<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DynamicSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'type',
        'icon',
        'background_color',
        'text_color',
        'action_url',
        'action_text',
        'is_active',
        'sort_order',
        'start_date',
        'end_date',
        'show_on_mobile',
        'show_on_desktop',
        'display_duration',
        'priority',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_on_mobile' => 'boolean',
        'show_on_desktop' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * Scope to get active slots
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    /**
     * Scope to get slots for mobile
     */
    public function scopeForMobile($query)
    {
        return $query->where('show_on_mobile', true);
    }

    /**
     * Scope to get slots for desktop
     */
    public function scopeForDesktop($query)
    {
        return $query->where('show_on_desktop', true);
    }

    /**
     * Scope to get slots ordered by priority and sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('priority', 'desc')
            ->orderBy('sort_order', 'asc');
    }

    /**
     * Get the default background color based on type
     */
    public function getDefaultBackgroundColorAttribute()
    {
        return match($this->type) {
            'offer' => '#52c41a',
            'promotion' => '#1890ff',
            'announcement' => '#faad14',
            'festival' => '#722ed1',
            'news' => '#13c2c2',
            default => '#1890ff',
        };
    }

    /**
     * Get the default text color based on type
     */
    public function getDefaultTextColorAttribute()
    {
        return '#ffffff';
    }

    /**
     * Get the background color (fallback to default if not set)
     */
    public function getBackgroundColorAttribute($value)
    {
        return $value ?: $this->default_background_color;
    }

    /**
     * Get the text color (fallback to default if not set)
     */
    public function getTextColorAttribute($value)
    {
        return $value ?: $this->default_text_color;
    }

    /**
     * Check if the slot is currently active based on date range
     */
    public function isCurrentlyActive()
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->start_date && $now->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $now->gt($this->end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Get formatted start date
     */
    public function getFormattedStartDateAttribute()
    {
        return $this->start_date ? $this->start_date->format('Y-m-d H:i:s') : null;
    }

    /**
     * Get formatted end date
     */
    public function getFormattedEndDateAttribute()
    {
        return $this->end_date ? $this->end_date->format('Y-m-d H:i:s') : null;
    }

    /**
     * Get the type label
     */
    public function getTypeLabelAttribute()
    {
        return match($this->type) {
            'offer' => 'Offer',
            'promotion' => 'Promotion',
            'announcement' => 'Announcement',
            'festival' => 'Festival',
            'news' => 'News',
            default => 'Announcement',
        };
    }

    /**
     * Get the type color
     */
    public function getTypeColorAttribute()
    {
        return match($this->type) {
            'offer' => '#52c41a',
            'promotion' => '#1890ff',
            'announcement' => '#faad14',
            'festival' => '#722ed1',
            'news' => '#13c2c2',
            default => '#1890ff',
        };
    }
}
