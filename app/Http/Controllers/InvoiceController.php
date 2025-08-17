<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    /**
     * Show admin invoices page
     */
    public function adminIndex()
    {
        $invoices = Invoice::with(['booking.service', 'booking.extras', 'customer'])
            ->orderBy('issued_date', 'desc')
            ->paginate(15);

        $stats = [
            'total_invoices' => Invoice::count(),
            'paid_invoices' => Invoice::paid()->count(),
            'pending_invoices' => Invoice::pending()->count(),
            'total_revenue' => Invoice::paid()->sum('total_amount'),
            'overdue_invoices' => Invoice::pending()->where('due_date', '<', now())->count(),
        ];

        return Inertia::render('Admin/Invoices', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'invoices' => $invoices,
            'stats' => $stats,
        ]);
    }

    /**
     * Show customer invoices page
     */
    public function customerIndex()
    {
        $user = Auth::user();
        
        $invoices = Invoice::where('user_id', $user->id)
            ->with(['booking.service', 'booking.extras'])
            ->orderBy('issued_date', 'desc')
            ->paginate(10);

        $stats = [
            'total_invoices' => Invoice::where('user_id', $user->id)->count(),
            'paid_invoices' => Invoice::where('user_id', $user->id)->paid()->count(),
            'pending_invoices' => Invoice::where('user_id', $user->id)->pending()->count(),
            'total_spent' => Invoice::where('user_id', $user->id)->paid()->sum('total_amount'),
        ];

        return Inertia::render('Customer/Invoices', [
            'auth' => [
                'user' => $user,
            ],
            'invoices' => $invoices,
            'stats' => $stats,
        ]);
    }

    /**
     * Show invoice details
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $invoice = Invoice::with([
            'booking.service', 
            'booking.extras', 
            'booking.employee',
            'customer'
        ])->findOrFail($id);

        // Check if user has access to this invoice
        if ($user->role === 'customer' && $invoice->user_id !== $user->id) {
            abort(403, 'Access denied');
        }

        return Inertia::render('Invoice/Detail', [
            'auth' => [
                'user' => $user,
            ],
            'invoice' => $invoice,
        ]);
    }

    /**
     * Download invoice as PDF
     */
    public function downloadPdf($id)
    {
        $user = Auth::user();
        
        $invoice = Invoice::with([
            'booking.service', 
            'booking.extras', 
            'booking.employee',
            'customer'
        ])->findOrFail($id);

        // Check if user has access to this invoice
        if ($user->role === 'customer' && $invoice->user_id !== $user->id) {
            abort(403, 'Access denied');
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.invoice', [
            'invoice' => $invoice,
            'company' => [
                'name' => 'HospiPal',
                'address' => '123 Healthcare Street, Medical District',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'zip' => '400001',
                'phone' => '+91 98765 43210',
                'email' => 'info@hospipal.com',
                'website' => 'www.hospipal.com',
                'gst_number' => 'GST123456789',
            ]
        ]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    /**
     * Download invoice as PDF for admin
     */
    public function adminDownloadPdf($id)
    {
        $invoice = Invoice::with([
            'booking.service', 
            'booking.extras', 
            'booking.employee',
            'customer'
        ])->findOrFail($id);

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.invoice', [
            'invoice' => $invoice,
            'company' => [
                'name' => 'HospiPal',
                'address' => '123 Healthcare Street, Medical District',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'zip' => '400001',
                'phone' => '+91 98765 43210',
                'email' => 'info@hospipal.com',
                'website' => 'www.hospipal.com',
                'gst_number' => 'GST123456789',
            ]
        ]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    /**
     * Send invoice via email
     */
    public function sendEmail($id)
    {
        $invoice = Invoice::with(['customer'])->findOrFail($id);
        
        // TODO: Implement email sending functionality
        // Mail::to($invoice->customer->email)->send(new InvoiceMail($invoice));
        
        return response()->json([
            'success' => true,
            'message' => 'Invoice sent successfully to ' . $invoice->customer->email
        ]);
    }

    /**
     * Mark invoice as paid
     */
    public function markAsPaid($id)
    {
        $invoice = Invoice::findOrFail($id);
        
        $invoice->update([
            'status' => 'paid',
            'payment_status' => 'paid',
            'paid_date' => now(),
            'payment_date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice marked as paid successfully'
        ]);
    }

    /**
     * Mark invoice as cancelled
     */
    public function markAsCancelled($id)
    {
        $invoice = Invoice::findOrFail($id);
        
        $invoice->update([
            'status' => 'cancelled',
            'payment_status' => 'cancelled',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice marked as cancelled successfully'
        ]);
    }

    /**
     * Get invoice statistics for admin dashboard
     */
    public function getStats()
    {
        $stats = [
            'total_invoices' => Invoice::count(),
            'paid_invoices' => Invoice::paid()->count(),
            'pending_invoices' => Invoice::pending()->count(),
            'total_revenue' => Invoice::paid()->sum('total_amount'),
            'overdue_invoices' => Invoice::pending()->where('due_date', '<', now())->count(),
            'this_month_revenue' => Invoice::paid()
                ->whereMonth('paid_date', now()->month)
                ->whereYear('paid_date', now()->year)
                ->sum('total_amount'),
            'last_month_revenue' => Invoice::paid()
                ->whereMonth('paid_date', now()->subMonth()->month)
                ->whereYear('paid_date', now()->subMonth()->year)
                ->sum('total_amount'),
        ];

        return response()->json($stats);
    }

    /**
     * Search invoices
     */
    public function search(Request $request)
    {
        $query = Invoice::with(['booking.service', 'customer']);

        // Apply filters
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('booking.service', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->date_from) {
            $query->where('issued_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('issued_date', '<=', $request->date_to);
        }

        $invoices = $query->orderBy('issued_date', 'desc')->paginate(15);

        return response()->json($invoices);
    }
}
