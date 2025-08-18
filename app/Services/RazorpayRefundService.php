<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayRefundService
{
    protected $api;

    public function __construct()
    {
        // Get Razorpay credentials from settings table
        $razorpayKey = \DB::table('settings')->where('key', 'razorpay_key')->value('value');
        $razorpaySecret = \DB::table('settings')->where('key', 'razorpay_secret')->value('value');
        
        if (!$razorpayKey || !$razorpaySecret) {
            throw new \Exception('Razorpay credentials not found in settings. Please configure them in the admin panel.');
        }
        
        $this->api = new Api($razorpayKey, $razorpaySecret);
    }

    /**
     * Process refund through Razorpay
     */
    public function processRefund($paymentId, $amount, $reason = null)
    {
        try {
            Log::info('Processing Razorpay refund', [
                'payment_id' => $paymentId,
                'amount' => $amount,
                'reason' => $reason
            ]);

            $refundData = [
                'payment_id' => $paymentId,
                'amount' => $amount * 100, // Convert to paise
                'speed' => 'normal', // or 'optimum'
            ];

            if ($reason) {
                $refundData['notes'] = [
                    'reason' => $reason
                ];
            }

            $refund = $this->api->refund->create($refundData);

            Log::info('Razorpay refund created successfully', [
                'refund_id' => $refund->id,
                'payment_id' => $paymentId,
                'amount' => $amount
            ]);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'status' => $refund->status,
                'amount' => $refund->amount / 100, // Convert back from paise
                'currency' => $refund->currency,
                'created_at' => $refund->created_at,
            ];

        } catch (\Exception $e) {
            Log::error('Razorpay refund failed', [
                'payment_id' => $paymentId,
                'amount' => $amount,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'error_code' => $e->getCode(),
            ];
        }
    }

    /**
     * Get refund details from Razorpay
     */
    public function getRefundDetails($refundId)
    {
        try {
            $refund = $this->api->refund->fetch($refundId);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'payment_id' => $refund->payment_id,
                'status' => $refund->status,
                'amount' => $refund->amount / 100,
                'currency' => $refund->currency,
                'created_at' => $refund->created_at,
                'processed_at' => $refund->processed_at ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('Failed to fetch Razorpay refund details', [
                'refund_id' => $refundId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check if refund is eligible
     */
    public function isRefundEligible($paymentId)
    {
        try {
            $payment = $this->api->payment->fetch($paymentId);
            
            // Check if payment is captured and not already refunded
            return $payment->status === 'captured' && 
                   $payment->refund_status === null;

        } catch (\Exception $e) {
            Log::error('Failed to check refund eligibility', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails($paymentId)
    {
        try {
            $payment = $this->api->payment->fetch($paymentId);

            return [
                'success' => true,
                'payment_id' => $payment->id,
                'amount' => $payment->amount / 100,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'refund_status' => $payment->refund_status,
                'created_at' => $payment->created_at,
                'captured_at' => $payment->captured_at ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('Failed to fetch payment details', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
