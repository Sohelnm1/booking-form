<<<<<<< HEAD
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
        Schema::create('consent_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'terms_conditions', 'privacy_policy', 'booking_consent'
            $table->string('title'); // Display title
            $table->text('content'); // HTML content
            $table->text('summary')->nullable(); // Short summary for preview
            $table->boolean('is_required')->default(true); // Must customer accept this?
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('version')->default('1.0'); // For tracking changes
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consent_settings');
    }
=======
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
        Schema::create('consent_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'terms_conditions', 'privacy_policy', 'booking_consent'
            $table->string('title'); // Display title
            $table->text('content'); // HTML content
            $table->text('summary')->nullable(); // Short summary for preview
            $table->boolean('is_required')->default(true); // Must customer accept this?
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('version')->default('1.0'); // For tracking changes
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consent_settings');
    }
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
}; 