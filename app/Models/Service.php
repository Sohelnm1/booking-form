<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'category',
        'color',
        'image',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
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
     * Get the forms available for this service
     */
    public function forms(): BelongsToMany
    {
        return $this->belongsToMany(Form::class, 'service_forms')
                    ->withPivot('is_active', 'sort_order')
                    ->withTimestamps()
                    ->wherePivot('is_active', true);
    }
} 