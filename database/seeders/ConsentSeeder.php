<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConsentSetting;

class ConsentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Terms and Conditions
        ConsentSetting::create([
            'name' => 'terms_conditions',
            'title' => 'Terms and Conditions',
            'content' => "By booking an appointment with us, you agree to the following terms and conditions:

1. **Booking and Cancellation**
   - Appointments must be booked at least 2 hours in advance
   - Cancellations must be made at least 24 hours before the appointment
   - Late cancellations may incur a cancellation fee

2. **Payment**
   - Payment is required at the time of booking
   - We accept all major credit cards and cash payments
   - Prices are subject to change without notice

3. **Service**
   - We reserve the right to refuse service
   - Please arrive 10 minutes before your appointment time
   - Late arrivals may result in reduced service time

4. **Health and Safety**
   - Please inform us of any health conditions before your appointment
   - We follow strict hygiene and safety protocols
   - Your health and safety is our priority

5. **Privacy**
   - Your personal information is kept confidential
   - We will not share your information with third parties
   - You may request access to your personal data at any time

For questions about these terms, please contact us.",
            'summary' => 'Terms and conditions for booking appointments, including cancellation policies, payment terms, and service guidelines.',
            'is_required' => true,
            'is_active' => true,
            'sort_order' => 1,
            'version' => '1.0',
            'last_updated' => now(),
        ]);

        // Privacy Policy
        ConsentSetting::create([
            'name' => 'privacy_policy',
            'title' => 'Privacy Policy',
            'content' => "Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.

**Information We Collect**
- Name, email, phone number for booking purposes
- Appointment history and preferences
- Payment information (processed securely)
- Any health information you choose to share

**How We Use Your Information**
- To process and confirm your bookings
- To send appointment reminders and updates
- To improve our services
- To comply with legal obligations

**Information Sharing**
- We do not sell, trade, or rent your personal information
- We may share information with service providers who assist us
- We may disclose information if required by law

**Data Security**
- We use industry-standard security measures
- Your data is stored securely and encrypted
- We regularly review our security practices

**Your Rights**
- You can access, update, or delete your personal information
- You can opt out of marketing communications
- You can request a copy of your data

**Contact Us**
If you have questions about this privacy policy, please contact us.",
            'summary' => 'How we collect, use, and protect your personal information when you use our booking service.',
            'is_required' => true,
            'is_active' => true,
            'sort_order' => 2,
            'version' => '1.0',
            'last_updated' => now(),
        ]);

        // Booking Consent
        ConsentSetting::create([
            'name' => 'booking_consent',
            'title' => 'Booking Consent',
            'content' => "By proceeding with this booking, you confirm that:

1. **Personal Information**
   - You consent to us collecting and processing your personal information
   - You understand how we will use your information as described in our Privacy Policy
   - You can withdraw your consent at any time

2. **Appointment Confirmation**
   - You agree to receive appointment confirmations and reminders
   - You understand our cancellation and rescheduling policies
   - You will arrive on time for your appointment

3. **Service Agreement**
   - You understand the service you are booking
   - You agree to our terms and conditions
   - You will provide accurate information about your health and preferences

4. **Communication**
   - You consent to receive communications about your booking
   - You can opt out of marketing communications
   - We will only contact you for booking-related matters

Your consent is voluntary and you can withdraw it at any time by contacting us.",
            'summary' => 'Consent for booking appointments, data processing, and service communications.',
            'is_required' => true,
            'is_active' => true,
            'sort_order' => 3,
            'version' => '1.0',
            'last_updated' => now(),
        ]);
    }
} 