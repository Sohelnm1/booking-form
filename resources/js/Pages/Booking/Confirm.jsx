import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Divider,
    Progress,
    Form,
    Input,
    InputNumber,
    Select,
    Alert,
    Steps,
    Descriptions,
    Result,
    Radio,
    Checkbox,
    DatePicker,
    TimePicker,
    message,
    Spin,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    GiftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";
import LocationField from "../../Components/LocationField";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Confirm({
    service,
    selectedExtras,
    date,
    time,
    consentSettings,
    form,
    formFields,
    paymentSettings,
    totalPrice,
    verifiedPhone,
    selectedPricingTier,
    selectedDuration,
    selectedPrice,
    bookingSettings,
    auth,
}) {
    const [formInstance] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [finalPrice, setFinalPrice] = useState(totalPrice);
    const [distanceCharges, setDistanceCharges] = useState(0);
    const [distanceLoading, setDistanceLoading] = useState(false);

    // Calculate total duration
    const serviceDuration = selectedPricingTier
        ? selectedPricingTier.duration_minutes
        : service.duration;
    const totalDuration =
        serviceDuration +
        selectedExtras.reduce((sum, extra) => {
            const quantity = extra.quantity || 1;
            // Check if durationRelation exists and calculate total minutes
            if (extra.durationRelation) {
                const totalMinutes =
                    extra.durationRelation.hours * 60 +
                    extra.durationRelation.minutes;
                return sum + totalMinutes * quantity;
            }
            // Fallback to total_duration if available
            return sum + (extra.total_duration || 0) * quantity;
        }, 0);

    // Set initial form values when component mounts
    React.useEffect(() => {
        console.log("Confirm page - verifiedPhone received:", verifiedPhone);
        console.log("Confirm page - formInstance available:", !!formInstance);
        console.log("Confirm page - formFields:", formFields);
        console.log("Confirm page - bookingSettings:", bookingSettings);
        console.log(
            "Confirm page - URL search params:",
            window.location.search
        );
        console.log(
            "Confirm page - gender preference from URL:",
            new URLSearchParams(window.location.search).get("gender_preference")
        );

        if (verifiedPhone && formFields) {
            // Find the phone number field dynamically
            const phoneField = formFields.find(
                (field) =>
                    field.is_primary &&
                    (field.name === "customer_phone" ||
                        field.name === "phone_number")
            );

            if (phoneField) {
                console.log(
                    "Found phone field:",
                    phoneField.name,
                    "Setting value:",
                    verifiedPhone
                );
                formInstance.setFieldsValue({
                    [phoneField.name]: verifiedPhone,
                });

                // Verify the value was set
                setTimeout(() => {
                    const currentValues = formInstance.getFieldsValue();
                    console.log(
                        "Form values after setting phone:",
                        currentValues
                    );
                }, 100);
            } else {
                console.log("No phone field found in form fields");
            }
        } else {
            console.log("No verified phone number available or no form fields");
        }
    }, [verifiedPhone, formInstance, formFields]);

    // Function to calculate distance charges
    const calculateDistanceCharges = async (formValues) => {
        console.log("calculateDistanceCharges called with:", formValues);
        if (!formValues) return;

        // Find location fields with distance calculation enabled
        const locationFields =
            formFields?.filter(
                (field) =>
                    field.type === "location" &&
                    field.has_distance_calculation &&
                    field.linked_extra_id
            ) || [];

        console.log("Location fields found:", locationFields);
        if (locationFields.length === 0) {
            console.log("No location fields with distance calculation found");
            return;
        }

        // Group fields by linked extra
        const fieldsByExtra = {};
        locationFields.forEach((field) => {
            if (!fieldsByExtra[field.linked_extra_id]) {
                fieldsByExtra[field.linked_extra_id] = [];
            }
            fieldsByExtra[field.linked_extra_id].push(field);
        });

        // Check if we have both origin and destination for any extra
        let hasCompleteData = false;
        for (const extraId in fieldsByExtra) {
            const fields = fieldsByExtra[extraId];
            const hasOrigin = fields.some(
                (f) =>
                    f.distance_calculation_type === "origin" &&
                    formValues[f.name]
            );
            const hasDestination = fields.some(
                (f) =>
                    f.distance_calculation_type === "destination" &&
                    formValues[f.name]
            );

            console.log("Extra ID:", extraId, "Fields:", fields);
            console.log(
                "Has origin:",
                hasOrigin,
                "Has destination:",
                hasDestination
            );

            if (hasOrigin && hasDestination) {
                hasCompleteData = true;
                break;
            }
        }

        if (!hasCompleteData) {
            console.log("No complete data for distance calculation");
            setDistanceCharges(0);
            return;
        }

        setDistanceLoading(true);

        const requestData = {
            form_responses: Object.keys(formValues)
                .filter(
                    (fieldName) =>
                        formValues[fieldName] !== undefined &&
                        formValues[fieldName] !== null &&
                        formValues[fieldName] !== ""
                )
                .map((fieldName) => ({
                    field_name: fieldName,
                    response_value: formValues[fieldName],
                })),
        };

        console.log("Sending request to API:", requestData);

        try {
            const response = await fetch(
                route("booking.calculate-extra-charges"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log("API response:", result);
                setDistanceCharges(result.total_extra_charges || 0);
                setFinalPrice(totalPrice + (result.total_extra_charges || 0));
            } else {
                const errorText = await response.text();
                console.error(
                    "Failed to calculate distance charges. Status:",
                    response.status
                );
                console.error("Response text:", errorText);
                setDistanceCharges(0);
            }
        } catch (error) {
            console.error("Error calculating distance charges:", error);
            setDistanceCharges(0);
        } finally {
            setDistanceLoading(false);
        }
    };

    // Handle form field changes to trigger distance calculation
    const handleFormValuesChange = (changedValues, allValues) => {
        // Check if any location fields changed
        const locationFields =
            formFields?.filter(
                (field) =>
                    field.type === "location" && field.has_distance_calculation
            ) || [];

        const hasLocationFieldChange = locationFields.some((field) =>
            changedValues.hasOwnProperty(field.name)
        );

        if (hasLocationFieldChange) {
            // Debounce the calculation to avoid too many API calls
            setTimeout(() => {
                calculateDistanceCharges(allValues);
            }, 500);
        }
    };

    const handleBack = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        const consentIds = consentSettings.map((consent) => consent.id);
        router.visit(route("booking.consent"), {
            data: {
                service_id: service.id,
                extras: extraIds,
                date: date,
                time: time,
                consents: consentIds,
            },
        });
    };

    const validateCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const extraIds = selectedExtras.map((extra) => extra.id);

            // Get the current phone number from the form
            const currentPhoneNumber =
                formInstance.getFieldValue("customer_phone") || verifiedPhone;

            const response = await fetch(route("booking.validate-coupon"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    code: couponCode,
                    service_id: service.id,
                    extras: extraIds,
                    phone_number: currentPhoneNumber,
                }),
            });

            const result = await response.json();

            if (result.valid) {
                setAppliedCoupon(result.coupon);
                setFinalPrice(result.coupon.final_amount);
                setCouponError("");
                message.success(result.message);
            } else {
                setCouponError(result.message);
                setAppliedCoupon(null);
                setFinalPrice(totalPrice);
            }
        } catch (error) {
            console.error("Coupon validation error:", error);
            setCouponError("Failed to validate coupon. Please try again.");
            setAppliedCoupon(null);
            setFinalPrice(totalPrice);
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setFinalPrice(totalPrice);
        setCouponError("");
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const extraIds = selectedExtras.map((extra) => extra.id);
            const extraQuantitiesData = selectedExtras.map((extra) => ({
                id: extra.id,
                quantity: extra.quantity || 1,
            }));
            const consentIds = consentSettings.map((consent) => consent.id);

            // Build form data dynamically based on form fields
            const formData = {
                service_id: service.id,
                pricing_tier_id: selectedPricingTier?.id,
                selected_duration:
                    selectedPricingTier?.duration_minutes || service.duration,
                selected_price: selectedPricingTier?.price || service.price,
                extras: extraIds,
                extra_quantities: extraQuantitiesData,
                date: date,
                time: time,
                consents: consentIds,
                verified_phone: verifiedPhone, // Include verified phone number
                payment_method: values.payment_method,
                special_requests: values.special_requests || "",
                coupon_code: appliedCoupon ? appliedCoupon.code : null,
                gender_preference: window.location.search.includes(
                    "gender_preference="
                )
                    ? new URLSearchParams(window.location.search).get(
                          "gender_preference"
                      )
                    : "no_preference",
                distance_charges: distanceCharges, // Include distance charges
            };

            // Add form field values dynamically
            if (formFields) {
                formFields.forEach((field) => {
                    if (values[field.name] !== undefined) {
                        formData[field.name] = values[field.name];
                    }
                });
            }

            // Debug: Log what's being sent to backend
            console.log("Form data being sent to backend:", formData);
            console.log(
                "Gender preference being sent:",
                formData.gender_preference
            );
            console.log("Pricing tier debug:", {
                selectedPricingTier: selectedPricingTier,
                pricing_tier_id: formData.pricing_tier_id,
                selected_duration: formData.selected_duration,
                selected_price: formData.selected_price,
                service_price: service.price,
                service_duration: service.duration,
            });
            console.log("Form values from Ant Design:", values);
            console.log("Applied coupon:", appliedCoupon);
            console.log("Coupon code being sent:", formData.coupon_code);
            console.log("Phone number debug:", {
                verifiedPhone,
                formValues: values,
                finalFormData: formData,
            });

            // Create booking and get Razorpay order
            const response = await fetch(route("booking.process"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(formData),
            });

            let result;
            try {
                result = await response.json();
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                message.error(
                    "Server returned an invalid response. Please try again."
                );
                return;
            }

            if (result.success) {
                // Debug: Log the order data
                console.log("Razorpay order data:", result.order_data);
                console.log("Frontend final price:", finalPrice);
                console.log("Frontend total price:", totalPrice);
                console.log(
                    "Amount being sent to Razorpay:",
                    result.order_data.amount
                );
                console.log(
                    "Amount in rupees:",
                    result.order_data.amount / 100
                );
                console.log(
                    "Expected discounted amount in paise:",
                    finalPrice * 100
                );
                console.log(
                    "Expected discounted amount in rupees:",
                    finalPrice
                );

                // Initialize Razorpay
                const options = {
                    key: result.order_data.key_id,
                    amount: result.order_data.amount,
                    currency: result.order_data.currency,
                    name: "HospiPal",
                    description: `${service.name} - Booking`,
                    order_id: result.order_data.order_id,
                    handler: function (response) {
                        // Handle successful payment
                        window.location.href =
                            route("booking.payment-success") +
                            `?razorpay_payment_id=${response.razorpay_payment_id}` +
                            `&razorpay_order_id=${response.razorpay_order_id}` +
                            `&razorpay_signature=${response.razorpay_signature}`;
                    },
                    prefill: {
                        name: values.customer_name,
                        email: values.customer_email,
                        contact: verifiedPhone || values.customer_phone, // Use verified phone if available
                    },
                    theme: {
                        color: "#1890ff",
                    },
                    modal: {
                        ondismiss: function () {
                            // Handle modal dismissal (user closed the payment modal)
                            window.location.href = route(
                                "booking.payment-cancelled"
                            );
                        },
                    },
                    notes: {
                        "Booking Details": `${service.name} - ${formatDate(
                            date
                        )} at ${formatTime(time)}`,
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Handle different types of errors
                if (result.errors) {
                    // Validation errors
                    Object.keys(result.errors).forEach((field) => {
                        result.errors[field].forEach((error) => {
                            message.error(error);
                        });
                    });
                } else {
                    // General error
                    message.error(result.error || "Failed to create booking");
                }
            }
        } catch (error) {
            console.error("Booking error:", error);
            message.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    };

    const formatTime = (time) => {
        return dayjs(time, "HH:mm").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, MMMM D, YYYY");
    };

    // Helper function to get validation rules for form fields
    const getFieldValidationRules = (field) => {
        const rules = [];

        if (field.is_required) {
            rules.push({
                required: true,
                message: `Please enter your ${field.label.toLowerCase()}`,
            });
        } else {
            rules.push({ required: false });
        }

        // Add type-specific rules
        switch (field.type) {
            case "email":
                rules.push({
                    type: "email",
                    message: "Please enter a valid email address",
                });
                break;
            case "phone":
                rules.push({
                    pattern: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number",
                });
                break;
            case "number":
                rules.push({
                    type: "number",
                    message: "Please enter a valid number",
                });
                break;
            case "url":
                rules.push({
                    type: "url",
                    message: "Please enter a valid URL",
                });
                break;
        }

        return rules;
    };

    // Helper function to render form fields based on type
    const renderFormField = (field) => {
        const commonProps = {
            placeholder: field.placeholder,
            size: "large",
        };

        switch (field.type) {
            case "text":
                return <Input {...commonProps} />;
            case "email":
                return <Input {...commonProps} prefix={<MailOutlined />} />;
            case "phone":
                return <Input {...commonProps} prefix={<PhoneOutlined />} />;
            case "number":
                return (
                    <InputNumber {...commonProps} style={{ width: "100%" }} />
                );
            case "textarea":
                return <Input.TextArea {...commonProps} rows={3} />;
            case "select":
                return (
                    <Select {...commonProps}>
                        {field.options?.map((option, index) => {
                            const value =
                                typeof option === "object"
                                    ? option.value
                                    : option;
                            const label =
                                typeof option === "object"
                                    ? option.label
                                    : option;
                            return (
                                <Option key={index} value={value}>
                                    {label}
                                </Option>
                            );
                        })}
                    </Select>
                );
            case "radio":
                return (
                    <Radio.Group>
                        {field.options?.map((option, index) => {
                            const value =
                                typeof option === "object"
                                    ? option.value
                                    : option;
                            const label =
                                typeof option === "object"
                                    ? option.label
                                    : option;
                            return (
                                <Radio key={index} value={value}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                );
            case "checkbox":
                return (
                    <Checkbox.Group>
                        {field.options?.map((option, index) => {
                            const value =
                                typeof option === "object"
                                    ? option.value
                                    : option;
                            const label =
                                typeof option === "object"
                                    ? option.label
                                    : option;
                            return (
                                <Checkbox key={index} value={value}>
                                    {label}
                                </Checkbox>
                            );
                        })}
                    </Checkbox.Group>
                );
            case "date":
                return (
                    <DatePicker {...commonProps} style={{ width: "100%" }} />
                );
            case "time":
                return (
                    <TimePicker {...commonProps} style={{ width: "100%" }} />
                );
            case "datetime":
                return (
                    <DatePicker
                        {...commonProps}
                        showTime
                        style={{ width: "100%" }}
                    />
                );
            case "url":
                return <Input {...commonProps} />;
            case "password":
                return <Input.Password {...commonProps} />;
            case "location":
                return (
                    <LocationField
                        {...commonProps}
                        allowCurrentLocation={
                            field.settings?.allowCurrentLocation !== false
                        }
                    />
                );
            default:
                return <Input {...commonProps} />;
        }
    };

    return (
        <div>
            <Head title="Confirm & Pay - Book Appointment" />

            <BookingHeader auth={auth} />

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "16px",
                    overflow: "hidden",
                }}
            >
                {/* Add responsive top spacing for mobile */}
                <div className="mobile-top-spacing" />
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="large"
                    />
                    <Title level={2} style={{ marginTop: 24, marginBottom: 8 }}>
                        Confirm & Pay
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Review your booking and complete payment
                    </Text>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 32 }}>
                    <Progress
                        percent={100}
                        showInfo={false}
                        strokeColor="#1890ff"
                        trailColor="#f0f0f0"
                    />
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Text type="secondary">Step 5 of 5</Text>
                    </div>
                </div>

                <Row gutter={[16, 16]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        {/* Booking Summary */}
                        <Card style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <CheckCircleOutlined
                                    style={{ marginRight: 8, color: "#52c41a" }}
                                />
                                Booking Summary
                            </Title>

                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label="Service">
                                    <div>
                                        <Text strong>
                                            {service.name}
                                            {selectedPricingTier && (
                                                <Tag
                                                    color="blue"
                                                    style={{
                                                        marginLeft: 8,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {selectedPricingTier.name}
                                                </Tag>
                                            )}
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            {selectedPricingTier
                                                ? formatDuration(
                                                      selectedPricingTier.duration_minutes
                                                  )
                                                : service.duration_label ||
                                                  formatDuration(
                                                      service.duration
                                                  )}
                                        </Text>
                                    </div>
                                </Descriptions.Item>

                                {selectedExtras.length > 0 && (
                                    <Descriptions.Item label="Extras">
                                        {selectedExtras.map((extra) => {
                                            const quantity =
                                                extra.quantity || 1;
                                            return (
                                                <div
                                                    key={extra.id}
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    <Text>
                                                        + {extra.name}
                                                        {quantity > 1 && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {" "}
                                                                × {quantity}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        {formatPrice(
                                                            parseFloat(
                                                                extra.price
                                                            ) * quantity
                                                        )}
                                                    </Text>
                                                    <br />
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {extra.duration_relation
                                                            ? extra
                                                                  .duration_relation
                                                                  .label
                                                            : "No additional time"}
                                                        {quantity > 1 && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {" "}
                                                                × {quantity}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                </div>
                                            );
                                        })}
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Appointment Date">
                                    <CalendarOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    {formatDate(date)}
                                </Descriptions.Item>

                                <Descriptions.Item label="Appointment Time">
                                    <ClockCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    {formatTime(time)}
                                </Descriptions.Item>

                                {(() => {
                                    const urlParams = new URLSearchParams(
                                        window.location.search
                                    );
                                    const genderPreference =
                                        urlParams.get("gender_preference");
                                    const shouldShow =
                                        genderPreference &&
                                        genderPreference !== "no_preference";
                                    console.log("Gender preference debug:", {
                                        urlParams: window.location.search,
                                        genderPreference,
                                        shouldShow,
                                        bookingSettings: bookingSettings,
                                    });
                                    return shouldShow;
                                })() && (
                                    <Descriptions.Item label="HospiPal Preference">
                                        <Text>
                                            {(() => {
                                                const urlParams =
                                                    new URLSearchParams(
                                                        window.location.search
                                                    );
                                                const genderPreference =
                                                    urlParams.get(
                                                        "gender_preference"
                                                    );
                                                return genderPreference ===
                                                    "male"
                                                    ? "Male"
                                                    : "Female";
                                            })()}{" "}
                                            HospiPal
                                            {bookingSettings?.enable_gender_preference && (
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        marginLeft: 8,
                                                    }}
                                                >
                                                    (+₹
                                                    {(() => {
                                                        const urlParams =
                                                            new URLSearchParams(
                                                                window.location.search
                                                            );
                                                        const genderPreference =
                                                            urlParams.get(
                                                                "gender_preference"
                                                            );
                                                        return genderPreference ===
                                                            "male"
                                                            ? bookingSettings?.male_preference_fee ||
                                                                  0
                                                            : bookingSettings?.female_preference_fee ||
                                                                  0;
                                                    })()}
                                                    )
                                                </Text>
                                            )}
                                        </Text>
                                    </Descriptions.Item>
                                )}

                                {/* <Descriptions.Item label="Total Duration">
                                    {formatDuration(totalDuration)}
                                </Descriptions.Item> */}

                                {appliedCoupon && (
                                    <Descriptions.Item label="Original Price">
                                        <Text delete style={{ fontSize: 16 }}>
                                            <DollarOutlined
                                                style={{ marginRight: 8 }}
                                            />
                                            {formatPrice(totalPrice)}
                                        </Text>
                                    </Descriptions.Item>
                                )}

                                {appliedCoupon && (
                                    <Descriptions.Item label="Discount">
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: "#52c41a",
                                            }}
                                        >
                                            -{" "}
                                            {formatPrice(
                                                appliedCoupon.discount_amount
                                            )}
                                        </Text>
                                    </Descriptions.Item>
                                )}

                                {distanceCharges > 0 && (
                                    <Descriptions.Item label="Extra Distance Charges">
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: "#fa8c16",
                                            }}
                                        >
                                            + {formatPrice(distanceCharges)}
                                            {distanceLoading && (
                                                <Spin
                                                    size="small"
                                                    style={{ marginLeft: 8 }}
                                                />
                                            )}
                                        </Text>
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Total Price">
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 18,
                                            color: "#52c41a",
                                        }}
                                    >
                                        <DollarOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        {formatPrice(finalPrice)}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Coupon Section */}
                        <Card style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <GiftOutlined style={{ marginRight: 8 }} />
                                Apply Coupon
                            </Title>

                            {!appliedCoupon ? (
                                <Row gutter={16}>
                                    <Col flex="auto">
                                        <Input
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value)
                                            }
                                            onPressEnter={validateCoupon}
                                            status={couponError ? "error" : ""}
                                        />
                                        {couponError && (
                                            <Text
                                                type="danger"
                                                style={{ fontSize: 12 }}
                                            >
                                                {couponError}
                                            </Text>
                                        )}
                                    </Col>
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={validateCoupon}
                                            loading={couponLoading}
                                        >
                                            Apply
                                        </Button>
                                    </Col>
                                </Row>
                            ) : (
                                <div>
                                    <Alert
                                        message="Coupon Applied Successfully!"
                                        description={
                                            <div>
                                                <Text strong>
                                                    {appliedCoupon.name}
                                                </Text>
                                                <br />
                                                <Text type="secondary">
                                                    You saved Rs.{" "}
                                                    {
                                                        appliedCoupon.discount_amount
                                                    }
                                                </Text>
                                            </div>
                                        }
                                        type="success"
                                        showIcon
                                        action={
                                            <Button
                                                size="small"
                                                onClick={removeCoupon}
                                            >
                                                Remove
                                            </Button>
                                        }
                                    />
                                </div>
                            )}
                        </Card>

                        {/* Customer Information Form */}
                        <Card>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                Customer Information
                            </Title>

                            <Form
                                form={formInstance}
                                layout="vertical"
                                onFinish={handleSubmit}
                                onValuesChange={handleFormValuesChange}
                                initialValues={{
                                    payment_method: "card",
                                }}
                            >
                                {formFields && formFields.length > 0 ? (
                                    <>
                                        {/* Primary Fields */}
                                        {formFields
                                            .filter((field) => field.is_primary)
                                            .map((field) => (
                                                <Form.Item
                                                    key={field.id}
                                                    name={field.name}
                                                    label={field.label}
                                                    rules={getFieldValidationRules(
                                                        field
                                                    )}
                                                    help={field.help_text}
                                                >
                                                    {renderFormField(field)}
                                                </Form.Item>
                                            ))}

                                        {/* Custom Fields */}
                                        {formFields
                                            .filter(
                                                (field) => !field.is_primary
                                            )
                                            .map((field) => (
                                                <Form.Item
                                                    key={field.id}
                                                    name={field.name}
                                                    label={field.label}
                                                    rules={getFieldValidationRules(
                                                        field
                                                    )}
                                                    help={field.help_text}
                                                >
                                                    {renderFormField(field)}
                                                </Form.Item>
                                            ))}

                                        {/* Payment Method */}
                                        <Form.Item
                                            name="payment_method"
                                            label="Payment"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Payment method is required",
                                                },
                                            ]}
                                        >
                                            <div>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: "14px",
                                                        marginBottom: 12,
                                                        display: "block",
                                                    }}
                                                >
                                                    All transactions are secure
                                                    and encrypted.
                                                </Text>
                                                <div
                                                    style={{
                                                        border: "1px solid #1890ff",
                                                        borderRadius: "8px",
                                                        padding: "16px",
                                                        backgroundColor: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                backgroundColor:
                                                                    "#1890ff",
                                                                borderRadius:
                                                                    "4px",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            <CreditCardOutlined
                                                                style={{
                                                                    color: "white",
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: 16,
                                                                    color: "#1f1f1f",
                                                                }}
                                                            >
                                                                Razorpay Secure
                                                            </Text>
                                                            <div
                                                                style={{
                                                                    fontSize: 12,
                                                                    color: "#666",
                                                                    marginTop: 2,
                                                                }}
                                                            >
                                                                (UPI, Cards,
                                                                Wallets,
                                                                NetBanking)
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            UPI
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            VISA
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            MC
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            +18
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 12,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor:
                                                                "#f0f0f0",
                                                            borderRadius: "4px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 10,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            🌐
                                                        </div>
                                                    </div>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        After clicking 'Confirm
                                                        & Pay', you will be
                                                        redirected to Razorpay
                                                        Secure (UPI, Cards,
                                                        Wallets, NetBanking) to
                                                        complete your purchase
                                                        securely.
                                                    </Text>
                                                </div>
                                            </div>
                                        </Form.Item>
                                    </>
                                ) : (
                                    // Fallback to basic fields if no form is configured
                                    <>
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="customer_name"
                                                    label="Full Name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter your full name",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={
                                                            <UserOutlined />
                                                        }
                                                        placeholder="Enter your full name"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="customer_phone"
                                                    label="Phone Number"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter your phone number",
                                                        },
                                                        {
                                                            pattern:
                                                                /^[0-9+\-\s()]+$/,
                                                            message:
                                                                "Please enter a valid phone number",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Enter your phone number"
                                                        disabled={
                                                            !!verifiedPhone
                                                        }
                                                        addonBefore={
                                                            <span
                                                                style={{
                                                                    color: verifiedPhone
                                                                        ? "#52c41a"
                                                                        : "inherit",
                                                                }}
                                                            >
                                                                {verifiedPhone
                                                                    ? "✓ Verified"
                                                                    : "📱"}
                                                            </span>
                                                        }
                                                    />
                                                </Form.Item>
                                                {verifiedPhone && (
                                                    <Text
                                                        type="success"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Phone number verified in
                                                        previous step
                                                    </Text>
                                                )}
                                                {verifiedPhone &&
                                                    verifiedPhone !==
                                                        formInstance.getFieldValue(
                                                            "customer_phone"
                                                        ) && (
                                                        <Text
                                                            type="warning"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            Note: Using verified
                                                            phone number (
                                                            {verifiedPhone}) for
                                                            booking
                                                        </Text>
                                                    )}
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="customer_email"
                                            label="Email Address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your email address",
                                                },
                                                {
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email address",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined />}
                                                placeholder="Enter your email address"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="payment_method"
                                            label="Payment"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Payment method is required",
                                                },
                                            ]}
                                        >
                                            <div>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: "14px",
                                                        marginBottom: 12,
                                                        display: "block",
                                                    }}
                                                >
                                                    All transactions are secure
                                                    and encrypted.
                                                </Text>
                                                <div
                                                    style={{
                                                        border: "1px solid #1890ff",
                                                        borderRadius: "8px",
                                                        padding: "16px",
                                                        backgroundColor: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                backgroundColor:
                                                                    "#1890ff",
                                                                borderRadius:
                                                                    "4px",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            <CreditCardOutlined
                                                                style={{
                                                                    color: "white",
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: 16,
                                                                    color: "#1f1f1f",
                                                                }}
                                                            >
                                                                Razorpay Secure
                                                            </Text>
                                                            <div
                                                                style={{
                                                                    fontSize: 12,
                                                                    color: "#666",
                                                                    marginTop: 2,
                                                                }}
                                                            >
                                                                (UPI, Cards,
                                                                Wallets,
                                                                NetBanking)
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            UPI
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            VISA
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            MC
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            +18
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 12,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor:
                                                                "#f0f0f0",
                                                            borderRadius: "4px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 10,
                                                                color: "#666",
                                                            }}
                                                        >
                                                            🌐
                                                        </div>
                                                    </div>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        After clicking 'Confirm
                                                        & Pay', you will be
                                                        redirected to Razorpay
                                                        Secure (UPI, Cards,
                                                        Wallets, NetBanking) to
                                                        complete your purchase
                                                        securely.
                                                    </Text>
                                                </div>
                                            </div>
                                        </Form.Item>

                                        <Form.Item
                                            name="special_requests"
                                            label="Special Requests (Optional)"
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="Any special requests or notes for your appointment..."
                                            />
                                        </Form.Item>
                                    </>
                                )}

                                {/* Terms Confirmation */}
                                <Alert
                                    message="Booking Confirmation"
                                    description="By clicking 'Confirm & Pay', you agree to our terms and conditions and confirm your appointment booking."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />

                                {/* Action Buttons */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 16,
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    <Button
                                        size="large"
                                        icon={<ArrowLeftOutlined />}
                                        onClick={handleBack}
                                        style={{ width: "100%" }}
                                    >
                                        Back to Terms
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<CheckCircleOutlined />}
                                        style={{ width: "100%" }}
                                    >
                                        <span className="hidden-xs">
                                            Confirm & Pay
                                        </span>
                                        <span className="visible-xs">Pay</span>{" "}
                                        {formatPrice(finalPrice)}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>

                    {/* Sidebar - Summary */}
                    <Col xs={24} lg={8}>
                        <Card style={{ position: "sticky", top: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Final Summary
                            </Title>

                            {/* Service */}
                            <div style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text strong>
                                        {service.name}
                                        {selectedPricingTier && (
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {selectedPricingTier.name}
                                            </Tag>
                                        )}
                                    </Text>
                                    <Text>
                                        {selectedPricingTier
                                            ? formatPrice(
                                                  selectedPricingTier.price
                                              )
                                            : formatPrice(service.price)}
                                    </Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {selectedPricingTier
                                        ? formatDuration(
                                              selectedPricingTier.duration_minutes
                                          )
                                        : service.duration_label ||
                                          formatDuration(service.duration)}
                                </Text>
                            </div>

                            {/* Employee Assignment */}
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Employee will be automatically assigned
                                    based on availability
                                </Text>
                            </div>

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => {
                                        const quantity = extra.quantity || 1;
                                        const totalPrice =
                                            parseFloat(extra.price) * quantity;

                                        return (
                                            <div
                                                key={extra.id}
                                                style={{ marginBottom: 8 }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Text>
                                                        + {extra.name}
                                                        {quantity > 1 && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                    marginLeft: 4,
                                                                }}
                                                            >
                                                                × {quantity}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        {formatPrice(
                                                            totalPrice
                                                        )}
                                                    </Text>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* Gender Preference Fee */}
                            {window.location.search.includes(
                                "gender_preference="
                            ) &&
                                new URLSearchParams(window.location.search).get(
                                    "gender_preference"
                                ) !== "no_preference" && (
                                    <>
                                        <Divider style={{ margin: "12px 0" }} />
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text>
                                                +{" "}
                                                {new URLSearchParams(
                                                    window.location.search
                                                ).get("gender_preference") ===
                                                "male"
                                                    ? "Male"
                                                    : "Female"}{" "}
                                                Preference
                                            </Text>
                                            <Text>
                                                {formatPrice(
                                                    new URLSearchParams(
                                                        window.location.search
                                                    ).get(
                                                        "gender_preference"
                                                    ) === "male"
                                                        ? bookingSettings?.male_preference_fee ||
                                                              0
                                                        : bookingSettings?.female_preference_fee ||
                                                              0
                                                )}
                                            </Text>
                                        </div>
                                    </>
                                )}

                            {/* Appointment Details */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">Appointment Date</Text>
                                <div>
                                    <Text strong>{formatDate(date)}</Text>
                                </div>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">Appointment Time</Text>
                                <div>
                                    <Text strong>{formatTime(time)}</Text>
                                </div>
                            </div>

                            {/* Total */}
                            <Divider style={{ margin: "16px 0" }} />

                            {distanceCharges > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text>Extra Distance Charges</Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#fa8c16",
                                        }}
                                    >
                                        + {formatPrice(distanceCharges)}
                                        {distanceLoading && (
                                            <Spin
                                                size="small"
                                                style={{ marginLeft: 8 }}
                                            />
                                        )}
                                    </Text>
                                </div>
                            )}

                            {appliedCoupon && (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text>Original Price</Text>
                                        <Text delete style={{ fontSize: 14 }}>
                                            {formatPrice(totalPrice)}
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text>Discount</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#52c41a",
                                            }}
                                        >
                                            -{" "}
                                            {formatPrice(
                                                appliedCoupon.discount_amount
                                            )}
                                        </Text>
                                    </div>
                                </>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text strong>Total Price</Text>
                                <Text
                                    strong
                                    style={{ fontSize: 18, color: "#52c41a" }}
                                >
                                    {formatPrice(finalPrice)}
                                </Text>
                            </div>
                            {/* <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text type="secondary">Total Duration</Text>
                                <Text type="secondary">
                                    {formatDuration(totalDuration)}
                                </Text>
                            </div> */}

                            {/* Accepted Agreements */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">
                                    Accepted Agreements
                                </Text>
                                <div>
                                    {consentSettings.map((consent) => (
                                        <Tag
                                            key={consent.id}
                                            color="green"
                                            style={{ marginTop: 4 }}
                                        >
                                            {consent.title}
                                        </Tag>
                                    ))}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <Alert
                                message="Secure Payment"
                                description={`Your payment information is encrypted and secure. ${
                                    paymentSettings?.razorpay_key
                                        ? "Powered by Razorpay."
                                        : ""
                                }`}
                                type="success"
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                            {paymentSettings?.currency && (
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12,
                                        display: "block",
                                        marginTop: 8,
                                    }}
                                >
                                    Currency: {paymentSettings.currency}
                                </Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
