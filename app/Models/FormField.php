<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'label',
        'name',
        'type',
        'placeholder',
        'help_text',
        'is_required',
        'is_primary',
        'sort_order',
        'options',
        'validation_rules',
        'settings',
        'rendering_control',
        'has_distance_calculation',
        'distance_calculation_type',
        'linked_extra_id',
        'covered_distance_km',
        'price_per_extra_km',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_primary' => 'boolean',
        'options' => 'array',
        'validation_rules' => 'array',
        'settings' => 'array',
        'has_distance_calculation' => 'boolean',
        'covered_distance_km' => 'decimal:2',
        'price_per_extra_km' => 'decimal:2',
    ];

    /**
     * Get the form that owns this field
     */
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    /**
     * Get the services that use this field (for custom fields)
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'form_field_services')
                    ->withTimestamps();
    }

    /**
     * Get the extras that use this field (for custom fields)
     */
    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'form_field_extras')
                    ->withTimestamps();
    }

    /**
     * Get the linked extra for distance calculation
     */
    public function linkedExtra(): BelongsTo
    {
        return $this->belongsTo(Extra::class, 'linked_extra_id');
    }

    /**
     * Get available field types
     */
    public static function getFieldTypes()
    {
        return [
            'text' => 'Text Input',
            'email' => 'Email Input',
            'phone' => 'Phone Number',
            'number' => 'Number Input',
            'textarea' => 'Text Area',
            'select' => 'Dropdown Select',
            'checkbox' => 'Checkbox',
            'radio' => 'Radio Buttons',
            'file' => 'File Upload',
            'date' => 'Date Picker',
            'time' => 'Time Picker',
            'datetime' => 'Date & Time Picker',
            'url' => 'URL Input',
            'password' => 'Password Input',
            'location' => 'Location Picker',
        ];
    }

    /**
     * Get validation rules for this field
     */
    public function getValidationRules()
    {
        $rules = [];

        if ($this->is_required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        // Add type-specific rules
        switch ($this->type) {
            case 'email':
                $rules[] = 'email';
                break;
            case 'phone':
                $rules[] = 'regex:/^[0-9+\-\s\(\)]+$/';
                break;
            case 'number':
                $rules[] = 'numeric';
                break;
            case 'url':
                $rules[] = 'url';
                break;
            case 'file':
                $rules[] = 'file';
                break;
            case 'location':
                $rules[] = 'string';
                break;
        }

        // Add custom validation rules
        if ($this->validation_rules) {
            $rules = array_merge($rules, $this->validation_rules);
        }

        return $rules;
    }

    /**
     * Get field options for select/radio/checkbox
     */
    public function getOptions()
    {
        return $this->options ?? [];
    }
} 