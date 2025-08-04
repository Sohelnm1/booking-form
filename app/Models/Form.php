<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'sort_order',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * Get the form fields for this form
     */
    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class)->orderBy('sort_order');
    }

    /**
     * Get the services that use this form
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_forms')
                    ->withPivot('is_active', 'sort_order')
                    ->withTimestamps();
    }

    /**
     * Scope to get only active forms
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order forms by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get primary fields (phone, name, email)
     */
    public function primaryFields()
    {
        return $this->fields()->where('is_primary', true)->orderBy('sort_order');
    }

    /**
     * Get custom fields (non-primary)
     */
    public function customFields()
    {
        return $this->fields()->where('is_primary', false)->orderBy('sort_order');
    }
} 