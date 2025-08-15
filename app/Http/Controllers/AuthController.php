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
        return Inertia::render('Customer/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
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