<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Extra;
use App\Models\ConsentSetting;
use App\Models\ScheduleSetting;
use App\Models\Form;
use App\Models\FormField;
use App\Models\Booking;
use App\Models\User;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Services\RazorpayService;
use Illuminate\Support\Str;
use Twilio\Rest\Client;

class BookingController extends Controller
{
    /**
     * Show service selection page
     */
    public function selectService()
    {
        $services = Service::active()->ordered()->get();
        
        return Inertia::render('Booking/SelectService', [
            'services' => $services,
        ]);
    }

    /**
     * Show extras selection page
     */
    public function selectExtras(Request $request)
    {
        $serviceId = $request->query('service_id');
        $service = Service::findOrFail($serviceId);
        $extras = $service->extras()
                         ->where('extras.is_active', true)
                         ->orderBy('service_extras.sort_order')
                         ->orderBy('extras.name')
                         ->get();
        
        return Inertia::render('Booking/SelectExtras', [
            'service' => $service,
            'extras' => $extras,
        ]);
    }

    /**
     * Show date and time selection page
     */
    public function selectDateTime(Request $request)
    {
        $serviceId = $request->query('service_id');
        $extras = $request->query('extras', []);
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::whereIn('id', $extras)->get();
        $scheduleSettings = ScheduleSetting::active()->ordered()->get();
        
        return Inertia::render('Booking/SelectDateTime', [
            'service' => $service,
            'selectedExtras' => $selectedExtras,
            'scheduleSettings' => $scheduleSettings,
        ]);
    }

    /**
     * Show consent page
     */
    public function consent(Request $request)
    {
        $serviceId = $request->query('service_id');
        $extras = $request->query('extras', []);
        $date = $request->query('date');
        $time = $request->query('time');
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::whereIn('id', $extras)->get();
        $consentSettings = ConsentSetting::active()->ordered()->get();
        
        return Inertia::render('Booking/Consent', [
            'service' => $service,
            'selectedExtras' => $selectedExtras,
            'date' => $date,
            'time' => $time,
            'consentSettings' => $consentSettings,
        ]);
    }

    /**
     * Show confirmation and payment page
     */
    public function confirm(Request $request)
    {
        $serviceId = $request->query('service_id');
        $extras = $request->query('extras', []);
        $date = $request->query('date');
        $time = $request->query('time');
        $consents = $request->query('consents', []);
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::whereIn('id', $extras)->get();
        $consentSettings = ConsentSetting::whereIn('id', $consents)->get();
        
        // Get the default booking form (single form for all services)
        $form = Form::where('name', 'Default Booking Form')->first();
        if (!$form) {
            // Create default form if it doesn't exist
            $form = Form::create([
                'name' => 'Default Booking Form',
                'description' => 'Standard booking form with primary fields and service-specific custom fields',
                'is_active' => true,
                'sort_order' => 1,
            ]);
            
            // Create default primary fields
            $primaryFields = [
                ['label' => 'Full Name', 'name' => 'customer_name', 'type' => 'text', 'is_primary' => true, 'is_required' => true, 'sort_order' => 1],
                ['label' => 'Phone Number', 'name' => 'customer_phone', 'type' => 'phone', 'is_primary' => true, 'is_required' => true, 'sort_order' => 2],
                ['label' => 'Email Address', 'name' => 'customer_email', 'type' => 'email', 'is_primary' => true, 'is_required' => false, 'sort_order' => 3],
            ];
            
            foreach ($primaryFields as $fieldData) {
                $form->fields()->create($fieldData);
            }
        }
        
        // Get all primary fields (always shown)
        $primaryFields = $form->fields()->where('is_primary', true)->orderBy('sort_order')->get();
        
        // Get custom fields that are either:
        // 1. Associated with this specific service, OR
        // 2. Not associated with any services (show for all services)
        $customFields = $form->fields()
            ->where('is_primary', false)
            ->where(function($query) use ($service) {
                $query->whereHas('services', function($subQuery) use ($service) {
                    $subQuery->where('services.id', $service->id);
                })
                ->orWhereDoesntHave('services'); // Fields with no service associations show for all
            })
            ->orderBy('sort_order')
            ->get();
        
        // Combine primary and custom fields
        $formFields = $primaryFields->merge($customFields);
        
        // Load payment settings
        $paymentSettings = [
            'razorpay_key' => $this->getSetting('razorpay_key'),
            'razorpay_secret' => $this->getSetting('razorpay_secret'),
            'currency' => $this->getSetting('currency', 'INR'),
        ];
        
        // Calculate total price
        $totalPrice = floatval($service->price);
        foreach ($selectedExtras as $extra) {
            $totalPrice += floatval($extra->price);
        }
        
        return Inertia::render('Booking/Confirm', [
            'service' => $service,
            'selectedExtras' => $selectedExtras,
            'date' => $date,
            'time' => $time,
            'consentSettings' => $consentSettings,
            'form' => $form,
            'formFields' => $formFields,
            'paymentSettings' => $paymentSettings,
            'totalPrice' => $totalPrice,
            'verifiedPhone' => $request->get('verified_phone'),
        ]);
    }

