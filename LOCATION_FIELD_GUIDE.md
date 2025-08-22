# Location Field Implementation Guide

## Overview

The location field type has been added to the booking form system, allowing customers to input their location with autocomplete suggestions and current location detection.

## Features

-   **Location Autocomplete**: Uses Google Places API to provide location suggestions as users type
-   **Current Location Detection**: Allows users to use their current GPS location
-   **Form Integration**: Seamlessly integrates with the existing booking form system
-   **Data Storage**: Stores location data including address, coordinates, and place ID

## Setup Requirements

### 1. Google Maps API Key

Configure your Google Maps API key through the admin panel:

1. Go to **Admin > Integration**
2. Find the **Google Maps API** integration card
3. Click **Configure**
4. Enter your Google Maps API key
5. Select the enabled services (Places API, Geocoding API, Maps JavaScript API)
6. Click **Save Changes**

### 2. Google Maps API Services

Ensure your Google Maps API key has the following services enabled in Google Cloud Console:

-   Places API
-   Geocoding API
-   Maps JavaScript API

## Admin Configuration

### Adding a Location Field

1. Go to **Admin > Forms**
2. Click **Add Field**
3. Set **Field Type** to "Location Picker"
4. Configure the following settings:
    - **Field Label**: e.g., "Your Location"
    - **Field Name**: Auto-generated from label
    - **Placeholder**: e.g., "Enter your address or use current location"
    - **Help Text**: Optional guidance for users
    - **Allow Current Location**: Toggle to enable/disable current location button
    - **Required**: Whether the field is mandatory
    - **Rendering Control**: Choose when to show this field (services/extras/both)

### Location Field Settings

-   **Allow Current Location**: When enabled, shows a location button that users can click to use their current GPS location

## User Experience

### For Customers

1. **Typing Location**: Users can start typing their address and see autocomplete suggestions
2. **Selecting from Suggestions**: Click on any suggestion to fill in the complete address
3. **Current Location**: Click the location button (if enabled) to use GPS location
4. **Manual Entry**: Users can also type their full address manually

### Location Data Stored

When a location is selected, the system stores:

-   **Address**: Full formatted address
-   **Latitude**: GPS latitude coordinate
-   **Longitude**: GPS longitude coordinate
-   **Place ID**: Google Places unique identifier
-   **Name**: Location name (if available)

## Technical Implementation

### Frontend Components

-   **LocationField.jsx**: Main component handling location input and suggestions
-   **Google Maps Integration**: Uses Google Places API for autocomplete and geocoding
-   **Form Integration**: Compatible with Ant Design Form components

### Backend Processing

-   **FormField Model**: Updated to include 'location' field type
-   **Validation**: Basic string validation for location fields
-   **Data Storage**: Enhanced response formatting for location data

### API Requirements

The location field requires:

-   Google Maps JavaScript API
-   Google Places API
-   Google Geocoding API

## Browser Compatibility

-   **Geolocation API**: Required for current location feature
-   **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
-   **HTTPS**: Geolocation requires secure connection

## Error Handling

The component handles various error scenarios:

-   **API Unavailable**: Falls back to basic text input
-   **Geolocation Denied**: Shows appropriate error message
-   **Network Issues**: Graceful degradation
-   **Invalid API Key**: Continues with basic functionality

## Customization

### Styling

The LocationField component uses Ant Design styling and can be customized through:

-   CSS classes
-   Inline styles
-   Ant Design theme customization

### Functionality

You can extend the component by:

-   Adding custom validation rules
-   Implementing additional location services
-   Customizing the suggestion display
-   Adding location history

## Troubleshooting

### Common Issues

1. **No Suggestions Appearing**

    - Check Google Maps API key is valid
    - Verify Places API is enabled
    - Check browser console for errors

2. **Current Location Not Working**

    - Ensure HTTPS is enabled
    - Check browser location permissions
    - Verify geolocation API support

3. **Form Submission Issues**
    - Check field validation rules
    - Verify form data structure
    - Review server-side processing

### Debug Mode

Enable debug logging by checking browser console for:

-   API response errors
-   Geolocation errors
-   Form validation issues

## Security Considerations

-   **API Key Security**: Keep your Google Maps API key secure
-   **Rate Limiting**: Monitor API usage to avoid quota limits
-   **Data Privacy**: Consider GDPR compliance for location data
-   **HTTPS Requirement**: Geolocation requires secure connection

## Future Enhancements

Potential improvements:

-   Location history for returning users
-   Custom location validation rules
-   Integration with mapping services
-   Advanced location analytics
-   Multi-language support for addresses
