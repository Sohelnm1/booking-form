<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsentSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'content',
        'summary',
        'is_required',
        'is_active',
        'sort_order',
        'version',
        'last_updated',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'last_updated' => 'datetime',
    ];

    /**
     * Scope to get only active consent settings
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
        return $query->orderBy('sort_order')->orderBy('title');
    }

    /**
     * Scope to get required consent settings
     */
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    /**
     * Update the last_updated timestamp
     */
    public function updateLastUpdated()
    {
        $this->update(['last_updated' => now()]);
    }

    /**
     * Get the content with basic HTML formatting
     */
    public function getFormattedContentAttribute()
    {
        return nl2br(e($this->content));
    }

    /**
     * Get a short preview of the content
     */
    public function getPreviewAttribute()
    {
        return $this->summary ?: substr(strip_tags($this->content), 0, 150) . '...';
    }
} 