<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get the first available duration (or create a default one)
        $defaultDuration = DB::table('durations')->first();
        
        if ($defaultDuration) {
            // Update all extras that don't have a duration_id set
            DB::table('extras')
                ->whereNull('duration_id')
                ->update(['duration_id' => $defaultDuration->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set duration_id back to null for all extras
        DB::table('extras')->update(['duration_id' => null]);
    }
};
