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
        Schema::create('schedule_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'default', 'weekend', 'emergency'
            $table->text('description')->nullable();
            
            // Booking window settings
            $table->integer('booking_window_days')->default(30); // How many days ahead
            $table->integer('min_advance_hours')->default(2); // Minimum hours before booking
            $table->integer('max_advance_days')->default(90); // Maximum days ahead
            
            // Time slot settings
            $table->integer('buffer_time_minutes')->default(15); // Time between appointments
            
            // Working hours
            $table->time('start_time')->default('09:00:00');
            $table->time('end_time')->default('18:00:00');
            
            // Working days (JSON array: [1,2,3,4,5] for Mon-Fri)
            $table->json('working_days'); // Removed default value - MySQL doesn't allow JSON defaults
            
            // Break times (JSON array of time ranges)
            $table->json('break_times')->nullable(); // [{"start": "12:00", "end": "13:00"}]
            
            // Service-specific settings
            $table->json('service_overrides')->nullable(); // Override settings per service
            
            // Status
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
        Schema::dropIfExists('schedule_settings');
    }
}; 