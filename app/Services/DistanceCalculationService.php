<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DistanceCalculationService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = \DB::table('settings')->where('key', 'google_maps_api_key')->value('value');
    }

    /**
     * Calculate distance between two locations using Google Maps Distance Matrix API
     */
    public function calculateDistance($origin, $destination)
    {
        if (!$this->apiKey) {
            Log::warning('Google Maps API key not configured for distance calculation');
            return [
                'distance' => 0,
                'duration' => 0,
                'status' => 'API_KEY_MISSING'
            ];
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
                'origins' => $origin,
                'destinations' => $destination,
                'key' => $this->apiKey,
                'units' => 'metric'
            ]);

            $data = $response->json();

            if ($data['status'] === 'OK' && !empty($data['rows'][0]['elements'][0])) {
                $element = $data['rows'][0]['elements'][0];
                
                if ($element['status'] === 'OK') {
                    return [
                        'distance' => $element['distance']['value'] / 1000, // Convert meters to kilometers
                        'duration' => $element['duration']['value'], // Duration in seconds
                        'status' => 'OK'
                    ];
                } else {
                    Log::warning('Distance calculation failed', [
                        'origin' => $origin,
                        'destination' => $destination,
                        'status' => $element['status']
                    ]);
                    return [
                        'distance' => 0,
                        'duration' => 0,
                        'status' => $element['status']
                    ];
                }
            } else {
                Log::warning('Distance Matrix API response error', [
                    'origin' => $origin,
                    'destination' => $destination,
                    'response' => $data
                ]);
                return [
                    'distance' => 0,
                    'duration' => 0,
                    'status' => $data['status'] ?? 'UNKNOWN_ERROR'
                ];
            }
        } catch (\Exception $e) {
            Log::error('Distance calculation exception', [
                'origin' => $origin,
                'destination' => $destination,
                'error' => $e->getMessage()
            ]);
            return [
                'distance' => 0,
                'duration' => 0,
                'status' => 'EXCEPTION'
            ];
        }
    }

    /**
     * Calculate extra km charge based on distance and coverage
     */
    public function calculateExtraKmCharge($totalDistance, $coveredDistance, $pricePerKm)
    {
        $extraKm = max(0, $totalDistance - $coveredDistance);
        return $extraKm * $pricePerKm;
    }

    /**
     * Get distance calculation summary for an extra
     */
    public function getDistanceSummary($origin, $destination, $coveredDistance, $pricePerKm)
    {
        $distanceResult = $this->calculateDistance($origin, $destination);
        
        if ($distanceResult['status'] !== 'OK') {
            return [
                'distance' => 0,
                'extra_km' => 0,
                'extra_charge' => 0,
                'status' => $distanceResult['status']
            ];
        }

        $totalDistance = $distanceResult['distance'];
        $extraKm = max(0, $totalDistance - $coveredDistance);
        $extraCharge = $extraKm * $pricePerKm;

        return [
            'distance' => $totalDistance,
            'extra_km' => $extraKm,
            'extra_charge' => $extraCharge,
            'status' => 'OK'
        ];
    }

    /**
     * Calculate distance charges for form field responses
     */
    public function calculateFormFieldDistanceCharges($booking)
    {
        $totalExtraCharges = 0;
        $distanceResponses = [];

        // Get all form responses for this booking
        $formResponses = $booking->formResponses()->with('formField.linkedExtra')->get();

        // Group responses by linked extra
        $responsesByExtra = $formResponses->filter(function($response) {
            return $response->formField && $response->formField->has_distance_calculation;
        })->groupBy('formField.linked_extra_id');

        foreach ($responsesByExtra as $extraId => $responses) {
            if (!$extraId) continue;

            $extra = \App\Models\Extra::find($extraId);
            if (!$extra) continue;

            // Find origin and destination responses
            $originResponse = $responses->first(function($response) {
                return $response->formField->distance_calculation_type === 'origin';
            });

            $destinationResponse = $responses->first(function($response) {
                return $response->formField->distance_calculation_type === 'destination';
            });

            if ($originResponse && $destinationResponse) {
                // Use origin field settings (only origin field has distance settings)
                $originField = $originResponse->formField;
                
                // Use the origin field's settings
                $coveredDistance = $originField ? $originField->covered_distance_km : 10.00;
                $pricePerKm = $originField ? $originField->price_per_extra_km : 10.00;
                
                $summary = $this->getDistanceSummary(
                    $originResponse->response_value,
                    $destinationResponse->response_value,
                    $coveredDistance,
                    $pricePerKm
                );

                // Update both responses with distance data
                $originResponse->update([
                    'calculated_distance_km' => $summary['distance'],
                    'extra_km_charge' => $summary['extra_charge'] / 2 // Split charge between origin and destination
                ]);

                $destinationResponse->update([
                    'calculated_distance_km' => $summary['distance'],
                    'extra_km_charge' => $summary['extra_charge'] / 2 // Split charge between origin and destination
                ]);

                $totalExtraCharges += $summary['extra_charge'];
                $distanceResponses[] = [
                    'extra_id' => $extraId,
                    'extra_name' => $extra->name,
                    'distance' => $summary['distance'],
                    'extra_km' => $summary['extra_km'],
                    'extra_charge' => $summary['extra_charge'],
                    'origin_field' => $originResponse->formField->label,
                    'destination_field' => $destinationResponse->formField->label
                ];
            }
        }

        return [
            'total_extra_charges' => $totalExtraCharges,
            'distance_responses' => $distanceResponses
        ];
    }
}
