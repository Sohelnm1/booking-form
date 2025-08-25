<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ConsentSetting;

class UpdateConsentSettings extends Command
{
    protected $signature = 'consent:update';
    protected $description = 'Update consent settings with new content';

    public function handle()
    {
        $this->info('Updating consent settings...');

        // Update Terms & Conditions
        $terms = ConsentSetting::where('name', 'terms_conditions')->first();
        if ($terms) {
            $terms->update([
                'content' => "TERMS AND CONDITIONS

1. ACCEPTANCE OF TERMS
By accessing and using HospiPal Health LLP's services, you accept and agree to be bound by the terms and provision of this agreement.

2. SERVICE DESCRIPTION
HospiPal provides non-medical companion support services in hospitals. Our services include:
- Patient companionship and emotional support
- Assistance with non-medical tasks
- Communication support between patients and families
- Basic comfort and care activities

3. BOOKING AND PAYMENT
- All bookings must be made through our official platform
- Payment is required at the time of booking
- Cancellation policies apply as per our booking terms
- Refunds are processed according to our refund policy

4. SERVICE LIMITATIONS
- HospiPal companions are NOT medical professionals
- We do not provide medical care, nursing, or treatment
- Medical decisions remain the responsibility of hospital staff
- Companions will not administer medication or perform medical procedures

5. CANCELLATION POLICY
- Cancellations must be made at least 24 hours before the scheduled service
- Late cancellations may incur charges
- Emergency cancellations will be handled on a case-by-case basis

6. PRIVACY AND CONFIDENTIALITY
- All patient information is kept strictly confidential
- We comply with applicable privacy laws and regulations
- Information is shared only with authorized personnel

7. LIABILITY
- HospiPal is not liable for medical outcomes
- Our liability is limited to the scope of companion services
- We maintain appropriate insurance coverage

8. CHANGES TO TERMS
We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.

9. CONTACT INFORMATION
For questions about these terms, contact us at support@hospipalhealth.com

Last Updated: " . now()->format('F j, Y'),
                'last_updated' => now(),
            ]);
            $this->info('Terms & Conditions updated');
        }

        // Update Privacy Policy
        $privacy = ConsentSetting::where('name', 'privacy_policy')->first();
        if ($privacy) {
            $privacy->update([
                'content' => "PRIVACY POLICY

1. INFORMATION WE COLLECT
We collect information you provide directly to us, including:
- Personal identification information (name, email, phone number)
- Booking and service preferences
- Payment information
- Communication records
- Feedback and reviews

2. HOW WE USE YOUR INFORMATION
We use the collected information for:
- Processing bookings and payments
- Providing customer support
- Sending service updates and confirmations
- Improving our services
- Legal compliance and dispute resolution

3. INFORMATION SHARING
We do not sell, trade, or rent your personal information. We may share information with:
- Service providers who assist in our operations
- Legal authorities when required by law
- Third parties with your explicit consent

4. DATA SECURITY
We implement appropriate security measures to protect your information:
- Encryption of sensitive data
- Secure payment processing
- Regular security audits
- Limited access to personal information

5. DATA RETENTION
We retain your information for as long as necessary to:
- Provide our services
- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

6. YOUR RIGHTS
You have the right to:
- Access your personal information
- Request correction of inaccurate data
- Request deletion of your data
- Opt-out of marketing communications
- File a complaint with relevant authorities

7. COOKIES AND TRACKING
We use cookies and similar technologies to:
- Improve website functionality
- Analyze usage patterns
- Provide personalized experiences
- Remember your preferences

8. THIRD-PARTY LINKS
Our website may contain links to third-party sites. We are not responsible for their privacy practices.

9. CHANGES TO THIS POLICY
We may update this privacy policy periodically. We will notify you of significant changes.

10. CONTACT US
For privacy-related questions, contact us at support@hospipalhealth.com

Last Updated: " . now()->format('F j, Y'),
                'last_updated' => now(),
            ]);
            $this->info('Privacy Policy updated');
        }

        // Update Booking Consent
        $consent = ConsentSetting::where('name', 'booking_consent')->first();
        if ($consent) {
            $consent->update([
                'content' => "BOOKING CONSENT AND AGREEMENT

1. SERVICE ACKNOWLEDGMENT
By booking a HospiPal service, you acknowledge that:
- You understand HospiPal provides non-medical companion support only
- Medical care remains the responsibility of hospital staff
- Companions are not qualified medical professionals
- You have the authority to book services for the patient

2. PATIENT CONSENT
You confirm that:
- The patient (or their legal guardian) has consented to companion services
- You have provided accurate patient information
- The patient is aware of the service scope and limitations
- Emergency contacts have been provided

3. SERVICE SCOPE
HospiPal companions will provide:
- Emotional support and companionship
- Assistance with non-medical tasks
- Communication support with family
- Basic comfort and care activities
- Monitoring and reporting of patient status

4. SERVICE LIMITATIONS
Companions will NOT:
- Provide medical care or treatment
- Administer medication
- Make medical decisions
- Perform nursing duties
- Give medical advice

5. EMERGENCY PROTOCOLS
In case of medical emergencies:
- Companions will immediately notify hospital staff
- They will follow hospital emergency procedures
- They will contact emergency contacts as needed
- They will document the incident

6. CANCELLATION AND REFUNDS
- Cancellations must be made at least 24 hours in advance
- Late cancellations may incur charges
- Refunds are processed according to our policy
- Emergency cancellations are handled case-by-case

7. LIABILITY AND INSURANCE
- HospiPal maintains appropriate insurance coverage
- Our liability is limited to companion services
- We are not liable for medical outcomes
- Patients remain under hospital care responsibility

8. CONFIDENTIALITY
- All patient information is confidential
- Information is shared only with authorized personnel
- We comply with privacy laws and regulations
- Patient dignity and privacy are respected

9. FEEDBACK AND COMPLAINTS
- We welcome feedback about our services
- Complaints are handled promptly and professionally
- Contact us at support@hospipalhealth.com
- We strive for continuous improvement

10. AGREEMENT
By proceeding with this booking, you agree to:
- These terms and conditions
- Our privacy policy
- Service scope and limitations
- Cancellation and refund policies

Last Updated: " . now()->format('F j, Y'),
                'last_updated' => now(),
            ]);
            $this->info('Booking Consent updated');
        }

        $this->info('All consent settings updated successfully!');
        return 0;
    }
}
