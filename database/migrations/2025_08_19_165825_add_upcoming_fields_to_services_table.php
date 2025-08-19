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
        Schema::table('services', function (Blueprint $table) {
            $table->boolean('is_upcoming')->default(false)->after('is_active');
            $table->boolean('has_flexible_duration')->default(false)->after('is_upcoming');
            $table->boolean('has_tba_pricing')->default(false)->after('has_flexible_duration');
            $table->text('coming_soon_description')->nullable()->after('has_tba_pricing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['is_upcoming', 'has_flexible_duration', 'has_tba_pricing', 'coming_soon_description']);
        });
    }
};
