# Invoice System Guide

## Overview

The invoice system provides comprehensive invoice management for both admin and customer views. It automatically generates professional invoices for all bookings and reschedule payments, with detailed breakdowns including services, extras, discounts, and reschedule fees.

## Features

### 🧾 **Automatic Invoice Generation**

-   **Booking Invoices**: Created automatically when payments are successful
-   **Reschedule Invoices**: Generated for reschedule fee payments
-   **Professional Templates**: Clean, professional PDF invoices
-   **Unique Invoice Numbers**: Auto-generated with format `INV-YYYYMM-XXXX`

### 📊 **Admin Invoice Management**

-   **Invoice Dashboard**: Statistics and overview of all invoices
-   **Search & Filter**: Find invoices by customer, service, status, or date range
-   **Invoice Details**: Comprehensive view of each invoice
-   **Status Management**: Mark invoices as paid, cancelled, or pending
-   **PDF Download**: Download professional invoice PDFs
-   **Email Integration**: Send invoices via email (ready for implementation)

### 👤 **Customer Invoice Access**

-   **Personal Invoice List**: View all their invoices
-   **Invoice Details**: Detailed breakdown of charges
-   **PDF Download**: Download their invoices
-   **Statistics**: Overview of their invoice history

## Database Structure

### Invoices Table

```sql
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(255) UNIQUE NOT NULL,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    invoice_type VARCHAR(50) DEFAULT 'booking',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    reschedule_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    coupon_code VARCHAR(100),
    coupon_discount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NULL,
    paid_date TIMESTAMP NULL,
    notes TEXT,
    invoice_items JSON,
    payment_history JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Key Fields

-   **invoice_number**: Auto-generated unique identifier (INV-202412-0001)
-   **invoice_type**: Type of invoice (booking, reschedule, cancellation)
-   **invoice_items**: JSON array of line items with descriptions and prices
-   **payment_history**: JSON array tracking payment attempts
-   **status**: Invoice status (draft, sent, paid, cancelled)
-   **payment_status**: Payment status (pending, paid, failed, refunded)

## Invoice Generation Process

### 1. Booking Payment Success

```php
// In BookingController::paymentSuccess()
$booking->update([
    'status' => 'confirmed',
    'payment_status' => 'paid',
    'payment_method' => 'razorpay',
    'transaction_id' => $request->razorpay_payment_id,
]);

// Create invoice automatically
$booking->createOrUpdateInvoice();
```

### 2. Reschedule Payment Success

```php
// In CustomerController::reschedulePaymentSuccess()
$booking->update([
    'reschedule_payment_amount' => $rescheduleData['reschedule_fee'],
    'reschedule_payment_id' => $request->razorpay_payment_id,
    'reschedule_payment_date' => now(),
    'reschedule_payment_status' => 'paid',
]);

// Create or update invoice
$booking->createOrUpdateInvoice();
```

### 3. Invoice Creation Logic

```php
// Invoice::createFromBooking()
public static function createFromBooking(Booking $booking, string $type = 'booking'): self
{
    $invoiceItems = [
        [
            'description' => $booking->service->name,
            'quantity' => 1,
            'unit_price' => $booking->service->price,
            'total' => $booking->service->price,
            'type' => 'service'
        ]
    ];

    // Add extras
    foreach ($booking->extras as $extra) {
        $invoiceItems[] = [
            'description' => $extra->name,
            'quantity' => 1,
            'unit_price' => $extra->pivot->price,
            'total' => $extra->pivot->price,
            'type' => 'extra'
        ];
    }

    // Add reschedule fee if applicable
    if ($booking->reschedule_payment_amount > 0) {
        $invoiceItems[] = [
            'description' => 'Reschedule Fee',
            'quantity' => 1,
            'unit_price' => $booking->reschedule_payment_amount,
            'total' => $booking->reschedule_payment_amount,
            'type' => 'reschedule_fee'
        ];
    }

    $subtotal = collect($invoiceItems)->sum('total');
    $discountAmount = $booking->discount_amount ?? 0;
    $rescheduleFee = $booking->reschedule_payment_amount ?? 0;
    $totalAmount = $subtotal - $discountAmount + $rescheduleFee;

    return self::create([
        'invoice_number' => self::generateInvoiceNumber(),
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'invoice_type' => $type,
        'subtotal' => $subtotal,
        'discount_amount' => $discountAmount,
        'reschedule_fee' => $rescheduleFee,
        'total_amount' => $totalAmount,
        'currency' => 'INR',
        'payment_method' => $booking->payment_method,
        'transaction_id' => $booking->transaction_id,
        'payment_status' => $booking->payment_status,
        'payment_date' => $booking->payment_status === 'paid' ? now() : null,
        'coupon_code' => $booking->coupon_code,
        'coupon_discount' => $discountAmount,
        'status' => $booking->payment_status === 'paid' ? 'paid' : 'pending',
        'issued_date' => now(),
        'due_date' => now()->addDays(7),
        'paid_date' => $booking->payment_status === 'paid' ? now() : null,
        'invoice_items' => $invoiceItems,
        'payment_history' => [
            [
                'date' => now()->toISOString(),
                'status' => $booking->payment_status,
                'amount' => $totalAmount,
                'transaction_id' => $booking->transaction_id,
                'method' => $booking->payment_method
            ]
        ]
    ]);
}
```

## PDF Invoice Template

### Professional Design Features

-   **Company Header**: HospiPal branding with contact information
-   **Invoice Details**: Number, date, due date, and status
-   **Customer Information**: Name, email, phone, booking details
-   **Itemized Breakdown**: Services, extras, and reschedule fees
-   **Payment Summary**: Subtotal, discounts, fees, and total
-   **Payment Information**: Method, transaction ID, payment date
-   **Professional Styling**: Clean layout with proper spacing and colors

### Template Structure

```html
<!-- Company Information -->
<div class="company-info">
    <div class="company-logo">HospiPal</div>
    <div>Address, Phone, Email, Website, GST</div>
