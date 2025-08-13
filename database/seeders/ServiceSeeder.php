<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing services (only if no bookings exist)
        if (Service::count() === 0) {
            // Only truncate if no services exist
        }

        // Services data
        $services = [
            [
                'name' => 'Haircut & Styling',
                'description' => 'Professional haircut and styling service with premium products',
                'price' => 500.00,
                'duration' => 60,
                'category' => 'Hair Services',
                'color' => '#1890ff',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Hair Coloring',
                'description' => 'Professional hair coloring service with premium products and expert consultation',
                'price' => 1500.00,
                'duration' => 120,
                'category' => 'Hair Services',
                'color' => '#722ed1',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Facial Treatment',
                'description' => 'Relaxing facial treatment with natural products and skin analysis',
                'price' => 800.00,
                'duration' => 90,
                'category' => 'Skin Care',
                'color' => '#52c41a',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Manicure & Pedicure',
                'description' => 'Complete nail care service with polish and design options',
                'price' => 400.00,
                'duration' => 45,
                'category' => 'Nail Services',
                'color' => '#fa8c16',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Relaxing Massage',
                'description' => 'Therapeutic massage for stress relief and muscle relaxation',
                'price' => 1200.00,
                'duration' => 60,
                'category' => 'Massage',
                'color' => '#eb2f96',
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($services as $service) {
            // Check if service already exists
            $existingService = Service::where('name', $service['name'])->first();
            if (!$existingService) {
                Service::create($service);
            }
        }
    }
}
