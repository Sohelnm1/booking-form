# Reschedule Payment System Guide

## Overview

The reschedule payment system allows customers to pay a fee when rescheduling their bookings. This system integrates with Razorpay for payment processing and follows a similar flow to the main booking payment system.

## How It Works

### 1. Reschedule Request Flow

When a customer attempts to reschedule a booking:

1. **Policy Check**: The system checks if rescheduling is allowed based on the booking policy
2. **Fee Calculation**: If rescheduling is allowed, the system calculates the reschedule fee from the policy
3. **Payment Decision**:
    - If fee > 0: Redirect to payment flow
    - If fee = 0: Proceed with reschedule directly

### 2. Payment Flow (When Fee > 0)

1. **Session Storage**: Store reschedule data in session
2. **Razorpay Order**: Create a Razorpay order for the reschedule fee
3. **Payment Modal**: Open Razorpay payment modal
4. **Payment Success**: Verify payment and complete reschedule
5. **Payment Failure**: Clear session and show error

### 3. Direct Reschedule (When Fee = 0)

1. **Validation**: Check all reschedule conditions
2. **Reschedule**: Update booking with new appointment time
3. **Notifications**: Send reschedule notifications if enabled

## Backend Implementation

### Routes

```php
// Reschedule booking
POST /customer/bookings/{id}/reschedule

// Payment success callback
POST /customer/reschedule/payment-success

// Payment failure callback
POST /customer/reschedule/payment-failed
```

### Key Methods

#### `rescheduleBooking()`

-   Validates reschedule request
-   Checks policy conditions
-   Routes to payment or direct reschedule

#### `handleRescheduleWithPayment()`

-   Creates session data for reschedule
-   Generates Razorpay order
-   Returns payment data to frontend

#### `performReschedule()`

-   Actually performs the reschedule operation
-   Updates booking record
-   Sends notifications

#### `reschedulePaymentSuccess()`

-   Verifies Razorpay payment
-   Retrieves session data
-   Calls `performReschedule()`
-   Clears session data

## Frontend Implementation

### RescheduleModal Component

The modal now includes:

1. **Fee Display**: Shows reschedule fee in policy information
2. **Warning Alert**: Informs user about payment requirement
3. **Payment Integration**: Handles Razorpay payment flow
4. **Dynamic Button Text**: Changes based on fee requirement

### Key Features

-   **Fee Visibility**: Orange tag shows reschedule fee amount
-   **Payment Warning**: Alert box explains payment requirement
-   **Dynamic Button**: Shows "Reschedule & Pay ₹X" when fee > 0
-   **Payment Flow**: Integrates Razorpay checkout
-   **Error Handling**: Comprehensive error messages

## Configuration

### Booking Policy Settings

The reschedule fee is configured in the booking policy:

```php
// In BookingPolicySetting model
'reschedule_fee' => 'decimal:2', // Fee amount in rupees
```

### Admin Interface

Admins can set the reschedule fee in the Booking Policies page:

-   Navigate to Admin → Booking Policies
-   Set "Reschedule Fee (₹)" field
-   Save the policy

## Session Management

### Session Data Structure

```php
'pending_reschedule' => [
    'booking_id' => $booking->id,
    'new_appointment_time' => $newAppointmentTime->format('Y-m-d H:i:s'),
    'reschedule_fee' => $rescheduleFee,
    'policy_id' => $policy ? $policy->id : null,
    'created_at' => now()->timestamp,
]

'reschedule_order_id' => $orderData['order_id']
```

### Session Expiry

-   Session data expires after 30 minutes (1800 seconds)
-   Prevents stale payment attempts
-   Forces user to restart reschedule process

## Error Handling

### Common Error Scenarios

1. **Payment Gateway Not Configured**

    - Error: "Payment gateway is not configured"
    - Solution: Configure Razorpay in admin settings

2. **Session Expired**

    - Error: "Reschedule session expired. Please try again."
    - Solution: User must restart reschedule process

3. **Payment Verification Failed**

    - Error: "Payment verification failed"
    - Solution: Check Razorpay webhook configuration

4. **Invalid Session Data**
    - Error: "Invalid reschedule session data"
    - Solution: Clear browser cache and try again

## Testing

### Test Scenarios

1. **No Fee Reschedule**

    - Set reschedule_fee = 0
    - Verify direct reschedule without payment

2. **Fee Reschedule**

    - Set reschedule_fee > 0
    - Verify payment flow integration

3. **Payment Cancellation**

    - Start payment flow
    - Cancel payment
    - Verify session cleanup

4. **Session Expiry**
    - Start reschedule process
    - Wait 30+ minutes
    - Verify session expiry handling

## Security Considerations

1. **Payment Verification**: All payments are verified using Razorpay signatures
2. **Session Validation**: Session data is validated before processing
3. **User Authorization**: Only booking owners can reschedule their bookings
4. **Policy Enforcement**: All policy rules are enforced server-side

## Reschedule Tracking & Display

### Database Fields

The system now tracks comprehensive reschedule information:

```sql
-- Existing fields
reschedule_attempts (Number of times rescheduled)
rescheduled_at (When last rescheduled)

-- New payment tracking fields
reschedule_payment_amount (Amount paid for reschedule fee)
reschedule_payment_id (Razorpay payment ID for reschedule fee)
reschedule_payment_date (When reschedule payment was made)
reschedule_payment_status (Status: not_required, pending, paid, failed)
```

### Customer Interface

**Booking Detail Page:**

-   Shows reschedule attempts count
-   Displays last rescheduled date
-   Shows reschedule fee paid (if any)
-   Displays payment ID and payment date
-   Dedicated "Reschedule Information" card

**Bookings List:**

-   Shows reschedule attempts count
-   Displays reschedule fee amount (if paid)
-   Quick overview of reschedule history

### Admin Interface

**Appointments List:**

-   Shows reschedule attempts in status column
-   Quick indicator of rescheduled bookings

**Appointment Details Modal:**

-   Comprehensive reschedule information
-   Payment details including amount, ID, and date
-   Payment status with color-coded badges
-   Full reschedule history

### Payment Status Tracking

-   **not_required**: No reschedule fee was charged
-   **pending**: Payment is in progress
-   **paid**: Payment completed successfully
-   **failed**: Payment failed

## Future Enhancements

1. **Partial Refunds**: Handle partial refunds for reschedule fees
2. **Multiple Payment Methods**: Support additional payment gateways
3. **Fee Waivers**: Allow admins to waive fees for specific cases
4. **Payment History**: Track reschedule payment history
5. **Email Receipts**: Send payment receipts for reschedule fees
6. **Reschedule Analytics**: Dashboard showing reschedule patterns
7. **Automated Notifications**: Notify admins of frequent reschedulers
