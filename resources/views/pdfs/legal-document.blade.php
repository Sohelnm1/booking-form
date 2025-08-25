<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $document_type }} - {{ $company }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1890ff;
            padding-bottom: 20px;
        }
        .content {
            font-size: 14px;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $company }}</h1>
        <h2>{{ $title }}</h2>
        <p>Version: {{ $version }} | Last Updated: {{ $last_updated ? $last_updated->format('F j, Y') : 'N/A' }}</p>
    </div>

    <div class="content">
        {!! nl2br(e($content)) !!}
    </div>

    <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
        <p><strong>{{ $company }}</strong></p>
        <p>Generated on: {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>
