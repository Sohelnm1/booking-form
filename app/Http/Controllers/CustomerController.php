<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\BookingPolicySetting;
use App\Models\ScheduleSetting;
use App\Models\ServicePricingTier;
use Carbon\Carbon;
use App\Models\Service; // Added this import

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:customer');
    }

    /**
     * Show customer dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        $bookings = Booking::where('user_id', $user->id)
            ->with(['service', 'pricingTier', 'employee', 'extras.durationRelation', 'bookingPolicySetting'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        // Fetch ALL active services for the carousel (not just HospiPal ones)
        $services = Service::where('is_active', true)
            ->ordered()
            ->get()
            ->map(function($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'icon' => $service->icon ?: $this->getDefaultIcon($service->name),
                    'color' => $service->color ?: $this->getDefaultColor($service->id),
                    'image' => $service->image, // Add the image field
                    'price' => $service->price,
                    'duration' => $service->duration,
                    'is_upcoming' => $service->is_upcoming,
                    'has_flexible_duration' => $service->has_flexible_duration,
                    'has_tba_pricing' => $service->has_tba_pricing,
                ];
            });

        // Fetch active extras for the extras section
        $extras = \App\Models\Extra::where('is_active', true)
            ->ordered()
            ->get()
            ->map(function($extra) {
                return [
                    'id' => $extra->id,
                    'name' => $extra->name,
                    'description' => $extra->description,
                    'price' => $extra->price,
                    'image' => $extra->image,
                    'duration' => $extra->duration,
                    'max_quantity' => $extra->max_quantity,
                ];
            });

        // Debug: Log the services and extras being fetched
        \Log::info('Data fetched for dashboard:', [
            'total_services' => $services->count(),
            'total_extras' => $extras->count(),
            'services' => $services->toArray(),
            'extras' => $extras->toArray()
        ]);

        return Inertia::render('Customer/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'bookings' => $bookings,
            'services' => $services,
            'extras' => $extras,
        ]);
    }

    /**
     * Show customer bookings
     */
    public function bookings()
    {
        $user = Auth::user();
        
        $bookings = Booking::where('user_id', $user->id)
            ->with(['service', 'pricingTier', 'employee', 'extras.durationRelation', 'bookingPolicySetting'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return Inertia::render('Customer/Bookings', [
            'auth' => [
                'user' => $user,
            ],
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show specific booking details
     */
    public function showBooking($id)
    {
        $user = Auth::user();
        
        $booking = Booking::where('user_id', $user->id)
            ->where('id', $id)
            ->with(['service', 'pricingTier', 'employee', 'extras.durationRelation', 'bookingPolicySetting', 'formResponses.formField', 'invoice'])
            ->firstOrFail();
        
        // Force load the pricing tier relationship if not already loaded
        if (!$booking->relationLoaded('pricingTier')) {
            $booking->load('pricingTier');
        }

        // Get schedule settings for the booking
        $scheduleSettings = ScheduleSetting::active()->ordered()->get();
        
        // Add schedule settings to the booking object
        $booking->schedule_settings = $scheduleSettings;

        // Ensure pricing tier data is explicitly included
        $bookingData = $booking->toArray();
        if ($booking->pricingTier) {
            $bookingData['pricingTier'] = [
                'id' => $booking->pricingTier->id,
                'name' => $booking->pricingTier->name,
                'price' => $booking->pricingTier->price,
                'duration_minutes' => $booking->pricingTier->duration_minutes,
            ];
        }

        return Inertia::render('Customer/BookingDetail', [
            'auth' => [
                'user' => $user,
            ],
            'booking' => $bookingData,
        ]);
    }

    /**
     * Handle customer cancellation request
     */
    public function cancelBooking(Request $request, $id)
    {
        $user = Auth::user();
        
        // Find the booking and ensure it belongs to the customer
        $booking = Booking::where('user_id', $user->id)
            ->where('id', $id)
            ->with('bookingPolicySetting')
            ->firstOrFail();

        // Get the applicable policy
        $policy = $booking->bookingPolicySetting;
        if (!$policy) {
            $policy = BookingPolicySetting::active()->first();
        }

        // Check if cancellation is allowed
        if (!$booking->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Cancellation is not allowed at this time.',
                'details' => [
                    'cancellation_window_hours' => $policy ? $policy->cancellation_window_hours : 24,
                    'hours_until_appointment' => now()->diffInHours($booking->appointment_time, false),
                ]
            ], 400);
        }

        // Check if reason is required
        if ($policy && $policy->require_cancellation_reason && !$request->reason) {
            return response()->json([
                'success' => false,
                'message' => 'Cancellation reason is required.',
            ], 400);
        }

        // Calculate cancellation fee
        $cancellationFee = $booking->getCancellationFee();

        // Perform the cancellation
        $success = $booking->cancel($request->reason);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking.',
            ], 500);
        }

        // Send notifications if enabled
        if ($policy) {
            $this->sendCancellationNotifications($booking, $policy);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully.',
            'data' => [
                'booking_id' => $booking->id,
                'cancellation_fee' => $cancellationFee,
                'refund_amount' => $this->calculateRefundAmount($booking, $policy),
                'policy_applied' => $policy ? $policy->name : 'Default Policy',
            ]
        ]);
    }

    /**
     * Handle customer reschedule request
     */
    public function rescheduleBooking(Request $request, $id)
    {
        $user = Auth::user();
        
        // Validate request
        $request->validate([
            'new_appointment_time' => 'required|date|after:now',
        ]);

        // Find the booking and ensure it belongs to the customer
        $booking = Booking::where('user_id', $user->id)
            ->where('id', $id)
            ->with('bookingPolicySetting')
            ->firstOrFail();

        // Get the applicable policy
        $policy = $booking->bookingPolicySetting;
        if (!$policy) {
            $policy = BookingPolicySetting::active()->first();
        }

        // Check if reschedule is allowed
        if (!$booking->canBeRescheduled()) {
            return response()->json([
                'success' => false,
                'message' => 'Rescheduling is not allowed for this booking.',
                'reason' => 'The booking cannot be rescheduled based on the current policy.',
            ], 400);
        }

        // Check reschedule attempt limits
        if ($policy && $booking->reschedule_attempts >= $policy->max_reschedule_attempts) {
            return response()->json([
                'success' => false,
                'message' => 'Maximum reschedule attempts reached.',
                'reason' => "You have already rescheduled {$booking->reschedule_attempts} time(s). The maximum allowed is {$policy->max_reschedule_attempts}.",
                'details' => [
                    'current_attempts' => $booking->reschedule_attempts,
                    'max_attempts' => $policy->max_reschedule_attempts,
                ]
            ], 400);
        }

        // Check advance notice requirement
        $newAppointmentTime = Carbon::parse($request->new_appointment_time);
        $hoursUntilNewAppointment = now()->diffInHours($newAppointmentTime, false);
        
        if ($policy && $hoursUntilNewAppointment < $policy->reschedule_advance_notice_hours) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient advance notice for rescheduling.',
                'reason' => "You selected a time that is only {$hoursUntilNewAppointment} hours away. Rescheduling requires at least {$policy->reschedule_advance_notice_hours} hours advance notice.",
                'details' => [
                    'required_hours' => $policy->reschedule_advance_notice_hours,
                    'provided_hours' => $hoursUntilNewAppointment,
                ]
            ], 400);
        }

        // Check same day/next day restrictions
        if ($policy) {
            $sameDay = $newAppointmentTime->isSameDay($booking->appointment_time);
            $nextDay = $newAppointmentTime->isSameDay($booking->appointment_time->addDay());
            
            if ($sameDay && !$policy->allow_same_day_reschedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Same day rescheduling is not allowed.',
                ], 400);
            }
            
            if ($nextDay && !$policy->allow_next_day_reschedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Next day rescheduling is not allowed.',
                ], 400);
            }
        }

        // Check if user is trying to reschedule to the same time slot
        if ($newAppointmentTime->format('Y-m-d H:i:s') === $booking->appointment_time->format('Y-m-d H:i:s')) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot reschedule to the same time slot.',
            ], 400);
        }

        // Check if new time slot is available with proper employee availability
        $availableEmployees = \App\Models\User::getAvailableEmployeesForSlot(
            $booking->service_id,
            $newAppointmentTime->format('Y-m-d'),
            $newAppointmentTime->format('H:i'),
            $booking->duration,
            $booking->id, // Exclude current booking
            $booking->gender_preference // Use original booking's gender preference
        );
        
        if ($availableEmployees->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Selected time slot is not available.',
                'reason' => 'No employees are available for this time slot.',
            ], 400);
        }

        // Calculate reschedule fee
        $rescheduleFee = $policy ? $policy->reschedule_fee : 0;

        // If there's a reschedule fee, create payment flow
        if ($rescheduleFee > 0) {
            return $this->handleRescheduleWithPayment($booking, $newAppointmentTime, $rescheduleFee, $policy);
        }

        // No fee, proceed with reschedule directly
        return $this->performReschedule($booking, $newAppointmentTime, $policy);
    }

    /**
     * Handle reschedule with payment requirement
     */
    private function handleRescheduleWithPayment($booking, $newAppointmentTime, $rescheduleFee, $policy)
    {
        try {
            // Create a temporary reschedule record in session
            $rescheduleData = [
                'booking_id' => $booking->id,
                'new_appointment_time' => $newAppointmentTime->format('Y-m-d H:i:s'),
                'reschedule_fee' => $rescheduleFee,
                'policy_id' => $policy ? $policy->id : null,
                'created_at' => now()->timestamp,
            ];

            session(['pending_reschedule' => $rescheduleData]);

            // Create Razorpay order for reschedule fee
            $razorpayService = new \App\Services\RazorpayService();
            
            if (!$razorpayService->isConfigured()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment gateway is not configured.',
                ], 500);
            }

            // Create a temporary booking object for Razorpay order
            $tempBooking = new Booking([
                'id' => 'reschedule_' . $booking->id,
                'total_amount' => $rescheduleFee,
                'user_id' => $booking->user_id,
            ]);

            // Load the customer relationship for the temporary booking
            $tempBooking->setRelation('customer', $booking->customer);
            $tempBooking->setRelation('service', $booking->service);

            $orderData = $razorpayService->createOrder($tempBooking);

            // Store order ID in session
            session(['reschedule_order_id' => $orderData['order_id']]);

            // Update booking with pending payment status
            $booking->update([
                'reschedule_payment_status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'requires_payment' => true,
                'message' => 'Reschedule fee payment required.',
                'data' => [
                    'reschedule_fee' => $rescheduleFee,
                    'order_id' => $orderData['order_id'],
                    'key_id' => $orderData['key_id'],
                    'amount' => $orderData['amount'],
                    'currency' => $orderData['currency'],
                    'new_appointment_time' => $newAppointmentTime->format('Y-m-d H:i:s'),
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Reschedule payment setup failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to setup reschedule payment.',
            ], 500);
        }
    }

    /**
     * Perform the actual reschedule operation
     */
    private function performReschedule($booking, $newAppointmentTime, $policy)
    {
        // Get available employees for the new time slot
        $availableEmployees = \App\Models\User::getAvailableEmployeesForSlot(
            $booking->service_id,
            $newAppointmentTime->format('Y-m-d'),
            $newAppointmentTime->format('H:i'),
            $booking->duration,
            $booking->id, // Exclude current booking
            $booking->gender_preference // Use original booking's gender preference
        );
        
        if ($availableEmployees->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'No employees are available for the selected time slot.',
            ], 400);
        }
        
        // Assign the first available employee
        $newEmployee = $availableEmployees->first();
        
        // Perform the reschedule with new employee
        $success = $booking->reschedule($newAppointmentTime);
        
        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reschedule booking.',
            ], 500);
        }
        
        // Update the employee assignment
        $booking->update([
            'employee_id' => $newEmployee->id,
            'reschedule_payment_status' => 'not_required',
        ]);
        
        \Log::info('Booking rescheduled with new employee', [
            'booking_id' => $booking->id,
            'old_employee_id' => $booking->employee_id,
            'new_employee_id' => $newEmployee->id,
            'new_employee_name' => $newEmployee->name,
            'new_appointment_time' => $newAppointmentTime->format('Y-m-d H:i:s'),
            'gender_preference' => $booking->gender_preference
        ]);

        // Send notifications if enabled
        if ($policy) {
            $this->sendRescheduleNotifications($booking, $policy);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking rescheduled successfully.',
            'data' => [
                'booking_id' => $booking->id,
                'new_appointment_time' => $newAppointmentTime->format('Y-m-d H:i:s'),
                'new_employee_id' => $newEmployee->id,
                'new_employee_name' => $newEmployee->name,
                'reschedule_fee' => 0,
                'reschedule_attempts' => $booking->reschedule_attempts,
                'policy_applied' => $policy ? $policy->name : 'Default Policy',
            ]
        ]);
    }

    /**
     * Handle reschedule payment success
     */
    public function reschedulePaymentSuccess(Request $request)
    {
        try {
            // Verify payment
            $razorpayService = new \App\Services\RazorpayService();
            
            if (!$razorpayService->verifyPayment(
                $request->razorpay_payment_id,
                $request->razorpay_order_id,
                $request->razorpay_signature
            )) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed.',
                ], 400);
            }

            // Get reschedule data from session
            $rescheduleData = session('pending_reschedule');
            $orderId = session('reschedule_order_id');

            if (!$rescheduleData || !$orderId || $orderId !== $request->razorpay_order_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reschedule session data.',
                ], 400);
            }

            // Check if session data is not expired (30 minutes)
            if (now()->timestamp - $rescheduleData['created_at'] > 1800) {
                session()->forget(['pending_reschedule', 'reschedule_order_id']);
                return response()->json([
                    'success' => false,
                    'message' => 'Reschedule session expired. Please try again.',
                ], 400);
            }

            // Find the booking
            $booking = Booking::where('user_id', Auth::id())
                ->where('id', $rescheduleData['booking_id'])
                ->with('bookingPolicySetting')
                ->firstOrFail();

            // Get the policy
            $policy = $booking->bookingPolicySetting;
            if (!$policy && $rescheduleData['policy_id']) {
                $policy = BookingPolicySetting::find($rescheduleData['policy_id']);
            }

            // Perform the reschedule
            $newAppointmentTime = Carbon::parse($rescheduleData['new_appointment_time']);
            $result = $this->performReschedule($booking, $newAppointmentTime, $policy);

            // Clear session data
            session()->forget(['pending_reschedule', 'reschedule_order_id']);

            // Add payment information to response
            if ($result->getStatusCode() === 200) {
                $responseData = json_decode($result->getContent(), true);
                $responseData['data']['payment_id'] = $request->razorpay_payment_id;
                $responseData['data']['payment_amount'] = $rescheduleData['reschedule_fee'];
                
                // Update booking with reschedule payment information
                $booking->update([
                    'reschedule_payment_amount' => $rescheduleData['reschedule_fee'],
                    'reschedule_payment_id' => $request->razorpay_payment_id,
                    'reschedule_payment_date' => now(),
                    'reschedule_payment_status' => 'paid',
                ]);

                // Create or update invoice for reschedule payment
                $booking->createOrUpdateInvoice();
                
                return response()->json($responseData);
            }

            return $result;

        } catch (\Exception $e) {
            \Log::error('Reschedule payment success failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process reschedule payment.',
            ], 500);
        }
    }

    /**
     * Handle reschedule payment failure
     */
    public function reschedulePaymentFailed(Request $request)
    {
        // Clear session data
        session()->forget(['pending_reschedule', 'reschedule_order_id']);
        
        return response()->json([
            'success' => false,
            'message' => 'Reschedule payment failed. Your booking was not rescheduled.',
        ], 400);
    }

    /**
     * Get booking policy information for a specific booking
     */
    public function getBookingPolicy($id)
    {
        $user = Auth::user();
        
        $booking = Booking::where('user_id', $user->id)
            ->where('id', $id)
            ->with('bookingPolicySetting')
            ->firstOrFail();

        $policy = $booking->bookingPolicySetting;
        if (!$policy) {
            $policy = BookingPolicySetting::active()->first();
        }

        if (!$policy) {
            return response()->json([
                'success' => false,
                'message' => 'No booking policy found.',
            ], 404);
        }

        $hoursUntilAppointment = now()->diffInHours($booking->appointment_time, false);

        // Debug logging
        \Log::info('Booking Policy Debug', [
            'booking_id' => $booking->id,
            'booking_policy_setting_id' => $booking->booking_policy_setting_id,
            'policy_id' => $policy->id,
            'policy_name' => $policy->name,
            'reschedule_window_hours' => $policy->reschedule_window_hours,
            'max_reschedule_attempts' => $policy->max_reschedule_attempts,
            'reschedule_advance_notice_hours' => $policy->reschedule_advance_notice_hours,
            'hours_until_appointment' => $hoursUntilAppointment,
            'reschedule_attempts' => $booking->reschedule_attempts,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'policy' => [
                    'name' => $policy->name,
                    'description' => $policy->description,
                    'cancellation' => [
                        'allowed' => $booking->canBeCancelled(),
                        'window_hours' => $policy->cancellation_window_hours,
                        'policy' => $policy->cancellation_policy_text,
                        'late_fee' => $policy->late_cancellation_fee,
                        'late_fee_window' => $policy->late_cancellation_window_hours,
                        'require_reason' => $policy->require_cancellation_reason,
                        'hours_until_appointment' => $hoursUntilAppointment,
                    ],
                    'reschedule' => [
                        'allowed' => $booking->canBeRescheduled(),
                        'window_hours' => $policy->reschedule_window_hours,
                        'max_attempts' => $policy->max_reschedule_attempts,
                        'current_attempts' => $booking->reschedule_attempts,
                        'fee' => $policy->reschedule_fee,
                        'advance_notice_hours' => $policy->reschedule_advance_notice_hours,
                        'allow_same_day' => $policy->allow_same_day_reschedule,
                        'allow_next_day' => $policy->allow_next_day_reschedule,
                        'hours_until_appointment' => $hoursUntilAppointment,
                    ],
                ],
                'booking' => [
                    'id' => $booking->id,
                    'appointment_time' => $booking->appointment_time->format('Y-m-d H:i:s'),
                    'status' => $booking->status,
                    'reschedule_attempts' => $booking->reschedule_attempts,
                ]
            ]
        ]);
    }

    /**
     * Send cancellation notifications
     */
    private function sendCancellationNotifications($booking, $policy)
    {
        // TODO: Implement actual notification sending
        // This would integrate with your notification system (email, SMS, etc.)
        
        if ($policy->notify_admin_on_cancellation) {
            // Send notification to admin
            // Mail::to(admin_email)->send(new BookingCancelledMail($booking));
        }
        
        if ($policy->notify_employee_on_cancellation && $booking->employee) {
            // Send notification to assigned employee
            // Mail::to($booking->employee->email)->send(new BookingCancelledMail($booking));
        }
    }

    /**
     * Send reschedule notifications
     */
    private function sendRescheduleNotifications($booking, $policy)
    {
        // TODO: Implement actual notification sending
        
        if ($policy->notify_admin_on_reschedule) {
            // Send notification to admin
            // Mail::to(admin_email)->send(new BookingRescheduledMail($booking));
        }
        
        if ($policy->notify_employee_on_reschedule && $booking->employee) {
            // Send notification to assigned employee
            // Mail::to($booking->employee->email)->send(new BookingRescheduledMail($booking));
        }
    }

    /**
     * Calculate refund amount based on policy
     */
    private function calculateRefundAmount($booking, $policy)
    {
        if (!$policy) {
            return $booking->total_amount; // Full refund by default
        }

        switch ($policy->cancellation_policy) {
            case 'full_refund':
                return $booking->total_amount;
            
            case 'partial_refund':
                // You can customize the partial refund percentage
                return $booking->total_amount * 0.5; // 50% refund
            
            case 'credit_only':
                return 0; // No refund, credit only
            
            case 'no_refund':
                return 0;
            
            default:
                return $booking->total_amount;
        }
    }

    /**
     * Get default icon based on service name
     */
    private function getDefaultIcon($serviceName)
    {
        $iconMap = [
            'OPD' => '🧑‍⚕',
            'Elderly' => '👵',
            'Emergency' => '⚡',
            'Discharge' => '📋',
            'Admission' => '🛏',
            'Overnight' => '🌙',
            'Errands' => '📑',
            'Recovery' => '💡',
        ];

        foreach ($iconMap as $keyword => $icon) {
            if (stripos($serviceName, $keyword) !== false) {
                return $icon;
            }
        }

        return '🏥'; // Default icon
    }

    /**
     * Get default color based on service ID
     */
    private function getDefaultColor($serviceId)
    {
        $colors = [
            '#1890ff', // Blue
            '#52c41a', // Green
            '#faad14', // Orange
            '#722ed1', // Purple
            '#13c2c2', // Cyan
            '#eb2f96', // Pink
            '#fa8c16', // Orange
            '#a0d911', // Lime
        ];

        return $colors[($serviceId - 1) % count($colors)];
    }
} 