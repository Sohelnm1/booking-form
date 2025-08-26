<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Show login page
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login
     */
    public function login(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'phone_number' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'phone_number' => ['Your account has been deactivated.'],
            ]);
        }

        Auth::login($user);

        // Redirect based on role
        return match($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'employee' => redirect()->route('employee.dashboard'),
            'customer' => redirect()->route('customer.dashboard'),
            default => redirect()->route('welcome')
        };
    }

    /**
     * Show registration page
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:users,phone_number',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer', // Default role for registration
        ]);

        Auth::login($user);

        return redirect()->route('customer.dashboard');
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('welcome');
    }

    /**
     * Handle customer login with OTP verification
     */
    public function customerLogin(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:10',
            'otp' => 'required|string|size:6',
        ]);

        try {
            $phoneNumber = $this->formatPhoneNumber($request->phone_number);
            
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
            
            // Find or create customer user
            $customer = User::where('phone_number', $phoneNumber)->first();
            
            if (!$customer) {
                // Create new customer
                $customer = User::create([
                    'name' => 'Customer', // Default name, can be updated later
                    'phone_number' => $phoneNumber,
                    'role' => 'customer',
                    'password' => bcrypt(Str::random(12)), // Temporary password
                ]);
            }

            // Log in the customer
            Auth::login($customer);

            return response()->json([
                'success' => 'Login successful',
                'user' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone_number' => $customer->phone_number,
                    'email' => $customer->email,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Customer login failed:', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Login failed'], 500);
        }
    }

    /**
     * Show customer dashboard
     */
    public function showCustomerDashboard()
    {
        // Fetch ALL active services for the carousel (not just HospiPal ones)
        $services = \App\Models\Service::where('is_active', true)
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

        // Fetch active dynamic slots for the dashboard
        $dynamicSlots = \App\Models\DynamicSlot::where('is_active', true)
            ->where(function($query) {
                $query->where('show_on_mobile', true)
                      ->orWhere('show_on_desktop', true);
            })
            ->orderBy('priority', 'desc')
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(function($slot) {
                return [
                    'id' => $slot->id,
                    'title' => $slot->title,
                    'content' => $slot->content,
                    'type' => $slot->type,
                    'icon' => $slot->icon,
                    'background_color' => $slot->background_color,
                    'text_color' => $slot->text_color,
                    'action_url' => $slot->action_url,
                    'action_text' => $slot->action_text,
                    'display_duration' => $slot->display_duration,
                    'priority' => $slot->priority,
                    'show_on_mobile' => $slot->show_on_mobile,
                    'show_on_desktop' => $slot->show_on_desktop,
                    'is_active' => $slot->is_active,
                ];
            });

        // Debug: Log the services and extras being fetched
        \Log::info('Data fetched for public dashboard:', [
            'total_services' => $services->count(),
            'total_extras' => $extras->count(),
            'total_dynamic_slots' => $dynamicSlots->count(),
            'services' => $services->toArray(),
            'extras' => $extras->toArray(),
            'dynamic_slots' => $dynamicSlots->toArray()
        ]);

        return Inertia::render('Customer/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'services' => $services,
            'extras' => $extras,
            'dynamicSlots' => $dynamicSlots,
        ]);
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

    /**
     * Format phone number consistently
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove any non-digit characters except +
        $phoneNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);
        
        // If it starts with +, keep as is
        if (str_starts_with($phoneNumber, '+')) {
            return $phoneNumber;
        }
        
        // If it starts with 91, add +
        if (str_starts_with($phoneNumber, '91')) {
            return '+' . $phoneNumber;
        }
        
        // For Indian numbers, add +91 and remove leading 0
        return '+91' . ltrim($phoneNumber, '0');
    }
} 