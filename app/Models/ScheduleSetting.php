<<<<<<< HEAD
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
    public function getAvailableSlots($date = null, $serviceDuration = 30)
    {
        $date = $date ?? now();
        $slots = [];
        
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        $duration = $serviceDuration; // Use service duration instead of fixed slot duration
        $buffer = $this->buffer_time_minutes;
        
        $current = $start->copy();
        
        while ($current->addMinutes($duration) <= $end) {
            $slotStart = $current->copy()->subMinutes($duration);
            $slotEnd = $current->copy();
            
            // Check if slot conflicts with break times
            $isBreakTime = $this->isBreakTime($slotStart, $slotEnd);
            
            if (!$isBreakTime) {
                $slots[] = [
                    'start' => $slotStart->format('H:i'),
                    'end' => $slotEnd->format('H:i'),
                    'available' => true
                ];
            }
            
            $current->addMinutes($buffer);
        }
        
        return $slots;
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
=======
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
    public function getAvailableSlots($date = null, $serviceDuration = 30)
    {
        $date = $date ?? now();
        $slots = [];
        
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        $duration = $serviceDuration; // Use service duration instead of fixed slot duration
        $buffer = $this->buffer_time_minutes;
        
        $current = $start->copy();
        
        while ($current->addMinutes($duration) <= $end) {
            $slotStart = $current->copy()->subMinutes($duration);
            $slotEnd = $current->copy();
            
            // Check if slot conflicts with break times
            $isBreakTime = $this->isBreakTime($slotStart, $slotEnd);
            
            if (!$isBreakTime) {
                $slots[] = [
                    'start' => $slotStart->format('H:i'),
                    'end' => $slotEnd->format('H:i'),
                    'available' => true
                ];
            }
            
            $current->addMinutes($buffer);
        }
        
        return $slots;
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
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 