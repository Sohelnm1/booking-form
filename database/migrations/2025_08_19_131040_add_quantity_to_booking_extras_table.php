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
        Schema::table('booking_extras', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('price')->comment('Quantity of this extra in the booking');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_extras', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
