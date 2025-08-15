<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'minimum_amount',
        'maximum_discount',
        'max_uses',
        'max_uses_per_user',
        'used_count',
        'valid_from',
        'valid_until',
        'is_active',
        'applicable_services',
        'excluded_services',
        'created_by',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'applicable_services' => 'array',
        'excluded_services' => 'array',
    ];

    /**
     * Get the usages for this coupon
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Get the bookings that used this coupon
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if coupon is valid (active and within date range)
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        if ($this->valid_from && $now->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until && $now->gt($this->valid_until)) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if coupon can be used by a specific user
     */
    public function canBeUsedBy(User $user, $amount = 0): array
    {
        $result = [
            'valid' => false,
            'message' => '',
            'discount_amount' => 0
        ];

        // Check if coupon is valid
        if (!$this->isValid()) {
            $result['message'] = 'Coupon is not valid or has expired.';
            return $result;
        }

        // Check minimum amount
        if ($amount < $this->minimum_amount) {
            $result['message'] = "Minimum order amount of Rs. {$this->minimum_amount} required.";
            return $result;
        }

        // Check if user has used this coupon before
        $userUsageCount = $this->usages()->where('user_id', $user->id)->count();
        if ($userUsageCount >= $this->max_uses_per_user) {
            $result['message'] = 'You have already used this coupon maximum times.';
            return $result;
        }

        // Calculate discount amount
        $discountAmount = $this->calculateDiscount($amount);
        
        if ($discountAmount <= 0) {
            $result['message'] = 'No discount applicable for this amount.';
            return $result;
        }

        $result['valid'] = true;
        $result['discount_amount'] = $discountAmount;
        $result['message'] = "Discount of Rs. {$discountAmount} applied successfully!";

        return $result;
    }

    /**
     * Calculate discount amount for given total
     */
    public function calculateDiscount($amount): float
    {
        if ($amount < $this->minimum_amount) {
            return 0;
        }

        $discount = 0;

        if ($this->discount_type === 'percentage') {
            $discount = ($amount * $this->discount_value) / 100;
        } else {
            $discount = $this->discount_value;
        }

        // Apply maximum discount limit
        if ($this->maximum_discount && $discount > $this->maximum_discount) {
            $discount = $this->maximum_discount;
        }

        // Ensure discount doesn't exceed the amount
        if ($discount > $amount) {
            $discount = $amount;
        }

        return round($discount, 2);
    }

    /**
     * Check if coupon applies to specific service
     */
    public function appliesToService($serviceId): bool
    {
        // If no service restrictions, applies to all
        if (empty($this->applicable_services) && empty($this->excluded_services)) {
            return true;
        }

        // Check excluded services
        if (!empty($this->excluded_services) && in_array($serviceId, $this->excluded_services)) {
            return false;
        }

        // Check applicable services
        if (!empty($this->applicable_services) && !in_array($serviceId, $this->applicable_services)) {
            return false;
        }

        return true;
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Get formatted discount text
     */
    public function getDiscountTextAttribute(): string
    {
        if ($this->discount_type === 'percentage') {
            return "{$this->discount_value}% OFF";
        } else {
            return "Rs. {$this->discount_value} OFF";
        }
    }

    /**
     * Get validity status
     */
    public function getValidityStatusAttribute(): string
    {
        if (!$this->is_active) {
            return 'Inactive';
        }

        $now = Carbon::now();

        if ($this->valid_from && $now->lt($this->valid_from)) {
            return 'Not Started';
        }

        if ($this->valid_until && $now->gt($this->valid_until)) {
            return 'Expired';
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return 'Fully Used';
        }

        return 'Active';
    }

    /**
     * Scope for active coupons
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for valid coupons
     */
    public function scopeValid($query)
    {
        $now = Carbon::now();
        
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('valid_from')
                  ->orWhere('valid_from', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('valid_until')
                  ->orWhere('valid_until', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')
                  ->orWhereRaw('used_count < max_uses');
            });
    }
}
