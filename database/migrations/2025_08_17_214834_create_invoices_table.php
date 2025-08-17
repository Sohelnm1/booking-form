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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique()->comment('Auto-generated invoice number');
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Invoice details
            $table->string('invoice_type')->default('booking')->comment('booking, reschedule, cancellation');
            $table->decimal('subtotal', 10, 2)->comment('Amount before discounts and taxes');
            $table->decimal('discount_amount', 10, 2)->default(0)->comment('Coupon discount amount');
            $table->decimal('reschedule_fee', 10, 2)->default(0)->comment('Reschedule fee if applicable');
            $table->decimal('total_amount', 10, 2)->comment('Final amount after all adjustments');
            $table->string('currency', 3)->default('INR');
            
            // Payment information
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('payment_status')->default('pending');
            $table->timestamp('payment_date')->nullable();
            
            // Coupon information
            $table->string('coupon_code')->nullable();
            $table->decimal('coupon_discount', 10, 2)->default(0);
            
            // Invoice status
            $table->string('status')->default('draft')->comment('draft, sent, paid, cancelled');
            $table->timestamp('issued_date')->useCurrent();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('paid_date')->nullable();
            
            // Additional details
            $table->text('notes')->nullable();
            $table->json('invoice_items')->nullable()->comment('Detailed breakdown of services and extras');
            $table->json('payment_history')->nullable()->comment('Payment attempts and history');
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['invoice_number']);
            $table->index(['booking_id']);
            $table->index(['user_id']);
            $table->index(['status']);
            $table->index(['issued_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
