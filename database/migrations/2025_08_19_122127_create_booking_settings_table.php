<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Added DB facade import

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('booking_settings')->insert([
            [
                'key' => 'max_extras_per_booking',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Maximum number of different extras that can be added to a booking',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'max_quantity_per_extra',
                'value' => '5',
                'type' => 'integer',
                'description' => 'Maximum quantity allowed for each extra',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'enable_extra_quantities',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable quantity controls for extras',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_settings');
    }
};
