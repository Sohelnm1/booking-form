<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the seeders to create test data
        $this->call([
            AdminSeeder::class,
            DurationSeeder::class,
            ServiceSeeder::class,
            SettingSeeder::class,
            ExtraSeeder::class,
            FormSeeder::class,
            ScheduleSeeder::class,
            ConsentSeeder::class,
            CustomerSeeder::class,
            BookingPolicySeeder::class,
        ]);
    }
}
