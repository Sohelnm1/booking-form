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
        Schema::create('service_pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "Single Visit", "Pack of 5", "Half Shift"
            $table->text('description')->nullable(); // Optional description for this tier
            $table->integer('duration_minutes'); // Duration in minutes
            $table->decimal('price', 10, 2); // Price for this tier
            $table->boolean('is_popular')->default(false); // Mark as popular/recommended
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
        Schema::dropIfExists('service_pricing_tiers');
    }
};
