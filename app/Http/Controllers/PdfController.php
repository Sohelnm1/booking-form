<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConsentSetting;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    /**
     * Download Terms & Conditions PDF
     */
    public function termsConditions()
    {
        try {
            $consentSetting = ConsentSetting::where('name', 'terms_conditions')
                ->where('is_active', true)
                ->orderBy('version', 'desc')
                ->first();

            if (!$consentSetting) {
                abort(404, 'Terms & Conditions not found');
            }

            $data = [
                'title' => $consentSetting->title,
                'content' => $consentSetting->content,
                'version' => $consentSetting->version,
                'last_updated' => $consentSetting->last_updated,
                'company' => 'HospiPal Health LLP',
                'document_type' => 'Terms & Conditions'
            ];

            // Test with simple content first
            $pdf = Pdf::loadView('pdfs.legal-document', $data);
            
            return $pdf->download('terms-and-conditions-' . $consentSetting->version . '.pdf');
        } catch (\Exception $e) {
            \Log::error('PDF Generation Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Download Privacy Policy PDF
     */
    public function privacyPolicy()
    {
        $consentSetting = ConsentSetting::where('name', 'privacy_policy')
            ->where('is_active', true)
            ->orderBy('version', 'desc')
            ->first();

        if (!$consentSetting) {
            abort(404, 'Privacy Policy not found');
        }

        $data = [
            'title' => $consentSetting->title,
            'content' => $consentSetting->content,
            'version' => $consentSetting->version,
            'last_updated' => $consentSetting->last_updated,
            'company' => 'HospiPal Health LLP',
            'document_type' => 'Privacy Policy'
        ];

        $pdf = Pdf::loadView('pdfs.legal-document', $data);
        
        return $pdf->download('privacy-policy-' . $consentSetting->version . '.pdf');
    }

    /**
     * Download Booking Consent PDF
     */
    public function bookingConsent()
    {
        $consentSetting = ConsentSetting::where('name', 'booking_consent')
            ->where('is_active', true)
            ->orderBy('version', 'desc')
            ->first();

        if (!$consentSetting) {
            abort(404, 'Booking Consent not found');
        }

        $data = [
            'title' => $consentSetting->title,
            'content' => $consentSetting->content,
            'version' => $consentSetting->version,
            'last_updated' => $consentSetting->last_updated,
            'company' => 'HospiPal Health LLP',
            'document_type' => 'Booking Consent'
        ];

        $pdf = Pdf::loadView('pdfs.legal-document', $data);
        
        return $pdf->download('booking-consent-' . $consentSetting->version . '.pdf');
    }
}
