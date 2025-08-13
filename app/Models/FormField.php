<<<<<<< HEAD
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
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_primary' => 'boolean',
        'options' => 'array',
        'validation_rules' => 'array',
        'settings' => 'array',
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
=======
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
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_primary' => 'boolean',
        'options' => 'array',
        'validation_rules' => 'array',
        'settings' => 'array',
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
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 