<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Extra extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'disclaimer_title',
        'disclaimer_content',
        'price',
        'duration',
        'duration_id',
        'max_quantity',
        'image',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'max_quantity' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the services that have this extra
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_extras')
                    ->withPivot('is_active', 'sort_order')
                    ->withTimestamps();
    }

    /**
     * Get the bookings that include this extra
     */
    public function bookings(): BelongsToMany
    {
        return $this->belongsToMany(Booking::class, 'booking_extras')
                    ->withPivot('price')
                    ->withTimestamps();
    }

    /**
     * Get the duration for this extra
     */
    public function durationRelation(): BelongsTo
    {
        return $this->belongsTo(Duration::class, 'duration_id');
    }

    /**
     * Get total duration in minutes (for backward compatibility)
     */
    public function getTotalDurationAttribute()
    {
        if ($this->durationRelation) {
            return $this->durationRelation->total_minutes;
        }
        return $this->duration ?? 0; // Fallback to old duration field
    }

    /**
     * Scope to get only active extras
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
} 