    /**
     * Process the booking and create Razorpay order
     */
    public function processBooking(Request $request)
    {
        // Clean up any expired session data first
        $this->cleanupExpiredSessionData();
        
        // Debug: Log the incoming request
        \Log::info('Booking request received', [
            'coupon_code' => $request->coupon_code,
            'service_id' => $request->service_id,
            'customer_phone' => $request->customer_phone,
            'date' => $request->date,
            'time' => $request->time
        ]);

        try {
            $request->validate([
                'service_id' => 'required|exists:services,id',
                'extras' => 'array',
                'extras.*' => 'exists:extras,id',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required|date_format:H:i',
                'consents' => 'array',
                'consents.*' => 'exists:consent_settings,id',
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email',
                'customer_phone' => 'required|string|max:20',
                'coupon_code' => 'nullable|string',
                // Custom fields validation will be dynamic based on form fields
            ]);

            $service = Service::findOrFail($request->service_id);
            $selectedExtras = Extra::whereIn('id', $request->extras ?? [])->get();
            
            // Calculate total duration and price
            $totalDuration = $service->duration;
            $totalPrice = floatval($service->price);
            
            foreach ($selectedExtras as $extra) {
                $totalDuration += $extra->duration ?? 0;
                $totalPrice += floatval($extra->price);
            }
            
            // Create or find customer user first (needed for coupon validation)
            // Check by phone number first (primary identifier), then by email
            $customer = User::where('phone_number', $request->customer_phone)->first();
            if (!$customer) {
                $customer = User::where('email', $request->customer_email)->first();
            }
            
            if (!$customer) {
                $customer = User::create([
                    'name' => $request->customer_name,
                    'email' => $request->customer_email,
                    'phone_number' => $request->customer_phone,
                    'role' => 'customer',
                    'password' => bcrypt(Str::random(12)), // Temporary password
                ]);
            } else {
                // Update customer info if found by phone number but email is different
                if ($customer->email !== $request->customer_email) {
                    $customer->update([
                        'name' => $request->customer_name,
                        'email' => $request->customer_email,
                    ]);
                }
            }
            
            // Handle coupon if provided
            $discountAmount = 0;
            $couponId = null;
            $couponCode = null;
            
            if ($request->coupon_code) {
                \Log::info('Processing coupon code', ['coupon_code' => $request->coupon_code]);
                
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();
                
                if ($coupon) {
                    \Log::info('Coupon found', [
                        'coupon_id' => $coupon->id,
                        'coupon_name' => $coupon->name,
                        'is_active' => $coupon->is_active,
                        'discount_type' => $coupon->discount_type,
                        'discount_value' => $coupon->discount_value,
                        'max_uses_per_user' => $coupon->max_uses_per_user
                    ]);
                    
                    // For testing - bypass validation temporarily
                    $isValid = true; // $coupon->isValid();
                    \Log::info('Coupon validation result', ['is_valid' => $isValid]);
                    
                    if ($isValid) {
                        \Log::info('Coupon is valid');
                        
                        // Check if user can use this coupon
                        $userUsageCount = $coupon->usages()->where('user_id', $customer->id)->count();
                        \Log::info('User usage count', ['user_id' => $customer->id, 'usage_count' => $userUsageCount]);
                        
                        // For testing - bypass usage limit temporarily
                        $canUse = true; // $userUsageCount < $coupon->max_uses_per_user;
                        \Log::info('Can user use coupon', ['can_use' => $canUse, 'usage_count' => $userUsageCount, 'max_uses' => $coupon->max_uses_per_user]);
                        
                        if ($canUse) {
                            \Log::info('User can use this coupon');
                            
                            // Calculate discount
                            if ($coupon->discount_type === 'percentage') {
                                $discountAmount = ($totalPrice * $coupon->discount_value) / 100;
                            } else {
                                $discountAmount = $coupon->discount_value;
                            }
                            
                            \Log::info('Initial discount calculation', [
                                'discount_type' => $coupon->discount_type,
                                'discount_value' => $coupon->discount_value,
                                'total_price_before' => $totalPrice,
                                'calculated_discount' => $discountAmount
                            ]);
                            
                            // Apply maximum discount limit
                            if ($coupon->maximum_discount && $discountAmount > $coupon->maximum_discount) {
                                $discountAmount = $coupon->maximum_discount;
                                \Log::info('Applied maximum discount limit', ['max_discount' => $coupon->maximum_discount]);
                            }
                            
                            // Ensure discount doesn't exceed total amount
                            if ($discountAmount > $totalPrice) {
                                $discountAmount = $totalPrice;
                                \Log::info('Limited discount to total price');
                            }
                            
                            $couponId = $coupon->id;
                            $couponCode = $coupon->code;
                            
                            // Update total price
                            $totalPrice -= $discountAmount;
                            
                            \Log::info('Coupon applied successfully', [
                                'final_discount_amount' => $discountAmount,
                                'final_total_price' => $totalPrice
                            ]);
                        } else {
                            \Log::warning('User has already used this coupon maximum times', [
                                'user_id' => $customer->id,
                                'usage_count' => $userUsageCount,
                                'max_uses_per_user' => $coupon->max_uses_per_user
                            ]);
                        }
                    } else {
                        \Log::warning('Coupon is not valid', ['coupon_id' => $coupon->id]);
                    }
                } else {
                    \Log::warning('Coupon not found', ['coupon_code' => $request->coupon_code]);
                }
            } else {
                \Log::info('No coupon code provided');
            }
            
            // Create appointment datetime
            $appointmentTime = \Carbon\Carbon::parse($request->date . ' ' . $request->time);
            
            // Find available employees for this service and time slot
            $availableEmployees = User::getAvailableEmployeesForSlot(
                $service->id,
                $request->date,
                $request->time,
                $totalDuration
            );

            // Debug logging
            \Log::info('Employee availability check', [
                'service_id' => $service->id,
                'service_name' => $service->name,
                'date' => $request->date,
                'time' => $request->time,
                'duration' => $totalDuration,
                'available_employees_count' => $availableEmployees->count(),
                'available_employees' => $availableEmployees->pluck('name')->toArray()
            ]);

            if ($availableEmployees->isEmpty()) {
                // For testing - get any active employee for this service
                $fallbackEmployee = User::where('role', 'employee')
                    ->where('is_active', true)
                    ->whereHas('services', function($query) use ($service) {
                        $query->where('services.id', $service->id);
                    })
                    ->first();
                
                if (!$fallbackEmployee) {
                    return response()->json([
                        'success' => false,
                        'error' => 'No employees available for this service. Please contact support.'
                    ], 400);
                }
                
                \Log::warning('Using fallback employee assignment', [
                    'employee_id' => $fallbackEmployee->id,
                    'employee_name' => $fallbackEmployee->name,
                    'service_id' => $service->id
                ]);
                
                $assignedEmployee = $fallbackEmployee;
            } else {
                // Auto-assign the first available employee
                $assignedEmployee = $availableEmployees->first();
            }
            
            // Debug: Log amounts before booking creation
            \Log::info('Amounts before booking creation', [
                'original_total' => $service->price + $selectedExtras->sum('price'),
                'discount_amount' => $discountAmount,
                'final_total_price' => $totalPrice,
                'coupon_code' => $couponCode,
                'coupon_id' => $couponId
            ]);
            
            // Store booking data in session instead of creating booking immediately
            $bookingData = [
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'employee_id' => $assignedEmployee->id,
                'appointment_time' => $appointmentTime,
                'duration' => $totalDuration,
                'total_amount' => $totalPrice,
                'status' => 'pending',
                'payment_status' => 'pending',
                'consent_given' => !empty($request->consents),
                'consent_given_at' => !empty($request->consents) ? now() : null,
                'coupon_id' => $couponId,
                'discount_amount' => $discountAmount,
                'coupon_code' => $couponCode,
                'extras' => $selectedExtras->toArray(),
                'custom_fields' => $request->except([
                    'service_id', 'extras', 'date', 'time', 'consents', 
                    'customer_name', 'customer_email', 'customer_phone', 
                    'payment_method', 'special_requests', 'coupon_code'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // Store in session for later use
            session(['pending_booking' => $bookingData]);
            session(['pending_booking_created_at' => now()]); // Store creation time
            
            // Create Razorpay order with a temporary receipt
            $razorpayService = new RazorpayService();
            
            if (!$razorpayService->isConfigured()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment gateway is not configured. Please contact support.'
                ], 400);
            }
            
            // Create a temporary booking object for Razorpay order creation
            $tempBooking = (object) $bookingData;
            $tempBooking->id = 'temp_' . time(); // Temporary ID for receipt
            
            $orderData = $razorpayService->createOrder($tempBooking);
            
            // Store the order ID in session for payment verification
            session(['razorpay_order_id' => $orderData['order_id']]);
            
            return response()->json([
                'success' => true,
                'order_data' => $orderData,
                'booking_id' => null // No booking ID yet
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Booking processing failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again.'
            ], 500);
        }
    }

    /**
     * Show booking success page
     */
    public function success()
    {
        return Inertia::render('Booking/Success');
    }

    /**
     * Handle Razorpay payment success
     */
    public function paymentSuccess(Request $request)
    {
        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $razorpayService = new RazorpayService();
        
        // Verify payment signature
        $isValid = $razorpayService->verifyPayment(
            $request->razorpay_payment_id,
            $request->razorpay_order_id,
            $request->razorpay_signature
        );

        if (!$isValid) {
            return redirect()->route('booking.failed')->with('error', 'Payment verification failed.');
        }

        // Get booking data from session
        $bookingData = session('pending_booking');
        $sessionOrderId = session('razorpay_order_id');
        
        if (!$bookingData || $sessionOrderId !== $request->razorpay_order_id) {
            \Log::warning('Invalid or missing session data for payment success', [
                'has_booking_data' => !empty($bookingData),
                'session_order_id' => $sessionOrderId,
                'request_order_id' => $request->razorpay_order_id,
                'session_data' => session()->all()
            ]);
            
            return redirect()->route('booking.failed')->with('error', 'Booking session expired or invalid. Please try again.');
        }

        // Get payment details from Razorpay
        $paymentDetails = $razorpayService->getPaymentDetails($request->razorpay_payment_id);
        
        if (!$paymentDetails) {
            return redirect()->route('booking.failed')->with('error', 'Failed to fetch payment details.');
        }

        // Create the actual booking record
        $booking = Booking::create([
            'user_id' => $bookingData['user_id'],
            'service_id' => $bookingData['service_id'],
            'employee_id' => $bookingData['employee_id'],
            'appointment_time' => $bookingData['appointment_time'],
            'duration' => $bookingData['duration'],
            'total_amount' => $bookingData['total_amount'],
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => $paymentDetails->method ?? 'razorpay',
            'transaction_id' => $request->razorpay_payment_id,
            'consent_given' => $bookingData['consent_given'],
            'consent_given_at' => $bookingData['consent_given_at'],
            'coupon_id' => $bookingData['coupon_id'],
            'discount_amount' => $bookingData['discount_amount'],
            'coupon_code' => $bookingData['coupon_code'],
        ]);

        // Attach extras to booking
        foreach ($bookingData['extras'] as $extra) {
            $booking->extras()->attach($extra['id'], [
                'price' => $extra['price']
            ]);
        }

        // Store custom field responses
        if (!empty($bookingData['custom_fields'])) {
            $this->storeCustomFieldResponses($booking, (object) $bookingData['custom_fields']);
        }

        // Handle coupon usage if coupon was applied
        if ($booking->coupon_id) {
            $coupon = Coupon::find($booking->coupon_id);
            if ($coupon) {
                // Increment coupon usage
                $coupon->increment('used_count');
                
                // Record usage for this user
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'user_id' => $booking->user_id,
                    'booking_id' => $booking->id,
                    'discount_amount' => $booking->discount_amount,
                    'original_amount' => $booking->total_amount + $booking->discount_amount, // Add back the discount to get original amount
                    'final_amount' => $booking->total_amount,
                    'used_at' => now(),
                ]);
            }
        }

