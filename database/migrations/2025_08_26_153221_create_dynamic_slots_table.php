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
        Schema::create('dynamic_slots', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['offer', 'promotion', 'announcement', 'festival', 'news'])->default('announcement');
            $table->string('icon')->nullable(); // Emoji or icon
            $table->string('background_color')->nullable(); // Hex color code
            $table->string('text_color')->nullable(); // Hex color code
            $table->string('action_url')->nullable(); // Optional link
            $table->string('action_text')->nullable(); // Button text
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamp('start_date')->nullable(); // When to start showing
            $table->timestamp('end_date')->nullable(); // When to stop showing
            $table->boolean('show_on_mobile')->default(true);
            $table->boolean('show_on_desktop')->default(true);
            $table->integer('display_duration')->nullable(); // In seconds, null for permanent
            $table->integer('priority')->default(1); // Higher number = higher priority
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dynamic_slots');
    }
};
