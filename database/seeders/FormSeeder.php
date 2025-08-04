<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Form;
use App\Models\FormField;
use App\Models\Service;

class FormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a basic booking form
        $bookingForm = Form::create([
            'name' => 'Basic Booking Form',
            'description' => 'Standard booking form with essential customer information',
            'is_active' => true,
            'sort_order' => 1,
            'settings' => [
                'theme' => 'default',
                'layout' => 'vertical',
            ],
        ]);

        // Create primary fields for the booking form
        $primaryFields = [
            [
                'label' => 'Phone Number',
                'name' => 'phone_number',
                'type' => 'phone',
                'placeholder' => 'Enter your phone number',
                'help_text' => 'We will use this to confirm your booking',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 1,
            ],
            [
                'label' => 'Full Name',
                'name' => 'full_name',
                'type' => 'text',
                'placeholder' => 'Enter your full name',
                'help_text' => 'Please enter your complete name as it appears on your ID',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 2,
            ],
            [
                'label' => 'Email Address',
                'name' => 'email',
                'type' => 'email',
                'placeholder' => 'Enter your email address',
                'help_text' => 'Optional: For booking confirmations and updates',
                'is_required' => false,
                'is_primary' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($primaryFields as $field) {
            FormField::create(array_merge($field, ['form_id' => $bookingForm->id]));
        }

        // Create a detailed booking form
        $detailedForm = Form::create([
            'name' => 'Detailed Booking Form',
            'description' => 'Comprehensive booking form with additional customer preferences',
            'is_active' => true,
            'sort_order' => 2,
            'settings' => [
                'theme' => 'modern',
                'layout' => 'vertical',
            ],
        ]);

        // Create fields for the detailed form
        $detailedFields = [
            [
                'label' => 'Phone Number',
                'name' => 'phone_number',
                'type' => 'phone',
                'placeholder' => 'Enter your phone number',
                'help_text' => 'We will use this to confirm your booking',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 1,
            ],
            [
                'label' => 'Full Name',
                'name' => 'full_name',
                'type' => 'text',
                'placeholder' => 'Enter your full name',
                'help_text' => 'Please enter your complete name as it appears on your ID',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 2,
            ],
            [
                'label' => 'Email Address',
                'name' => 'email',
                'type' => 'email',
                'placeholder' => 'Enter your email address',
                'help_text' => 'For booking confirmations and updates',
                'is_required' => false,
                'is_primary' => true,
                'sort_order' => 3,
            ],
            [
                'label' => 'Preferred Date',
                'name' => 'preferred_date',
                'type' => 'date',
                'placeholder' => 'Select your preferred date',
                'help_text' => 'Choose your preferred appointment date',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 4,
            ],
            [
                'label' => 'Preferred Time',
                'name' => 'preferred_time',
                'type' => 'select',
                'placeholder' => 'Select your preferred time',
                'help_text' => 'Choose your preferred appointment time',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 5,
                'options' => [
                    '09:00 AM',
                    '10:00 AM',
                    '11:00 AM',
                    '12:00 PM',
                    '01:00 PM',
                    '02:00 PM',
                    '03:00 PM',
                    '04:00 PM',
                    '05:00 PM',
                ],
            ],
            [
                'label' => 'Special Requirements',
                'name' => 'special_requirements',
                'type' => 'textarea',
                'placeholder' => 'Any special requirements or notes',
                'help_text' => 'Please let us know if you have any special requirements',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 6,
            ],
            [
                'label' => 'How did you hear about us?',
                'name' => 'referral_source',
                'type' => 'select',
                'placeholder' => 'Select how you heard about us',
                'help_text' => 'This helps us improve our marketing',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 7,
                'options' => [
                    'Social Media',
                    'Google Search',
                    'Friend/Family',
                    'Advertisement',
                    'Walk-in',
                    'Other',
                ],
            ],
        ];

        foreach ($detailedFields as $field) {
            FormField::create(array_merge($field, ['form_id' => $detailedForm->id]));
        }

        // Create a spa-specific form
        $spaForm = Form::create([
            'name' => 'Spa Treatment Form',
            'description' => 'Specialized form for spa and wellness treatments',
            'is_active' => true,
            'sort_order' => 3,
            'settings' => [
                'theme' => 'spa',
                'layout' => 'vertical',
            ],
        ]);

        // Create fields for the spa form
        $spaFields = [
            [
                'label' => 'Phone Number',
                'name' => 'phone_number',
                'type' => 'phone',
                'placeholder' => 'Enter your phone number',
                'help_text' => 'We will use this to confirm your booking',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 1,
            ],
            [
                'label' => 'Full Name',
                'name' => 'full_name',
                'type' => 'text',
                'placeholder' => 'Enter your full name',
                'help_text' => 'Please enter your complete name',
                'is_required' => true,
                'is_primary' => true,
                'sort_order' => 2,
            ],
            [
                'label' => 'Email Address',
                'name' => 'email',
                'type' => 'email',
                'placeholder' => 'Enter your email address',
                'help_text' => 'For booking confirmations',
                'is_required' => false,
                'is_primary' => true,
                'sort_order' => 3,
            ],
            [
                'label' => 'Age',
                'name' => 'age',
                'type' => 'number',
                'placeholder' => 'Enter your age',
                'help_text' => 'Required for treatment safety',
                'is_required' => true,
                'is_primary' => false,
                'sort_order' => 4,
            ],
            [
                'label' => 'Medical Conditions',
                'name' => 'medical_conditions',
                'type' => 'textarea',
                'placeholder' => 'List any medical conditions or allergies',
                'help_text' => 'This information helps us provide safe treatments',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 5,
            ],
            [
                'label' => 'Skin Sensitivity',
                'name' => 'skin_sensitivity',
                'type' => 'select',
                'placeholder' => 'Select your skin sensitivity level',
                'help_text' => 'This helps us choose appropriate products',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 6,
                'options' => [
                    'Normal',
                    'Sensitive',
                    'Very Sensitive',
                    'Allergic to certain products',
                ],
            ],
            [
                'label' => 'Pregnancy Status',
                'name' => 'pregnancy_status',
                'type' => 'radio',
                'placeholder' => 'Are you pregnant?',
                'help_text' => 'Some treatments are not suitable during pregnancy',
                'is_required' => false,
                'is_primary' => false,
                'sort_order' => 7,
                'options' => [
                    'Not Pregnant',
                    'Pregnant (First Trimester)',
                    'Pregnant (Second Trimester)',
                    'Pregnant (Third Trimester)',
                ],
            ],
        ];

        foreach ($spaFields as $field) {
            FormField::create(array_merge($field, ['form_id' => $spaForm->id]));
        }

        // Associate forms with services
        $services = Service::all();
        
        // Basic form for all services
        $bookingForm->services()->attach($services->pluck('id')->toArray());
        
        // Detailed form for premium services
        $premiumServices = $services->whereIn('name', ['Facial Treatment', 'Massage Therapy']);
        $detailedForm->services()->attach($premiumServices->pluck('id')->toArray());
        
        // Spa form for spa services
        $spaServices = $services->whereIn('name', ['Facial Treatment', 'Spa Package']);
        $spaForm->services()->attach($spaServices->pluck('id')->toArray());
    }
} 