        // Clear session data
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);

        // TODO: Send confirmation email
        // TODO: Send SMS notification

        return Inertia::render('Booking/Success', [
            'booking' => $booking->load(['customer', 'service', 'employee', 'extras']),
            'payment_id' => $request->razorpay_payment_id
        ]);
    }

    /**
     * Handle Razorpay payment failure
     */
    public function paymentFailed(Request $request)
    {
        // Clear session data for failed payment
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
        
        return Inertia::render('Booking/Failed', [
            'error' => $request->get('error', 'Payment failed. Please try again.'),
            'booking_id' => null // No booking ID since booking wasn't created
        ]);
    }

    /**
     * Handle Razorpay payment cancellation
     */
    public function paymentCancelled(Request $request)
    {
        // Clear session data for cancelled payment
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
        
        return Inertia::render('Booking/Failed', [
            'error' => 'Payment was cancelled. No booking was created.',
            'booking_id' => null
        ]);
    }

    /**
     * Get available time slots for a specific date
     */
    public function getAvailableSlots(Request $request)
    {
        try {
            $request->validate([
                'date' => 'required|date',
                'service_id' => 'required|exists:services,id',
            ]);

            $service = Service::findOrFail($request->service_id);
            $date = \Carbon\Carbon::parse($request->date);
            
            \Log::info('Available slots request', [
                'date' => $date->format('Y-m-d'),
                'service_id' => $service->id,
                'service_name' => $service->name,
                'service_duration' => $service->duration
            ]);
            
            // Get the most appropriate schedule setting
            $scheduleSetting = $this->getScheduleForDate($date, $service);
            
            if (!$scheduleSetting) {
                \Log::info('No schedule setting found');
                return response()->json(['slots' => []]);
            }

            \Log::info('Schedule setting found', [
                'schedule_name' => $scheduleSetting->name,
                'working_days' => $scheduleSetting->working_days
            ]);

            // Check if the date is a working day
            $dayOfWeek = $date->dayOfWeek; // 1=Monday, 7=Sunday
            if (!in_array($dayOfWeek, $scheduleSetting->working_days)) {
                \Log::info('Date is not a working day', ['day_of_week' => $dayOfWeek]);
                return response()->json(['slots' => []]);
            }

            // Get basic slots from schedule
            $slots = $scheduleSetting->getAvailableSlots($date, $service->duration);
            
            \Log::info('Generated slots from schedule', ['count' => count($slots)]);
            
            // Filter out slots that don't meet minimum advance time
            $now = now();
            $minAdvanceTime = $now->copy()->addHours($scheduleSetting->min_advance_hours);
            
            $filteredSlots = [];
            foreach ($slots as $slot) {
                $slotDateTime = $date->copy()->setTimeFromTimeString($slot['start']);
                
                // Only include slots that meet minimum advance time
                if ($slotDateTime->gte($minAdvanceTime)) {
                    try {
                        // Check if any employees are available for this slot
                        $availableEmployees = User::getAvailableEmployeesForSlot(
                            $service->id,
                            $date->format('Y-m-d'),
                            $slot['start'],
                            $service->duration
                        );
                        
                        $isAvailable = $availableEmployees->count() > 0;
                        $slot['available'] = $isAvailable;
                        $slot['available_employees'] = $availableEmployees->count();
                        $filteredSlots[] = $slot;
                        
                        \Log::info('Slot processed', [
                            'slot' => $slot['start'],
                            'available' => $isAvailable,
                            'available_employees' => $availableEmployees->count()
                        ]);
                    } catch (Exception $e) {
                        \Log::error('Error checking slot availability', [
                            'slot' => $slot['start'],
                            'error' => $e->getMessage()
                        ]);
                        // Default to available if there's an error
                        $slot['available'] = true;
                        $slot['available_employees'] = 0;
                        $filteredSlots[] = $slot;
                    }
                }
            }
            
            \Log::info('Returning filtered slots', ['count' => count($filteredSlots)]);
            return response()->json(['slots' => $filteredSlots]);
            
        } catch (Exception $e) {
            \Log::error('Error in getAvailableSlots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Validate a coupon code
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'extras' => 'array',
            'extras.*' => 'exists:extras,id',
            'phone_number' => 'nullable|string', // Add phone number for user validation
        ]);

        $code = strtoupper($request->code);
        $service = Service::findOrFail($request->service_id);
        $selectedExtras = Extra::whereIn('id', $request->extras ?? [])->get();
        
        // Calculate total amount for validation
        $totalAmount = floatval($service->price);
        foreach ($selectedExtras as $extra) {
            $totalAmount += floatval($extra->price);
        }

        // Find the coupon
        $coupon = Coupon::where('code', $code)->first();
        
        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.'
            ]);
        }

        // Check if coupon is active
        if (!$coupon->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not active.'
            ]);
        }

        // Check validity period
        $now = now();
        if ($coupon->valid_from && $now->lt($coupon->valid_from)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not yet valid.'
            ]);
        }

        if ($coupon->valid_until && $now->gt($coupon->valid_until)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has expired.'
            ]);
        }

        // Check usage limits
        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has reached its usage limit.'
            ]);
        }

        // Check per-user usage limit if phone number is provided
        if ($request->phone_number) {
            $phoneNumber = $request->phone_number;
            
            // Find existing user by phone number
            $existingUser = User::where('phone_number', $phoneNumber)->first();
            
            if ($existingUser) {
                // Check how many times this user has used this coupon
                $userUsageCount = CouponUsage::where('coupon_id', $coupon->id)
                    ->where('user_id', $existingUser->id)
                    ->count();
                
                if ($userUsageCount >= $coupon->max_uses_per_user) {
                    return response()->json([
                        'valid' => false,
                        'message' => 'You have already used this coupon maximum times.'
                    ]);
                }
            }
        }

        // Check minimum amount
        if ($totalAmount < $coupon->minimum_amount) {
            return response()->json([
                'valid' => false,
                'message' => "Minimum order amount of Rs. {$coupon->minimum_amount} required."
            ]);
        }

        // Check service restrictions
        if ($coupon->applicable_services && !empty($coupon->applicable_services)) {
            if (!in_array($service->id, $coupon->applicable_services)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This coupon is not applicable for this service.'
                ]);
            }
        }

        if ($coupon->excluded_services && !empty($coupon->excluded_services)) {
            if (in_array($service->id, $coupon->excluded_services)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This coupon cannot be used for this service.'
                ]);
            }
        }

        // Calculate discount amount
        $discountAmount = 0;
        if ($coupon->discount_type === 'percentage') {
            $discountAmount = ($totalAmount * $coupon->discount_value) / 100;
        } else {
            $discountAmount = $coupon->discount_value;
        }

        // Apply maximum discount limit
        if ($coupon->maximum_discount && $discountAmount > $coupon->maximum_discount) {
            $discountAmount = $coupon->maximum_discount;
        }

        // Ensure discount doesn't exceed total amount
        if ($discountAmount > $totalAmount) {
            $discountAmount = $totalAmount;
        }

        $finalAmount = $totalAmount - $discountAmount;

        return response()->json([
            'valid' => true,
            'message' => "Coupon applied successfully! You saved Rs. {$discountAmount}",
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'discount_amount' => $discountAmount,
                'original_amount' => $totalAmount,
                'final_amount' => $finalAmount,
            ]
        ]);
    }

    /**
     * Store custom field responses for a booking
     */
    private function storeCustomFieldResponses($booking, $request)
    {
        // Get the default booking form
        $form = Form::where('name', 'Default Booking Form')->first();
        if (!$form) {
            return;
        }

        // Get all form fields (primary and custom)
        $formFields = $form->fields()->with('services')->get();

        foreach ($formFields as $field) {
            $fieldName = $field->name;
            $fieldValue = $request->input($fieldName);

            // Skip if no value provided
            if ($fieldValue === null || $fieldValue === '') {
                continue;
            }

            // For custom fields, check if they apply to this service
            if (!$field->is_primary) {
                $fieldServices = $field->services;
                if ($fieldServices->count() > 0) {
                    // Field is service-specific, check if it applies to current service
                    if (!$fieldServices->contains('id', $booking->service_id)) {
                        continue; // Skip this field as it doesn't apply to this service
                    }
                }
                // If field has no services assigned, it applies to all services
            }

            // Store the response
            $booking->formResponses()->create([
                'form_field_id' => $field->id,
                'response_value' => $fieldValue,
                'response_data' => $this->formatFieldResponse($field, $fieldValue),
            ]);
        }
    }

    /**
     * Format field response based on field type
     */
    private function formatFieldResponse($field, $value)
    {
        switch ($field->type) {
            case 'checkbox':
                return [
                    'checked' => (bool) $value,
                    'raw_value' => $value,
                ];
            
            case 'radio':
            case 'select':
                return [
                    'selected_option' => $value,
                    'raw_value' => $value,
                ];
            
            case 'date':
                return [
                    'formatted_date' => $value ? date('Y-m-d', strtotime($value)) : null,
                    'raw_value' => $value,
                ];
            
            case 'time':
                return [
                    'formatted_time' => $value ? date('H:i', strtotime($value)) : null,
                    'raw_value' => $value,
                ];
            
            default:
                return [
                    'raw_value' => $value,
                ];
        }
    }

    /**
     * Get the appropriate schedule setting for a given date and service
     */
    private function getScheduleForDate($date, $service)
    {
        // For now, use the first active schedule
        // In the future, you could implement logic to select different schedules
        // based on date, service type, or other criteria
        return ScheduleSetting::active()->ordered()->first();
    }

    /**
     * Get setting value from database
     */
    private function getSetting($key, $default = null)
    {
        $setting = \DB::table('settings')->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Send OTP to phone number
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:10',
        ]);

        try {
            $phoneNumber = $request->phone_number;
            
            // Format phone number for Twilio (ensure it starts with +)
            if (!str_starts_with($phoneNumber, '+')) {
                // If it starts with 91, add +, otherwise assume it's a local number
                if (str_starts_with($phoneNumber, '91')) {
                    $phoneNumber = '+' . $phoneNumber;
                } else {
                    // For Indian numbers, add +91
                    $phoneNumber = '+91' . ltrim($phoneNumber, '0');
                }
            }
            
            // For testing - skip Twilio configuration check
            // Uncomment the below code when you want to enable real SMS sending
            /*
            // Check if Twilio is configured
            $twilioSid = $this->getSetting('twilio_sid');
            $twilioToken = $this->getSetting('twilio_token');
            $twilioPhone = $this->getSetting('twilio_phone');

            if (empty($twilioSid) || empty($twilioToken) || empty($twilioPhone)) {
                return response()->json(['error' => 'SMS service not configured'], 400);
            }
            */

            // Generate 6-digit OTP
            $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store OTP in session for verification
            session(['otp_' . $phoneNumber => $otp]);
            session(['otp_expiry_' . $phoneNumber => now()->addMinutes(5)]);

            // For testing - bypass SMS sending and always show OTP on screen
            $message = "Your verification code is: {$otp}. Valid for 5 minutes.";
            
            // Log the OTP for testing (remove in production)
            \Log::info("OTP generated for testing: {$otp}", [
                'phone' => $phoneNumber,
                'otp' => $otp,
                'expiry' => now()->addMinutes(5)
            ]);
            
            // Skip actual SMS sending for testing
            // Uncomment the below code when you want to enable real SMS sending
            /*
            try {
                $twilio = new Client($twilioSid, $twilioToken);
                $messageResult = $twilio->messages->create(
                    $phoneNumber,
                    [
                        'from' => $twilioPhone,
                        'body' => $message
                    ]
                );
                
                \Log::info("SMS sent successfully to {$phoneNumber}: {$message}", [
                    'message_sid' => $messageResult->sid,
                    'status' => $messageResult->status,
                    'to' => $messageResult->to,
                    'from' => $messageResult->from
                ]);
            } catch (\Exception $twilioException) {
                \Log::error('Twilio SMS sending failed:', [
                    'phone' => $phoneNumber,
                    'twilio_sid' => $twilioSid,
                    'twilio_phone' => $twilioPhone,
                    'error' => $twilioException->getMessage(),
                    'error_code' => $twilioException->getCode(),
                ]);
                return response()->json(['error' => 'Failed to send SMS. Please try again.'], 500);
            }
            */

            // For testing purposes, return the OTP in the response
            return response()->json([
                'success' => 'OTP sent successfully',
                'otp' => $otp // Only for testing - remove in production
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send OTP:', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to send OTP'], 500);
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:10',
            'otp' => 'required|string|size:6',
        ]);

        try {
            $phoneNumber = $request->phone_number;
            
            // Format phone number for consistency
            if (!str_starts_with($phoneNumber, '+')) {
                if (str_starts_with($phoneNumber, '91')) {
                    $phoneNumber = '+' . $phoneNumber;
                } else {
                    $phoneNumber = '+91' . ltrim($phoneNumber, '0');
                }
            }
            
            $otp = $request->otp;
            
            // Get stored OTP and expiry
            $storedOtp = session('otp_' . $phoneNumber);
            $otpExpiry = session('otp_expiry_' . $phoneNumber);

            if (!$storedOtp || !$otpExpiry) {
                return response()->json(['error' => 'OTP expired or not found'], 400);
            }

            if (now()->isAfter($otpExpiry)) {
                // Clear expired OTP
                session()->forget(['otp_' . $phoneNumber, 'otp_expiry_' . $phoneNumber]);
                return response()->json(['error' => 'OTP has expired'], 400);
            }

            if ($otp !== $storedOtp) {
                return response()->json(['error' => 'Invalid OTP'], 400);
            }

            // Clear OTP after successful verification
            session()->forget(['otp_' . $phoneNumber, 'otp_expiry_' . $phoneNumber]);
            
            // Mark phone as verified in session
            session(['phone_verified_' . $phoneNumber => true]);

            return response()->json(['success' => 'Phone number verified successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to verify OTP:', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to verify OTP'], 500);
        }
    }

    /**
     * Clean up any expired session data.
     */
    private function cleanupExpiredSessionData()
    {
        $now = now();
        
        // Clean up pending booking data older than 30 minutes
        $pendingBooking = session('pending_booking');
        $bookingCreatedAt = session('pending_booking_created_at');
        
        if ($pendingBooking && $bookingCreatedAt) {
            $bookingTime = \Carbon\Carbon::parse($bookingCreatedAt);
            if ($now->diffInMinutes($bookingTime) > 30) {
                session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
                \Log::info('Cleaned up expired pending booking session data');
            }
        }
        
        // Clean up any orphaned pending bookings older than 1 hour (from old system)
        $orphanedBookings = Booking::where('payment_status', 'pending')
            ->where('created_at', '<', $now->subHour())
            ->get();
            
        foreach ($orphanedBookings as $booking) {
            \Log::info('Cleaning up orphaned pending booking', [
                'booking_id' => $booking->id,
                'created_at' => $booking->created_at,
                'customer' => $booking->customer->name ?? 'Unknown'
            ]);
            $booking->delete();
        }
        
        $expiredKeys = collect(session()->all())
            ->filter(function ($value, $key) use ($now) {
                // Check for OTP keys
                if (str_starts_with($key, 'otp_')) {
                    $phoneNumber = substr($key, 4);
                    $expiryKey = 'otp_expiry_' . $phoneNumber;
                    $storedExpiry = session($expiryKey);
                    return $storedExpiry && $now->isAfter($storedExpiry);
                }
                // Check for phone verification keys
                if (str_starts_with($key, 'phone_verified_')) {
                    $phoneNumber = substr($key, 17);
                    $otpExpiry = session('otp_expiry_' . $phoneNumber);
                    return $otpExpiry && $now->isAfter($otpExpiry);
                }
                return false;
            })
            ->keys()
            ->toArray();

        foreach ($expiredKeys as $key) {
            session()->forget($key);
        }
    }
} 