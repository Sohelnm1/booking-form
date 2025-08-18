<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Services\RazorpayRefundService;

class ProcessRazorpayRefund extends Command
{
    protected $signature = 'razorpay:refund {booking_id} {--force : Force process even if already processed}';
    protected $description = 'Process refund through Razorpay API for a specific booking';

    public function handle()
    {
        $bookingId = $this->argument('booking_id');
        $force = $this->option('force');
        
        $booking = Booking::find($bookingId);
        
        if (!$booking) {
            $this->error("Booking with ID {$bookingId} not found.");
            return 1;
        }

        if ($booking->status !== 'cancelled') {
            $this->error("Booking is not cancelled.");
            return 1;
        }

        if ($booking->refund_status === 'processed' && !$force) {
            $this->error("Refund already processed. Use --force to reprocess.");
            return 1;
        }

        $this->info("Processing refund for booking {$bookingId}...");
        $this->info("Payment ID: {$booking->transaction_id}");
        $this->info("Refund Amount: ₹{$booking->refund_amount}");

        try {
            $razorpayService = new RazorpayRefundService();
            
            $result = $razorpayService->processRefund(
                $booking->transaction_id,
                $booking->refund_amount,
                "Booking cancellation - {$booking->cancellation_reason}"
            );

            if ($result['success']) {
                $this->info("✅ Razorpay refund processed successfully!");
                $this->info("Razorpay Refund ID: {$result['refund_id']}");
                $this->info("Status: {$result['status']}");
                $this->info("Amount: ₹{$result['amount']}");
                
                // Update booking with Razorpay refund details
                $booking->update([
                    'refund_transaction_id' => 'RZP_' . $result['refund_id'],
                    'refund_status' => 'processed',
                    'refund_processed_at' => now(),
                    'refund_method' => 'razorpay',
                ]);
                
                $this->info("✅ Booking updated with Razorpay refund details.");
                
            } else {
                $this->error("❌ Razorpay refund failed: {$result['error']}");
                return 1;
            }

        } catch (\Exception $e) {
            $this->error("❌ Error processing refund: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
