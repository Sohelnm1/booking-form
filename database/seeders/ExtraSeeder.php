<<<<<<< HEAD
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Extra;

class ExtraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $extras = [
            [
                'name' => 'Deep Conditioning',
                'description' => 'Intensive hair conditioning treatment for damaged hair',
                'price' => 200.00,
                'duration' => 15,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Hair Mask',
                'description' => 'Nourishing hair mask for extra shine and softness',
                'price' => 150.00,
                'duration' => 10,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Scalp Massage',
                'description' => 'Relaxing scalp massage to improve blood circulation',
                'price' => 100.00,
                'duration' => 5,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Hair Serum',
                'description' => 'Professional hair serum for frizz control and shine',
                'price' => 80.00,
                'duration' => 0,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Neck & Shoulder Massage',
                'description' => 'Therapeutic massage for neck and shoulder tension relief',
                'price' => 120.00,
                'duration' => 10,
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($extras as $extra) {
            Extra::create($extra);
        }
    }
=======
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Extra;

class ExtraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $extras = [
            [
                'name' => 'Deep Conditioning',
                'description' => 'Intensive hair conditioning treatment for damaged hair',
                'price' => 200.00,
                'duration' => 15,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Hair Mask',
                'description' => 'Nourishing hair mask for extra shine and softness',
                'price' => 150.00,
                'duration' => 10,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Scalp Massage',
                'description' => 'Relaxing scalp massage to improve blood circulation',
                'price' => 100.00,
                'duration' => 5,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Hair Serum',
                'description' => 'Professional hair serum for frizz control and shine',
                'price' => 80.00,
                'duration' => 0,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Neck & Shoulder Massage',
                'description' => 'Therapeutic massage for neck and shoulder tension relief',
                'price' => 120.00,
                'duration' => 10,
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($extras as $extra) {
            Extra::create($extra);
        }
    }
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
} 