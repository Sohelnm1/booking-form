<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookingPolicySetting;

class BookingPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $policies = [
            [
                'name' => 'Standard Policy',
                'description' => 'Default policy with standard cancellation and reschedule rules',
                'cancellation_window_hours' => 24,
                'cancellation_policy' => 'full_refund',
                'late_cancellation_fee' => 0,
                'late_cancellation_window_hours' => 2,
                'require_cancellation_reason' => false,
                'auto_cancel_no_show' => true,
                'no_show_minutes' => 15,
                'reschedule_window_hours' => 24,
                'max_reschedule_attempts' => 2,
                'reschedule_fee' => 0,
                'reschedule_advance_notice_hours' => 2,
                'allow_same_day_reschedule' => false,
                'allow_next_day_reschedule' => true,
                'send_reminder_24h' => true,
                'send_reminder_2h' => true,
                'send_reminder_1h' => false,
                'notify_admin_on_cancellation' => true,
                'notify_admin_on_reschedule' => true,
                'notify_employee_on_cancellation' => true,
                'notify_employee_on_reschedule' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Flexible Policy',
                'description' => 'More flexible policy with extended windows and no fees',
                'cancellation_window_hours' => 48,
                'cancellation_policy' => 'full_refund',
                'late_cancellation_fee' => 0,
                'late_cancellation_window_hours' => 4,
                'require_cancellation_reason' => false,
                'auto_cancel_no_show' => true,
                'no_show_minutes' => 20,
                'reschedule_window_hours' => 48,
                'max_reschedule_attempts' => 3,
                'reschedule_fee' => 0,
                'reschedule_advance_notice_hours' => 1,
                'allow_same_day_reschedule' => true,
                'allow_next_day_reschedule' => true,
                'send_reminder_24h' => true,
                'send_reminder_2h' => true,
                'send_reminder_1h' => true,
                'notify_admin_on_cancellation' => true,
                'notify_admin_on_reschedule' => true,
                'notify_employee_on_cancellation' => true,
                'notify_employee_on_reschedule' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Strict Policy',
                'description' => 'Strict policy with fees and limited flexibility',
                'cancellation_window_hours' => 12,
                'cancellation_policy' => 'partial_refund',
                'late_cancellation_fee' => 50,
                'late_cancellation_window_hours' => 1,
                'require_cancellation_reason' => true,
                'auto_cancel_no_show' => true,
                'no_show_minutes' => 10,
                'reschedule_window_hours' => 12,
                'max_reschedule_attempts' => 1,
                'reschedule_fee' => 25,
                'reschedule_advance_notice_hours' => 4,
                'allow_same_day_reschedule' => false,
                'allow_next_day_reschedule' => false,
                'send_reminder_24h' => true,
                'send_reminder_2h' => true,
                'send_reminder_1h' => false,
                'notify_admin_on_cancellation' => true,
                'notify_admin_on_reschedule' => true,
                'notify_employee_on_cancellation' => true,
                'notify_employee_on_reschedule' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($policies as $policy) {
            BookingPolicySetting::create($policy);
        }
    }
}
