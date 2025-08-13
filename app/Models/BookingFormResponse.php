<<<<<<< HEAD
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingFormResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'form_field_id',
        'response_value',
        'response_data',
    ];

    protected $casts = [
        'response_data' => 'array',
    ];

    /**
     * Get the booking this response belongs to
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the form field this response is for
     */
    public function formField(): BelongsTo
    {
        return $this->belongsTo(FormField::class);
    }

    /**
     * Get the formatted response value based on field type
     */
    public function getFormattedValueAttribute()
    {
        $field = $this->formField;
        
        if (!$field) {
            return $this->response_value;
        }

        switch ($field->type) {
            case 'checkbox':
                return $this->response_value ? 'Yes' : 'No';
            
            case 'radio':
            case 'select':
                // For radio/select, response_value should be the option value
                // We can look up the label from the field options
                if ($field->options && is_array($field->options)) {
                    foreach ($field->options as $option) {
                        if (is_array($option) && $option['value'] === $this->response_value) {
                            return $option['label'];
                        } elseif ($option === $this->response_value) {
                            return $option;
                        }
                    }
                }
                return $this->response_value;
            
            case 'date':
                return $this->response_value ? date('M d, Y', strtotime($this->response_value)) : '';
            
            case 'time':
                return $this->response_value ? date('h:i A', strtotime($this->response_value)) : '';
            
            default:
                return $this->response_value;
        }
    }
=======
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingFormResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'form_field_id',
        'response_value',
        'response_data',
    ];

    protected $casts = [
        'response_data' => 'array',
    ];

    /**
     * Get the booking this response belongs to
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the form field this response is for
     */
    public function formField(): BelongsTo
    {
        return $this->belongsTo(FormField::class);
    }

    /**
     * Get the formatted response value based on field type
     */
    public function getFormattedValueAttribute()
    {
        $field = $this->formField;
        
        if (!$field) {
            return $this->response_value;
        }

        switch ($field->type) {
            case 'checkbox':
                return $this->response_value ? 'Yes' : 'No';
            
            case 'radio':
            case 'select':
                // For radio/select, response_value should be the option value
                // We can look up the label from the field options
                if ($field->options && is_array($field->options)) {
                    foreach ($field->options as $option) {
                        if (is_array($option) && $option['value'] === $this->response_value) {
                            return $option['label'];
                        } elseif ($option === $this->response_value) {
                            return $option;
                        }
                    }
                }
                return $this->response_value;
            
            case 'date':
                return $this->response_value ? date('M d, Y', strtotime($this->response_value)) : '';
            
            case 'time':
                return $this->response_value ? date('h:i A', strtotime($this->response_value)) : '';
            
            default:
                return $this->response_value;
        }
    }
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 