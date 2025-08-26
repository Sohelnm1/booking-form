<?php

namespace Database\Seeders;

use App\Models\DynamicSlot;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DynamicSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing dynamic slots
        DynamicSlot::truncate();

        // Sample dynamic slots
        $slots = [
            [
                'title' => 'Weekly Offer: 10% off Elderly Care Packages',
                'content' => 'Get 10% discount on all elderly care packages this week. Limited time offer!',
                'type' => 'offer',
                'icon' => '🎉',
                'background_color' => '#52c41a',
                'text_color' => '#ffffff',
                'action_url' => null,
                'action_text' => null,
                'is_active' => true,
                'sort_order' => 1,
                'start_date' => Carbon::now()->startOfWeek(),
                'end_date' => Carbon::now()->endOfWeek(),
                'show_on_mobile' => true,
                'show_on_desktop' => true,
                'display_duration' => null,
                'priority' => 5,
            ],
            [
                'title' => 'Festival Greetings: Happy Ganesh Chaturthi!',
                'content' => 'Wishing all our customers a blessed Ganesh Chaturthi! May Lord Ganesha bring prosperity and good health.',
                'type' => 'festival',
                'icon' => '🙏',
                'background_color' => '#722ed1',
                'text_color' => '#ffffff',
                'action_url' => null,
                'action_text' => null,
                'is_active' => true,
                'sort_order' => 2,
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(5),
                'show_on_mobile' => true,
                'show_on_desktop' => true,
                'display_duration' => null,
                'priority' => 4,
            ],
            [
                'title' => 'Families across the world book HospiPals every day',
                'content' => 'Join thousands of families who trust HospiPal for their loved ones\' care. Book your HospiPal today!',
                'type' => 'promotion',
                'icon' => '🌍',
                'background_color' => '#1890ff',
                'text_color' => '#ffffff',
                'action_url' => null,
                'action_text' => 'Book Now',
                'is_active' => true,
                'sort_order' => 3,
                'start_date' => null,
                'end_date' => null,
                'show_on_mobile' => true,
                'show_on_desktop' => true,
                'display_duration' => null,
                'priority' => 3,
            ],
            [
                'title' => 'New Feature: Instant Booking Confirmation',
                'content' => 'Experience faster booking with our new instant confirmation system. Get your booking ID immediately!',
                'type' => 'news',
                'icon' => '✨',
                'background_color' => '#13c2c2',
                'text_color' => '#ffffff',
                'action_url' => null,
                'action_text' => 'Learn More',
                'is_active' => true,
                'sort_order' => 4,
                'start_date' => Carbon::now()->subDays(7),
                'end_date' => Carbon::now()->addDays(14),
                'show_on_mobile' => true,
                'show_on_desktop' => true,
                'display_duration' => null,
                'priority' => 2,
            ],
            [
                'title' => 'Special Discount for First-Time Users',
                'content' => 'New to HospiPal? Get 15% off your first booking with code: WELCOME15',
                'type' => 'offer',
                'icon' => '💝',
                'background_color' => '#faad14',
                'text_color' => '#ffffff',
                'action_url' => null,
                'action_text' => 'Use Code',
                'is_active' => true,
                'sort_order' => 5,
                'start_date' => null,
                'end_date' => null,
                'show_on_mobile' => true,
                'show_on_desktop' => true,
                'display_duration' => null,
                'priority' => 1,
            ],
        ];

        foreach ($slots as $slot) {
            DynamicSlot::create($slot);
        }
    }
}
