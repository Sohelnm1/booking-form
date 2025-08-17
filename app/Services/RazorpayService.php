<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayService
{
    private $keyId;
    private $keySecret;
    private $webhookSecret;

    public function __construct()
    {
        $this->keyId = \DB::table('settings')->where('key', 'razorpay_key')->value('value');
        $this->keySecret = \DB::table('settings')->where('key', 'razorpay_secret')->value('value');
        $this->webhookSecret = \DB::table('settings')->where('key', 'razorpay_webhook_secret')->value('value');
    }

    /**
     * Create a Razorpay order
     */
    public function createOrder(Booking $booking)
    {
        try {
            $api = new Api($this->keyId, $this->keySecret);

            // Debug: Log the amount being used for Razorpay order
            Log::info('Creating Razorpay order', [
                'booking_id' => $booking->id,
                'booking_total_amount' => $booking->total_amount,
                'booking_discount_amount' => $booking->discount_amount ?? 0,
                'razorpay_amount_paise' => $booking->total_amount * 100,
                'razorpay_amount_rupees' => $booking->total_amount
            ]);

            // Handle temporary bookings that don't have relationships loaded
            $customerName = 'Customer';
            $serviceName = 'Service';
            
            if ($booking->exists && $booking->relationLoaded('customer')) {
                $customerName = $booking->customer->name;
            }
            
            if ($booking->exists && $booking->relationLoaded('service')) {
                $serviceName = $booking->service->name;
            }

            $orderData = [
                'receipt' => str_starts_with($booking->id, 'reschedule_') 
                    ? 'reschedule_' . str_replace('reschedule_', '', $booking->id)
                    : 'booking_' . $booking->id,
                'amount' => $booking->total_amount * 100, // Convert to paise
                'currency' => 'INR',
                'notes' => [
                    'booking_id' => $booking->id,
                    'customer_name' => $customerName,
                    'service_name' => $serviceName,
                    'type' => str_starts_with($booking->id, 'reschedule_') ? 'reschedule_fee' : 'booking',
                ]
            ];

            $order = $api->order->create($orderData);

            // Only update if it's a real booking (not temporary)
            if ($booking->exists && !str_starts_with($booking->id, 'temp_')) {
                $booking->update([
                    'transaction_id' => $order->id,
                    'payment_status' => 'pending'
                ]);
            }

            // Debug: Log the final response
            Log::info('Razorpay order response', [
                'order_id' => $order->id,
                'amount' => $order->amount,
                'currency' => $order->currency,
                'amount_in_rupees' => $order->amount / 100
            ]);

            return [
                'order_id' => $order->id,
                'amount' => $order->amount,
                'currency' => $order->currency,
                'key_id' => $this->keyId
            ];

        } catch (\Exception $e) {
            Log::error('Razorpay order creation failed: ' . $e->getMessage());
            throw new \Exception('Failed to create payment order: ' . $e->getMessage());
        }
    }

    /**
     * Verify payment signature
     */
    public function verifyPayment($paymentId, $orderId, $signature)
    {
        try {
            $api = new Api($this->keyId, $this->keySecret);

            $attributes = [
                'razorpay_payment_id' => $paymentId,
                'razorpay_order_id' => $orderId,
                'razorpay_signature' => $signature
            ];

            $api->utility->verifyPaymentSignature($attributes);

            return true;

        } catch (\Exception $e) {
            Log::error('Payment verification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails($paymentId)
    {
        try {
            $api = new Api($this->keyId, $this->keySecret);
            return $api->payment->fetch($paymentId);

        } catch (\Exception $e) {
            Log::error('Failed to fetch payment details: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if Razorpay is configured
     */
    public function isConfigured()
    {
        return !empty($this->keyId) && !empty($this->keySecret);
    }

    /**
     * Get Razorpay configuration for frontend
     */
    public function getConfig()
    {
        return [
            'key_id' => $this->keyId,
            'is_configured' => $this->isConfigured()
        ];
    }
} 