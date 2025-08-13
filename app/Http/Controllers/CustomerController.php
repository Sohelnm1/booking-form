<<<<<<< HEAD
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
=======
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
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 