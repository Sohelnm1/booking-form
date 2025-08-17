# Booking Policies System - Reschedule & Cancellation Settings

## Overview

This system provides comprehensive admin controls for managing customer booking cancellations and reschedules. It allows administrators to set flexible policies that control when and how customers can modify their appointments.

## Features Implemented

### 1. **Admin Panel - Booking Policies Page**

-   **Location**: `/admin/booking-policies`
-   **Access**: Admin users only
-   **Features**:
    -   Create, edit, and delete booking policies
    -   Multiple policy types (Standard, Flexible, Strict)
    -   Comprehensive settings for cancellation and reschedule rules

### 2. **Cancellation Settings**

#### **Cancellation Window**

-   **Setting**: `cancellation_window_hours`
-   **Purpose**: How many hours before appointment customers can cancel
-   **Default**: 24 hours
-   **Example**: If set to 24, customers can cancel up to 24 hours before their appointment

#### **Cancellation Policy**

-   **Options**:
    -   `full_refund` - Complete refund to customer
    -   `partial_refund` - Partial refund (percentage-based)
    -   `no_refund` - No refund provided
    -   `credit_only` - Store credit instead of refund

#### **Late Cancellation Fees**

-   **Setting**: `late_cancellation_fee`
-   **Purpose**: Fee charged for cancellations within a specific window
-   **Window**: `late_cancellation_window_hours`
-   **Example**: ₹50 fee if cancelled within 2 hours of appointment

#### **Cancellation Requirements**

-   **Require Reason**: `require_cancellation_reason`
-   **Auto-Cancel No-Shows**: `auto_cancel_no_show`
-   **No-Show Minutes**: `no_show_minutes` (when to auto-cancel)

### 3. **Reschedule Settings**

#### **Reschedule Window**

-   **Setting**: `reschedule_window_hours`
-   **Purpose**: How many hours before appointment customers can reschedule
-   **Default**: 24 hours

#### **Reschedule Limits**

-   **Max Attempts**: `max_reschedule_attempts`
-   **Reschedule Fee**: `reschedule_fee`
-   **Advance Notice**: `reschedule_advance_notice_hours`

#### **Reschedule Flexibility**

-   **Same Day**: `allow_same_day_reschedule`
-   **Next Day**: `allow_next_day_reschedule`

### 4. **Notification Settings**

#### **Reminder Notifications**

-   **24h Reminder**: `send_reminder_24h`
-   **2h Reminder**: `send_reminder_2h`
-   **1h Reminder**: `send_reminder_1h`

#### **Admin/Employee Notifications**

-   **Admin on Cancellation**: `notify_admin_on_cancellation`
-   **Admin on Reschedule**: `notify_admin_on_reschedule`
-   **Employee on Cancellation**: `notify_employee_on_cancellation`
-   **Employee on Reschedule**: `notify_employee_on_reschedule`

## Default Policies Created

### 1. **Standard Policy**

-   **Cancellation**: 24h window, full refund, no late fees
-   **Reschedule**: 24h window, 2 attempts, no fees
-   **Notifications**: 24h and 2h reminders
-   **Best for**: Most businesses

### 2. **Flexible Policy**

-   **Cancellation**: 48h window, full refund, no fees
-   **Reschedule**: 48h window, 3 attempts, no fees
-   **Notifications**: All reminders (24h, 2h, 1h)
-   **Best for**: Customer-friendly businesses

### 3. **Strict Policy**

-   **Cancellation**: 12h window, partial refund, ₹50 late fee
-   **Reschedule**: 12h window, 1 attempt, ₹25 fee
-   **Notifications**: 24h and 2h reminders
-   **Best for**: High-demand services

## Database Structure

### **booking_policy_settings** Table

