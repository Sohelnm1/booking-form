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
            $table->boolean('has_distance_calculation')->default(false)->after('rendering_control');
            $table->enum('distance_calculation_type', ['origin', 'destination'])->nullable()->after('has_distance_calculation');
            $table->unsignedBigInteger('linked_extra_id')->nullable()->after('distance_calculation_type');
            $table->foreign('linked_extra_id')->references('id')->on('extras')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->dropForeign(['linked_extra_id']);
            $table->dropColumn([
                'has_distance_calculation',
                'distance_calculation_type',
                'linked_extra_id'
            ]);
        });
    }
};
