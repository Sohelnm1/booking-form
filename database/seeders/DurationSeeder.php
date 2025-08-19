<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Duration;

class DurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $durations = [
            ['name' => '15 minutes', 'hours' => 0, 'minutes' => 15, 'label' => '15 minutes', 'sort_order' => 1],
            ['name' => '30 minutes', 'hours' => 0, 'minutes' => 30, 'label' => '30 minutes', 'sort_order' => 2],
            ['name' => '45 minutes', 'hours' => 0, 'minutes' => 45, 'label' => '45 minutes', 'sort_order' => 3],
            ['name' => '1 hour', 'hours' => 1, 'minutes' => 0, 'label' => '1 hour', 'sort_order' => 4],
            ['name' => '1.5 hours', 'hours' => 1, 'minutes' => 30, 'label' => '1.5 hours', 'sort_order' => 5],
            ['name' => '2 hours', 'hours' => 2, 'minutes' => 0, 'label' => '2 hours', 'sort_order' => 6],
            ['name' => '2.5 hours', 'hours' => 2, 'minutes' => 30, 'label' => '2.5 hours', 'sort_order' => 7],
            ['name' => '3 hours', 'hours' => 3, 'minutes' => 0, 'label' => '3 hours', 'sort_order' => 8],
        ];

        foreach ($durations as $duration) {
            Duration::updateOrCreate(
                ['hours' => $duration['hours'], 'minutes' => $duration['minutes']],
                $duration
            );
        }
    }
}
