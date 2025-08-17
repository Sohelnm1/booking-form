<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\BookingPolicySetting;

class AssignPolicyToBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:assign-policy {--policy=standard}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign a booking policy to all bookings that don\'t have one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $policyName = $this->option('policy');
        
        // Find the policy
        $policy = BookingPolicySetting::where('name', 'like', "%{$policyName}%")->first();
        
        if (!$policy) {
            $this->error("Policy not found: {$policyName}");
            return 1;
        }
        
        $this->info("Using policy: {$policy->name} (ID: {$policy->id})");
        $this->info("Reschedule window: {$policy->reschedule_window_hours} hours");
        $this->info("Max attempts: {$policy->max_reschedule_attempts}");
        
        // Find bookings without a policy
        $bookingsWithoutPolicy = Booking::whereNull('booking_policy_setting_id')->get();
        
        if ($bookingsWithoutPolicy->isEmpty()) {
            $this->info("All bookings already have a policy assigned.");
            return 0;
        }
        
        $this->info("Found {$bookingsWithoutPolicy->count()} bookings without a policy.");
        
        // Auto-assign without confirmation for non-interactive use
        $updated = Booking::whereNull('booking_policy_setting_id')
            ->update(['booking_policy_setting_id' => $policy->id]);
        
        $this->info("Updated {$updated} bookings with policy ID {$policy->id}");
        
        return 0;
    }
}