</div>

<!-- Invoice Details -->
<div class="invoice-info">
    <div class="invoice-number">INVOICE</div>
    <div>Invoice #, Date, Due Date, Status</div>
</div>

<!-- Customer Information -->
<div class="customer-info">
    <div>Name, Email, Phone, Booking #, Appointment</div>
</div>

<!-- Invoice Items Table -->
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
        <!-- Service, Extras, Reschedule Fees -->
    </tbody>
</table>

<!-- Totals Section -->
<div class="totals">
    <div>Subtotal, Discount, Reschedule Fee, Total</div>
</div>

<!-- Payment Information -->
<div class="payment-info">
    <div>Payment Status, Method, Transaction ID, Date</div>
</div>
```

## Admin Interface

### Invoice Dashboard

**Statistics Cards:**

-   Total Invoices
-   Paid Invoices
-   Pending Invoices
-   Total Revenue
-   Overdue Invoices

**Invoice List Features:**

-   Search by invoice number, customer, or service
-   Filter by status (All, Paid, Pending, Cancelled, Draft)
-   Date range filtering
-   Pagination with customizable page sizes

**Invoice Actions:**

-   View detailed invoice information
-   Download PDF invoice
-   Send invoice via email
-   Mark as paid/cancelled
-   Print invoice

### Invoice Details Modal

**Sections:**

1. **Invoice Information**: Number, status, dates, total amount
2. **Customer Information**: Name, email, phone
3. **Booking Information**: ID, service, appointment, employee
4. **Payment Information**: Status, method, transaction ID, date
5. **Action Buttons**: Download, print, mark as paid/cancelled, send email

## Customer Interface

### Invoice List Page

**Features:**

-   Personal invoice statistics
-   List of all customer invoices
-   Search and filter capabilities
-   Download and view actions

**Statistics:**

-   Total Invoices
-   Paid Invoices
-   Total Spent

### Invoice Details

**Information Displayed:**

-   Invoice number and dates
-   Service and booking details
-   Payment information
-   Itemized breakdown
-   Total calculations

**Actions:**

-   Download PDF invoice
-   Print invoice
-   View detailed breakdown

## Routes

### Admin Routes

```php
// Invoice management
Route::get('/admin/invoices', [InvoiceController::class, 'adminIndex']);
Route::get('/admin/invoices/{id}', [InvoiceController::class, 'show']);
Route::get('/admin/invoices/{id}/download', [InvoiceController::class, 'adminDownloadPdf']);
Route::post('/admin/invoices/{id}/send-email', [InvoiceController::class, 'sendEmail']);
Route::post('/admin/invoices/{id}/mark-paid', [InvoiceController::class, 'markAsPaid']);
Route::post('/admin/invoices/{id}/mark-cancelled', [InvoiceController::class, 'markAsCancelled']);
Route::get('/admin/invoices/stats', [InvoiceController::class, 'getStats']);
Route::get('/admin/invoices/search', [InvoiceController::class, 'search']);
```

### Customer Routes

```php
// Customer invoice access
Route::get('/customer/invoices', [InvoiceController::class, 'customerIndex']);
Route::get('/customer/invoices/{id}', [InvoiceController::class, 'show']);
Route::get('/customer/invoices/{id}/download', [InvoiceController::class, 'downloadPdf']);
```

## Invoice Number Generation

### Format: `INV-YYYYMM-XXXX`

**Example:** `INV-202412-0001`

**Logic:**

```php
public static function generateInvoiceNumber(): string
{
    $year = date('Y');
    $month = date('m');

    // Get the last invoice number for this year/month
    $lastInvoice = self::where('invoice_number', 'like', "INV-{$year}{$month}-%")
        ->orderBy('invoice_number', 'desc')
        ->first();

    if ($lastInvoice) {
        // Extract the sequence number and increment
        $parts = explode('-', $lastInvoice->invoice_number);
        $sequence = intval($parts[2]) + 1;
    } else {
        $sequence = 1;
    }

    return sprintf("INV-%s%s-%04d", $year, $month, $sequence);
}
```

## Integration Points

### Booking Success Flow

1. **Payment Success** → Update booking status
2. **Create Invoice** → Generate invoice with all details
3. **Store Invoice** → Save to database with relationships
4. **Customer Access** → Invoice available in customer portal

### Reschedule Payment Flow

1. **Reschedule Request** → Check policy and calculate fee
2. **Payment Success** → Update booking with reschedule payment
3. **Update Invoice** → Add reschedule fee to existing invoice
4. **Customer Notification** → Invoice updated with new charges

### Customer Booking Detail

-   **Invoice Download Button**: Available when invoice exists
-   **Invoice Information**: Shows in booking details
-   **Direct Access**: Link to invoice management page

## Future Enhancements

### Planned Features

1. **Email Integration**

    - Automated invoice emails
    - Payment reminders
    - Receipt confirmations

2. **Advanced Reporting**

    - Revenue analytics
    - Invoice aging reports
    - Customer payment history

3. **Payment Integration**

    - Online invoice payment
    - Payment gateway integration
    - Automatic payment tracking

4. **Invoice Customization**

    - Custom invoice templates
    - Company branding options
    - Multi-language support

5. **Bulk Operations**
    - Bulk invoice generation
    - Mass email sending
    - Batch status updates

## Security Considerations

### Access Control

-   **Customer Access**: Only own invoices
-   **Admin Access**: All invoices with proper authentication
-   **PDF Security**: Signed URLs with expiration
-   **Data Protection**: Encrypted sensitive information

### Audit Trail

-   **Payment History**: Track all payment attempts
-   **Status Changes**: Log all invoice status updates
-   **User Actions**: Record who performed what actions
-   **Timestamps**: Accurate creation and modification times

## Testing Scenarios

### Invoice Generation

1. **New Booking**: Verify invoice created with all details
2. **Reschedule Payment**: Check reschedule fee added to invoice
3. **Coupon Applied**: Ensure discount properly reflected
4. **Multiple Extras**: Verify all extras included in breakdown

### Admin Functions

1. **Invoice Search**: Test search by various criteria
2. **Status Updates**: Verify status change functionality
3. **PDF Download**: Test PDF generation and download
4. **Email Sending**: Test email functionality

### Customer Functions

1. **Invoice Access**: Verify customers see only their invoices
2. **PDF Download**: Test customer PDF access
3. **Invoice Details**: Check all information displayed correctly
4. **Navigation**: Test invoice page navigation

## Troubleshooting

### Common Issues

1. **Invoice Not Generated**

    - Check payment success flow
    - Verify booking relationships loaded
    - Check database constraints

2. **PDF Generation Fails**

    - Verify DomPDF installation
    - Check template syntax
    - Ensure proper data relationships

3. **Invoice Number Duplicates**

    - Check unique constraint
    - Verify generation logic
    - Review concurrent access

4. **Missing Invoice Items**
    - Check booking extras relationship
    - Verify reschedule fee calculation
    - Review invoice creation logic

### Debug Steps

1. **Check Logs**: Review Laravel logs for errors
2. **Verify Data**: Check database for invoice records
3. **Test Relationships**: Ensure all relationships loaded
4. **Template Debug**: Test PDF template separately
5. **Route Testing**: Verify all routes accessible

## Conclusion

The invoice system provides a comprehensive solution for managing all financial transactions in the booking system. It automatically generates professional invoices, provides detailed breakdowns, and offers both admin and customer access to invoice information. The system is designed to be scalable, secure, and user-friendly while maintaining professional standards for financial documentation.
