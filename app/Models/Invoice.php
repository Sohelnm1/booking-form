<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'booking_id',
        'user_id',
        'invoice_type',
        'subtotal',
        'discount_amount',
        'reschedule_fee',
        'total_amount',
        'currency',
        'payment_method',
        'transaction_id',
        'payment_status',
        'payment_date',
        'coupon_code',
        'coupon_discount',
        'status',
        'issued_date',
        'due_date',
        'paid_date',
        'notes',
        'invoice_items',
        'payment_history',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'reschedule_fee' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'issued_date' => 'datetime',
        'due_date' => 'datetime',
        'paid_date' => 'datetime',
        'payment_date' => 'datetime',
        'invoice_items' => 'array',
        'payment_history' => 'array',
    ];

    /**
     * Get the booking associated with this invoice
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the customer associated with this invoice
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Generate a unique invoice number
     */
    public static function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        
        // Get the last invoice number for this year/month
        $lastInvoice = self::where('invoice_number', 'like', "INV-{$year}{$month}-%")
            ->orderBy('invoice_number', 'desc')
            ->first();

        if ($lastInvoice) {
            // Extract the sequence number and increment
            $parts = explode('-', $lastInvoice->invoice_number);
            $sequence = intval($parts[2]) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf("INV-%s%s-%04d", $year, $month, $sequence);
    }

    /**
     * Create invoice from booking
     */
    public static function createFromBooking(Booking $booking, string $type = 'booking'): self
    {
        $invoiceItems = [
            [
                'description' => $booking->service->name,
                'quantity' => 1,
                'unit_price' => $booking->service->price,
                'total' => $booking->service->price,
                'type' => 'service'
            ]
        ];

        // Add extras
        if ($booking->extras && $booking->extras->count() > 0) {
            foreach ($booking->extras as $extra) {
                $price = $extra->pivot ? $extra->pivot->price : $extra->price;
                $invoiceItems[] = [
                    'description' => $extra->name,
                    'quantity' => 1,
                    'unit_price' => $price,
                    'total' => $price,
                    'type' => 'extra'
                ];
            }
        }

        // Add reschedule fee if applicable
        if ($booking->reschedule_payment_amount > 0) {
            $invoiceItems[] = [
                'description' => 'Reschedule Fee',
                'quantity' => 1,
                'unit_price' => $booking->reschedule_payment_amount,
                'total' => $booking->reschedule_payment_amount,
                'type' => 'reschedule_fee'
            ];
        }

        // Calculate subtotal including all items (services, extras, and reschedule fee)
        $subtotal = collect($invoiceItems)->sum('total');
        $discountAmount = $booking->discount_amount ?? 0;
        $totalAmount = $subtotal - $discountAmount;

        return self::create([
            'invoice_number' => self::generateInvoiceNumber(),
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'invoice_type' => $type,
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'reschedule_fee' => 0, // Reschedule fee is included in subtotal as a line item
            'total_amount' => $totalAmount,
            'currency' => 'INR',
            'payment_method' => $booking->payment_method,
            'transaction_id' => $booking->transaction_id,
            'payment_status' => $booking->payment_status,
            'payment_date' => $booking->payment_status === 'paid' ? now() : null,
            'coupon_code' => $booking->coupon_code,
            'coupon_discount' => $discountAmount,
            'status' => $booking->payment_status === 'paid' ? 'paid' : 'pending',
            'issued_date' => now(),
            'due_date' => now()->addDays(7), // 7 days due date
            'paid_date' => $booking->payment_status === 'paid' ? now() : null,
            'invoice_items' => $invoiceItems,
            'payment_history' => [
                [
                    'date' => now()->toISOString(),
                    'status' => $booking->payment_status,
                    'amount' => $totalAmount,
                    'transaction_id' => $booking->transaction_id,
                    'method' => $booking->payment_method
                ]
            ]
        ]);
    }

    /**
     * Get formatted invoice number
     */
    public function getFormattedInvoiceNumberAttribute(): string
    {
        return $this->invoice_number;
    }

    /**
     * Get formatted total amount
     */
    public function getFormattedTotalAttribute(): string
    {
        return '&#8377;' . number_format($this->total_amount, 2);
    }

    /**
     * Get formatted subtotal
     */
    public function getFormattedSubtotalAttribute(): string
    {
        return '&#8377;' . number_format($this->subtotal, 2);
    }

    /**
     * Get formatted discount amount
     */
    public function getFormattedDiscountAttribute(): string
    {
        return '&#8377;' . number_format($this->discount_amount, 2);
    }

    /**
     * Get formatted reschedule fee
     */
    public function getFormattedRescheduleFeeAttribute(): string
    {
        return '&#8377;' . number_format($this->reschedule_fee, 2);
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'paid' => 'success',
            'pending' => 'warning',
            'cancelled' => 'error',
            'draft' => 'default',
            default => 'default'
        };
    }

    /**
     * Get payment status badge color
     */
    public function getPaymentStatusColorAttribute(): string
    {
        return match($this->payment_status) {
            'paid' => 'success',
            'pending' => 'warning',
            'failed' => 'error',
            'refunded' => 'default',
            default => 'default'
        };
    }

    /**
     * Scope for paid invoices
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope for pending invoices
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for recent invoices
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('issued_date', '>=', now()->subDays($days));
    }

    /**
     * Check if invoice is overdue
     */
    public function isOverdue(): bool
    {
        return $this->status === 'pending' && 
               $this->due_date && 
               $this->due_date->isPast();
    }

    /**
     * Get overdue days
     */
    public function getOverdueDaysAttribute(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return $this->due_date->diffInDays(now());
    }
}
