<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AdminController;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Customer routes
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
});

// Employee routes
Route::middleware(['auth', 'role:employee'])->group(function () {
    Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/appointments', [AdminController::class, 'appointments'])->name('admin.appointments');
    Route::get('/admin/employees', [AdminController::class, 'employees'])->name('admin.employees');
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
Route::post('/admin/forms', [AdminController::class, 'storeForm'])->name('admin.forms.store');
Route::put('/admin/forms/{id}', [AdminController::class, 'updateForm'])->name('admin.forms.update');
Route::patch('/admin/forms/{id}', [AdminController::class, 'updateForm'])->name('admin.forms.patch');
Route::post('/admin/forms/{id}/delete', [AdminController::class, 'deleteForm'])->name('admin.forms.delete');

// Form fields routes
Route::post('/admin/form-fields', [AdminController::class, 'storeFormField'])->name('admin.form-fields.store');
Route::put('/admin/form-fields/{id}', [AdminController::class, 'updateFormField'])->name('admin.form-fields.update');
Route::patch('/admin/form-fields/{id}', [AdminController::class, 'updateFormField'])->name('admin.form-fields.patch');
Route::post('/admin/form-fields/{id}/delete', [AdminController::class, 'deleteFormField'])->name('admin.form-fields.delete');
    Route::get('/admin/custom-fields', [AdminController::class, 'customFields'])->name('admin.custom-fields');
    Route::get('/admin/times', [AdminController::class, 'times'])->name('admin.times');
    Route::get('/admin/calendar', [AdminController::class, 'calendar'])->name('admin.calendar');
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::get('/admin/integration', [AdminController::class, 'integration'])->name('admin.integration');
    Route::get('/admin/notification', [AdminController::class, 'notification'])->name('admin.notification');
});
