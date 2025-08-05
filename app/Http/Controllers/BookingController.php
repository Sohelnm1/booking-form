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
        $extras = Extra::active()->ordered()->get();
        
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
        
        // Get the form associated with this service
        $form = $service->forms()->first();
        if (!$form) {
            // Fallback to default form
            $form = Form::active()->first();
        }
        
        $formFields = [];
        if ($form) {
            $formFields = $form->fields()->orderBy('sort_order')->get();
        }
        
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
        ]);
    }

    /**
     * Process the booking
     */
    public function processBooking(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'extras' => 'array',
            'extras.*' => 'exists:extras,id',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'consents' => 'array',
            'consents.*' => 'exists:consent_settings,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|max:20',
        ]);

        // TODO: Create booking record
        // TODO: Process payment
        // TODO: Send confirmation email
        
        return redirect()->route('booking.success')->with('success', 'Booking confirmed successfully!');
    }

    /**
     * Show booking success page
     */
    public function success()
    {
        return Inertia::render('Booking/Success');
    }

    /**
     * Get available time slots for a specific date
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'service_id' => 'required|exists:services,id',
        ]);

        $service = Service::findOrFail($request->service_id);
        $scheduleSetting = ScheduleSetting::active()->first(); // For now, use first active schedule
        
        if (!$scheduleSetting) {
            return response()->json(['slots' => []]);
        }

        $slots = $scheduleSetting->getAvailableSlots($request->date, $service->duration);
        
        return response()->json(['slots' => $slots]);
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
            
            // Check if Twilio is configured
            $twilioSid = $this->getSetting('twilio_sid');
            $twilioToken = $this->getSetting('twilio_token');
            $twilioPhone = $this->getSetting('twilio_phone');

            if (empty($twilioSid) || empty($twilioToken) || empty($twilioPhone)) {
                return response()->json(['error' => 'SMS service not configured'], 400);
            }

            // Generate 6-digit OTP
            $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store OTP in session for verification
            session(['otp_' . $phoneNumber => $otp]);
            session(['otp_expiry_' . $phoneNumber => now()->addMinutes(5)]);

            // Send SMS using Twilio
            $message = "Your verification code is: {$otp}. Valid for 5 minutes.";
            
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

            return response()->json(['success' => 'OTP sent successfully']);
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
} 