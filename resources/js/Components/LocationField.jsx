import React, { useState, useEffect, useRef } from "react";
import { Input, Button, List, Spin, message } from "antd";
import { EnvironmentOutlined, AimOutlined } from "@ant-design/icons";

const LocationField = ({
    value,
    onChange,
    placeholder = "Enter your location",
    size = "large",
    disabled = false,
    allowCurrentLocation = true,
    ...props
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Initialize Google Places services
        if (window.google && window.google.maps) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
            placesService.current = new window.google.maps.places.PlacesService(
                document.createElement("div")
            );
        }
    }, []);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        // For form compatibility, pass the input value directly
        onChange?.(inputValue);

        if (!inputValue.trim() || !autocompleteService.current) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        setShowSuggestions(true);

        autocompleteService.current.getPlacePredictions(
            {
                input: inputValue,
                types: ["geocode", "establishment"],
            },
            (predictions, status) => {
                setLoading(false);
                if (
                    status ===
                        window.google.maps.places.PlacesServiceStatus.OK &&
                    predictions
                ) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            }
        );
    };

    const handleSuggestionClick = (suggestion) => {
        if (placesService.current) {
            placesService.current.getDetails(
                {
                    placeId: suggestion.place_id,
                    fields: ["formatted_address", "geometry", "name"],
                },
                (place, status) => {
                    if (
                        status ===
                            window.google.maps.places.PlacesServiceStatus.OK &&
                        place
                    ) {
                        const locationData = {
                            address:
                                place.formatted_address ||
                                suggestion.description,
                            name:
                                place.name ||
                                suggestion.structured_formatting?.main_text ||
                                "",
                            latitude: place.geometry?.location?.lat(),
                            longitude: place.geometry?.location?.lng(),
                            placeId: suggestion.place_id,
                        };

                        // For form compatibility, pass the address as the main value
                        onChange?.(locationData.address);
                        setShowSuggestions(false);
                        setSuggestions([]);
                    }
                }
            );
        } else {
            // Fallback if Places service is not available
            onChange?.(suggestion.description);
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            message.error("Geolocation is not supported by this browser.");
            return;
        }

        setCurrentLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                if (placesService.current) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode(
                        { location: { lat: latitude, lng: longitude } },
                        (results, status) => {
                            setCurrentLocationLoading(false);
                            if (status === "OK" && results[0]) {
                                const locationData = {
                                    address: results[0].formatted_address,
                                    name: results[0].formatted_address,
                                    latitude: latitude,
                                    longitude: longitude,
                                    placeId: results[0].place_id,
                                };

                                // For form compatibility, pass the address as the main value
                                onChange?.(locationData.address);
                                message.success("Current location detected!");
                            } else {
                                message.error(
                                    "Could not get address for current location."
                                );
                            }
                        }
                    );
                } else {
                    // Fallback if Google services are not available
                    setCurrentLocationLoading(false);
                    const locationData = {
                        address: `Current Location (${latitude.toFixed(
                            6
                        )}, ${longitude.toFixed(6)})`,
                        name: "Current Location",
                        latitude: latitude,
                        longitude: longitude,
                    };
                    // For form compatibility, pass the address as the main value
                    onChange?.(locationData.address);
                    message.success("Current location detected!");
                }
            },
            (error) => {
                setCurrentLocationLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message.error(
                            "Location access denied. Please enable location services."
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message.error("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        message.error("Location request timed out.");
                        break;
                    default:
                        message.error(
                            "An unknown error occurred while getting location."
                        );
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    const handleFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    const displayValue = typeof value === "object" ? value.address : value;

    return (
        <div style={{ position: "relative" }}>
            <Input
                ref={inputRef}
                value={displayValue || ""}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                size={size}
                disabled={disabled}
                prefix={<EnvironmentOutlined />}
                suffix={
                    allowCurrentLocation && (
                        <Button
                            type="text"
                            icon={<AimOutlined />}
                            loading={currentLocationLoading}
                            onClick={getCurrentLocation}
                            disabled={disabled}
                            title="Use current location"
                            style={{ border: "none", padding: 0 }}
                        />
                    )
                }
                {...props}
            />

            {showSuggestions && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        backgroundColor: "white",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        maxHeight: "200px",
                        overflow: "auto",
                    }}
                >
                    {loading ? (
                        <div style={{ padding: "12px", textAlign: "center" }}>
                            <Spin size="small" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <List
                            size="small"
                            dataSource={suggestions}
                            renderItem={(suggestion) => (
                                <List.Item
                                    style={{
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0",
                                    }}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor =
                                            "#f5f5f5";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 500 }}>
                                            {suggestion.structured_formatting
                                                ?.main_text ||
                                                suggestion.description}
                                        </div>
                                        {suggestion.structured_formatting
                                            ?.secondary_text && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                }}
                                            >
                                                {
                                                    suggestion
                                                        .structured_formatting
                                                        .secondary_text
                                                }
                                            </div>
                                        )}
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div
                            style={{
                                padding: "12px",
                                textAlign: "center",
                                color: "#666",
                            }}
                        >
                            No suggestions found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationField;
