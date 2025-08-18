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
            // Refund processing fields
            $table->decimal('refund_amount', 10, 2)->nullable()->after('total_amount');
            $table->decimal('cancellation_fee_charged', 10, 2)->nullable()->after('refund_amount');
            $table->enum('refund_status', ['pending', 'processed', 'failed', 'not_applicable'])->default('not_applicable')->after('payment_status');
            $table->string('refund_transaction_id')->nullable()->after('refund_status');
            $table->timestamp('refund_processed_at')->nullable()->after('refund_transaction_id');
            $table->text('refund_notes')->nullable()->after('refund_processed_at');
            $table->string('refund_method')->nullable()->after('refund_notes'); // original_payment_method, credit_note, etc.
            
            // Admin processing fields
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->after('refund_method'); // Admin who cancelled
            $table->foreignId('refund_processed_by')->nullable()->constrained('users')->after('cancelled_by'); // Admin who processed refund
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by', 'refund_processed_by']);
            $table->dropColumn([
                'refund_amount',
                'cancellation_fee_charged', 
                'refund_status',
                'refund_transaction_id',
                'refund_processed_at',
                'refund_notes',
                'refund_method',
                'cancelled_by',
                'refund_processed_by'
            ]);
        });
    }
};
