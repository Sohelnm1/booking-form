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
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('gender_preference', ['male', 'female', 'no_preference'])->default('no_preference')->after('coupon_code');
            $table->decimal('gender_preference_fee', 10, 2)->default(0.00)->after('gender_preference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['gender_preference', 'gender_preference_fee']);
        });
    }
};
