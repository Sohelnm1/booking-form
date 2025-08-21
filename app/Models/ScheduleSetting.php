<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'booking_window_days',
        'min_advance_hours',
        'max_advance_days',
        'buffer_time_minutes',
        'start_time',
        'end_time',
        'working_days',
        'break_times',
        'service_overrides',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'working_days' => 'array',
        'break_times' => 'array',
        'service_overrides' => 'array',
        'is_active' => 'boolean',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    /**
     * Get working days as readable text
     */
    public function getWorkingDaysTextAttribute()
    {
        $dayNames = [
            1 => 'Monday',
            2 => 'Tuesday', 
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            7 => 'Sunday'
        ];

        $days = collect($this->working_days)->map(function($day) use ($dayNames) {
            return $dayNames[$day] ?? $day;
        });

        return $days->implode(', ');
    }

    /**
     * Get available time slots for a given date and service duration
     */
    public function getAvailableSlots($date = null, $serviceDuration = 30, $excludeBookingId = null, $genderPreference = null, $serviceId = null)
    {
        $date = $date ?? now();
        $slots = [];
        
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        $duration = $serviceDuration; // Use service duration instead of fixed slot duration
        $buffer = $this->buffer_time_minutes;
        
        \Log::info('ScheduleSetting getAvailableSlots', [
            'schedule_name' => $this->name,
            'start_time' => $start->format('H:i'),
            'end_time' => $end->format('H:i'),
            'service_duration' => $duration,
            'buffer_time' => $buffer,
            'date' => $date->format('Y-m-d'),
            'exclude_booking_id' => $excludeBookingId,
            'gender_preference' => $genderPreference
        ]);
        
        // Start from the actual start time
        $current = $start->copy();
        
        while ($current->copy()->addMinutes($duration) <= $end) {
            $slotStart = $current->copy();
            $slotEnd = $current->copy()->addMinutes($duration);
            
            // Check if slot conflicts with break times
            $isBreakTime = $this->isBreakTime($slotStart, $slotEnd);
            
            if (!$isBreakTime) {
                // For "no_preference", we need to check if ANY employee is available
                // For specific gender preference, we check conflicts with that gender only
                if ($genderPreference === 'no_preference') {
                    // Check if there are any employees available for this slot
                    $availableEmployees = \App\Models\User::getAvailableEmployeesForSlot(
                        $serviceId,
                        $date->format('Y-m-d'),
                        $slotStart->format('H:i'),
                        $duration,
                        $excludeBookingId,
                        'no_preference'
                    );
                    
                    if ($availableEmployees->count() > 0) {
                        $slots[] = [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i'),
                            'available' => true
                        ];
                        
                        \Log::info('Slot created for no preference', [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i'),
                            'available_employees' => $availableEmployees->count()
                        ]);
                    } else {
                        \Log::info('Slot excluded for no preference - no employees available', [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i')
                        ]);
                    }
                } else {
                    // For specific gender preference, check conflicts with that gender
                    $isConflicting = $this->hasConflictingBookings($date, $slotStart, $slotEnd, $excludeBookingId, $genderPreference);
                    
                    if (!$isConflicting) {
                        $slots[] = [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i'),
                            'available' => true
                        ];
                        
                        \Log::info('Slot created for specific gender', [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i'),
                            'gender_preference' => $genderPreference
                        ]);
                    } else {
                        \Log::info('Slot excluded - conflicts with existing booking', [
                            'start' => $slotStart->format('H:i'),
                            'end' => $slotEnd->format('H:i'),
                            'gender_preference' => $genderPreference
                        ]);
                    }
                }
            }
            
            // Move to next slot: service duration + buffer time
            $current->addMinutes($duration + $buffer);
        }
        
        return $slots;
    }


//     public function getAvailableSlots($date = null, $serviceDuration = 30, $excludeBookingId = null)
// {
//     $date = $date ?? now();
//     $slots = [];
    
//     $start = \Carbon\Carbon::parse($this->start_time);
//     $end = \Carbon\Carbon::parse($this->end_time);
//     $duration = $serviceDuration;
//     $buffer = $this->buffer_time_minutes;
    
//     // Get original booking time if we're excluding a booking
//     $originalBookingTime = null;
//     if ($excludeBookingId) {
//         $booking = \App\Models\Booking::find($excludeBookingId);
//         if ($booking) {
//             $originalBookingTime = \Carbon\Carbon::parse($booking->appointment_time);
//         }
//     }
    
//     $current = $start->copy();
    
