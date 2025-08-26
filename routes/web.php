<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\InvoiceController;

// Public routes
Route::get('/', [AuthController::class, 'showCustomerDashboard'])->name('welcome');

// Test CSRF route
Route::post('/test-csrf', function () {
    return response()->json(['success' => 'CSRF token is valid']);
})->name('test-csrf');

// Booking routes
Route::prefix('booking')->name('booking.')->group(function () {
    Route::get('/select-service', [BookingController::class, 'selectService'])->name('select-service');
    Route::get('/select-extras', [BookingController::class, 'selectExtras'])->name('select-extras');
    Route::get('/select-datetime', [BookingController::class, 'selectDateTime'])->name('select-datetime');
    Route::post('/store-extra-quantities', [BookingController::class, 'storeExtraQuantities'])->name('store-extra-quantities');
    Route::get('/consent', [BookingController::class, 'consent'])->name('consent');
    Route::get('/confirm', [BookingController::class, 'confirm'])->name('confirm');
    Route::post('/process', [BookingController::class, 'processBooking'])->name('process');
    Route::get('/success', [BookingController::class, 'success'])->name('success');
    Route::get('/payment-success', [BookingController::class, 'paymentSuccess'])->name('payment-success');
    Route::get('/payment-failed', [BookingController::class, 'paymentFailed'])->name('payment-failed');
    Route::get('/payment-cancelled', [BookingController::class, 'paymentCancelled'])->name('payment-cancelled');
    Route::match(['GET', 'POST'], '/available-slots', [BookingController::class, 'getAvailableSlots'])->name('available-slots');
    Route::post('/send-otp', [BookingController::class, 'sendOtp'])->name('send-otp');
    Route::post('/verify-otp', [BookingController::class, 'verifyOtp'])->name('verify-otp');
    Route::post('/validate-coupon', [BookingController::class, 'validateCoupon'])->name('validate-coupon');
    Route::post('/calculate-distance', [BookingController::class, 'calculateDistance'])->name('calculate-distance');
    Route::post('/calculate-extra-charges', [BookingController::class, 'calculateExtraCharges'])->name('calculate-extra-charges');
});

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/customer-login', [AuthController::class, 'customerLogin'])->name('customer.login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Customer routes
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
    Route::get('/customer/bookings', [CustomerController::class, 'bookings'])->name('customer.bookings');
    Route::get('/customer/bookings/{id}', [CustomerController::class, 'showBooking'])->name('customer.bookings.show');
    
    // Booking management routes
    Route::post('/customer/bookings/{id}/cancel', [CustomerController::class, 'cancelBooking'])->name('customer.bookings.cancel');
    Route::post('/customer/bookings/{id}/reschedule', [CustomerController::class, 'rescheduleBooking'])->name('customer.bookings.reschedule');
    Route::get('/customer/bookings/{id}/policy', [CustomerController::class, 'getBookingPolicy'])->name('customer.bookings.policy');
    
    // Reschedule payment routes
    Route::post('/customer/reschedule/payment-success', [CustomerController::class, 'reschedulePaymentSuccess'])->name('customer.reschedule.payment-success');
    Route::post('/customer/reschedule/payment-failed', [CustomerController::class, 'reschedulePaymentFailed'])->name('customer.reschedule.payment-failed');
    
    // Invoice routes
    Route::get('/customer/invoices', [InvoiceController::class, 'customerIndex'])->name('customer.invoices');
    Route::get('/customer/invoices/{id}', [InvoiceController::class, 'show'])->name('customer.invoices.show');
    Route::get('/customer/invoices/{id}/download', [InvoiceController::class, 'downloadPdf'])->name('customer.invoices.download');
});

