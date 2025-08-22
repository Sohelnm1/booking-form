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
        Schema::table('form_fields', function (Blueprint $table) {
            $table->decimal('covered_distance_km', 8, 2)->default(10.00)->after('linked_extra_id');
            $table->decimal('price_per_extra_km', 8, 2)->default(10.00)->after('covered_distance_km');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->dropColumn(['covered_distance_km', 'price_per_extra_km']);
        });
    }
};
