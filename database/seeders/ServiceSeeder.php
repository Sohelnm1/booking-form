<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'HospiPal for OPD Visits',
                'description' => 'Escort and assist during doctor visits & diagnostics.',
                'price' => 500.00,
                'duration' => 120, // 2 hours
                'icon' => '🧑‍⚕',
                'color' => '#1890ff',
                'is_active' => true,
                'sort_order' => 1,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Elderly Care',
                'description' => 'Respectful companion for seniors (single visit or packages).',
                'price' => 800.00,
                'duration' => 240, // 4 hours
                'icon' => '👵',
                'color' => '#52c41a',
                'is_active' => true,
                'sort_order' => 2,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal On-Call (Emergency)',
                'description' => 'Quick HospiPal when family can\'t reach in time.',
                'price' => 1200.00,
                'duration' => 180, // 3 hours
                'icon' => '⚡',
                'color' => '#faad14',
                'is_active' => true,
                'sort_order' => 3,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Discharge Support',
                'description' => 'Smooth exit with paperwork, billing & pharmacy help.',
                'price' => 600.00,
                'duration' => 150, // 2.5 hours
                'icon' => '📋',
                'color' => '#722ed1',
                'is_active' => true,
                'sort_order' => 4,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Admission Support',
                'description' => 'Stay support during admission (up to 4 / 8 / 12 hrs).',
                'price' => 1000.00,
                'duration' => 480, // 8 hours
                'icon' => '🛏',
                'color' => '#13c2c2',
                'is_active' => true,
                'sort_order' => 5,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Overnight Stay',
                'description' => 'Trusted companion for patients through the night.',
                'price' => 1500.00,
                'duration' => 720, // 12 hours
                'icon' => '🌙',
                'color' => '#eb2f96',
                'is_active' => true,
                'sort_order' => 6,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Hospital Errands',
                'description' => 'Reports, bills & document runs handled for you.',
                'price' => 400.00,
                'duration' => 90, // 1.5 hours
                'icon' => '📑',
                'color' => '#fa8c16',
                'is_active' => true,
                'sort_order' => 7,
                'is_upcoming' => false,
            ],
            [
                'name' => 'HospiPal for Recovery (Coming Soon)',
                'description' => 'Non-medical recovery support at home or hotel.',
                'price' => 0.00,
                'duration' => 0,
                'icon' => '💡',
                'color' => '#a0d911',
                'is_active' => true,
                'sort_order' => 8,
                'is_upcoming' => true,
                'coming_soon_description' => 'This service will be available soon for post-hospital recovery support.',
            ],
        ];

        foreach ($services as $serviceData) {
            Service::updateOrCreate(
                ['name' => $serviceData['name']],
                $serviceData
            );
        }
    }
}
