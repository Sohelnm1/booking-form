<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Extra;
use App\Models\ConsentSetting;
use App\Models\ScheduleSetting;
use App\Models\Form;
use App\Models\FormField;
use App\Models\Booking;
use App\Models\User;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\BookingSetting;
use App\Models\ServicePricingTier;
use App\Services\RazorpayService;
use Illuminate\Support\Str;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Show service selection page
     */
    public function selectService()
    {
        // Only show services that are active and not upcoming (bookable services)
        $services = Service::availableForBooking()->with('pricingTiers')->ordered()->get();
        
        // Also get upcoming services to display separately
        $upcomingServices = Service::upcoming()->active()->with('pricingTiers')->ordered()->get();
        
        // Add duration labels to services only (not pricing tiers)
        $servicesWithDurationLabels = $services->map(function($service) {
            $serviceData = $service->toArray();
            $serviceData['duration_label'] = $service->getDurationLabel();
            return $serviceData;
        });
        
        $upcomingServicesWithDurationLabels = $upcomingServices->map(function($service) {
            $serviceData = $service->toArray();
            $serviceData['duration_label'] = $service->getDurationLabel();
            return $serviceData;
        });
        
        return Inertia::render('Booking/SelectService', [
            'services' => $servicesWithDurationLabels,
            'upcomingServices' => $upcomingServicesWithDurationLabels,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show extras selection page
     */
    public function selectExtras(Request $request)
    {
        $serviceId = $request->query('service_id');
        $pricingTierId = $request->query('pricing_tier_id');
        $selectedDuration = $request->query('selected_duration');
        $selectedPrice = $request->query('selected_price');
        
        $service = Service::findOrFail($serviceId);
        
        // If pricing tier is selected, get the tier details
        $selectedPricingTier = null;
        if ($pricingTierId) {
            $selectedPricingTier = ServicePricingTier::find($pricingTierId);
        }
        
        // Load extras with durationRelation using a different approach
        $extras = Extra::whereHas('services', function($query) use ($serviceId) {
            $query->where('services.id', $serviceId);
        })
        ->with(['durationRelation', 'services'])
        ->where('extras.is_active', true)
        ->ordered()
        ->get();

        // Manually load duration data to ensure it's available
        $extrasWithDuration = $extras->map(function($extra) {
            $extraData = $extra->toArray();
            if ($extra->durationRelation) {
                $extraData['durationRelation'] = [
                    'id' => $extra->durationRelation->id,
                    'label' => $extra->durationRelation->label,
                    'hours' => $extra->durationRelation->hours,
                    'minutes' => $extra->durationRelation->minutes,
                    'calculated_total_minutes' => ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes,
                ];
            } else {
                $extraData['durationRelation'] = null;
            }
            // Ensure max_quantity is included
            $extraData['max_quantity'] = $extra->max_quantity ?? 5;
            return $extraData;
        });
        
        // Debug logging
        \Log::info('SelectExtras - Extras data:', [
            'service_id' => $serviceId,
            'extras_count' => $extras->count(),
            'extras_data' => $extras->map(function($extra) {
                return [
                    'id' => $extra->id,
                    'name' => $extra->name,
                    'duration_id' => $extra->duration_id,
                    'durationRelation' => $extra->durationRelation ? [
                        'id' => $extra->durationRelation->id,
                        'label' => $extra->durationRelation->label,
                        'hours' => $extra->durationRelation->hours,
                        'minutes' => $extra->durationRelation->minutes,
                        'calculated_total_minutes' => ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes,
                    ] : null,
                    'total_duration' => $extra->total_duration,
                ];
            })->toArray()
        ]);

        // Additional debugging for each extra
        foreach ($extras as $extra) {
            \Log::info("Extra {$extra->id} ({$extra->name}) - duration_id: {$extra->duration_id}, durationRelation: " . ($extra->durationRelation ? 'loaded' : 'null'));
            if ($extra->durationRelation) {
                \Log::info("  Duration details: {$extra->durationRelation->label} ({$extra->durationRelation->hours}h {$extra->durationRelation->minutes}m)");
            }
        }

        // Get booking settings
        $bookingSettings = BookingSetting::getAllSettings();
        
        // Add duration label to service
        $serviceData = $service->toArray();
        $serviceData['duration_label'] = $service->getDurationLabel();
        
        return Inertia::render('Booking/SelectExtras', [
            'service' => $serviceData,
            'extras' => $extrasWithDuration,
            'bookingSettings' => $bookingSettings,
            'selectedPricingTier' => $selectedPricingTier,
            'selectedDuration' => $selectedDuration,
            'selectedPrice' => $selectedPrice,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Store extra quantities in session
     */
    public function storeExtraQuantities(Request $request)
    {
        $request->validate([
            'extra_quantities' => 'required|array',
            'extra_quantities.*.id' => 'required|integer|exists:extras,id',
            'extra_quantities.*.quantity' => 'required|integer|min:1|max:20',
        ]);

        // Store in session
        session(['booking_extra_quantities' => $request->extra_quantities]);

        \Log::info('Extra quantities stored in session:', [
            'extra_quantities' => $request->extra_quantities
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Show date and time selection page
     */
    public function selectDateTime(Request $request)
    {
        $serviceId = $request->query('service_id');
        $pricingTierId = $request->query('pricing_tier_id');
        $selectedDuration = $request->query('selected_duration');
        $selectedPrice = $request->query('selected_price');
        $extras = $request->query('extras', []);
        
        // Try to get extra quantities from JSON parameter first, then session
        $extraQuantities = [];
        $extraQuantitiesJson = $request->query('extra_quantities_json');
        if ($extraQuantitiesJson) {
            try {
                $extraQuantities = json_decode(urldecode($extraQuantitiesJson), true) ?: [];
            } catch (\Exception $e) {
                \Log::error('Failed to decode extra quantities JSON:', ['error' => $e->getMessage()]);
                $extraQuantities = session('booking_extra_quantities', []);
            }
        } else {
            $extraQuantities = session('booking_extra_quantities', []);
        }
        
        // Debug logging
        \Log::info('SelectDateTime - Request data:', [
            'service_id' => $serviceId,
            'extras' => $extras,
            'extra_quantities_json' => $extraQuantitiesJson,
            'extra_quantities_decoded' => $extraQuantities,
            'all_query_params' => $request->query()
        ]);
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::with('durationRelation')->whereIn('id', $extras)->get();
        
        // Process extra quantities with proper durationRelation handling
        $extrasWithQuantities = $selectedExtras->map(function($extra) use ($extraQuantities) {
            $extraData = $extra->toArray();
            
            // Manually include durationRelation to ensure it's properly serialized
            if ($extra->durationRelation) {
                $extraData['durationRelation'] = [
                    'id' => $extra->durationRelation->id,
                    'label' => $extra->durationRelation->label,
                    'hours' => $extra->durationRelation->hours,
                    'minutes' => $extra->durationRelation->minutes,
                    'calculated_total_minutes' => ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes,
                ];
            } else {
                $extraData['durationRelation'] = null;
            }
            
            // Find the quantity for this extra
            $quantity = 1; // default
            foreach ($extraQuantities as $eq) {
                if (is_array($eq) && isset($eq['id']) && $eq['id'] == $extra->id) {
                    $quantity = $eq['quantity'] ?? 1;
                    break;
                }
            }
            $extraData['quantity'] = $quantity;
            return $extraData;
        });
        
        // Debug logging
        \Log::info('SelectDateTime - Processed extras:', [
            'extras_with_quantities' => $extrasWithQuantities->toArray()
        ]);
        
        $scheduleSettings = ScheduleSetting::active()->ordered()->get();
        
        // Get pricing tier if selected
        $selectedPricingTier = null;
        if ($pricingTierId) {
            $selectedPricingTier = ServicePricingTier::find($pricingTierId);
        }

        // Add duration label to service
        $serviceData = $service->toArray();
        $serviceData['duration_label'] = $service->getDurationLabel();
        
        return Inertia::render('Booking/SelectDateTime', [
            'service' => $serviceData,
            'selectedExtras' => $extrasWithQuantities,
            'scheduleSettings' => $scheduleSettings,
            'selectedPricingTier' => $selectedPricingTier,
            'selectedDuration' => $selectedDuration,
            'selectedPrice' => $selectedPrice,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show consent page
     */
    public function consent(Request $request)
    {
        $serviceId = $request->query('service_id');
        $pricingTierId = $request->query('pricing_tier_id');
        $selectedDuration = $request->query('selected_duration');
        $selectedPrice = $request->query('selected_price');
        $extras = $request->query('extras', []);
        
        // Try to get extra quantities from JSON parameter first, then session
        $extraQuantities = [];
        $extraQuantitiesJson = $request->query('extra_quantities_json');
        if ($extraQuantitiesJson) {
            try {
                $extraQuantities = json_decode(urldecode($extraQuantitiesJson), true) ?: [];
            } catch (\Exception $e) {
                \Log::error('Failed to decode extra quantities JSON in consent:', ['error' => $e->getMessage()]);
                $extraQuantities = session('booking_extra_quantities', []);
            }
        } else {
            $extraQuantities = session('booking_extra_quantities', []);
        }
        
        $date = $request->query('date');
        $time = $request->query('time');
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::with('durationRelation')->whereIn('id', $extras)->get();
        
        // Process extra quantities with proper durationRelation handling for consent page
        $extrasWithQuantities = $selectedExtras->map(function($extra) use ($extraQuantities) {
            $extraData = $extra->toArray();
            
            // Manually include durationRelation to ensure it's properly serialized
            if ($extra->durationRelation) {
                $extraData['durationRelation'] = [
                    'id' => $extra->durationRelation->id,
                    'label' => $extra->durationRelation->label,
                    'hours' => $extra->durationRelation->hours,
                    'minutes' => $extra->durationRelation->minutes,
                    'calculated_total_minutes' => ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes,
                ];
            } else {
                $extraData['durationRelation'] = null;
            }
            
            // Find the quantity for this extra
            $quantity = 1; // default
            foreach ($extraQuantities as $eq) {
                if (is_array($eq) && isset($eq['id']) && $eq['id'] == $extra->id) {
                    $quantity = $eq['quantity'] ?? 1;
                    break;
                }
            }
            $extraData['quantity'] = $quantity;
            return $extraData;
        });
        
        $consentSettings = ConsentSetting::active()->ordered()->get();
        
        // Get pricing tier if selected
        $selectedPricingTier = null;
        if ($pricingTierId) {
            $selectedPricingTier = ServicePricingTier::find($pricingTierId);
        }

        // Add duration label to service
        $serviceData = $service->toArray();
        $serviceData['duration_label'] = $service->getDurationLabel();
        
        return Inertia::render('Booking/Consent', [
            'service' => $serviceData,
            'selectedExtras' => $extrasWithQuantities,
            'date' => $date,
            'time' => $time,
            'consentSettings' => $consentSettings,
            'selectedPricingTier' => $selectedPricingTier,
            'selectedDuration' => $selectedDuration,
            'selectedPrice' => $selectedPrice,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show confirmation and payment page
     */
    public function confirm(Request $request)
    {
        $serviceId = $request->query('service_id');
        $pricingTierId = $request->query('pricing_tier_id');
        $selectedDuration = $request->query('selected_duration');
        $selectedPrice = $request->query('selected_price');
        $extras = $request->query('extras', []);
        
        // Try to get extra quantities from JSON parameter first, then session
        $extraQuantities = [];
        $extraQuantitiesJson = $request->query('extra_quantities_json');
        if ($extraQuantitiesJson) {
            try {
                $extraQuantities = json_decode(urldecode($extraQuantitiesJson), true) ?: [];
            } catch (\Exception $e) {
                \Log::error('Failed to decode extra quantities JSON in confirm:', ['error' => $e->getMessage()]);
                $extraQuantities = session('booking_extra_quantities', []);
            }
        } else {
            $extraQuantities = session('booking_extra_quantities', []);
        }
        
        $date = $request->query('date');
        $time = $request->query('time');
        $consents = $request->query('consents', []);
        $verifiedPhone = $request->get('verified_phone');
        
        // Debug logging
        \Log::info('Confirm page request data', [
            'service_id' => $serviceId,
            'extras' => $extras,
            'date' => $date,
            'time' => $time,
            'consents' => $consents,
            'verified_phone' => $verifiedPhone,
            'all_query_params' => $request->query()
        ]);
        
        $service = Service::findOrFail($serviceId);
        $selectedExtras = Extra::with('durationRelation')->whereIn('id', $extras)->get();
        
        // Process extra quantities with proper durationRelation handling for confirm page
        $extrasWithQuantities = $selectedExtras->map(function($extra) use ($extraQuantities) {
            $extraData = $extra->toArray();
            
            // Manually include durationRelation to ensure it's properly serialized
            if ($extra->durationRelation) {
                $extraData['durationRelation'] = [
                    'id' => $extra->durationRelation->id,
                    'label' => $extra->durationRelation->label,
                    'hours' => $extra->durationRelation->hours,
                    'minutes' => $extra->durationRelation->minutes,
                    'calculated_total_minutes' => ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes,
                ];
            } else {
                $extraData['durationRelation'] = null;
            }
            
            // Find the quantity for this extra
            $quantity = 1; // default
            foreach ($extraQuantities as $eq) {
                if (is_array($eq) && isset($eq['id']) && $eq['id'] == $extra->id) {
                    $quantity = $eq['quantity'] ?? 1;
                    break;
                }
            }
            $extraData['quantity'] = $quantity;
            return $extraData;
        });
        
        $consentSettings = ConsentSetting::whereIn('id', $consents)->get();
        
        // Get any active booking form (prefer the first one)
        $form = Form::where('is_active', true)->first();
        if (!$form) {
            // Create default form if no active forms exist
            $form = Form::create([
                'name' => 'Default Booking Form',
                'description' => 'Standard booking form with primary fields and service-specific custom fields',
                'is_active' => true,
                'sort_order' => 1,
            ]);
            
            // Create default primary fields
            $primaryFields = [
                ['label' => 'Full Name', 'name' => 'customer_name', 'type' => 'text', 'is_primary' => true, 'is_required' => true, 'sort_order' => 1],
                ['label' => 'Phone Number', 'name' => 'customer_phone', 'type' => 'phone', 'is_primary' => true, 'is_required' => true, 'sort_order' => 2],
                ['label' => 'Email Address', 'name' => 'customer_email', 'type' => 'email', 'is_primary' => true, 'is_required' => false, 'sort_order' => 3],
            ];
            
            foreach ($primaryFields as $fieldData) {
                $form->fields()->create($fieldData);
            }
        }
        
        // Get all primary fields (always shown)
        $primaryFields = $form->fields()->where('is_primary', true)->orderBy('sort_order')->get();
        
        // Get custom fields based on rendering control and selected services/extras
        $customFields = $form->fields()
            ->where('is_primary', false)
            ->where(function($query) use ($service, $selectedExtras) {
                $query->where(function($subQuery) use ($service, $selectedExtras) {
                    // Services-based rendering
                    $subQuery->where('rendering_control', 'services')
                        ->where(function($serviceQuery) use ($service) {
                            $serviceQuery->whereHas('services', function($sQuery) use ($service) {
                                $sQuery->where('services.id', $service->id);
                            })
                            ->orWhereDoesntHave('services'); // Fields with no service associations show for all
                        });
                })
                ->orWhere(function($subQuery) use ($selectedExtras) {
                    // Extras-based rendering
                    $subQuery->where('rendering_control', 'extras')
                        ->where(function($extraQuery) use ($selectedExtras) {
                            if ($selectedExtras->count() > 0) {
                                $extraQuery->whereHas('extras', function($eQuery) use ($selectedExtras) {
                                    $eQuery->whereIn('extras.id', $selectedExtras->pluck('id'));
                                })
                                ->orWhereDoesntHave('extras'); // Fields with no extra associations show for all
                            } else {
                                // If no extras selected, show fields that don't have any extra associations
                                $extraQuery->whereDoesntHave('extras');
                            }
                        });
                })
                ->orWhere(function($subQuery) use ($service, $selectedExtras) {
                    // Both services and extras rendering
                    $subQuery->where('rendering_control', 'both')
                        ->where(function($bothQuery) use ($service, $selectedExtras) {
                            // Must match service condition
                            $bothQuery->where(function($serviceQuery) use ($service) {
                                $serviceQuery->whereHas('services', function($sQuery) use ($service) {
                                    $sQuery->where('services.id', $service->id);
                                })
                                ->orWhereDoesntHave('services');
                            })
                            // AND must match extras condition
                            ->where(function($extraQuery) use ($selectedExtras) {
                                if ($selectedExtras->count() > 0) {
                                    $extraQuery->whereHas('extras', function($eQuery) use ($selectedExtras) {
                                        $eQuery->whereIn('extras.id', $selectedExtras->pluck('id'));
                                    })
                                    ->orWhereDoesntHave('extras');
                                } else {
                                    $extraQuery->whereDoesntHave('extras');
                                }
                            });
                        });
                });
            })
            ->orderBy('sort_order')
            ->get();
        
        // Combine primary and custom fields
        $formFields = $primaryFields->merge($customFields);
        
        // Load payment settings
        $paymentSettings = [
            'razorpay_key' => $this->getSetting('razorpay_key'),
            'razorpay_secret' => $this->getSetting('razorpay_secret'),
            'currency' => $this->getSetting('currency', 'INR'),
        ];
        
        // Get pricing tier if selected
        $selectedPricingTier = null;
        if ($pricingTierId) {
            $selectedPricingTier = ServicePricingTier::find($pricingTierId);
        }

        // Calculate total price
        $servicePrice = $selectedPricingTier ? floatval($selectedPricingTier->price) : floatval($service->price);
        $totalPrice = $servicePrice;
        foreach ($extrasWithQuantities as $extra) {
            $quantity = $extra['quantity'] ?? 1;
            $totalPrice += floatval($extra['price']) * $quantity;
        }
        
        // Add duration label to service
        $serviceData = $service->toArray();
        $serviceData['duration_label'] = $service->getDurationLabel();
        
        return Inertia::render('Booking/Confirm', [
            'service' => $serviceData,
            'selectedExtras' => $extrasWithQuantities,
            'date' => $date,
            'time' => $time,
            'consentSettings' => $consentSettings,
            'form' => $form,
            'formFields' => $formFields,
            'paymentSettings' => $paymentSettings,
            'totalPrice' => $totalPrice,
            'verifiedPhone' => $request->get('verified_phone'),
            'selectedPricingTier' => $selectedPricingTier,
            'selectedDuration' => $selectedDuration,
            'selectedPrice' => $selectedPrice,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Process the booking and create Razorpay order
     */
    public function processBooking(Request $request)
    {
        // Clean up any expired session data first
        $this->cleanupExpiredSessionData();
        
        // Debug: Log the incoming request
        \Log::info('Booking request received', [
            'coupon_code' => $request->coupon_code,
            'service_id' => $request->service_id,
            'customer_phone' => $request->customer_phone,
            'verified_phone' => $request->verified_phone,
            'date' => $request->date,
            'time' => $request->time
        ]);

        try {
            // Get the form to understand field names
            $form = Form::where('is_active', true)->first();
            $primaryFields = $form ? $form->fields()->where('is_primary', true)->get() : collect();
            
            // Map field names dynamically
            $nameField = $primaryFields->where('name', 'customer_name')->first() ?: $primaryFields->where('name', 'full_name')->first();
            $phoneField = $primaryFields->where('name', 'customer_phone')->first() ?: $primaryFields->where('name', 'phone_number')->first();
            $emailField = $primaryFields->where('name', 'customer_email')->first() ?: $primaryFields->where('name', 'email')->first();
            
            // Build validation rules dynamically
            $validationRules = [
                'service_id' => 'required|exists:services,id',
                'pricing_tier_id' => 'nullable|exists:service_pricing_tiers,id',
                'selected_duration' => 'nullable|integer',
                'selected_price' => 'nullable|numeric',
                'extras' => 'array',
                'extras.*' => 'exists:extras,id',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required|date_format:H:i',
                'consents' => 'array',
                'consents.*' => 'exists:consent_settings,id',
                'verified_phone' => 'nullable|string|max:20',
                'coupon_code' => 'nullable|string',
            ];
            
            // Add validation for primary fields
            if ($nameField) {
                $validationRules[$nameField->name] = 'required|string|max:255';
            }
            if ($phoneField) {
                $validationRules[$phoneField->name] = 'required|string|max:20';
            }
            if ($emailField) {
                $validationRules[$emailField->name] = 'nullable|email';
            }
            
            // Also accept the old hardcoded names for backward compatibility
            $validationRules['customer_name'] = 'nullable|string|max:255';
            $validationRules['customer_phone'] = 'nullable|string|max:20';
            $validationRules['customer_email'] = 'nullable|email';
            
            $request->validate($validationRules);
            
            // Extract customer information using dynamic field names or fallback to hardcoded names
            $customerName = $request->get($nameField->name ?? 'customer_name');
            $customerPhone = $request->get($phoneField->name ?? 'customer_phone');
            $customerEmail = $request->get($emailField->name ?? 'customer_email');
            
            \Log::info('Field mapping and extraction', [
                'name_field_name' => $nameField ? $nameField->name : 'customer_name',
                'phone_field_name' => $phoneField ? $phoneField->name : 'customer_phone',
                'email_field_name' => $emailField ? $emailField->name : 'customer_email',
                'extracted_name' => $customerName,
                'extracted_phone' => $customerPhone,
                'extracted_email' => $customerEmail,
                'all_request_data' => $request->all()
            ]);
            
            // Use verified phone number if available, otherwise use the form phone number
            $phoneNumberToUse = $request->verified_phone ?: $customerPhone;
            
            // Format the phone number consistently
            $phoneNumberToUse = $this->formatPhoneNumber($phoneNumberToUse);
            
            \Log::info('Phone number resolution', [
                'form_phone' => $customerPhone,
                'verified_phone' => $request->verified_phone,
                'phone_to_use' => $phoneNumberToUse
            ]);

            $service = Service::findOrFail($request->service_id);
            
            // Get pricing tier if selected
            $selectedPricingTier = null;
            if ($request->pricing_tier_id) {
                $selectedPricingTier = ServicePricingTier::find($request->pricing_tier_id);
            }
            
            $selectedExtras = Extra::with('durationRelation')->whereIn('id', $request->extras ?? [])->get();
            
            // Process extra quantities from form data or session
            $extraQuantities = $request->extra_quantities ?? session('booking_extra_quantities', []);
            
            \Log::info('Processing booking with extra quantities', [
                'request_extra_quantities' => $request->extra_quantities,
                'session_extra_quantities' => session('booking_extra_quantities', []),
                'final_extra_quantities' => $extraQuantities
            ]);
            
            $extrasWithQuantities = [];
            
            foreach ($selectedExtras as $extra) {
                $quantity = 1; // default
                foreach ($extraQuantities as $eq) {
                    if (is_array($eq) && isset($eq['id']) && $eq['id'] == $extra->id) {
                        $quantity = $eq['quantity'] ?? 1;
                        break;
                    }
                }
                $extrasWithQuantities[] = [
                    'id' => $extra->id,
                    'name' => $extra->name,
                    'price' => $extra->price,
                    'quantity' => $quantity,
                    'durationRelation' => $extra->durationRelation,
                    'total_duration' => $extra->total_duration,
                ];
            }
            
            // Calculate total duration and price
            $serviceDuration = $selectedPricingTier ? $selectedPricingTier->duration_minutes : $service->duration;
            $servicePrice = $selectedPricingTier ? floatval($selectedPricingTier->price) : floatval($service->price);
            
            $totalDuration = $serviceDuration;
            $totalPrice = $servicePrice;
            
            foreach ($extrasWithQuantities as $extra) {
                $quantity = $extra['quantity'];
                if ($extra['durationRelation']) {
                    $totalDuration += (($extra['durationRelation']->hours * 60) + $extra['durationRelation']->minutes) * $quantity;
                } else {
                    $totalDuration += ($extra['total_duration'] ?? 0) * $quantity;
                }
                $totalPrice += floatval($extra['price']) * $quantity;
            }
            
            \Log::info('Final booking calculation', [
                'service_price' => $service->price,
                'service_duration' => $service->duration,
                'pricing_tier_id' => $request->pricing_tier_id,
                'selected_pricing_tier' => $selectedPricingTier ? [
                    'id' => $selectedPricingTier->id,
                    'name' => $selectedPricingTier->name,
                    'price' => $selectedPricingTier->price,
                    'duration' => $selectedPricingTier->duration_minutes
                ] : null,
                'service_price_used' => $servicePrice,
                'service_duration_used' => $serviceDuration,
                'extras_with_quantities' => $extrasWithQuantities,
                'total_duration' => $totalDuration,
                'total_price' => $totalPrice
            ]);
            
            // Create or find customer user first (needed for coupon validation)
            // Check by phone number first (primary identifier) - this is the primary way to identify users
            $customer = User::where('phone_number', $phoneNumberToUse)->first();
            
            // Only check by email if we want to update an existing user's phone number
            // But for new bookings, we should create a new user if phone number doesn't exist
            if (!$customer && $customerEmail) {
                // Check if there's a user with this email but different phone
                $existingUserWithEmail = User::where('email', $customerEmail)->first();
                if ($existingUserWithEmail && $existingUserWithEmail->phone_number !== $phoneNumberToUse) {
                    \Log::warning('Email already exists with different phone number', [
                        'email' => $customerEmail,
                        'existing_phone' => $existingUserWithEmail->phone_number,
                        'new_phone' => $phoneNumberToUse,
                        'existing_user_id' => $existingUserWithEmail->id
                    ]);
                    // Don't use the existing user - we'll create a new one
                    $customer = null;
                }
            }
            
            \Log::info('User lookup result', [
                'phone_number_to_use' => $phoneNumberToUse,
                'customer_email' => $customerEmail,
                'customer_found' => $customer ? true : false,
                'customer_id' => $customer ? $customer->id : null,
                'customer_phone' => $customer ? $customer->phone_number : null,
                'customer_name' => $customer ? $customer->name : null
            ]);
            
            if (!$customer) {
                $customer = User::create([
                    'name' => $customerName,
                    'email' => $customerEmail, // Can be null
                    'phone_number' => $phoneNumberToUse,
                    'role' => 'customer',
                    'password' => bcrypt(Str::random(12)), // Temporary password
                ]);
                
                \Log::info('New customer created', [
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                    'customer_phone' => $customer->phone_number,
                    'customer_email' => $customer->email
                ]);
            } else {
                \Log::info('Existing customer found', [
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                    'customer_phone' => $customer->phone_number,
                    'customer_email' => $customer->email
                ]);
                
                // Update customer info if found by phone number but email is different
                // Only update if the new email is not already used by another user
                if ($customerEmail && $customer->email !== $customerEmail) {
                    // Check if the new email is already used by another user
                    $existingUserWithEmail = User::where('email', $customerEmail)
                        ->where('id', '!=', $customer->id)
                        ->first();
                    
                    if (!$existingUserWithEmail) {
                        // Safe to update email
                        $customer->update([
                            'name' => $customerName,
                            'email' => $customerEmail,
                        ]);
                        
                        \Log::info('Customer email updated', [
                            'customer_id' => $customer->id,
                            'old_email' => $customer->email,
                            'new_email' => $customerEmail
                        ]);
                    } else {
                        // Email is already used by another user, only update name
                        $customer->update([
                            'name' => $customerName,
                        ]);
                        
                        \Log::info('Email update skipped - email already in use by another user', [
                            'customer_id' => $customer->id,
                            'requested_email' => $customerEmail,
                            'existing_user_id' => $existingUserWithEmail->id
                        ]);
                    }
                } else {
                    // Email is the same or not provided, just update name if needed
                    if ($customer->name !== $customerName) {
                        $customer->update([
                            'name' => $customerName,
                        ]);
                        
                        \Log::info('Customer name updated', [
                            'customer_id' => $customer->id,
                            'old_name' => $customer->name,
                            'new_name' => $customerName
                        ]);
                    }
                }
            }
            
            // Handle coupon if provided
            $discountAmount = 0;
            $couponId = null;
            $couponCode = null;
            
            if ($request->coupon_code) {
                \Log::info('Processing coupon code', ['coupon_code' => $request->coupon_code]);
                
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();
                
                if ($coupon) {
                    \Log::info('Coupon found', [
                        'coupon_id' => $coupon->id,
                        'coupon_name' => $coupon->name,
                        'is_active' => $coupon->is_active,
                        'discount_type' => $coupon->discount_type,
                        'discount_value' => $coupon->discount_value,
                        'max_uses_per_user' => $coupon->max_uses_per_user
                    ]);
                    
                    // For testing - bypass validation temporarily
                    $isValid = true; // $coupon->isValid();
                    \Log::info('Coupon validation result', ['is_valid' => $isValid]);
                    
                    if ($isValid) {
                        \Log::info('Coupon is valid');
                        
                        // Check if user can use this coupon
                        $userUsageCount = $coupon->usages()->where('user_id', $customer->id)->count();
                        \Log::info('User usage count', ['user_id' => $customer->id, 'usage_count' => $userUsageCount]);
                        
                        // For testing - bypass usage limit temporarily
                        $canUse = true; // $userUsageCount < $coupon->max_uses_per_user;
                        \Log::info('Can user use coupon', ['can_use' => $canUse, 'usage_count' => $userUsageCount, 'max_uses' => $coupon->max_uses_per_user]);
                        
                        if ($canUse) {
                            \Log::info('User can use this coupon');
                            
                            // Calculate discount
                            if ($coupon->discount_type === 'percentage') {
                                $discountAmount = ($totalPrice * $coupon->discount_value) / 100;
                            } else {
                                $discountAmount = $coupon->discount_value;
                            }
                            
                            \Log::info('Initial discount calculation', [
                                'discount_type' => $coupon->discount_type,
                                'discount_value' => $coupon->discount_value,
                                'total_price_before' => $totalPrice,
                                'calculated_discount' => $discountAmount
                            ]);
                            
                            // Apply maximum discount limit
                            if ($coupon->maximum_discount && $discountAmount > $coupon->maximum_discount) {
                                $discountAmount = $coupon->maximum_discount;
                                \Log::info('Applied maximum discount limit', ['max_discount' => $coupon->maximum_discount]);
                            }
                            
                            // Ensure discount doesn't exceed total amount
                            if ($discountAmount > $totalPrice) {
                                $discountAmount = $totalPrice;
                                \Log::info('Limited discount to total price');
                            }
                            
                            $couponId = $coupon->id;
                            $couponCode = $coupon->code;
                            
                            // Update total price
                            $totalPrice -= $discountAmount;
                            
                            \Log::info('Coupon applied successfully', [
                                'final_discount_amount' => $discountAmount,
                                'final_total_price' => $totalPrice
                            ]);
                        } else {
                            \Log::warning('User has already used this coupon maximum times', [
                                'user_id' => $customer->id,
                                'usage_count' => $userUsageCount,
                                'max_uses_per_user' => $coupon->max_uses_per_user
                            ]);
                        }
                    } else {
                        \Log::warning('Coupon is not valid', ['coupon_id' => $coupon->id]);
                    }
                } else {
                    \Log::warning('Coupon not found', ['coupon_code' => $request->coupon_code]);
                }
            } else {
                \Log::info('No coupon code provided');
            }
            
            // Create appointment datetime
            $appointmentTime = \Carbon\Carbon::parse($request->date . ' ' . $request->time);
            
            // Find available employees for this service and time slot
            $availableEmployees = User::getAvailableEmployeesForSlot(
                $service->id,
                $request->date,
                $request->time,
                $totalDuration
            );

            // Debug logging
            \Log::info('Employee availability check', [
                'service_id' => $service->id,
                'service_name' => $service->name,
                'date' => $request->date,
                'time' => $request->time,
                'duration' => $totalDuration,
                'available_employees_count' => $availableEmployees->count(),
                'available_employees' => $availableEmployees->pluck('name')->toArray()
            ]);

            if ($availableEmployees->isEmpty()) {
                // For testing - get any active employee for this service
                $fallbackEmployee = User::where('role', 'employee')
                    ->where('is_active', true)
                    ->whereHas('services', function($query) use ($service) {
                        $query->where('services.id', $service->id);
                    })
                    ->first();
                
                if (!$fallbackEmployee) {
                    return response()->json([
                        'success' => false,
                        'error' => 'No employees available for this service. Please contact support.'
                    ], 400);
                }
                
                \Log::warning('Using fallback employee assignment', [
                    'employee_id' => $fallbackEmployee->id,
                    'employee_name' => $fallbackEmployee->name,
                    'service_id' => $service->id
                ]);
                
                $assignedEmployee = $fallbackEmployee;
            } else {
                // Auto-assign the first available employee
                $assignedEmployee = $availableEmployees->first();
            }
            
            // Debug: Log amounts before booking creation
            \Log::info('Amounts before booking creation', [
                'original_total' => $service->price + $selectedExtras->sum('price'),
                'discount_amount' => $discountAmount,
                'final_total_price' => $totalPrice,
                'coupon_code' => $couponCode,
                'coupon_id' => $couponId
            ]);
            
            // Store booking data in session instead of creating booking immediately
            $bookingData = [
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'pricing_tier_id' => $selectedPricingTier?->id,
                'employee_id' => $assignedEmployee->id,
                'appointment_time' => $appointmentTime,
                'duration' => $totalDuration,
                'total_amount' => $totalPrice,
                'status' => 'pending',
                'payment_status' => 'pending',
                'consent_given' => !empty($request->consents),
                'consent_given_at' => !empty($request->consents) ? now() : null,
                'coupon_id' => $couponId,
                'discount_amount' => $discountAmount,
                'coupon_code' => $couponCode,
                'extras' => $extrasWithQuantities,
                'custom_fields' => $request->except([
                    'service_id', 'pricing_tier_id', 'selected_duration', 'selected_price', 
                    'extras', 'date', 'time', 'consents', 
                    'customer_name', 'customer_email', 'customer_phone', 
                    'payment_method', 'special_requests', 'coupon_code',
                    'verified_phone',
                    // Also exclude dynamic field names
                    $nameField ? $nameField->name : null,
                    $phoneField ? $phoneField->name : null,
                    $emailField ? $emailField->name : null,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            \Log::info('Booking data stored in session', [
                'user_id' => $bookingData['user_id'],
                'customer_phone' => $customer->phone_number,
                'customer_name' => $customer->name,
                'service_id' => $bookingData['service_id'],
                'total_amount' => $bookingData['total_amount'],
                'coupon_code' => $bookingData['coupon_code'],
                'custom_fields_keys' => array_keys($bookingData['custom_fields'])
            ]);
            
            // Store in session for later use
            session(['pending_booking' => $bookingData]);
            session(['pending_booking_created_at' => now()]); // Store creation time
            
            // Create Razorpay order with a temporary receipt
            $razorpayService = new RazorpayService();
            
            if (!$razorpayService->isConfigured()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment gateway is not configured. Please contact support.'
                ], 400);
            }
            
            // Create a temporary booking object for Razorpay order creation
            $tempBooking = new Booking($bookingData);
            $tempBooking->id = 'temp_' . time(); // Temporary ID for receipt
            $tempBooking->exists = true; // Make it behave like an existing model
            
            \Log::info('Created temporary booking for Razorpay', [
                'temp_booking_id' => $tempBooking->id,
                'total_amount' => $tempBooking->total_amount,
                'service_id' => $tempBooking->service_id,
                'user_id' => $tempBooking->user_id
            ]);
            
            $orderData = $razorpayService->createOrder($tempBooking);
            
            // Store the order ID in session for payment verification
            session(['razorpay_order_id' => $orderData['order_id']]);
            
            return response()->json([
                'success' => true,
                'order_data' => $orderData,
                'booking_id' => null // No booking ID yet
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Booking processing failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again.'
            ], 500);
        }
    }

    /**
     * Show booking success page
     */
    public function success()
    {
        return Inertia::render('Booking/Success', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Handle Razorpay payment success
     */
    public function paymentSuccess(Request $request)
    {
        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $razorpayService = new RazorpayService();
        
        // Verify payment signature
        $isValid = $razorpayService->verifyPayment(
            $request->razorpay_payment_id,
            $request->razorpay_order_id,
            $request->razorpay_signature
        );

        if (!$isValid) {
            return redirect()->route('booking.failed')->with('error', 'Payment verification failed.');
        }

        // Get booking data from session
        $bookingData = session('pending_booking');
        $sessionOrderId = session('razorpay_order_id');
        
        if (!$bookingData || $sessionOrderId !== $request->razorpay_order_id) {
            \Log::warning('Invalid or missing session data for payment success', [
                'has_booking_data' => !empty($bookingData),
                'session_order_id' => $sessionOrderId,
                'request_order_id' => $request->razorpay_order_id,
                'session_data' => session()->all()
            ]);
            
            return redirect()->route('booking.failed')->with('error', 'Booking session expired or invalid. Please try again.');
        }

        // Debug: Log the booking data to track phone number and user
        \Log::info('Payment success - booking data from session', [
            'user_id' => $bookingData['user_id'] ?? 'not_set',
            'service_id' => $bookingData['service_id'] ?? 'not_set',
            'total_amount' => $bookingData['total_amount'] ?? 'not_set',
            'custom_fields' => $bookingData['custom_fields'] ?? [],
            'session_data' => session()->all()
        ]);

        // Get the user to verify phone number
        $user = User::find($bookingData['user_id']);
        if ($user) {
            \Log::info('Payment success - user details', [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_phone' => $user->phone_number,
                'user_email' => $user->email
            ]);
        } else {
            \Log::error('Payment success - user not found', [
                'user_id' => $bookingData['user_id']
            ]);
        }

        // Get payment details from Razorpay
        $paymentDetails = $razorpayService->getPaymentDetails($request->razorpay_payment_id);
        
        if (!$paymentDetails) {
            return redirect()->route('booking.failed')->with('error', 'Failed to fetch payment details.');
        }

        // Get the default booking policy
        $defaultPolicy = \App\Models\BookingPolicySetting::active()->first();
        
        \Log::info('Assigning policy to new booking', [
            'default_policy_id' => $defaultPolicy ? $defaultPolicy->id : null,
            'default_policy_name' => $defaultPolicy ? $defaultPolicy->name : 'No policy found',
            'reschedule_window_hours' => $defaultPolicy ? $defaultPolicy->reschedule_window_hours : 'N/A',
            'max_reschedule_attempts' => $defaultPolicy ? $defaultPolicy->max_reschedule_attempts : 'N/A',
        ]);
        
        // Create the actual booking record
        $booking = Booking::create([
            'user_id' => $bookingData['user_id'],
            'service_id' => $bookingData['service_id'],
            'pricing_tier_id' => $bookingData['pricing_tier_id'] ?? null,
            'employee_id' => $bookingData['employee_id'],
            'appointment_time' => $bookingData['appointment_time'],
            'appointment_date_time' => $bookingData['appointment_time']->setTimezone('Asia/Kolkata'),
            'duration' => $bookingData['duration'],
            'total_amount' => $bookingData['total_amount'],
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => $paymentDetails->method ?? 'razorpay',
            'transaction_id' => $request->razorpay_payment_id,
        ]);

        // Create invoice for the booking
        $booking->createOrUpdateInvoice();

        // Update additional booking fields
        $booking->update([
            'consent_given' => $bookingData['consent_given'],
            'consent_given_at' => $bookingData['consent_given_at'],
            'coupon_id' => $bookingData['coupon_id'],
            'discount_amount' => $bookingData['discount_amount'],
            'coupon_code' => $bookingData['coupon_code'],
            'booking_policy_setting_id' => $defaultPolicy ? $defaultPolicy->id : null,
        ]);

        \Log::info('Payment success - booking created', [
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'service_id' => $booking->service_id,
            'total_amount' => $booking->total_amount,
            'booking_policy_setting_id' => $booking->booking_policy_setting_id,
            'policy_name' => $booking->bookingPolicySetting ? $booking->bookingPolicySetting->name : 'No policy assigned'
        ]);

        // Attach extras to booking
        foreach ($bookingData['extras'] as $extra) {
            $booking->extras()->attach($extra['id'], [
                'price' => $extra['price'],
                'quantity' => $extra['quantity'] ?? 1
            ]);
        }

        // Store custom field responses
        if (!empty($bookingData['custom_fields'])) {
            $this->storeCustomFieldResponses($booking, $bookingData['custom_fields']);
        }

        // Handle coupon usage if coupon was applied
        if ($booking->coupon_id) {
            $coupon = Coupon::find($booking->coupon_id);
            if ($coupon) {
                // Increment coupon usage
                $coupon->increment('used_count');
                
                // Record usage for this user
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'user_id' => $booking->user_id,
                    'booking_id' => $booking->id,
                    'discount_amount' => $booking->discount_amount,
                    'original_amount' => $booking->total_amount + $booking->discount_amount, // Add back the discount to get original amount
                    'final_amount' => $booking->total_amount,
                    'used_at' => now(),
                ]);
            }
        }

        // Clear session data
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);

        // TODO: Send confirmation email
        // TODO: Send SMS notification

        // Ensure pricing tier data is explicitly included
        $bookingData = $booking->load(['customer', 'service', 'pricingTier', 'employee', 'extras.durationRelation', 'formResponses.formField'])->toArray();
        if ($booking->pricingTier) {
            $bookingData['pricingTier'] = [
                'id' => $booking->pricingTier->id,
                'name' => $booking->pricingTier->name,
                'price' => $booking->pricingTier->price,
                'duration_minutes' => $booking->pricingTier->duration_minutes,
            ];
        }

        return Inertia::render('Booking/Success', [
            'booking' => $bookingData,
            'payment_id' => $request->razorpay_payment_id,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Handle Razorpay payment failure
     */
    public function paymentFailed(Request $request)
    {
        // Clear session data for failed payment
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
        
        return Inertia::render('Booking/Failed', [
            'error' => $request->get('error', 'Payment failed. Please try again.'),
            'booking_id' => null, // No booking ID since booking wasn't created
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Handle Razorpay payment cancellation
     */
    public function paymentCancelled(Request $request)
    {
        // Clear session data for cancelled payment
        session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
        
        return Inertia::render('Booking/Failed', [
            'error' => 'Payment was cancelled. No booking was created.',
            'booking_id' => null,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Get available time slots for a specific date
     */
    public function getAvailableSlots(Request $request)
    {
        try {
            $request->validate([
                'date' => 'required|date',
                'service_id' => 'required|exists:services,id',
                'extras' => 'nullable|array',
                'extras.*' => 'exists:extras,id',
                'exclude_booking_id' => 'nullable|exists:bookings,id',
                'duration' => 'nullable|integer', // Add duration parameter for reschedule
                'pricing_tier_id' => 'nullable|exists:service_pricing_tiers,id',
                'selected_duration' => 'nullable|integer',
                'selected_price' => 'nullable|numeric',
            ]);

            $service = Service::findOrFail($request->service_id);
            $date = \Carbon\Carbon::parse($request->date);
            
            // Get pricing tier if selected
            $selectedPricingTier = null;
            if ($request->pricing_tier_id) {
                $selectedPricingTier = ServicePricingTier::find($request->pricing_tier_id);
            }
            
            // Calculate total duration including extras
            $serviceDuration = $selectedPricingTier ? $selectedPricingTier->duration_minutes : $service->duration;
            $totalDuration = $serviceDuration;
            $selectedExtras = [];
            
            // Always calculate from extras if provided (for both new bookings and reschedule)
            if ($request->extras && is_array($request->extras)) {
                $selectedExtras = Extra::with('durationRelation')->whereIn('id', $request->extras)->get();
                foreach ($selectedExtras as $extra) {
                    if ($extra->durationRelation) {
                        $totalDuration += ($extra->durationRelation->hours * 60) + $extra->durationRelation->minutes;
                    } else {
                        $totalDuration += $extra->total_duration;
                    }
                }
            }
            
            // Override with provided duration if specified (for backward compatibility)
            if ($request->duration) {
                $totalDuration = $request->duration;
            }
            
            \Log::info('Available slots request', [
                'date' => $date->format('Y-m-d'),
                'service_id' => $service->id,
                'service_name' => $service->name,
                'service_duration' => $service->duration,
                'pricing_tier_id' => $request->pricing_tier_id,
                'selected_duration' => $request->selected_duration,
                'selected_price' => $request->selected_price,
                'service_duration_used' => $serviceDuration,
                'request_duration' => $request->duration,
                'request_extras' => $request->extras,
                'calculated_total_duration' => $totalDuration,
                'exclude_booking_id' => $request->exclude_booking_id
            ]);
            
            // Get the most appropriate schedule setting
            $scheduleSetting = $this->getScheduleForDate($date, $service);
            
            if (!$scheduleSetting) {
                \Log::info('No schedule setting found');
                return response()->json(['slots' => []]);
            }

            \Log::info('Schedule setting found', [
                'schedule_name' => $scheduleSetting->name,
                'working_days' => $scheduleSetting->working_days
            ]);

            // Check if the date is a working day
            $dayOfWeek = $date->dayOfWeek; // 1=Monday, 7=Sunday
            if (!in_array($dayOfWeek, $scheduleSetting->working_days)) {
                \Log::info('Date is not a working day', ['day_of_week' => $dayOfWeek]);
                return response()->json(['slots' => []]);
            }

            // Use flexible slot generation instead of sequential slots
            // You can toggle this based on your preference
            $useFlexibleSlots = false; // Set to false to use sequential slots
            
            if ($useFlexibleSlots) {
                $slots = $this->generateFlexibleSlots($date, $service, $scheduleSetting, $totalDuration, $request->exclude_booking_id);
            } else {
                // Fallback to sequential slot generation
                $slots = $scheduleSetting->getAvailableSlots($date, $totalDuration, $request->exclude_booking_id);
                
                // Process sequential slots for employee availability
                $processedSlots = [];
                foreach ($slots as $slot) {
                    $availableEmployees = User::getAvailableEmployeesForSlot(
                        $service->id,
                        $date->format('Y-m-d'),
                        $slot['start'],
                        $totalDuration,
                        $request->exclude_booking_id // Pass the booking ID to exclude
                    );
                    
                    // Only include slots that have available employees
                    if ($availableEmployees->count() > 0) {
                        $slot['available'] = true;
                        $slot['available_employees'] = $availableEmployees->count();
                        $processedSlots[] = $slot;
                    } else {
                        \Log::info('Slot excluded - no available employees', [
                            'slot' => $slot['start'],
                            'service_id' => $service->id,
                            'exclude_booking_id' => $request->exclude_booking_id
                        ]);
                    }
                }
                $slots = $processedSlots;
            }
            
            \Log::info('Generated flexible slots', [
                'count' => count($slots),
                'slots' => $slots
            ]);
            
            // Filter out slots that don't meet minimum advance time (if any)
            $now = now();
            $minAdvanceTime = $now->copy()->addHours($scheduleSetting->min_advance_hours);
            
            $filteredSlots = [];
            foreach ($slots as $slot) {
                $slotDateTime = $date->copy()->setTimeFromTimeString($slot['start']);
                
                // Only include slots that meet minimum advance time
                if ($slotDateTime->gte($minAdvanceTime)) {
                    $filteredSlots[] = $slot;
                } else {
                    \Log::info('Slot filtered out - does not meet minimum advance time', [
                        'slot' => $slot['start'],
                        'slot_datetime' => $slotDateTime->format('Y-m-d H:i:s'),
                        'min_advance_time' => $minAdvanceTime->format('Y-m-d H:i:s')
                    ]);
                }
            }
            
            \Log::info('Returning filtered slots', ['count' => count($filteredSlots)]);
            return response()->json(['slots' => $filteredSlots]);
            
        } catch (Exception $e) {
            \Log::error('Error in getAvailableSlots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Validate a coupon code
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'extras' => 'array',
            'extras.*' => 'exists:extras,id',
            'phone_number' => 'nullable|string', // Add phone number for user validation
        ]);

        $code = strtoupper($request->code);
        $service = Service::findOrFail($request->service_id);
        $selectedExtras = Extra::with('durationRelation')->whereIn('id', $request->extras ?? [])->get();
        
        // Calculate total amount for validation
        $totalAmount = floatval($service->price);
        foreach ($selectedExtras as $extra) {
            $totalAmount += floatval($extra->price);
        }

        // Find the coupon
        $coupon = Coupon::where('code', $code)->first();
        
        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.'
            ]);
        }

        // Check if coupon is active
        if (!$coupon->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not active.'
            ]);
        }

        // Check validity period
        $now = now();
        if ($coupon->valid_from && $now->lt($coupon->valid_from)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not yet valid.'
            ]);
        }

        if ($coupon->valid_until && $now->gt($coupon->valid_until)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has expired.'
            ]);
        }

        // Check usage limits
        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has reached its usage limit.'
            ]);
        }

        // Check per-user usage limit if phone number is provided
        if ($request->phone_number) {
            $phoneNumber = $request->phone_number;
            
            // Find existing user by phone number
            $existingUser = User::where('phone_number', $phoneNumber)->first();
            
            if ($existingUser) {
                // Check how many times this user has used this coupon
                $userUsageCount = CouponUsage::where('coupon_id', $coupon->id)
                    ->where('user_id', $existingUser->id)
                    ->count();
                
                if ($userUsageCount >= $coupon->max_uses_per_user) {
                    return response()->json([
                        'valid' => false,
                        'message' => 'You have already used this coupon maximum times.'
                    ]);
                }
            }
        }

        // Check minimum amount
        if ($totalAmount < $coupon->minimum_amount) {
            return response()->json([
                'valid' => false,
                'message' => "Minimum order amount of Rs. {$coupon->minimum_amount} required."
            ]);
        }

        // Check service restrictions
        if ($coupon->applicable_services && !empty($coupon->applicable_services)) {
            if (!in_array($service->id, $coupon->applicable_services)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This coupon is not applicable for this service.'
                ]);
            }
        }

        if ($coupon->excluded_services && !empty($coupon->excluded_services)) {
            if (in_array($service->id, $coupon->excluded_services)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This coupon cannot be used for this service.'
                ]);
            }
        }

        // Calculate discount amount
        $discountAmount = 0;
        if ($coupon->discount_type === 'percentage') {
            $discountAmount = ($totalAmount * $coupon->discount_value) / 100;
        } else {
            $discountAmount = $coupon->discount_value;
        }

        // Apply maximum discount limit
        if ($coupon->maximum_discount && $discountAmount > $coupon->maximum_discount) {
            $discountAmount = $coupon->maximum_discount;
        }

        // Ensure discount doesn't exceed total amount
        if ($discountAmount > $totalAmount) {
            $discountAmount = $totalAmount;
        }

        $finalAmount = $totalAmount - $discountAmount;

        return response()->json([
            'valid' => true,
            'message' => "Coupon applied successfully! You saved Rs. {$discountAmount}",
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'discount_amount' => $discountAmount,
                'original_amount' => $totalAmount,
                'final_amount' => $finalAmount,
            ]
        ]);
    }

    /**
     * Store custom field responses for a booking
     */
    private function storeCustomFieldResponses($booking, $customFieldsData)
    {
        // Get any active booking form (prefer the first one)
        $form = Form::where('is_active', true)->first();
        if (!$form) {
            \Log::warning('No active form found for storing custom field responses', [
                'booking_id' => $booking->id,
                'custom_fields_data' => $customFieldsData
            ]);
            return;
        }

        \Log::info('Storing custom field responses', [
            'booking_id' => $booking->id,
            'form_id' => $form->id,
            'form_name' => $form->name,
            'custom_fields_data' => $customFieldsData
        ]);

        // Get all form fields (primary and custom) with relationships
        $formFields = $form->fields()->with(['services', 'extras'])->get();

        foreach ($formFields as $field) {
            $fieldName = $field->name;
            $fieldValue = $customFieldsData[$fieldName] ?? null;

            // Skip if no value provided
            if ($fieldValue === null || $fieldValue === '') {
                continue;
            }

            // For custom fields, check if they apply based on rendering control
            if (!$field->is_primary) {
                $shouldStore = false;
                
                switch ($field->rendering_control) {
                    case 'services':
                        // Check service-based rendering
                        $fieldServices = $field->services;
                        if ($fieldServices->count() > 0) {
                            $shouldStore = $fieldServices->contains('id', $booking->service_id);
                        } else {
                            $shouldStore = true; // No services assigned = show for all
                        }
                        break;
                        
                    case 'extras':
                        // Check extras-based rendering
                        $fieldExtras = $field->extras;
                        $bookingExtras = $booking->extras;
                        
                        if ($fieldExtras->count() > 0) {
                            if ($bookingExtras->count() > 0) {
                                $shouldStore = $fieldExtras->intersect($bookingExtras)->count() > 0;
                            } else {
                                $shouldStore = false; // No extras selected
                            }
                        } else {
                            $shouldStore = true; // No extras assigned = show for all
                        }
                        break;
                        
                    case 'both':
                        // Check both services and extras
                        $serviceMatch = false;
                        $extrasMatch = false;
                        
                        // Service check
                        $fieldServices = $field->services;
                        if ($fieldServices->count() > 0) {
                            $serviceMatch = $fieldServices->contains('id', $booking->service_id);
                        } else {
                            $serviceMatch = true;
                        }
                        
                        // Extras check
                        $fieldExtras = $field->extras;
                        $bookingExtras = $booking->extras;
                        
                        if ($fieldExtras->count() > 0) {
                            if ($bookingExtras->count() > 0) {
                                $extrasMatch = $fieldExtras->intersect($bookingExtras)->count() > 0;
                            } else {
                                $extrasMatch = false;
                            }
                        } else {
                            $extrasMatch = true;
                        }
                        
                        $shouldStore = $serviceMatch && $extrasMatch;
                        break;
                        
                    default:
                        $shouldStore = true; // Fallback
                        break;
                }
                
                if (!$shouldStore) {
                    continue; // Skip this field as it doesn't apply
                }
            }

            // Store the response
            $booking->formResponses()->create([
                'form_field_id' => $field->id,
                'response_value' => $fieldValue,
                'response_data' => $this->formatFieldResponse($field, $fieldValue),
            ]);

            \Log::info('Stored form response', [
                'booking_id' => $booking->id,
                'field_id' => $field->id,
                'field_name' => $field->name,
                'field_label' => $field->label,
                'response_value' => $fieldValue
            ]);
        }
    }

    /**
     * Format field response based on field type
     */
    private function formatFieldResponse($field, $value)
    {
        switch ($field->type) {
            case 'checkbox':
                return [
                    'checked' => (bool) $value,
                    'raw_value' => $value,
                ];
            
            case 'radio':
            case 'select':
                return [
                    'selected_option' => $value,
                    'raw_value' => $value,
                ];
            
            case 'date':
                return [
                    'formatted_date' => $value ? date('Y-m-d', strtotime($value)) : null,
                    'raw_value' => $value,
                ];
            
            case 'time':
                return [
                    'formatted_time' => $value ? date('H:i', strtotime($value)) : null,
                    'raw_value' => $value,
                ];
            
            default:
                return [
                    'raw_value' => $value,
                ];
        }
    }

    /**
     * Get the appropriate schedule setting for a given date and service
     */
    private function getScheduleForDate($date, $service)
    {
        // For now, use the first active schedule
        // In the future, you could implement logic to select different schedules
        // based on date, service type, or other criteria
        return ScheduleSetting::active()->ordered()->first();
    }

    /**
     * Format phone number consistently
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove any non-digit characters except +
        $phoneNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);
        
        // If it starts with +, keep as is
        if (str_starts_with($phoneNumber, '+')) {
            return $phoneNumber;
        }
        
        // If it starts with 91, add +
        if (str_starts_with($phoneNumber, '91')) {
            return '+' . $phoneNumber;
        }
        
        // For Indian numbers, add +91 and remove leading 0
        return '+91' . ltrim($phoneNumber, '0');
    }

    /**
     * Get setting value from database
     */
    private function getSetting($key, $default = null)
    {
        $setting = \DB::table('settings')->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Send OTP to phone number
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:10',
        ]);

        try {
            $phoneNumber = $this->formatPhoneNumber($request->phone_number);
            
            // For testing - skip Twilio configuration check
            // Uncomment the below code when you want to enable real SMS sending
            /*
            // Check if Twilio is configured
            $twilioSid = $this->getSetting('twilio_sid');
            $twilioToken = $this->getSetting('twilio_token');
            $twilioPhone = $this->getSetting('twilio_phone');

            if (empty($twilioSid) || empty($twilioToken) || empty($twilioPhone)) {
                return response()->json(['error' => 'SMS service not configured'], 400);
            }
            */

            // Generate 6-digit OTP
            $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store OTP in session for verification
            session(['otp_' . $phoneNumber => $otp]);
            session(['otp_expiry_' . $phoneNumber => now()->addMinutes(5)]);

            // For testing - bypass SMS sending and always show OTP on screen
            $message = "Your verification code is: {$otp}. Valid for 5 minutes.";
            
            // Log the OTP for testing (remove in production)
            \Log::info("OTP generated for testing: {$otp}", [
                'phone' => $phoneNumber,
                'otp' => $otp,
                'expiry' => now()->addMinutes(5)
            ]);
            
            // Skip actual SMS sending for testing
            // Uncomment the below code when you want to enable real SMS sending
            /*
            try {
                $twilio = new Client($twilioSid, $twilioToken);
                $messageResult = $twilio->messages->create(
                    $phoneNumber,
                    [
                        'from' => $twilioPhone,
                        'body' => $message
                    ]
                );
                
                \Log::info("SMS sent successfully to {$phoneNumber}: {$message}", [
                    'message_sid' => $messageResult->sid,
                    'status' => $messageResult->status,
                    'to' => $messageResult->to,
                    'from' => $messageResult->from
                ]);
            } catch (\Exception $twilioException) {
                \Log::error('Twilio SMS sending failed:', [
                    'phone' => $phoneNumber,
                    'twilio_sid' => $twilioSid,
                    'twilio_phone' => $twilioPhone,
                    'error' => $twilioException->getMessage(),
                    'error_code' => $twilioException->getCode(),
                ]);
                return response()->json(['error' => 'Failed to send SMS. Please try again.'], 500);
            }
            */

            // For testing purposes, return the OTP in the response
            return response()->json([
                'success' => 'OTP sent successfully',
                'otp' => $otp // Only for testing - remove in production
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send OTP:', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to send OTP'], 500);
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:10',
            'otp' => 'required|string|size:6',
        ]);

        try {
            $phoneNumber = $this->formatPhoneNumber($request->phone_number);
            
            $otp = $request->otp;
            
            // Get stored OTP and expiry
            $storedOtp = session('otp_' . $phoneNumber);
            $otpExpiry = session('otp_expiry_' . $phoneNumber);

            if (!$storedOtp || !$otpExpiry) {
                return response()->json(['error' => 'OTP expired or not found'], 400);
            }

            if (now()->isAfter($otpExpiry)) {
                // Clear expired OTP
                session()->forget(['otp_' . $phoneNumber, 'otp_expiry_' . $phoneNumber]);
                return response()->json(['error' => 'OTP has expired'], 400);
            }

            if ($otp !== $storedOtp) {
                return response()->json(['error' => 'Invalid OTP'], 400);
            }

            // Clear OTP after successful verification
            session()->forget(['otp_' . $phoneNumber, 'otp_expiry_' . $phoneNumber]);
            
            // Mark phone as verified in session
            session(['phone_verified_' . $phoneNumber => true]);

            return response()->json([
                'success' => 'Phone number verified successfully',
                'formatted_phone' => $phoneNumber // Return the formatted phone number
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to verify OTP:', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to verify OTP'], 500);
        }
    }

    /**
     * Clean up any expired session data.
     */
    private function cleanupExpiredSessionData()
    {
        $now = now();
        
        // Clean up pending booking data older than 30 minutes
        $pendingBooking = session('pending_booking');
        $bookingCreatedAt = session('pending_booking_created_at');
        
        if ($pendingBooking && $bookingCreatedAt) {
            $bookingTime = \Carbon\Carbon::parse($bookingCreatedAt);
            if ($now->diffInMinutes($bookingTime) > 30) {
                session()->forget(['pending_booking', 'pending_booking_created_at', 'razorpay_order_id']);
                \Log::info('Cleaned up expired pending booking session data');
            }
        }
        
        // Clean up any orphaned pending bookings older than 1 hour (from old system)
        $orphanedBookings = Booking::where('payment_status', 'pending')
            ->where('created_at', '<', $now->subHour())
            ->get();
            
        foreach ($orphanedBookings as $booking) {
            \Log::info('Cleaning up orphaned pending booking', [
                'booking_id' => $booking->id,
                'created_at' => $booking->created_at,
                'customer' => $booking->customer->name ?? 'Unknown'
            ]);
            $booking->delete();
        }
        
        $expiredKeys = collect(session()->all())
            ->filter(function ($value, $key) use ($now) {
                // Check for OTP keys
                if (str_starts_with($key, 'otp_')) {
                    $phoneNumber = substr($key, 4);
                    $expiryKey = 'otp_expiry_' . $phoneNumber;
                    $storedExpiry = session($expiryKey);
                    return $storedExpiry && $now->isAfter($storedExpiry);
                }
                // Check for phone verification keys
                if (str_starts_with($key, 'phone_verified_')) {
                    $phoneNumber = substr($key, 17);
                    $otpExpiry = session('otp_expiry_' . $phoneNumber);
                    return $otpExpiry && $now->isAfter($otpExpiry);
                }
                return false;
            })
            ->keys()
            ->toArray();

        foreach ($expiredKeys as $key) {
            session()->forget($key);
        }
    }

    /**
     * Generate flexible time slots starting from current time
     */
    private function generateFlexibleSlots($date, $service, $scheduleSetting, $totalDuration = null, $excludeBookingId = null)
    {
        $now = now();
        $currentTime = $now->format('H:i');
        $startTime = $scheduleSetting->start_time;
        $endTime = $scheduleSetting->end_time;
        $serviceDuration = $totalDuration ?? $service->duration;
        $bufferTime = $scheduleSetting->buffer_time_minutes;
        
        \Log::info('Generating flexible slots', [
            'current_time' => $currentTime,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'service_duration' => $serviceDuration,
            'buffer_time' => $bufferTime,
            'total_duration' => $totalDuration
        ]);
        
        $slots = [];
        
        // Start from current time if it's within business hours, otherwise from start time
        $slotStartTime = $now->copy();
        if ($slotStartTime->format('H:i') < $startTime) {
            $slotStartTime = $date->copy()->setTimeFromTimeString($startTime);
        }
        
        $businessEndTime = $date->copy()->setTimeFromTimeString($endTime);
        
        // Generate slots until we can't fit a complete service
        while ($slotStartTime->copy()->addMinutes($serviceDuration) <= $businessEndTime) {
            $slotEndTime = $slotStartTime->copy()->addMinutes($serviceDuration);
            
            // Check if any employees are available for this slot
            $availableEmployees = User::getAvailableEmployeesForSlot(
                $service->id,
                $date->format('Y-m-d'),
                $slotStartTime->format('H:i'),
                $serviceDuration,
                $excludeBookingId
            );
            
            if ($availableEmployees->count() > 0) {
                $slots[] = [
                    'start' => $slotStartTime->format('H:i'),
                    'end' => $slotEndTime->format('H:i'),
                    'available' => true,
                    'available_employees' => $availableEmployees->count()
                ];
                
                \Log::info('Flexible slot created', [
                    'start' => $slotStartTime->format('H:i'),
                    'end' => $slotEndTime->format('H:i'),
                    'available_employees' => $availableEmployees->count()
                ]);
            } else {
                \Log::info('Slot skipped - no available employees', [
                    'start' => $slotStartTime->format('H:i'),
                    'end' => $slotEndTime->format('H:i')
                ]);
            }
            
            // Move to next slot (service duration + buffer time)
            $nextSlotTime = $slotStartTime->copy()->addMinutes($serviceDuration + $bufferTime);
            \Log::info('Moving to next slot', [
                'current_slot_start' => $slotStartTime->format('H:i'),
                'current_slot_end' => $slotEndTime->format('H:i'),
                'service_duration' => $serviceDuration,
                'buffer_time' => $bufferTime,
                'next_slot_start' => $nextSlotTime->format('H:i'),
                'total_increment' => $serviceDuration + $bufferTime
            ]);
            $slotStartTime = $nextSlotTime;
        }
        
        return $slots;
    }
} 