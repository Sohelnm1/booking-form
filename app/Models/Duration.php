<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Duration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hours',
        'minutes',
        'label',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'hours' => 'integer',
        'minutes' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('minutes');
    }

    /**
     * Get the formatted label for display
     */
    public function getFormattedLabelAttribute()
    {
        return $this->label;
    }

    /**
     * Get total minutes for calculations
     */
    public function getTotalMinutesAttribute()
    {
        return ($this->hours * 60) + $this->minutes;
    }

    /**
     * Get the value for form selects (total minutes for backward compatibility)
     */
    public function getValueAttribute()
    {
        return $this->total_minutes;
    }
}
