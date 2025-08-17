<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPolicySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'cancellation_window_hours',
        'cancellation_policy',
        'late_cancellation_fee',
        'late_cancellation_window_hours',
        'require_cancellation_reason',
        'auto_cancel_no_show',
        'no_show_minutes',
        'reschedule_window_hours',
        'max_reschedule_attempts',
        'reschedule_fee',
        'reschedule_advance_notice_hours',
        'allow_same_day_reschedule',
        'allow_next_day_reschedule',
        'send_reminder_24h',
        'send_reminder_2h',
        'send_reminder_1h',
        'notify_admin_on_cancellation',
        'notify_admin_on_reschedule',
        'notify_employee_on_cancellation',
        'notify_employee_on_reschedule',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'late_cancellation_fee' => 'decimal:2',
        'reschedule_fee' => 'decimal:2',
        'require_cancellation_reason' => 'boolean',
        'auto_cancel_no_show' => 'boolean',
        'allow_same_day_reschedule' => 'boolean',
        'allow_next_day_reschedule' => 'boolean',
        'send_reminder_24h' => 'boolean',
        'send_reminder_2h' => 'boolean',
        'send_reminder_1h' => 'boolean',
        'notify_admin_on_cancellation' => 'boolean',
        'notify_admin_on_reschedule' => 'boolean',
        'notify_employee_on_cancellation' => 'boolean',
        'notify_employee_on_reschedule' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Scope to get only active policies
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get policies ordered by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get cancellation policy as readable text
     */
    public function getCancellationPolicyTextAttribute(): string
    {
        return match($this->cancellation_policy) {
            'full_refund' => 'Full Refund',
            'partial_refund' => 'Partial Refund',
            'no_refund' => 'No Refund',
            'credit_only' => 'Credit Only',
            default => ucfirst(str_replace('_', ' ', $this->cancellation_policy))
        };
    }

    /**
     * Check if cancellation is allowed for a given booking
     */
    public function canCancelBooking($booking): bool
    {
        $appointmentTime = $booking->appointment_time;
        $now = now();
        $hoursUntilAppointment = $now->diffInHours($appointmentTime, false);
        
        return $hoursUntilAppointment >= $this->cancellation_window_hours;
    }

    /**
     * Check if reschedule is allowed for a given booking
     */
    public function canRescheduleBooking($booking): bool
    {
        $appointmentTime = $booking->appointment_time;
        $now = now();
        $hoursUntilAppointment = $now->diffInHours($appointmentTime, false);
        
        // Check if within reschedule window
        if ($hoursUntilAppointment < $this->reschedule_window_hours) {
            return false;
        }
        
        // Check if max reschedule attempts reached
        if ($booking->reschedule_attempts >= $this->max_reschedule_attempts) {
            return false;
        }
        
        // Check if appointment is too close (advance notice)
        if ($hoursUntilAppointment < $this->reschedule_advance_notice_hours) {
            return false;
        }
        
        return true;
    }

    /**
     * Get the cancellation fee for a booking
     */
    public function getCancellationFee($booking): float
    {
        $appointmentTime = $booking->appointment_time;
        $now = now();
        $hoursUntilAppointment = $now->diffInHours($appointmentTime, false);
        
        if ($hoursUntilAppointment <= $this->late_cancellation_window_hours) {
            return $this->late_cancellation_fee;
        }
        
        return 0;
    }

    /**
     * Get notification settings as array
     */
    public function getNotificationSettingsAttribute(): array
    {
        return [
            'reminders' => [
                '24h' => $this->send_reminder_24h,
                '2h' => $this->send_reminder_2h,
                '1h' => $this->send_reminder_1h,
            ],
            'admin_notifications' => [
                'cancellation' => $this->notify_admin_on_cancellation,
                'reschedule' => $this->notify_admin_on_reschedule,
            ],
            'employee_notifications' => [
                'cancellation' => $this->notify_employee_on_cancellation,
                'reschedule' => $this->notify_employee_on_reschedule,
            ],
        ];
    }
}
