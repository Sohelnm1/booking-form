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
        Schema::table('booking_form_responses', function (Blueprint $table) {
            $table->decimal('calculated_distance_km', 8, 2)->nullable()->after('response_value');
            $table->decimal('extra_km_charge', 8, 2)->default(0)->after('calculated_distance_km');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_form_responses', function (Blueprint $table) {
            $table->dropColumn([
                'calculated_distance_km',
                'extra_km_charge'
            ]);
        });
    }
};
