<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
        
        // TODO: Add booking statistics and recent bookings
        $stats = [
            'total_bookings' => 0,
            'upcoming_bookings' => 0,
            'completed_bookings' => 0,
            'cancelled_bookings' => 0,
        ];

        return Inertia::render('Customer/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show customer bookings
     */
    public function bookings()
    {
        $user = Auth::user();
        
        $bookings = $user->customerBookings()
            ->with(['service', 'employee', 'extras'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return Inertia::render('Customer/Bookings', [
            'auth' => [
                'user' => $user,
            ],
            'bookings' => $bookings,
        ]);
    }
} 