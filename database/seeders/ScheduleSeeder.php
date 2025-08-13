<<<<<<< HEAD
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScheduleSetting;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default schedule setting
        ScheduleSetting::create([
            'name' => 'Default Schedule',
            'description' => 'Standard business hours for regular appointments',
            'booking_window_days' => 30,
            'min_advance_hours' => 2,
            'max_advance_days' => 90,

            'buffer_time_minutes' => 15,
            'start_time' => '09:00:00',
            'end_time' => '18:00:00',
            'working_days' => [1, 2, 3, 4, 5], // Monday to Friday
            'break_times' => [
                ['start' => '12:00', 'end' => '13:00'], // Lunch break
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Create weekend schedule
        ScheduleSetting::create([
            'name' => 'Weekend Schedule',
            'description' => 'Limited hours for weekend appointments',
            'booking_window_days' => 14,
            'min_advance_hours' => 4,
            'max_advance_days' => 60,

            'buffer_time_minutes' => 20,
            'start_time' => '10:00:00',
            'end_time' => '16:00:00',
            'working_days' => [6, 7], // Saturday and Sunday
            'break_times' => [
                ['start' => '12:30', 'end' => '13:30'], // Lunch break
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create emergency schedule
        ScheduleSetting::create([
            'name' => 'Emergency Schedule',
            'description' => 'Same-day emergency appointments',
            'booking_window_days' => 1,
            'min_advance_hours' => 1,
            'max_advance_days' => 1,

            'buffer_time_minutes' => 30,
            'start_time' => '08:00:00',
            'end_time' => '20:00:00',
            'working_days' => [1, 2, 3, 4, 5, 6, 7], // All days
            'break_times' => [
                ['start' => '12:00', 'end' => '13:00'],
                ['start' => '17:00', 'end' => '18:00'],
            ],
            'is_active' => true,
            'sort_order' => 3,
        ]);
    }
=======
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScheduleSetting;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default schedule setting
        ScheduleSetting::create([
            'name' => 'Default Schedule',
            'description' => 'Standard business hours for regular appointments',
            'booking_window_days' => 30,
            'min_advance_hours' => 2,
            'max_advance_days' => 90,

            'buffer_time_minutes' => 15,
            'start_time' => '09:00:00',
            'end_time' => '18:00:00',
            'working_days' => [1, 2, 3, 4, 5], // Monday to Friday
            'break_times' => [
                ['start' => '12:00', 'end' => '13:00'], // Lunch break
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Create weekend schedule
        ScheduleSetting::create([
            'name' => 'Weekend Schedule',
            'description' => 'Limited hours for weekend appointments',
            'booking_window_days' => 14,
            'min_advance_hours' => 4,
            'max_advance_days' => 60,

            'buffer_time_minutes' => 20,
            'start_time' => '10:00:00',
            'end_time' => '16:00:00',
            'working_days' => [6, 7], // Saturday and Sunday
            'break_times' => [
                ['start' => '12:30', 'end' => '13:30'], // Lunch break
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create emergency schedule
        ScheduleSetting::create([
            'name' => 'Emergency Schedule',
            'description' => 'Same-day emergency appointments',
            'booking_window_days' => 1,
            'min_advance_hours' => 1,
            'max_advance_days' => 1,

            'buffer_time_minutes' => 30,
            'start_time' => '08:00:00',
            'end_time' => '20:00:00',
            'working_days' => [1, 2, 3, 4, 5, 6, 7], // All days
            'break_times' => [
                ['start' => '12:00', 'end' => '13:00'],
                ['start' => '17:00', 'end' => '18:00'],
            ],
            'is_active' => true,
            'sort_order' => 3,
        ]);
    }
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 