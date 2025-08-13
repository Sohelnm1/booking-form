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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            
            // Discount settings
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->decimal('minimum_amount', 10, 2)->default(0);
            $table->decimal('maximum_discount', 10, 2)->nullable();
            
            // Usage limits
            $table->integer('max_uses')->nullable(); // Total uses across all users
            $table->integer('max_uses_per_user')->default(1); // Uses per individual user
            $table->integer('used_count')->default(0);
            
            // Validity period
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            
            // Restrictions
            $table->boolean('is_active')->default(true);
            $table->boolean('is_first_time_only')->default(false); // Only for first-time users
            $table->json('applicable_services')->nullable(); // Specific services only
            $table->json('excluded_services')->nullable(); // Excluded services
            
            // Admin info
            $table->string('created_by')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['code', 'is_active']);
            $table->index(['valid_from', 'valid_until']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
