<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class AppointmentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Booking::with([
            'customer',
            'service',
            'employee',
            'extras',
            'formResponses.formField'
        ])
        ->orderBy('appointment_time', 'desc')
        ->get();
    }

    public function headings(): array
    {
        return [
            'Booking ID',
            'Customer Name',
            'Customer Email',
            'Customer Phone',
            'Service Name',
            'Service Duration (min)',
            'Service Price (Rs.)',
            'Employee Name',
            'Employee Email',
            'Employee Phone',
            'Employee Status',
            'Appointment Date',
            'Appointment Time',
            'Duration (min)',
            'Extras',
            'Extras Total (Rs.)',
            'Total Amount (Rs.)',
            'Booking Status',
            'Payment Status',
            'Consent Given',
            'Consent Date',
            'Created At',
            'Custom Fields'
        ];
    }

    public function map($booking): array
    {
        // Format extras
        $extras = $booking->extras->map(function($extra) {
            return $extra->name . ' (Rs. ' . $extra->pivot->price . ')';
        })->implode(', ');
        
        $extrasTotal = $booking->extras->sum('pivot.price');

        // Format custom fields
        $customFields = '';
        if ($booking->formResponses) {
            $customFieldResponses = $booking->formResponses->filter(function($response) {
                return $response->formField && !$response->formField->is_primary;
            });
            
            $customFields = $customFieldResponses->map(function($response) {
                $value = $response->formatted_value ?? $response->response_value;
                return $response->formField->label . ': ' . ($value ?? 'Not provided');
            })->implode('; ');
        }

        return [
            $booking->id,
            $booking->customer->name,
            $booking->customer->email,
            $booking->customer->phone_number,
            $booking->service->name,
            $booking->service->duration,
            $booking->service->price,
            $booking->employee->name,
            $booking->employee->email,
            $booking->employee->phone_number,
            $booking->employee->is_active ? 'Active' : 'Inactive',
            Carbon::parse($booking->appointment_time)->setTimezone('Asia/Kolkata')->format('Y-m-d'),
            Carbon::parse($booking->appointment_time)->setTimezone('Asia/Kolkata')->format('H:i'),
            $booking->duration,
            $extras ?: 'No extras',
            $extrasTotal,
            $booking->total_amount,
            ucfirst($booking->status),
            ucfirst($booking->payment_status),
            $booking->consent_given ? 'Yes' : 'No',
            $booking->consent_given_at ? Carbon::parse($booking->consent_given_at)->setTimezone('Asia/Kolkata')->format('Y-m-d H:i') : 'Not recorded',
            Carbon::parse($booking->created_at)->setTimezone('Asia/Kolkata')->format('Y-m-d H:i'),
            $customFields
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E3F2FD']
                ]
            ]
        ];
    }
}
