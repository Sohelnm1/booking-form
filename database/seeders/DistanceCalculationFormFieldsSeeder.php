<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Form;
use App\Models\FormField;

class DistanceCalculationFormFieldsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the active form
        $form = Form::where('is_active', true)->first();
        
        if (!$form) {
            $this->command->warn('No active form found. Please create an active form first.');
            return;
        }

        // Create Hospital Location field
        FormField::create([
            'form_id' => $form->id,
            'label' => 'Hospital Location',
            'name' => 'hospital_location',
            'type' => 'location',
            'placeholder' => 'Enter hospital address',
            'help_text' => 'Please enter the hospital address where the service will be provided',
            'is_required' => false,
            'is_primary' => false,
            'sort_order' => 100,
            'rendering_control' => 'extras',
            'has_distance_calculation' => true,
            'distance_calculation_type' => 'origin',
            'linked_extra_id' => null, // Will be set when linking to specific extras
            'settings' => [
                'allowCurrentLocation' => false
            ]
        ]);

        // Create Customer Location field
        FormField::create([
            'form_id' => $form->id,
            'label' => 'Your Location',
            'name' => 'customer_location',
            'type' => 'location',
            'placeholder' => 'Enter your address',
            'help_text' => 'Please enter your home address for distance calculation',
            'is_required' => false,
            'is_primary' => false,
            'sort_order' => 101,
            'rendering_control' => 'extras',
            'has_distance_calculation' => true,
            'distance_calculation_type' => 'destination',
            'linked_extra_id' => null, // Will be set when linking to specific extras
            'settings' => [
                'allowCurrentLocation' => true
            ]
        ]);

        $this->command->info('Distance calculation form fields created successfully!');
        $this->command->info('Remember to link these fields to specific extras in the admin panel.');
    }
}
