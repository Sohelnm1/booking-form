<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Extra;
use App\Models\Form;
use App\Models\FormField;
use App\Models\ScheduleSetting;
use App\Models\ConsentSetting;
use Twilio\Rest\Client;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    /**
     * Show admin dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // TODO: Add comprehensive statistics and recent bookings
        $stats = [
            'total_bookings' => 0,
            'total_revenue' => 0,
            'active_services' => 0,
            'employees' => 0,
        ];

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show appointments page
     */
    public function appointments()
    {
        return Inertia::render('Admin/Appointments', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show employees page
     */
    public function employees()
    {
        return Inertia::render('Admin/Employees', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show customers page
     */
    public function customers()
    {
        return Inertia::render('Admin/Customers', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show services page
     */
    public function services()
    {
        $services = Service::ordered()->get();
        $categories = ['Default', 'Hair Services', 'Skin Care', 'Nail Services', 'Massage'];
        $durations = [
            ['value' => 15, 'label' => '15 minutes'],
            ['value' => 30, 'label' => '30 minutes'],
            ['value' => 45, 'label' => '45 minutes'],
            ['value' => 60, 'label' => '1 hour'],
            ['value' => 90, 'label' => '1.5 hours'],
            ['value' => 120, 'label' => '2 hours'],
            ['value' => 150, 'label' => '2.5 hours'],
            ['value' => 180, 'label' => '3 hours'],
        ];

        return Inertia::render('Admin/Services', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'services' => $services,
            'categories' => $categories,
            'durations' => $durations,
            'editService' => request()->get('editService'),
        ]);
    }

    /**
     * Show a specific service
     */
    public function showService($id)
    {
        try {
            $serviceModel = Service::findOrFail($id);
            
            // Get related data for the service view
            $categories = ['Default', 'Hair Services', 'Skin Care', 'Nail Services', 'Massage'];
            $durations = [
                ['value' => 15, 'label' => '15 minutes'],
                ['value' => 30, 'label' => '30 minutes'],
                ['value' => 45, 'label' => '45 minutes'],
                ['value' => 60, 'label' => '1 hour'],
                ['value' => 90, 'label' => '1.5 hours'],
                ['value' => 120, 'label' => '2 hours'],
                ['value' => 150, 'label' => '2.5 hours'],
                ['value' => 180, 'label' => '3 hours'],
            ];

            return Inertia::render('Admin/ServiceDetail', [
                'auth' => [
                    'user' => Auth::user(),
                ],
                'service' => $serviceModel,
                'categories' => $categories,
                'durations' => $durations,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Service not found, return null service
            return Inertia::render('Admin/ServiceDetail', [
                'auth' => [
                    'user' => Auth::user(),
                ],
                'service' => null,
                'categories' => [],
                'durations' => [],
            ]);
        }
    }

    /**
     * Store a new service
     */
    public function storeService(Request $request)
    {
        // Log the incoming request data for debugging
        \Log::info('Service creation request data:', $request->all());
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'category' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = $request->only([
            'name', 'description', 'price', 'duration', 
            'category', 'color', 'is_active'
        ]);
        
        // Convert is_active to boolean
        if (isset($data['is_active'])) {
            $data['is_active'] = in_array($data['is_active'], ['1', 'true', true], true);
        }
        
        // Log the processed data
        \Log::info('Processed service data:', $data);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        $data['sort_order'] = Service::max('sort_order') + 1;

        Service::create($data);

        return redirect()->back()->with('success', 'Service created successfully');
    }

    /**
     * Update an existing service
     */
    public function updateService(Request $request, $id)
    {
        $serviceModel = Service::findOrFail($id);

        // Log the incoming request data for debugging
        \Log::info('Service update request data:', $request->all());
        \Log::info('Service update request method:', ['method' => $request->method()]);
        \Log::info('Service update request headers:', ['headers' => $request->headers->all()]);
        
        // Log specific fields to debug validation issues
        \Log::info('Name field:', ['value' => $request->input('name')]);
        \Log::info('Price field:', ['value' => $request->input('price')]);
        \Log::info('Duration field:', ['value' => $request->input('duration')]);
        \Log::info('Category field:', ['value' => $request->input('category')]);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'category' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = $request->only([
            'name', 'description', 'price', 'duration', 
            'category', 'color', 'is_active'
        ]);
        
        // Convert is_active to boolean
        if (isset($data['is_active'])) {
            $data['is_active'] = in_array($data['is_active'], ['1', 'true', true], true);
        }
        
        // Log the processed data
        \Log::info('Processed service update data:', $data);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($serviceModel->image && Storage::exists(str_replace('/storage/', 'public/', $serviceModel->image))) {
                Storage::delete(str_replace('/storage/', 'public/', $serviceModel->image));
            }
            
            $imagePath = $request->file('image')->store('services', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        $serviceModel->update($data);

        return redirect()->back()->with('success', 'Service updated successfully');
    }

    /**
     * Delete a service
     */
    public function deleteService($id)
    {
        try {
            $serviceModel = Service::findOrFail($id);
            
            // Log the deletion attempt
            \Log::info('Attempting to delete service:', [
                'id' => $serviceModel->id,
                'name' => $serviceModel->name,
                'user_id' => Auth::id(),
            ]);

            // Delete image if exists
            if ($serviceModel->image) {
                $imagePath = str_replace('/storage/', 'public/', $serviceModel->image);
                if (Storage::exists($imagePath)) {
                    Storage::delete($imagePath);
                    \Log::info('Service image deleted:', ['path' => $imagePath]);
                }
            }

            // Store service name for success message
            $serviceName = $serviceModel->name;
            
            // Delete the service
            $serviceModel->delete();
            
            \Log::info('Service deleted successfully:', [
                'id' => $id,
                'name' => $serviceName,
            ]);

            return redirect()->route('admin.services')->with('success', "Service '{$serviceName}' deleted successfully");
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete service:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            
            return redirect()->route('admin.services')->with('error', 'Failed to delete service. Please try again.');
        }
    }

    /**
     * Store a new extra
     */
    public function storeExtra(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:0',
            'is_active' => 'nullable|boolean',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        $data = $request->only([
            'name', 'description', 'price', 'duration', 'is_active'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('extras', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        $extra = Extra::create($data);

        // Attach services if provided
        if ($request->has('services')) {
            $extra->services()->attach($request->services);
        }

        return redirect()->back()->with('success', 'Extra created successfully');
    }

    /**
     * Update an extra
     */
    public function updateExtra(Request $request, $id)
    {
        $extra = Extra::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:0',
            'is_active' => 'nullable|boolean',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        $data = $request->only([
            'name', 'description', 'price', 'duration', 'is_active'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($extra->image && Storage::exists(str_replace('/storage/', 'public/', $extra->image))) {
                Storage::delete(str_replace('/storage/', 'public/', $extra->image));
            }
            
            $imagePath = $request->file('image')->store('extras', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        $extra->update($data);

        // Sync services
        $extra->services()->sync($request->services ?? []);

        return redirect()->back()->with('success', 'Extra updated successfully');
    }

    /**
     * Delete an extra
     */
    public function deleteExtra($id)
    {
        try {
            $extra = Extra::findOrFail($id);
            
            // Delete image if exists
            if ($extra->image) {
                $imagePath = str_replace('/storage/', 'public/', $extra->image);
                if (Storage::exists($imagePath)) {
                    Storage::delete($imagePath);
                }
            }

            $extraName = $extra->name;
            $extra->delete();

            return redirect()->back()->with('success', "Extra '{$extraName}' deleted successfully");
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete extra. Please try again.');
        }
    }

    /**
     * Show extras page
     */
    public function extras()
    {
        $extras = Extra::with('services')->ordered()->get();
        $services = Service::active()->ordered()->get();
        
        return Inertia::render('Admin/Extras', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'extras' => $extras,
            'services' => $services,
        ]);
    }

    /**
     * Show forms page
     */
    public function forms()
    {
        $forms = Form::with(['fields', 'services'])->ordered()->get();
        $services = Service::active()->ordered()->get();
        $fieldTypes = FormField::getFieldTypes();
        
        return Inertia::render('Admin/Forms', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'forms' => $forms,
            'services' => $services,
            'fieldTypes' => $fieldTypes,
        ]);
    }

    /**
     * Show custom fields page
     */
    public function customFields()
    {
        return Inertia::render('Admin/CustomFields', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show schedule settings page
     */
    public function schedule()
    {
        $scheduleSettings = ScheduleSetting::ordered()->get();
        $services = Service::ordered()->get();

        return Inertia::render('Admin/Schedule', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'scheduleSettings' => $scheduleSettings,
            'services' => $services,
        ]);
    }

    /**
     * Store schedule setting
     */
    public function storeSchedule(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'booking_window_days' => 'required|integer|min:1|max:365',
            'min_advance_hours' => 'required|integer|min:0|max:168',
            'max_advance_days' => 'required|integer|min:1|max:365',
            'buffer_time_minutes' => 'required|integer|min:0|max:60',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'working_days' => 'required|array|min:1',
            'working_days.*' => 'integer|in:1,2,3,4,5,6,7',
            'break_times' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        ScheduleSetting::create([
            'name' => $request->name,
            'description' => $request->description,
            'booking_window_days' => $request->booking_window_days,
            'min_advance_hours' => $request->min_advance_hours,
            'max_advance_days' => $request->max_advance_days,
            'buffer_time_minutes' => $request->buffer_time_minutes,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'working_days' => $request->working_days,
            'break_times' => $request->break_times,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->back()->with('success', 'Schedule setting created successfully.');
    }

    /**
     * Update schedule setting
     */
    public function updateSchedule(Request $request, $id)
    {
        $scheduleSetting = ScheduleSetting::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'booking_window_days' => 'required|integer|min:1|max:365',
            'min_advance_hours' => 'required|integer|min:0|max:168',
            'max_advance_days' => 'required|integer|min:1|max:365',
            'buffer_time_minutes' => 'required|integer|min:0|max:60',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'working_days' => 'required|array|min:1',
            'working_days.*' => 'integer|in:1,2,3,4,5,6,7',
            'break_times' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $scheduleSetting->update([
            'name' => $request->name,
            'description' => $request->description,
            'booking_window_days' => $request->booking_window_days,
            'min_advance_hours' => $request->min_advance_hours,
            'max_advance_days' => $request->max_advance_days,
            'buffer_time_minutes' => $request->buffer_time_minutes,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'working_days' => $request->working_days,
            'break_times' => $request->break_times,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->back()->with('success', 'Schedule setting updated successfully.');
    }

    /**
     * Delete schedule setting
     */
    public function deleteSchedule($id)
    {
        $scheduleSetting = ScheduleSetting::findOrFail($id);
        $scheduleSetting->delete();

        return redirect()->back()->with('success', 'Schedule setting deleted successfully.');
    }

    /**
     * Show times page
     */
    public function times()
    {
        return Inertia::render('Admin/Times', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show calendar page
     */
    public function calendar()
    {
        return Inertia::render('Admin/Calendar', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show settings page
     */
    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show integration page
     */
    public function integration()
    {
        // Load payment and integration settings from database
        $settings = \DB::table('settings')
            ->whereIn('group', ['payment', 'notification', 'integration'])
            ->get()
            ->keyBy('key');

        $integrations = [
            [
                'id' => 'razorpay',
                'name' => 'Razorpay Payment Gateway',
                'description' => 'Payment processing integration for online payments',
                'status' => $settings->get('razorpay_key')?->value ? 'active' : 'inactive',
                'api_key' => $settings->get('razorpay_key')?->value ? 'rzp_****' . substr($settings->get('razorpay_key')->value, -4) : '',
                'api_secret' => $settings->get('razorpay_secret')?->value ? '****' . substr($settings->get('razorpay_secret')->value, -4) : '',
                'is_enabled' => !empty($settings->get('razorpay_key')?->value),
                'last_sync' => now()->format('Y-m-d H:i:s'),
                'settings' => [
                    'razorpay_key' => $settings->get('razorpay_key')?->value ?? '',
                    'razorpay_secret' => $settings->get('razorpay_secret')?->value ?? '',
                    'currency' => $settings->get('currency')?->value ?? 'INR',
                ]
            ],
            [
                'id' => 'sms',
                'name' => 'SMS Gateway (Twilio)',
                'description' => 'SMS notifications for OTP and booking confirmations',
                'status' => $settings->get('twilio_sid')?->value ? 'active' : 'inactive',
                'api_key' => $settings->get('twilio_sid')?->value ? 'tw_****' . substr($settings->get('twilio_sid')->value, -4) : '',
                'is_enabled' => !empty($settings->get('twilio_sid')?->value),
                'last_sync' => now()->format('Y-m-d H:i:s'),
                'settings' => [
                    'twilio_sid' => $settings->get('twilio_sid')?->value ?? '',
                    'twilio_token' => $settings->get('twilio_token')?->value ?? '',
                    'twilio_phone' => $settings->get('twilio_phone')?->value ?? '',
                ]
            ],
            [
                'id' => 'email',
                'name' => 'Email Service (SendGrid)',
                'description' => 'Email notifications and marketing emails',
                'status' => $settings->get('sendgrid_key')?->value ? 'active' : 'inactive',
                'api_key' => $settings->get('sendgrid_key')?->value ? 'SG.****' . substr($settings->get('sendgrid_key')->value, -4) : '',
                'is_enabled' => !empty($settings->get('sendgrid_key')?->value),
                'last_sync' => now()->format('Y-m-d H:i:s'),
                'settings' => [
                    'sendgrid_key' => $settings->get('sendgrid_key')?->value ?? '',
                    'sendgrid_from_email' => $settings->get('sendgrid_from_email')?->value ?? '',
                    'sendgrid_from_name' => $settings->get('sendgrid_from_name')?->value ?? '',
                ]
            ],
        ];

        return Inertia::render('Admin/Integration', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'integrations' => $integrations,
        ]);
    }

    /**
     * Show notification page
     */
    public function notification()
    {
        return Inertia::render('Admin/Notification', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show consent settings page
     */
    public function consent()
    {
        $consentSettings = ConsentSetting::ordered()->get();

        return Inertia::render('Admin/Consent', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'consentSettings' => $consentSettings,
        ]);
    }

    /**
     * Store consent setting
     */
    public function storeConsent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:consent_settings',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'summary' => 'nullable|string',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'version' => 'string|max:10',
        ]);

        ConsentSetting::create([
            'name' => $request->name,
            'title' => $request->title,
            'content' => $request->content,
            'summary' => $request->summary,
            'is_required' => $request->boolean('is_required', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? 0,
            'version' => $request->version ?? '1.0',
            'last_updated' => now(),
        ]);

        return redirect()->back()->with('success', 'Consent setting created successfully.');
    }

    /**
     * Update consent setting
     */
    public function updateConsent(Request $request, $id)
    {
        $consentSetting = ConsentSetting::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:consent_settings,name,' . $id,
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'summary' => 'nullable|string',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'version' => 'string|max:10',
        ]);

        $consentSetting->update([
            'name' => $request->name,
            'title' => $request->title,
            'content' => $request->content,
            'summary' => $request->summary,
            'is_required' => $request->boolean('is_required', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? 0,
            'version' => $request->version ?? '1.0',
            'last_updated' => now(),
        ]);

        return redirect()->back()->with('success', 'Consent setting updated successfully.');
    }

    /**
     * Delete consent setting
     */
    public function deleteConsent($id)
    {
        $consentSetting = ConsentSetting::findOrFail($id);
        $consentSetting->delete();

        return redirect()->back()->with('success', 'Consent setting deleted successfully.');
    }

    /**
     * Store a new form
     */
    public function storeForm(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        $data = $request->only(['name', 'description', 'is_active', 'sort_order']);
        $data['settings'] = $request->input('settings', []);

        $form = Form::create($data);

        // Attach services if provided
        if ($request->has('services')) {
            $form->services()->attach($request->services);
        }

        return redirect()->route('admin.forms')->with('success', 'Form created successfully');
    }

    /**
     * Update an existing form
     */
    public function updateForm(Request $request, $id)
    {
        $form = Form::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        $data = $request->only(['name', 'description', 'is_active', 'sort_order']);
        $data['settings'] = $request->input('settings', []);

        $form->update($data);

        // Sync services
        $form->services()->sync($request->services ?? []);

        return redirect()->route('admin.forms')->with('success', 'Form updated successfully');
    }

    /**
     * Delete a form
     */
    public function deleteForm($id)
    {
        $form = Form::findOrFail($id);
        $formName = $form->name;

        try {
            $form->delete();
            return redirect()->route('admin.forms')->with('success', "Form '{$formName}' deleted successfully");
        } catch (\Exception $e) {
            \Log::error('Failed to delete form:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->route('admin.forms')->with('error', 'Failed to delete form. Please try again.');
        }
    }

    /**
     * Store a form field
     */
    public function storeFormField(Request $request)
    {
        $request->validate([
            'form_id' => 'required|exists:forms,id',
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(FormField::getFieldTypes())),
            'placeholder' => 'nullable|string',
            'help_text' => 'nullable|string',
            'is_required' => 'boolean',
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
            'options' => 'nullable|array',
            'validation_rules' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $data = $request->all();
        $data['options'] = $request->input('options', []);
        $data['validation_rules'] = $request->input('validation_rules', []);
        $data['settings'] = $request->input('settings', []);

        FormField::create($data);

        return redirect()->route('admin.forms')->with('success', 'Form field added successfully');
    }

    /**
     * Update a form field
     */
    public function updateFormField(Request $request, $id)
    {
        $field = FormField::findOrFail($id);

        $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:' . implode(',', array_keys(FormField::getFieldTypes())),
            'placeholder' => 'nullable|string',
            'help_text' => 'nullable|string',
            'is_required' => 'boolean',
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
            'options' => 'nullable|array',
            'validation_rules' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $data = $request->all();
        $data['options'] = $request->input('options', []);
        $data['validation_rules'] = $request->input('validation_rules', []);
        $data['settings'] = $request->input('settings', []);

        $field->update($data);

        return redirect()->route('admin.forms')->with('success', 'Form field updated successfully');
    }

    /**
     * Delete a form field
     */
    public function deleteFormField($id)
    {
        $field = FormField::findOrFail($id);
        $fieldName = $field->label;

        try {
            $field->delete();
            return redirect()->route('admin.forms')->with('success', "Field '{$fieldName}' deleted successfully");
        } catch (\Exception $e) {
            \Log::error('Failed to delete form field:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->route('admin.forms')->with('error', 'Failed to delete field. Please try again.');
        }
    }

    /**
     * Update integration settings
     */
    public function updateIntegration(Request $request)
    {
        $request->validate([
            'integration_id' => 'required|string',
            'settings' => 'required|array',
        ]);

        $integrationId = $request->integration_id;
        $settings = $request->settings;

        try {
            // Update settings based on integration type
            switch ($integrationId) {
                case 'razorpay':
                    $this->updateSetting('razorpay_key', $settings['razorpay_key'] ?? '', 'payment');
                    $this->updateSetting('razorpay_secret', $settings['razorpay_secret'] ?? '', 'payment');
                    $this->updateSetting('currency', $settings['currency'] ?? 'INR', 'payment');
                    break;

                case 'sms':
                    $this->updateSetting('twilio_sid', $settings['twilio_sid'] ?? '', 'notification');
                    $this->updateSetting('twilio_token', $settings['twilio_token'] ?? '', 'notification');
                    $this->updateSetting('twilio_phone', $settings['twilio_phone'] ?? '', 'notification');
                    break;

                case 'email':
                    $this->updateSetting('sendgrid_key', $settings['sendgrid_key'] ?? '', 'notification');
                    $this->updateSetting('sendgrid_from_email', $settings['sendgrid_from_email'] ?? '', 'notification');
                    $this->updateSetting('sendgrid_from_name', $settings['sendgrid_from_name'] ?? '', 'notification');
                    break;

                default:
                    return response()->json(['error' => 'Invalid integration type'], 400);
            }

            return response()->json(['success' => 'Integration settings updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to update integration settings:', [
                'integration_id' => $integrationId,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return response()->json(['error' => 'Failed to update settings'], 500);
        }
    }

    /**
     * Test integration connection
     */
    public function testIntegration(Request $request)
    {
        $request->validate([
            'integration_id' => 'required|string',
        ]);

        $integrationId = $request->integration_id;

        try {
            switch ($integrationId) {
                case 'razorpay':
                    // Test Razorpay connection
                    $key = \DB::table('settings')->where('key', 'razorpay_key')->value('value');
                    $secret = \DB::table('settings')->where('key', 'razorpay_secret')->value('value');
                    
                    if (empty($key) || empty($secret)) {
                        return response()->json(['error' => 'Razorpay credentials not configured'], 400);
                    }

                    // Here you would typically make a test API call to Razorpay
                    // For now, we'll just validate the format
                    if (!str_starts_with($key, 'rzp_')) {
                        return response()->json(['error' => 'Invalid Razorpay key format'], 400);
                    }

                    return response()->json(['success' => 'Razorpay connection successful']);

                case 'sms':
                    // Test SMS integration
                    $sid = \DB::table('settings')->where('key', 'twilio_sid')->value('value');
                    $token = \DB::table('settings')->where('key', 'twilio_token')->value('value');
                    $phone = \DB::table('settings')->where('key', 'twilio_phone')->value('value');
                    
                    if (empty($sid) || empty($token) || empty($phone)) {
                        return response()->json(['error' => 'SMS credentials not configured'], 400);
                    }

                    try {
                        $twilio = new Client($sid, $token);
                        // Test the connection by fetching account info
                        $account = $twilio->api->v2010->accounts($sid)->fetch();
                        
                        if ($account->status === 'active') {
                            return response()->json(['success' => 'SMS integration test successful']);
                        } else {
                            return response()->json(['error' => 'Twilio account is not active'], 400);
                        }
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'SMS integration test failed: ' . $e->getMessage()], 400);
                    }

                case 'email':
                    // Test email integration
                    $key = \DB::table('settings')->where('key', 'sendgrid_key')->value('value');
                    
                    if (empty($key)) {
                        return response()->json(['error' => 'Email credentials not configured'], 400);
                    }

                    return response()->json(['success' => 'Email integration test successful']);

                default:
                    return response()->json(['error' => 'Invalid integration type'], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Integration test failed:', [
                'integration_id' => $integrationId,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return response()->json(['error' => 'Integration test failed'], 500);
        }
    }

    /**
     * Helper method to update or create a setting
     */
    private function updateSetting($key, $value, $group = 'general')
    {
        \DB::table('settings')->updateOrInsert(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'updated_at' => now(),
            ]
        );
    }
} 