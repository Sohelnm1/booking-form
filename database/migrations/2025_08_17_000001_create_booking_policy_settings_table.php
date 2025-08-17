<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_policy_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            
            // Cancellation Settings
            $table->integer('cancellation_window_hours')->default(24)->comment('Hours before appointment when cancellation is allowed');
            $table->enum('cancellation_policy', ['full_refund', 'partial_refund', 'no_refund', 'credit_only'])->default('full_refund');
            $table->decimal('late_cancellation_fee', 8, 2)->default(0)->comment('Fee for late cancellations');
            $table->integer('late_cancellation_window_hours')->default(2)->comment('Hours before appointment for late cancellation fee');
            $table->boolean('require_cancellation_reason')->default(false);
            $table->boolean('auto_cancel_no_show')->default(true);
            $table->integer('no_show_minutes')->default(15)->comment('Minutes after appointment time to auto-cancel no-show');
            
            // Reschedule Settings
            $table->integer('reschedule_window_hours')->default(24)->comment('Hours before appointment when rescheduling is allowed');
            $table->integer('max_reschedule_attempts')->default(2)->comment('Maximum number of times a booking can be rescheduled');
            $table->decimal('reschedule_fee', 8, 2)->default(0)->comment('Fee for rescheduling');
            $table->integer('reschedule_advance_notice_hours')->default(2)->comment('Minimum notice required for rescheduling');
            $table->boolean('allow_same_day_reschedule')->default(false);
            $table->boolean('allow_next_day_reschedule')->default(true);
            
            // Notification Settings
            $table->boolean('send_reminder_24h')->default(true);
            $table->boolean('send_reminder_2h')->default(true);
            $table->boolean('send_reminder_1h')->default(false);
            $table->boolean('notify_admin_on_cancellation')->default(true);
            $table->boolean('notify_admin_on_reschedule')->default(true);
            $table->boolean('notify_employee_on_cancellation')->default(true);
            $table->boolean('notify_employee_on_reschedule')->default(true);
            
            // General Settings
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_policy_settings');
    }
};
