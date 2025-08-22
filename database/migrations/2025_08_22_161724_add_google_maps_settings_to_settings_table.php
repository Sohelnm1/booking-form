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
        // Insert Google Maps settings into the settings table
        \DB::table('settings')->insert([
            [
                'key' => 'google_maps_api_key',
                'value' => '',
                'group' => 'integration',
                'type' => 'string',
                'description' => 'API key for Google Maps services (Places, Geocoding, Maps)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'google_maps_enabled_services',
                'value' => 'places,geocoding,maps',
                'group' => 'integration',
                'type' => 'string',
                'description' => 'Comma-separated list of enabled Google Maps services',
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
        // Remove Google Maps settings from the settings table
        \DB::table('settings')->whereIn('key', [
            'google_maps_api_key',
            'google_maps_enabled_services'
        ])->delete();
    }
};
