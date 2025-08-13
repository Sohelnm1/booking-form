<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Appointment Details - {{ $company }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1890ff;
            padding-bottom: 20px;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1890ff;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        
        .document-title {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .document-meta {
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        
        .booking-id {
            background-color: #f0f8ff;
            border: 2px solid #1890ff;
            padding: 10px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        
        .booking-id-text {
            font-size: 16px;
            font-weight: bold;
            color: #1890ff;
        }
        
        .section {
            margin-bottom: 25px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .section-title {
            background-color: #f8f9fa;
            color: #1890ff;
            font-size: 14px;
            font-weight: bold;
            padding: 10px 15px;
            margin: 0;
            border-bottom: 2px solid #1890ff;
            text-transform: uppercase;
        }
        
        .section-content {
            padding: 15px;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .info-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        
        .info-table tr:nth-child(even) {
            background-color: #fafbfc;
        }
        
        .info-table tr:last-child td {
            border-bottom: none;
        }
        
        .info-label {
            width: 35%;
            font-weight: bold;
            color: #495057;
            border-right: 1px solid #ddd;
        }
        
        .info-value {
            width: 65%;
            color: #333;
        }
        
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-confirmed {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .status-completed {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .status-paid {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .total-row {
            background-color: #f8f9fa !important;
            border-top: 2px solid #ddd !important;
        }
        
        .total-label {
            font-weight: bold;
            font-size: 14px;
        }
        
        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #1890ff;
            text-align: right;
        }
        
        .price-highlight {
            font-weight: bold;
            color: #28a745;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 2px solid #ddd;
            padding-top: 15px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        
        .contact-info {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: rgba(24, 144, 255, 0.1);
            font-weight: bold;
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="watermark">{{ $company }}</div>
    
    <div class="header">
        <div class="company-name">{{ $company }}</div>
        <div class="document-title">Appointment Details</div>
        <div class="document-meta">
            Generated on {{ now()->format('F j, Y \a\t g:i A') }} | Document ID: APT-{{ $booking->id }}
        </div>
    </div>

    <div class="booking-id">
        <div class="booking-id-text">Booking Reference: #{{ $booking->id }}</div>
    </div>

    <!-- Customer Information -->
    <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">Full Name</td>
                    <td class="info-value">{{ $booking->customer->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">Email Address</td>
                    <td class="info-value">{{ $booking->customer->email }}</td>
                </tr>
                <tr>
                    <td class="info-label">Phone Number</td>
                    <td class="info-value">{{ $booking->customer->phone_number }}</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- Appointment Details -->
    <div class="section">
        <div class="section-title">Appointment Details</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">Service</td>
                    <td class="info-value">{{ $booking->service->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">Assigned Employee</td>
                    <td class="info-value">{{ $booking->employee->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">Appointment Date & Time</td>
                    <td class="info-value">{{ \Carbon\Carbon::parse($booking->appointment_time)->setTimezone('Asia/Kolkata')->format('l, F j, Y \a\t g:i A') }}</td>
                </tr>
                <tr>
                    <td class="info-label">Duration</td>
                    <td class="info-value">{{ $booking->duration }} minutes</td>
                </tr>
                <tr>
                    <td class="info-label">Appointment Status</td>
                    <td class="info-value">
                        <span class="status status-{{ $booking->status }}">
                            {{ ucfirst($booking->status) }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="info-label">Payment Status</td>
                    <td class="info-value">
                        <span class="status status-{{ $booking->payment_status }}">
                            {{ ucfirst($booking->payment_status) }}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    @if($booking->extras && count($booking->extras) > 0)
    <!-- Additional Services -->
    <div class="section">
        <div class="section-title">Additional Services</div>
        <div class="section-content">
            <table class="info-table">
                @foreach($booking->extras as $extra)
                <tr>
                    <td class="info-label">{{ $extra->name }}</td>
                    <td class="info-value price-highlight">Rs. {{ $extra->pivot->price }}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
    @endif

    @if($booking->formResponses && count($booking->formResponses) > 0)
    <!-- Custom Field Responses -->
    <div class="section">
        <div class="section-title">Additional Information</div>
        <div class="section-content">
            <table class="info-table">
                @foreach($booking->formResponses as $response)
                    @if($response->formField && !$response->formField->is_primary)
                    <tr>
                        <td class="info-label">{{ $response->formField->label }}</td>
                        <td class="info-value">{{ $response->formatted_value ?? $response->response_value ?? 'Not provided' }}</td>
                    </tr>
                    @endif
                @endforeach
            </table>
        </div>
    </div>
    @endif

    <!-- Pricing Summary -->
    <div class="section">
        <div class="section-title">Pricing Summary</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">Service Price</td>
                    <td class="info-value price-highlight">Rs. {{ $booking->service->price }}</td>
                </tr>
                @if($booking->extras && count($booking->extras) > 0)
                <tr>
                    <td class="info-label">Additional Services</td>
                    <td class="info-value price-highlight">Rs. {{ $booking->extras->sum('pivot.price') }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td class="info-label total-label">Total Amount</td>
                    <td class="info-value total-amount">Rs. {{ $booking->total_amount }}</td>
                </tr>
            </table>
        </div>
    </div>

    @if($booking->consent_given)
    <!-- Consent Information -->
    <div class="section">
        <div class="section-title">Consent Information</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">Consent Given</td>
                    <td class="info-value">
                        <span class="status status-confirmed">Yes</span>
                    </td>
                </tr>
                @if($booking->consent_given_at)
                <tr>
                    <td class="info-label">Consent Date</td>
                    <td class="info-value">{{ \Carbon\Carbon::parse($booking->consent_given_at)->setTimezone('Asia/Kolkata')->format('l, F j, Y \a\t g:i A') }}</td>
                </tr>
                @endif
            </table>
        </div>
    </div>
    @endif

    <div class="footer">
        <p><strong>This document was generated automatically by {{ $company }} booking system.</strong></p>
        <p>For any questions or concerns regarding this appointment, please contact our support team.</p>
        <div class="contact-info">
            <p>📧 support@hospipal.com | 📞 +91-XXXXXXXXXX | 🌐 www.hospipal.com</p>
        </div>
    </div>
</body>
</html>
