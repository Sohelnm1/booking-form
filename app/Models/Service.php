<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'color',
        'image',
        'is_active',
        'sort_order',
        'is_upcoming',
        'has_flexible_duration',
        'has_tba_pricing',
        'coming_soon_description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'is_upcoming' => 'boolean',
        'has_flexible_duration' => 'boolean',
        'has_tba_pricing' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('is_upcoming', true);
    }

    public function scopeAvailableForBooking($query)
    {
        return $query->where('is_active', true)->where('is_upcoming', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Check if this service is bookable (active and not upcoming)
     */
    public function isBookable(): bool
    {
        return $this->is_active && !$this->is_upcoming;
    }

    /**
     * Get the display price for this service
     */
    public function getDisplayPrice(): string
    {
        if ($this->has_tba_pricing) {
            return 'To be announced';
        }
        return '₹' . number_format($this->price, 2);
    }

    /**
     * Get the display duration for this service
     */
    public function getDisplayDuration(): string
    {
        if ($this->has_flexible_duration) {
            return 'Flexible';
        }
        
        $hours = floor($this->duration / 60);
        $minutes = $this->duration % 60;
        
        if ($hours > 0 && $minutes > 0) {
            return $hours . 'h ' . $minutes . 'm';
        } elseif ($hours > 0) {
            return $hours . 'h';
        } else {
            return $minutes . 'm';
        }
    }

    /**
     * Get the extras available for this service
     */
    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'service_extras')
                    ->withPivot('is_active', 'sort_order')
                    ->withTimestamps()
                    ->wherePivot('is_active', true);
    }

    /**
     * Get the pricing tiers for this service
     */
    public function pricingTiers(): HasMany
    {
        return $this->hasMany(ServicePricingTier::class)->active()->ordered();
    }

    /**
     * Check if this service has multiple pricing tiers
     */
    public function hasMultiplePricingTiers(): bool
    {
        return $this->pricingTiers()->count() > 0;
    }

    /**
     * Get the default pricing tier (first one or fallback to service price/duration)
     */
    public function getDefaultPricingTier()
    {
        $defaultTier = $this->pricingTiers()->first();
        
        if ($defaultTier) {
            return $defaultTier;
        }

        // Fallback to service's own price/duration
        return (object) [
            'name' => 'Standard',
            'duration_minutes' => $this->duration,
            'price' => $this->price,
            'getDisplayDuration' => fn() => $this->getDisplayDuration(),
            'getDisplayPrice' => fn() => $this->getDisplayPrice(),
        ];
    }

    /**
     * Get the forms available for this service
     */
    public function forms(): BelongsToMany
    {
        return $this->belongsToMany(Form::class, 'service_forms')
                    ->withPivot('is_active', 'sort_order')
                    ->withTimestamps()
                    ->wherePivot('is_active', true);
    }

    /**
     * Check if a time slot is available for this service
     */
    public function isSlotAvailable($date, $time, $duration, $excludeBookingId = null): bool
    {
        return Booking::isSlotAvailable($date, $time, $duration, $excludeBookingId);
    }
} 