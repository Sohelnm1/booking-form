<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone_number',
        'email',
        'password',
        'role',
        'gender',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is an employee
     */
    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Get user's permissions based on role
     */
    public function getPermissions(): array
    {
        return match($this->role) {
            'admin' => [
                'view_all_bookings',
                'manage_services',
                'manage_extras',
                'manage_employees',
                'manage_schedules',
                'view_reports',
                'manage_settings'
            ],
            'employee' => [
                'view_assigned_bookings',
                'update_booking_status',
                'view_services'
            ],
            'customer' => [
                'create_booking',
                'view_own_bookings',
                'reschedule_booking',
                'cancel_booking'
            ],
            default => []
        };
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->getPermissions());
    }

    /**
     * Get the services this employee can provide
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'employee_services')
                    ->withTimestamps();
    }

    /**
     * Get the schedule settings this employee follows
     */
    public function scheduleSettings(): BelongsToMany
    {
        return $this->belongsToMany(ScheduleSetting::class, 'employee_schedule_settings')
                    ->withTimestamps();
    }

    /**
     * Get the bookings assigned to this employee
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'employee_id');
    }

    /**
     * Get the bookings made by this customer
     */
    public function customerBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    /**
     * Get the coupon usages for this user
     */
    public function couponUsages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Check if employee is available for a specific time slot
     */
    public function isAvailableForSlot($date, $startTime, $duration): bool
    {
        // Check if employee has any bookings that conflict with this slot
        $newStartTime = \Carbon\Carbon::parse($date . ' ' . $startTime);
        $newEndTime = $newStartTime->copy()->addMinutes($duration);
        
        $conflictingBookings = $this->bookings()
            ->whereDate('appointment_time', $date)
            ->whereNotIn('status', ['cancelled']) // Exclude cancelled bookings
            ->where(function($query) use ($newStartTime, $newEndTime) {
                $query->where('appointment_time', '<=', $newEndTime)
                      ->whereRaw('DATE_ADD(appointment_time, INTERVAL duration MINUTE) >= ?', [$newStartTime]);
            })
            ->count();
        
        return $conflictingBookings === 0;
    }

    /**
     * Get available employees for a specific service and time slot
     */
    public static function getAvailableEmployeesForSlot($serviceId, $date, $startTime, $duration, $excludeBookingId = null)
    {
        // Debug: Check total employees
        $totalEmployees = self::where('role', 'employee')->count();
        \Log::info('Total employees', ['count' => $totalEmployees]);
        
        // Debug: Check active employees
        $activeEmployees = self::where('role', 'employee')->where('is_active', true)->count();
        \Log::info('Active employees', ['count' => $activeEmployees]);
        
        // Debug: Check employees with this service
        $employeesWithService = self::where('role', 'employee')
            ->where('is_active', true)
            ->whereHas('services', function($query) use ($serviceId) {
                $query->where('services.id', $serviceId);
            })->count();
        \Log::info('Employees with service', ['service_id' => $serviceId, 'count' => $employeesWithService]);
        
        // Debug: Check for conflicting bookings
        $newStartTime = \Carbon\Carbon::parse($date . ' ' . $startTime);
        $newEndTime = $newStartTime->copy()->addMinutes($duration);
        
        $employeesWithConflicts = self::where('role', 'employee')
            ->where('is_active', true)
            ->whereHas('services', function($query) use ($serviceId) {
                $query->where('services.id', $serviceId);
            })
            ->whereHas('bookings', function($query) use ($date, $startTime, $duration) {
                $newStartTime = \Carbon\Carbon::parse($date . ' ' . $startTime);
                $newEndTime = $newStartTime->copy()->addMinutes($duration);
                
                $query->whereDate('appointment_time', $date)
                      ->whereNotIn('status', ['cancelled']) // Exclude cancelled bookings
                      ->where(function($subQuery) use ($newStartTime, $newEndTime) {
                          $subQuery->where('appointment_time', '<=', $newEndTime)
                                   ->whereRaw('DATE_ADD(appointment_time, INTERVAL duration MINUTE) >= ?', [$newStartTime]);
                      });
            })->count();
        \Log::info('Employees with conflicts', ['count' => $employeesWithConflicts]);
        
        $availableEmployees = self::where('role', 'employee')
            ->where('is_active', true)
            ->whereHas('services', function($query) use ($serviceId) {
                $query->where('services.id', $serviceId);
            })
            ->whereDoesntHave('bookings', function($query) use ($date, $startTime, $duration, $excludeBookingId) {
                $newStartTime = \Carbon\Carbon::parse($date . ' ' . $startTime);
                $newEndTime = $newStartTime->copy()->addMinutes($duration);
                
                $query->whereDate('appointment_time', $date)
                      ->whereNotIn('status', ['cancelled']) // Exclude cancelled bookings
                      ->where(function($subQuery) use ($newStartTime, $newEndTime) {
                          $subQuery->where('appointment_time', '<=', $newEndTime)
                                   ->whereRaw('DATE_ADD(appointment_time, INTERVAL duration MINUTE) >= ?', [$newStartTime]);
                      });
                
                // Exclude the specified booking if provided (for rescheduling)
                if ($excludeBookingId) {
                    $query->where('bookings.id', '!=', $excludeBookingId);
                }
            })
            ->get();
            
        \Log::info('Final available employees', [
            'count' => $availableEmployees->count(),
            'exclude_booking_id' => $excludeBookingId,
            'date' => $date,
            'start_time' => $startTime,
            'service_id' => $serviceId
        ]);
        
        return $availableEmployees;
    }
}
