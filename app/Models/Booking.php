<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'employee_id',
        'appointment_time',
        'appointment_date_time',
        'duration',
        'total_amount',
        'status',
        'notes',
        'payment_status',
        'payment_method',
        'transaction_id',
        'otp',
        'otp_verified_at',
        'consent_given',
        'consent_given_at',
        'coupon_id',
        'discount_amount',
        'coupon_code',
        'reschedule_attempts',
        'cancellation_reason',
        'cancelled_at',
        'rescheduled_at',
        'booking_policy_setting_id',
        'reschedule_payment_amount',
        'reschedule_payment_id',
        'reschedule_payment_date',
        'reschedule_payment_status',
    ];

    protected $casts = [
        'appointment_time' => 'datetime',
        'appointment_date_time' => 'datetime',
        'total_amount' => 'decimal:2',
        'duration' => 'integer',
        'consent_given' => 'boolean',
        'otp_verified_at' => 'datetime',
        'consent_given_at' => 'datetime',
        'discount_amount' => 'decimal:2',
        'cancelled_at' => 'datetime',
        'rescheduled_at' => 'datetime',
        'reschedule_payment_amount' => 'decimal:2',
        'reschedule_payment_date' => 'datetime',
    ];

    /**
     * Get the customer who made the booking
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the service for this booking
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the employee assigned to this booking
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Get the extras included in this booking
     */
    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'booking_extras')
                    ->withPivot('price')
                    ->withTimestamps();
    }

    /**
     * Get the form responses for this booking
     */
    public function formResponses(): HasMany
    {
        return $this->hasMany(BookingFormResponse::class);
    }

    /**
     * Get the coupon used for this booking
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the coupon usage record for this booking
     */
    public function couponUsage(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Get the booking policy setting for this booking
     */
    public function bookingPolicySetting(): BelongsTo
    {
        return $this->belongsTo(BookingPolicySetting::class);
    }

    /**
     * Get a specific form response by field name
     */
    public function getFormResponse($fieldName)
    {
        return $this->formResponses()
                    ->whereHas('formField', function($query) use ($fieldName) {
                        $query->where('name', $fieldName);
                    })
                    ->first();
    }

    /**
     * Get all form responses with field information
     */
    public function getFormResponsesWithFields()
    {
        return $this->formResponses()
                    ->with('formField')
                    ->get()
                    ->mapWithKeys(function($response) {
                        return [$response->formField->name => $response];
                    });
    }

    /**
     * Get the end time of the appointment
     */
    public function getEndTimeAttribute()
    {
        return $this->appointment_time->copy()->addMinutes($this->duration);
    }

    /**
     * Check if booking conflicts with a given time slot
     */
    public function conflictsWith($startTime, $endTime): bool
    {
        $bookingStart = $this->appointment_time;
        $bookingEnd = $this->getEndTimeAttribute();

        // Check for overlap: if either start time is before the other's end time
        return $startTime < $bookingEnd && $endTime > $bookingStart;
    }

    /**
     * Scope to get only active bookings (not cancelled)
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['cancelled']);
    }

    /**
     * Scope to get bookings for a specific date
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('appointment_time', $date);
    }

    /**
     * Scope to get bookings for a specific date and time range
     */
    public function scopeForDateTimeRange($query, $date, $startTime, $endTime)
    {
        return $query->whereDate('appointment_time', $date)
                    ->whereTime('appointment_time', '>=', $startTime)
                    ->whereTime('appointment_time', '<', $endTime);
    }

    /**
     * Check if a time slot is available for booking
     */
    public static function isSlotAvailable($date, $startTime, $duration, $excludeBookingId = null): bool
    {
        $newStartTime = Carbon::parse($date . ' ' . $startTime);
        $newEndTime = $newStartTime->copy()->addMinutes($duration);
        
        // Get all active bookings for this date
        $existingBookings = self::active()
                                ->whereDate('appointment_time', $date)
                                ->get();

        if ($excludeBookingId) {
            $existingBookings = $existingBookings->where('id', '!=', $excludeBookingId);
        }

        // Check for conflicts with each existing booking
        foreach ($existingBookings as $booking) {
            $bookingStart = $booking->appointment_time;
            $bookingEnd = $booking->getEndTimeAttribute();
            
            // Check if there's any overlap - Fixed: Use <= and >= to include exact matches
            if ($newStartTime <= $bookingEnd && $newEndTime >= $bookingStart) {
                return false; // Conflict found
            }
        }

        return true; // No conflicts found
    }

    /**
     * Get all conflicting bookings for a time slot
     */
    public static function getConflictingBookings($date, $startTime, $duration, $excludeBookingId = null)
    {
        $newStartTime = Carbon::parse($date . ' ' . $startTime);
        $newEndTime = $newStartTime->copy()->addMinutes($duration);
        
        // Get all active bookings for this date
        $existingBookings = self::active()
                                ->whereDate('appointment_time', $date)
                                ->get();

        if ($excludeBookingId) {
            $existingBookings = $existingBookings->where('id', '!=', $excludeBookingId);
        }

        // Find conflicting bookings
        $conflictingBookings = collect();
        foreach ($existingBookings as $booking) {
            $bookingStart = $booking->appointment_time;
            $bookingEnd = $booking->getEndTimeAttribute();
            
            // Check if there's any overlap - Fixed: Use <= and >= to include exact matches
            if ($newStartTime <= $bookingEnd && $newEndTime >= $bookingStart) {
                $conflictingBookings->push($booking);
            }
        }

        return $conflictingBookings;
    }

    /**
     * Get booking status as readable text
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'no_show' => 'No Show',
            default => ucfirst($this->status)
        };
    }

    /**
     * Get payment status as readable text
     */
    public function getPaymentStatusTextAttribute(): string
    {
        return match($this->payment_status) {
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
            default => ucfirst($this->payment_status)
        };
    }

    /**
     * Check if booking can be cancelled
     */
    public function canBeCancelled(): bool
    {
        if ($this->status === 'cancelled' || $this->status === 'completed') {
            return false;
        }

        $policy = $this->bookingPolicySetting;
        if (!$policy) {
            // Default policy if none assigned
            $policy = BookingPolicySetting::active()->first();
        }

        if (!$policy) {
            return true; // Allow if no policy exists
        }

        return $policy->canCancelBooking($this);
    }

    /**
     * Check if booking can be rescheduled
     */
    public function canBeRescheduled(): bool
    {
        if ($this->status === 'cancelled' || $this->status === 'completed') {
            return false;
        }

        $policy = $this->bookingPolicySetting;
        if (!$policy) {
            // Default policy if none assigned
            $policy = BookingPolicySetting::active()->first();
        }

        if (!$policy) {
            return true; // Allow if no policy exists
        }

        return $policy->canRescheduleBooking($this);
    }

    /**
     * Cancel the booking
     */
    public function cancel($reason = null): bool
    {
        if (!$this->canBeCancelled()) {
            return false;
        }

        $this->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        return true;
    }

    /**
     * Reschedule the booking
     */
    public function reschedule($newDateTime): bool
    {
        if (!$this->canBeRescheduled()) {
            return false;
        }

        $policy = $this->bookingPolicySetting;
        if (!$policy) {
            $policy = BookingPolicySetting::active()->first();
        }

        if ($policy && $this->reschedule_attempts >= $policy->max_reschedule_attempts) {
            return false;
        }

        $this->update([
            'appointment_time' => $newDateTime,
            'appointment_date_time' => $newDateTime,
            'reschedule_attempts' => $this->reschedule_attempts + 1,
            'rescheduled_at' => now(),
        ]);

        return true;
    }

    /**
     * Get the cancellation fee for this booking
     */
    public function getCancellationFee(): float
    {
        $policy = $this->bookingPolicySetting;
        if (!$policy) {
            $policy = BookingPolicySetting::active()->first();
        }

        if (!$policy) {
            return 0;
        }

        return $policy->getCancellationFee($this);
    }

    /**
     * Get the invoice for this booking
     */
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * Create or update invoice for this booking
     */
    public function createOrUpdateInvoice(): Invoice
    {
        // Check if invoice already exists
        $invoice = $this->invoice;
        
        if ($invoice) {
            // Update existing invoice
            $invoice->update([
                'subtotal' => $this->service->price + ($this->extras ? $this->extras->sum('pivot.price') : 0),
                'discount_amount' => $this->discount_amount ?? 0,
                'reschedule_fee' => $this->reschedule_payment_amount ?? 0,
                'total_amount' => $this->total_amount,
                'payment_status' => $this->payment_status,
                'payment_date' => $this->payment_status === 'paid' ? now() : null,
                'status' => $this->payment_status === 'paid' ? 'paid' : 'pending',
                'paid_date' => $this->payment_status === 'paid' ? now() : null,
            ]);
            
            return $invoice;
        } else {
            // Create new invoice
            return Invoice::createFromBooking($this);
        }
    }
} 