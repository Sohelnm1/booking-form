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
        Schema::table('bookings', function (Blueprint $table) {
            $table->integer('reschedule_attempts')->default(0)->after('status');
            $table->text('cancellation_reason')->nullable()->after('reschedule_attempts');
            $table->timestamp('cancelled_at')->nullable()->after('cancellation_reason');
            $table->timestamp('rescheduled_at')->nullable()->after('cancelled_at');
            $table->foreignId('booking_policy_setting_id')->nullable()->constrained()->after('rescheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['booking_policy_setting_id']);
            $table->dropColumn([
                'reschedule_attempts',
                'cancellation_reason',
                'cancelled_at',
                'rescheduled_at',
                'booking_policy_setting_id'
            ]);
        });
    }
};
