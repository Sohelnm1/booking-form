<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;

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
    Route::get('/consent', [BookingController::class, 'consent'])->name('consent');
    Route::get('/confirm', [BookingController::class, 'confirm'])->name('confirm');
    Route::post('/process', [BookingController::class, 'processBooking'])->name('process');
    Route::get('/success', [BookingController::class, 'success'])->name('success');
    Route::get('/payment-success', [BookingController::class, 'paymentSuccess'])->name('payment-success');
    Route::get('/payment-failed', [BookingController::class, 'paymentFailed'])->name('payment-failed');
    Route::get('/payment-cancelled', [BookingController::class, 'paymentCancelled'])->name('payment-cancelled');
    Route::get('/available-slots', [BookingController::class, 'getAvailableSlots'])->name('available-slots');
    Route::post('/send-otp', [BookingController::class, 'sendOtp'])->name('send-otp');
    Route::post('/verify-otp', [BookingController::class, 'verifyOtp'])->name('verify-otp');
    Route::post('/validate-coupon', [BookingController::class, 'validateCoupon'])->name('validate-coupon');
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
    
    // Extras routes
    Route::get('/admin/extras', [AdminController::class, 'extras'])->name('admin.extras');
    Route::post('/admin/extras', [AdminController::class, 'storeExtra'])->name('admin.extras.store');
    Route::put('/admin/extras/{id}', [AdminController::class, 'updateExtra'])->name('admin.extras.update');
    Route::patch('/admin/extras/{id}', [AdminController::class, 'updateExtra'])->name('admin.extras.patch');
    Route::post('/admin/extras/{id}/delete', [AdminController::class, 'deleteExtra'])->name('admin.extras.delete');

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

    Route::get('/admin/custom-fields', [AdminController::class, 'customFields'])->name('admin.custom-fields');
    Route::get('/admin/times', [AdminController::class, 'times'])->name('admin.times');
    Route::get('/admin/calendar', [AdminController::class, 'calendar'])->name('admin.calendar');
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::get('/admin/integration', [AdminController::class, 'integration'])->name('admin.integration');
    Route::post('/admin/integration/update', [AdminController::class, 'updateIntegration'])->name('admin.integration.update');
    Route::post('/admin/integration/test', [AdminController::class, 'testIntegration'])->name('admin.integration.test');
    Route::get('/admin/notification', [AdminController::class, 'notification'])->name('admin.notification');
});
