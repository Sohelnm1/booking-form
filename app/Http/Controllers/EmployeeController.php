<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:employee');
    }

    /**
     * Show employee dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // TODO: Add assigned bookings and statistics
        $stats = [
            'assigned_bookings' => 0,
            'today_appointments' => 0,
            'completed_today' => 0,
            'pending' => 0,
        ];

        return Inertia::render('Employee/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => $stats,
        ]);
    }
} 