// Employee routes
Route::middleware(['auth', 'role:employee'])->group(function () {
    Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/appointments', [AdminController::class, 'appointments'])->name('admin.appointments');
    Route::get('/admin/appointments/{id}/pdf', [AdminController::class, 'downloadAppointmentPdf'])->name('admin.appointments.pdf');
    Route::get('/admin/appointments/export-excel', [AdminController::class, 'exportAppointmentsExcel'])->name('admin.appointments.excel');
    Route::get('/admin/appointments/{id}/policy', [AdminController::class, 'getBookingPolicy'])->name('admin.appointments.policy');
    Route::post('/admin/appointments/{id}/cancel', [AdminController::class, 'cancelBooking'])->name('admin.appointments.cancel');
    Route::post('/admin/appointments/{id}/refund', [AdminController::class, 'processRefund'])->name('admin.appointments.refund');
    Route::get('/admin/appointments/{id}/refund-details', [AdminController::class, 'getRefundDetails'])->name('admin.appointments.refund-details');
    Route::get('/admin/refunds', [AdminController::class, 'refunds'])->name('admin.refunds');
    Route::get('/admin/employees', [AdminController::class, 'employees'])->name('admin.employees');
    Route::post('/admin/employees', [AdminController::class, 'storeEmployee'])->name('admin.employees.store');
    Route::put('/admin/employees/{id}', [AdminController::class, 'updateEmployee'])->name('admin.employees.update');
    Route::patch('/admin/employees/{id}', [AdminController::class, 'updateEmployee'])->name('admin.employees.patch');
    Route::post('/admin/employees/{id}/delete', [AdminController::class, 'deleteEmployee'])->name('admin.employees.delete');
    Route::get('/admin/customers', [AdminController::class, 'customers'])->name('admin.customers');
    
    // Services routes
    Route::get('/admin/services', [AdminController::class, 'services'])->name('admin.services');
    Route::post('/admin/services', [AdminController::class, 'storeService'])->name('admin.services.store');
    Route::get('/admin/services/{id}', [AdminController::class, 'showService'])->name('admin.services.show');
    Route::put('/admin/services/{id}', [AdminController::class, 'updateService'])->name('admin.services.update');
    Route::patch('/admin/services/{id}', [AdminController::class, 'updateService'])->name('admin.services.patch');
    Route::post('/admin/services/{id}/delete', [AdminController::class, 'deleteService'])->name('admin.services.delete');
Route::put('/admin/services/{id}/update-sort-order', [AdminController::class, 'updateServiceSortOrder'])->name('admin.services.update-sort-order');
    
    // Pricing tiers routes
    Route::post('/admin/pricing-tiers', [AdminController::class, 'storePricingTier'])->name('admin.pricing-tiers.store');
    Route::put('/admin/pricing-tiers/{id}', [AdminController::class, 'updatePricingTier'])->name('admin.pricing-tiers.update');
    Route::patch('/admin/pricing-tiers/{id}', [AdminController::class, 'updatePricingTier'])->name('admin.pricing-tiers.patch');
    Route::post('/admin/pricing-tiers/{id}/delete', [AdminController::class, 'deletePricingTier'])->name('admin.pricing-tiers.delete');
    Route::put('/admin/pricing-tiers/{id}/update-sort-order', [AdminController::class, 'updatePricingTierSortOrder'])->name('admin.pricing-tiers.update-sort-order');
    
    // Extras routes
    Route::get('/admin/extras', [AdminController::class, 'extras'])->name('admin.extras');
    Route::post('/admin/extras', [AdminController::class, 'storeExtra'])->name('admin.extras.store');
    Route::put('/admin/extras/{id}', [AdminController::class, 'updateExtra'])->name('admin.extras.update');
    Route::patch('/admin/extras/{id}', [AdminController::class, 'updateExtra'])->name('admin.extras.patch');
    Route::post('/admin/extras/{id}/delete', [AdminController::class, 'deleteExtra'])->name('admin.extras.delete');
Route::put('/admin/extras/{id}/update-sort-order', [AdminController::class, 'updateExtraSortOrder'])->name('admin.extras.update-sort-order');

    // Durations routes
    Route::get('/admin/durations', [AdminController::class, 'durations'])->name('admin.durations');
    Route::get('/admin/durations/{id}', [AdminController::class, 'showDuration'])->name('admin.durations.show');
    Route::post('/admin/durations', [AdminController::class, 'storeDuration'])->name('admin.durations.store');
    Route::put('/admin/durations/{id}', [AdminController::class, 'updateDuration'])->name('admin.durations.update');
    Route::patch('/admin/durations/{id}', [AdminController::class, 'updateDuration'])->name('admin.durations.patch');
    Route::post('/admin/durations/{id}/delete', [AdminController::class, 'deleteDuration'])->name('admin.durations.delete');

    // Booking settings routes
    Route::get('/admin/booking-settings', [AdminController::class, 'bookingSettings'])->name('admin.booking-settings');
    Route::post('/admin/booking-settings', [AdminController::class, 'updateBookingSettings'])->name('admin.booking-settings.update');

    // Forms routes
    Route::get('/admin/forms', [AdminController::class, 'forms'])->name('admin.forms');

    // Form fields routes
    Route::post('/admin/form-fields', [AdminController::class, 'storeFormField'])->name('admin.form-fields.store');
    Route::put('/admin/form-fields/{id}', [AdminController::class, 'updateFormField'])->name('admin.form-fields.update');
    Route::patch('/admin/form-fields/{id}', [AdminController::class, 'updateFormField'])->name('admin.form-fields.patch');
    Route::post('/admin/form-fields/{id}/delete', [AdminController::class, 'deleteFormField'])->name('admin.form-fields.delete');

    // Schedule settings routes
    Route::get('/admin/schedule', [AdminController::class, 'schedule'])->name('admin.schedule');
    Route::post('/admin/schedule', [AdminController::class, 'storeSchedule'])->name('admin.schedule.store');
    Route::put('/admin/schedule/{id}', [AdminController::class, 'updateSchedule'])->name('admin.schedule.update');
    Route::patch('/admin/schedule/{id}', [AdminController::class, 'updateSchedule'])->name('admin.schedule.patch');
    Route::post('/admin/schedule/{id}/delete', [AdminController::class, 'deleteSchedule'])->name('admin.schedule.delete');

    // Consent settings routes
    Route::get('/admin/consent', [AdminController::class, 'consent'])->name('admin.consent');
    Route::post('/admin/consent', [AdminController::class, 'storeConsent'])->name('admin.consent.store');
    Route::put('/admin/consent/{id}', [AdminController::class, 'updateConsent'])->name('admin.consent.update');
    Route::patch('/admin/consent/{id}', [AdminController::class, 'updateConsent'])->name('admin.consent.patch');
    Route::post('/admin/consent/{id}/delete', [AdminController::class, 'deleteConsent'])->name('admin.consent.delete');

    // Coupons routes
    Route::get('/admin/coupons', [AdminController::class, 'coupons'])->name('admin.coupons');
    Route::post('/admin/coupons', [AdminController::class, 'storeCoupon'])->name('admin.coupons.store');
    Route::put('/admin/coupons/{id}', [AdminController::class, 'updateCoupon'])->name('admin.coupons.update');
    Route::patch('/admin/coupons/{id}', [AdminController::class, 'updateCoupon'])->name('admin.coupons.patch');
    Route::post('/admin/coupons/{id}/delete', [AdminController::class, 'deleteCoupon'])->name('admin.coupons.delete');

    // Booking policies routes
    Route::get('/admin/booking-policies', [AdminController::class, 'bookingPolicies'])->name('admin.booking-policies');
    Route::post('/admin/booking-policies', [AdminController::class, 'storeBookingPolicy'])->name('admin.booking-policies.store');
    Route::put('/admin/booking-policies/{id}', [AdminController::class, 'updateBookingPolicy'])->name('admin.booking-policies.update');
    Route::patch('/admin/booking-policies/{id}', [AdminController::class, 'updateBookingPolicy'])->name('admin.booking-policies.patch');
    Route::post('/admin/booking-policies/{id}/delete', [AdminController::class, 'deleteBookingPolicy'])->name('admin.booking-policies.delete');

    // Dynamic slots routes
    Route::get('/admin/dynamic-slots', [AdminController::class, 'dynamicSlots'])->name('admin.dynamic-slots');
    Route::post('/admin/dynamic-slots', [AdminController::class, 'storeDynamicSlot'])->name('admin.dynamic-slots.store');
    Route::put('/admin/dynamic-slots/{id}', [AdminController::class, 'updateDynamicSlot'])->name('admin.dynamic-slots.update');
    Route::patch('/admin/dynamic-slots/{id}', [AdminController::class, 'updateDynamicSlot'])->name('admin.dynamic-slots.patch');
    Route::post('/admin/dynamic-slots/{id}/delete', [AdminController::class, 'deleteDynamicSlot'])->name('admin.dynamic-slots.delete');
    Route::put('/admin/dynamic-slots/{id}/update-sort-order', [AdminController::class, 'updateDynamicSlotSortOrder'])->name('admin.dynamic-slots.update-sort-order');

    Route::get('/admin/custom-fields', [AdminController::class, 'customFields'])->name('admin.custom-fields');
    Route::get('/admin/times', [AdminController::class, 'times'])->name('admin.times');
    Route::get('/admin/calendar', [AdminController::class, 'calendar'])->name('admin.calendar');
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::get('/admin/integration', [AdminController::class, 'integration'])->name('admin.integration');
    Route::post('/admin/integration/update', [AdminController::class, 'updateIntegration'])->name('admin.integration.update');
    Route::post('/admin/integration/test', [AdminController::class, 'testIntegration'])->name('admin.integration.test');
    Route::get('/admin/notification', [AdminController::class, 'notification'])->name('admin.notification');
    
    // Invoice routes
    Route::get('/admin/invoices', [InvoiceController::class, 'adminIndex'])->name('admin.invoices');
    Route::get('/admin/invoices/{id}', [InvoiceController::class, 'show'])->name('admin.invoices.show');
    Route::get('/admin/invoices/{id}/download', [InvoiceController::class, 'adminDownloadPdf'])->name('admin.invoices.download');
    Route::post('/admin/invoices/{id}/send-email', [InvoiceController::class, 'sendEmail'])->name('admin.invoices.send-email');
    Route::post('/admin/invoices/{id}/mark-paid', [InvoiceController::class, 'markAsPaid'])->name('admin.invoices.mark-paid');
    Route::post('/admin/invoices/{id}/mark-cancelled', [InvoiceController::class, 'markAsCancelled'])->name('admin.invoices.mark-cancelled');
    Route::get('/admin/invoices/stats', [InvoiceController::class, 'getStats'])->name('admin.invoices.stats');
    Route::get('/admin/invoices/search', [InvoiceController::class, 'search'])->name('admin.invoices.search');
});

// Public PDF download routes
Route::get('/pdf/terms-conditions', [App\Http\Controllers\PdfController::class, 'termsConditions'])->name('pdf.terms-conditions');
Route::get('/pdf/privacy-policy', [App\Http\Controllers\PdfController::class, 'privacyPolicy'])->name('pdf.privacy-policy');
Route::get('/pdf/booking-consent', [App\Http\Controllers\PdfController::class, 'bookingConsent'])->name('pdf.booking-consent');

// Test route for debugging
Route::get('/test-pdf', function() {
    return response()->json(['message' => 'PDF route test successful']);
});

// Simple PDF test route
Route::get('/test-pdf-simple', function() {
    try {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.legal-document', [
            'title' => 'Test Document',
            'content' => 'This is a test PDF document.',
            'version' => '1.0',
            'last_updated' => now(),
            'company' => 'HospiPal Health LLP',
            'document_type' => 'Test'
        ]);
        return $pdf->download('test.pdf');
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});


