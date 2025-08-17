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
            // Reschedule payment tracking fields
            $table->decimal('reschedule_payment_amount', 8, 2)->nullable()->after('rescheduled_at')->comment('Amount paid for reschedule fee');
            $table->string('reschedule_payment_id')->nullable()->after('reschedule_payment_amount')->comment('Razorpay payment ID for reschedule fee');
            $table->timestamp('reschedule_payment_date')->nullable()->after('reschedule_payment_id')->comment('When reschedule payment was made');
            $table->string('reschedule_payment_status')->default('not_required')->after('reschedule_payment_date')->comment('Status of reschedule payment: not_required, pending, paid, failed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'reschedule_payment_amount',
                'reschedule_payment_id',
                'reschedule_payment_date',
                'reschedule_payment_status'
            ]);
        });
    }
};