```sql
- id (Primary Key)
- name (Policy name)
- description (Policy description)
- cancellation_window_hours (Hours before appointment for cancellation)
- cancellation_policy (full_refund, partial_refund, no_refund, credit_only)
- late_cancellation_fee (Fee for late cancellations)
- late_cancellation_window_hours (Window for late fees)
- require_cancellation_reason (Boolean)
- auto_cancel_no_show (Boolean)
- no_show_minutes (Minutes to wait before auto-cancelling)
- reschedule_window_hours (Hours before appointment for reschedule)
- max_reschedule_attempts (Maximum reschedule attempts)
- reschedule_fee (Fee for rescheduling)
- reschedule_advance_notice_hours (Minimum notice for reschedule)
- allow_same_day_reschedule (Boolean)
- allow_next_day_reschedule (Boolean)
- send_reminder_24h (Boolean)
- send_reminder_2h (Boolean)
- send_reminder_1h (Boolean)
- notify_admin_on_cancellation (Boolean)
- notify_admin_on_reschedule (Boolean)
- notify_employee_on_cancellation (Boolean)
- notify_employee_on_reschedule (Boolean)
- is_active (Boolean)
- sort_order (Integer)
- created_at, updated_at (Timestamps)
```

### **bookings** Table (Updated)

```sql
- reschedule_attempts (Number of times rescheduled)
- cancellation_reason (Reason for cancellation)
- cancelled_at (When cancelled)
- rescheduled_at (When last rescheduled)
- booking_policy_setting_id (Foreign key to policy)
```

## API Methods

### **Booking Model Methods**

```php
// Check if booking can be cancelled
$booking->canBeCancelled()

// Check if booking can be rescheduled
$booking->canBeRescheduled()

// Cancel a booking
$booking->cancel($reason)

// Reschedule a booking
$booking->reschedule($newDateTime)

// Get cancellation fee
$booking->getCancellationFee()
```

### **BookingPolicySetting Model Methods**

```php
// Check if cancellation is allowed
$policy->canCancelBooking($booking)

// Check if reschedule is allowed
$policy->canRescheduleBooking($booking)

// Get cancellation fee
$policy->getCancellationFee($booking)

// Get notification settings
$policy->notification_settings
```

## Admin Routes

```php
// View all policies
GET /admin/booking-policies

// Create new policy
POST /admin/booking-policies

// Update policy
PUT /admin/booking-policies/{id}

// Delete policy
POST /admin/booking-policies/{id}/delete
```

## Usage Examples

### **Creating a Custom Policy**

1. Go to Admin Panel → Booking Policies
2. Click "Add Policy"
3. Configure settings:
    - **Name**: "Premium Service Policy"
    - **Cancellation**: 48h window, full refund
    - **Reschedule**: 24h window, 1 attempt, ₹100 fee
    - **Notifications**: All reminders enabled
4. Save the policy

### **Applying Policies to Bookings**

Policies can be assigned to bookings during the booking process or retroactively. The system will automatically check policy rules when customers attempt to cancel or reschedule.

### **Customer Experience**

-   Customers see clear cancellation/reschedule policies
-   System enforces time windows and limits
-   Automatic fee calculations
-   Clear communication about restrictions

## Benefits

1. **Flexibility**: Multiple policy types for different business needs
2. **Automation**: Automatic enforcement of rules
3. **Revenue Protection**: Late cancellation fees and reschedule charges
4. **Customer Clarity**: Clear policies reduce confusion
5. **Admin Control**: Full control over booking modifications
6. **Scalability**: Easy to create and modify policies

## Future Enhancements

1. **Service-Specific Policies**: Different policies for different services
2. **Customer Tier Policies**: VIP customers get more flexible policies
3. **Dynamic Pricing**: Fees based on appointment value
4. **Integration**: Connect with payment gateways for automatic refunds
5. **Analytics**: Track cancellation/reschedule patterns
6. **Email Templates**: Customizable notification messages

## Technical Notes

-   All policies are stored in the database for easy modification
-   Policies can be activated/deactivated without deletion
-   System gracefully handles missing policies (defaults to permissive)
-   All time calculations use Laravel's Carbon library
-   Policies are cached for performance
-   Full audit trail of booking modifications

This system provides a robust foundation for managing customer booking modifications while protecting business interests and maintaining clear communication with customers.
