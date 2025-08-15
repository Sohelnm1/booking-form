<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test customers
        $customers = [
            [
                'name' => 'John Doe',
                'phone_number' => '1111111111',
                'email' => 'john.doe@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Jane Smith',
                'phone_number' => '2222222222',
                'email' => 'jane.smith@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Mike Johnson',
                'phone_number' => '3333333333',
                'email' => 'mike.johnson@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Wilson',
                'phone_number' => '4444444444',
                'email' => 'sarah.wilson@example.com',
                'role' => 'customer',
                'is_active' => false,
            ],
            [
                'name' => 'David Brown',
                'phone_number' => '5555555556',
                'email' => 'david.brown@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Lisa Davis',
                'phone_number' => '6666666666',
                'email' => 'lisa.davis@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Robert Miller',
                'phone_number' => '7777777777',
                'email' => 'robert.miller@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
            [
                'name' => 'Emily Garcia',
                'phone_number' => '8888888888',
                'email' => 'emily.garcia@example.com',
                'role' => 'customer',
                'is_active' => true,
            ],
        ];

        foreach ($customers as $customerData) {
            $customer = User::create([
                'name' => $customerData['name'],
                'phone_number' => $customerData['phone_number'],
                'email' => $customerData['email'],
                'password' => Hash::make('password'),
                'role' => $customerData['role'],
                'is_active' => $customerData['is_active'],
                'created_at' => Carbon::now()->subDays(rand(1, 365)), // Random join date
            ]);

            // Create some sample bookings for each customer
            $services = Service::all();
            if ($services->count() > 0) {
                $numBookings = rand(0, 5); // Random number of bookings per customer
                for ($i = 0; $i < $numBookings; $i++) {
                    $service = $services->random();
                    $appointmentTime = Carbon::now()->addDays(rand(-30, 30));
                    
                    Booking::create([
                        'user_id' => $customer->id,
                        'service_id' => $service->id,
                        'employee_id' => User::where('role', 'employee')->first()?->id,
                        'appointment_time' => $appointmentTime,
                        'appointment_date_time' => $appointmentTime->setTimezone('Asia/Kolkata'),
                        'duration' => $service->duration,
                        'total_amount' => $service->price + rand(0, 50), // Add some random extras
                        'status' => ['pending', 'confirmed', 'completed', 'cancelled'][rand(0, 3)],
                        'payment_status' => ['pending', 'paid', 'failed'][rand(0, 2)],
                        'consent_given' => true,
                        'consent_given_at' => Carbon::now(),
                    ]);
                }
            }
        }
    }
}
