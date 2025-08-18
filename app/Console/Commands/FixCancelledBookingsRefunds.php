<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;

class FixCancelledBookingsRefunds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:fix-refunds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix refund amounts for existing cancelled bookings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fix refund amounts for cancelled bookings...');

        $cancelledBookings = Booking::where('status', 'cancelled')
            ->where('refund_status', '!=', 'processed')
            ->get();

        $this->info("Found {$cancelledBookings->count()} cancelled bookings to fix.");

        $fixedCount = 0;
        $errorCount = 0;

        foreach ($cancelledBookings as $booking) {
            try {
                // Get the policy
                $policy = $booking->bookingPolicySetting;
                if (!$policy) {
                    $policy = \App\Models\BookingPolicySetting::active()->first();
                }

                // Calculate correct refund amount
                $cancellationFee = $booking->getCancellationFee();
                $baseRefundAmount = 0;

                if (!$policy) {
                    $baseRefundAmount = $booking->total_amount;
                } else {
                    switch ($policy->cancellation_policy) {
                        case 'full_refund':
                            $baseRefundAmount = $booking->total_amount;
                            break;
                        case 'partial_refund':
                            $baseRefundAmount = $booking->total_amount * 0.5;
                            break;
                        case 'credit_only':
                        case 'no_refund':
                            $baseRefundAmount = 0;
                            break;
                        default:
                            $baseRefundAmount = $booking->total_amount;
                            break;
                    }
                }

                $finalRefundAmount = max(0, $baseRefundAmount - $cancellationFee);

                // Update the booking
                $booking->update([
                    'cancellation_fee_charged' => $cancellationFee,
                    'refund_amount' => $finalRefundAmount,
                    'refund_status' => $finalRefundAmount > 0 ? 'pending' : 'not_applicable',
                ]);

                $this->line("Fixed booking #{$booking->id}: Original: ₹{$booking->total_amount}, Fee: ₹{$cancellationFee}, Refund: ₹{$finalRefundAmount}");
                $fixedCount++;

            } catch (\Exception $e) {
                $this->error("Error fixing booking #{$booking->id}: " . $e->getMessage());
                $errorCount++;
            }
        }

        $this->info("Completed! Fixed: {$fixedCount}, Errors: {$errorCount}");
    }
}