//     while ($current->copy()->addMinutes($duration) <= $end) {
//         $slotStart = $current->copy();
//         $slotEnd = $current->copy()->addMinutes($duration);
        
//         // Skip if this is the original booking time
//         if ($originalBookingTime && $slotStart->format('H:i') == $originalBookingTime->format('H:i')) {
//             $current->addMinutes($duration + $buffer);
//             continue;
//         }
        
//         $isBreakTime = $this->isBreakTime($slotStart, $slotEnd);
        
//         if (!$isBreakTime) {
//             $isConflicting = $this->hasConflictingBookings($date, $slotStart, $slotEnd, $excludeBookingId);
            
//             if (!$isConflicting) {
//                 $slots[] = [
//                     'start' => $slotStart->format('H:i'),
//                     'end' => $slotEnd->format('H:i'),
//                     'available' => true
//                 ];
//             }
//         }
        
//         $current->addMinutes($duration + $buffer);
//     }
    
//     return $slots;
// }
    /**
     * Check if a time slot conflicts with existing bookings
     */
    private function hasConflictingBookings($date, $slotStart, $slotEnd, $excludeBookingId = null, $genderPreference = null)
    {
        // Convert slot times to full datetime for proper comparison
        $slotStartDateTime = $date->copy()->setTimeFromTimeString($slotStart->format('H:i:s'));
        $slotEndDateTime = $date->copy()->setTimeFromTimeString($slotEnd->format('H:i:s'));
        
        $query = \App\Models\Booking::whereDate('appointment_time', $date)
            ->whereNotIn('status', ['cancelled']) // Only consider active bookings
            ->where(function($query) use ($slotStartDateTime, $slotEndDateTime) {
                // Two time periods overlap if: start1 < end2 AND start2 < end1
                // Fixed: Use <= and >= to include exact matches
                $query->where('appointment_time', '<=', $slotEndDateTime)
                      ->whereRaw('DATE_ADD(appointment_time, INTERVAL duration MINUTE) >= ?', [$slotStartDateTime]);
            });
        
        // For "no_preference", we don't filter by gender - we check all conflicts
        // For specific gender preference, we only check conflicts with that gender
        if ($genderPreference && $genderPreference !== 'no_preference') {
            $query->whereHas('employee', function($empQuery) use ($genderPreference) {
                $empQuery->where('gender', $genderPreference);
            });
            \Log::info('Filtering conflicts by gender preference', [
                'gender_preference' => $genderPreference,
                'slot_start' => $slotStart->format('H:i'),
                'slot_end' => $slotEnd->format('H:i')
            ]);
        } else {
            \Log::info('No gender preference filter - checking all conflicts', [
                'gender_preference' => $genderPreference,
                'slot_start' => $slotStart->format('H:i'),
                'slot_end' => $slotEnd->format('H:i')
            ]);
        }
        
        // Exclude the specified booking if provided (for rescheduling)
        if ($excludeBookingId) {
            \Log::info('excluding booking id', [
                'exclude_booking_id' => $excludeBookingId
            ]);
            $query->where('id', '!=', (int) $excludeBookingId);
        }
        
        \Log::info('Conflict check query', [
            'date' => $date->format('Y-m-d'),
            'slot_start' => $slotStartDateTime->format('Y-m-d H:i:s'),
            'slot_end' => $slotEndDateTime->format('Y-m-d H:i:s'),
            'exclude_booking_id' => $excludeBookingId,
            'conflicts_found' => $query->exists()
        ]);
        
        return $query->exists();
    }

    /**
     * Check if time slot conflicts with break times
     */
    private function isBreakTime($slotStart, $slotEnd)
    {
        if (!$this->break_times) {
            return false;
        }

        foreach ($this->break_times as $break) {
            $breakStart = \Carbon\Carbon::parse($break['start']);
            $breakEnd = \Carbon\Carbon::parse($break['end']);
            
            // Check for overlap
            if ($slotStart < $breakEnd && $slotEnd > $breakStart) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get booking window start and end dates
     */
    public function getBookingWindow($fromDate = null)
    {
        $fromDate = $fromDate ?? now();
        
        $startDate = $fromDate->copy()->addHours($this->min_advance_hours);
        $endDate = $fromDate->copy()->addDays($this->booking_window_days);
        
        return [
            'start' => $startDate,
            'end' => $endDate
        ];
    }

    /**
     * Scope to get only active settings
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
        return $query->orderBy('sort_order')->orderBy('name');
    }
} 