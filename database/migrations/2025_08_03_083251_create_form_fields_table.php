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
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('name'); // Field name for form submission
            $table->string('type'); // text, email, phone, number, select, checkbox, textarea, file, etc.
            $table->text('placeholder')->nullable();
            $table->text('help_text')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_primary')->default(false); // For phone number, full name, email
            $table->integer('sort_order')->default(0);
            $table->json('options')->nullable(); // For select, checkbox, radio options
            $table->json('validation_rules')->nullable(); // Custom validation rules
            $table->json('settings')->nullable(); // Field-specific settings
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
}; 