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
        // Add gender preference settings to booking_settings table
        \DB::table('booking_settings')->insert([
            [
                'key' => 'enable_gender_preference',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable gender preference option for customers during booking',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'male_preference_fee',
                'value' => '100',
                'type' => 'integer',
                'description' => 'Additional fee for male HospiPal preference (in rupees)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'female_preference_fee',
                'value' => '100',
                'type' => 'integer',
                'description' => 'Additional fee for female HospiPal preference (in rupees)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'gender_preference_label',
                'value' => 'Preferred HospiPal',
                'type' => 'string',
                'description' => 'Label for the gender preference field',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'gender_preference_description',
                'value' => 'Select your preferred HospiPal gender. Choosing a specific gender may incur an additional fee.',
                'type' => 'string',
                'description' => 'Description text for the gender preference field',
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
        // Remove gender preference settings
        \DB::table('booking_settings')->whereIn('key', [
            'enable_gender_preference',
            'male_preference_fee',
            'female_preference_fee',
            'gender_preference_label',
            'gender_preference_description'
        ])->delete();
    }
};
