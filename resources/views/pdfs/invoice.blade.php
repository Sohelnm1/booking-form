<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Arial', 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #fff;
        }
        
        .header {
            border-bottom: 3px solid #1890ff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .company-info {
            float: left;
            width: 60%;
        }
        
        .company-logo {
            font-size: 24px;
            font-weight: bold;
            color: #1890ff;
            margin-bottom: 10px;
        }
        
        .invoice-info {
            float: right;
            width: 35%;
            text-align: right;
        }
        
        .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: #1890ff;
            margin-bottom: 10px;
        }
        
        .clear {
            clear: both;
        }
        
        .customer-info {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1890ff;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        
        .info-grid {
            display: table;
            width: 100%;
        }
        
        .info-row {
            display: table-row;
        }
        
        .info-label {
            display: table-cell;
            width: 30%;
            font-weight: bold;
            padding: 5px 0;
        }
        
        .info-value {
            display: table-cell;
            width: 70%;
            padding: 5px 0;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .items-table th {
            background-color: #f5f5f5;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #ddd;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        
        .items-table .item-type {
            color: #666;
            font-size: 12px;
        }
        
        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .total-row.final {
            font-weight: bold;
            font-size: 16px;
            border-bottom: 2px solid #1890ff;
            color: #1890ff;
        }
        
        .payment-info {
            margin-top: 40px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-paid {
            background-color: #52c41a;
            color: white;
        }
        
        .status-pending {
            background-color: #faad14;
            color: white;
        }
        
        .status-cancelled {
            background-color: #ff4d4f;
            color: white;
        }
        
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <div class="company-logo">HospiPal</div>
            <div>{{ $company['address'] }}</div>
            <div>{{ $company['city'] }}, {{ $company['state'] }} {{ $company['zip'] }}</div>
            <div>Phone: {{ $company['phone'] }}</div>
            <div>Email: {{ $company['email'] }}</div>
            <div>Website: {{ $company['website'] }}</div>
            <div>GST: {{ $company['gst_number'] }}</div>
        </div>
        
        <div class="invoice-info">
            <div class="invoice-number">INVOICE</div>
            <div><strong>Invoice #:</strong> {{ $invoice->invoice_number }}</div>
            <div><strong>Date:</strong> {{ $invoice->issued_date->format('M d, Y') }}</div>
            <div><strong>Due Date:</strong> {{ $invoice->due_date->format('M d, Y') }}</div>
            <div><strong>Status:</strong> 
                <span class="status-badge status-{{ $invoice->status }}">
                    {{ ucfirst($invoice->status) }}
                </span>
            </div>
        </div>
        <div class="clear"></div>
    </div>
    
    <div class="customer-info">
        <div class="section-title">Bill To:</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">{{ $invoice->customer->name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $invoice->customer->email }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">{{ $invoice->customer->phone_number }}</div>
            </div>
            @if($invoice->booking)
            <div class="info-row">
                <div class="info-label">Booking #:</div>
                <div class="info-value">{{ $invoice->booking->id }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Appointment:</div>
                <div class="info-value">{{ $invoice->booking->appointment_time->format('M d, Y h:i A') }}</div>
            </div>
            @endif
        </div>
    </div>
    
    <div class="section-title">Invoice Items:</div>
    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->invoice_items as $item)
            <tr>
                <td>
                    {{ $item['description'] }}
                    <div class="item-type">{{ ucfirst($item['type']) }}</div>
                </td>
                <td>{{ ucfirst($item['type']) }}</td>
                <td>{{ $item['quantity'] }}</td>
                <td>&#8377;{{ number_format($item['unit_price'], 2) }}</td>
                <td>&#8377;{{ number_format($item['total'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>&#8377;{{ number_format($invoice->subtotal, 2) }}</span>
        </div>
        
        @if($invoice->discount_amount > 0)
        <div class="total-row">
            <span>Discount @if($invoice->coupon_code)({{ $invoice->coupon_code }})@endif:</span>
            <span>-&#8377;{{ number_format($invoice->discount_amount, 2) }}</span>
        </div>
        @endif
        
        <div class="total-row final">
            <span>Total:</span>
            <span>&#8377;{{ number_format($invoice->total_amount, 2) }}</span>
        </div>
    </div>
    <div class="clear"></div>
    
    @if($invoice->payment_status === 'paid')
    <div class="payment-info">
        <div class="section-title">Payment Information:</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Payment Status:</div>
                <div class="info-value">
                    <span class="status-badge status-paid">Paid</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Payment Date:</div>
                <div class="info-value">{{ $invoice->payment_date->format('M d, Y h:i A') }}</div>
            </div>
            @if($invoice->payment_method)
            <div class="info-row">
                <div class="info-label">Payment Method:</div>
                <div class="info-value">{{ ucfirst($invoice->payment_method) }}</div>
            </div>
            @endif
            @if($invoice->transaction_id)
            <div class="info-row">
                <div class="info-label">Transaction ID:</div>
                <div class="info-value">{{ $invoice->transaction_id }}</div>
            </div>
            @endif
        </div>
    </div>
    @endif
    
    @if($invoice->notes)
    <div style="margin-top: 30px;">
        <div class="section-title">Notes:</div>
        <div style="padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            {{ $invoice->notes }}
        </div>
    </div>
    @endif
    
    <div class="footer">
        <p><strong>Thank you for choosing HospiPal!</strong></p>
        <p>For any questions regarding this invoice, please contact us at {{ $company['email'] }} or call {{ $company['phone'] }}</p>
        <p>This is a computer-generated invoice. No signature required.</p>
    </div>
</body>
</html>
