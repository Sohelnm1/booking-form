<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'business_name',
                'value' => 'Beauty Salon & Spa',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Name of the business',
            ],
            [
                'key' => 'business_address',
                'value' => '123 Main Street, City, State 12345',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Business address',
            ],
            [
                'key' => 'business_phone',
                'value' => '+91 9876543210',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Business phone number',
            ],
            [
                'key' => 'business_email',
                'value' => 'info@beautysalon.com',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Business email address',
            ],
            [
                'key' => 'advance_booking_days',
                'value' => '30',
                'type' => 'integer',
                'group' => 'booking',
                'description' => 'How many days in advance customers can book',
            ],
            [
                'key' => 'cancellation_hours',
                'value' => '24',
                'type' => 'integer',
                'group' => 'booking',
                'description' => 'Hours before appointment when cancellation is allowed',
            ],
            [
                'key' => 'slot_duration',
                'value' => '30',
                'type' => 'integer',
                'group' => 'booking',
                'description' => 'Default slot duration in minutes',
            ],
            [
                'key' => 'currency',
                'value' => 'INR',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Default currency for payments',
            ],
            [
                'key' => 'razorpay_key',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Razorpay API key',
            ],
            [
                'key' => 'razorpay_secret',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Razorpay API secret',
            ],
            [
                'key' => 'twilio_sid',
                'value' => '',
                'type' => 'string',
                'group' => 'notification',
                'description' => 'Twilio Account SID for SMS',
            ],
            [
                'key' => 'twilio_token',
                'value' => '',
                'type' => 'string',
                'group' => 'notification',
                'description' => 'Twilio Auth Token for SMS',
            ],
            [
                'key' => 'twilio_phone',
                'value' => '',
                'type' => 'string',
                'group' => 'notification',
                'description' => 'Twilio Phone Number for SMS',
            ],
            [
                'key' => 'otp_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'booking',
                'description' => 'Enable OTP verification for bookings',
            ],
            [
                'key' => 'consent_required',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'booking',
                'description' => 'Require consent form before booking',
            ],
            [
                'key' => 'working_hours',
                'value' => '{"monday":{"start":"09:00","end":"18:00","active":true},"tuesday":{"start":"09:00","end":"18:00","active":true},"wednesday":{"start":"09:00","end":"18:00","active":true},"thursday":{"start":"09:00","end":"18:00","active":true},"friday":{"start":"09:00","end":"18:00","active":true},"saturday":{"start":"09:00","end":"17:00","active":true},"sunday":{"start":"10:00","end":"16:00","active":false}}',
                'type' => 'json',
                'group' => 'booking',
                'description' => 'Default working hours for the business',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->insert($setting);
        }
    }
}
