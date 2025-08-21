import React, { useState, useEffect } from "react";
import {
    Modal,
    Card,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Divider,
    Spin,
    Alert,
    Empty,
    message,
    Form,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function RescheduleModal({
    visible,
    onCancel,
    onSuccess,
    booking,
    scheduleSettings = [],
}) {
    const [form] = Form.useForm();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [policyLoading, setPolicyLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [policyInfo, setPolicyInfo] = useState(null);

    // Debug logging for schedule settings
    console.log("RescheduleModal component - Schedule settings:", {
        scheduleSettings,
        scheduleSettingsLength: scheduleSettings?.length,
        firstSchedule: scheduleSettings?.[0],
    });

    // Calculate total duration for slot calculation
    const totalDuration =
        (booking.pricingTier?.duration_minutes || booking.service.duration) +
        (booking.extras
            ? booking.extras.reduce((sum, extra) => {
                  // Check if durationRelation exists and calculate total minutes
                  if (extra.durationRelation) {
                      const totalMinutes =
                          extra.durationRelation.hours * 60 +
                          extra.durationRelation.minutes;
                      return sum + totalMinutes;
                  }
                  // Fallback to total_duration if available
                  return sum + (extra.total_duration || 0);
              }, 0)
            : 0);

    useEffect(() => {
        if (visible && booking) {
            fetchPolicyInfo();
            // Set current booking date as selected date initially
            const currentBookingDate = dayjs(booking.appointment_time);
            setSelectedDate(currentBookingDate);
            setCurrentMonth(currentBookingDate);
            fetchAvailableSlots(currentBookingDate);
        }
    }, [visible, booking]);

    const fetchPolicyInfo = async () => {
        if (!booking) return;

        setPolicyLoading(true);
        try {
            const response = await fetch(
                route("customer.bookings.policy", booking.id)
            );
            const result = await response.json();

            if (result.success) {
                setPolicyInfo(result.data.policy);
            } else {
                console.error("Failed to fetch policy info:", result.message);
            }
        } catch (error) {
            console.error("Error fetching policy info:", error);
        } finally {
            setPolicyLoading(false);
        }
    };

    const fetchAvailableSlots = async (date) => {
        if (!date || !booking) return;

        setLoading(true);
        try {
            // Use the exact same approach as the normal booking flow
            const params = new URLSearchParams({
                date: date.format("YYYY-MM-DD"),
                service_id: booking.service_id,
                exclude_booking_id: booking.id, // This is the only difference from normal booking
            });

            // Add pricing tier information if available
            if (booking.pricingTier) {
                params.append("pricing_tier_id", booking.pricingTier.id);
                params.append(
                    "selected_duration",
                    booking.pricingTier.duration_minutes
                );
                params.append("selected_price", booking.pricingTier.price);
            }

            // Add extras if any are selected (same as normal booking flow)
            if (booking.extras && booking.extras.length > 0) {
                booking.extras.forEach((extra) => {
                    params.append("extras[]", extra.id);
                });
            }

            // Add gender preference from original booking
            // Always pass the gender preference, including "no_preference"
            if (booking.gender_preference) {
                params.append("gender_preference", booking.gender_preference);
            }

            console.log(
                "Reschedule modal - Request params:",
                params.toString()
            );
            console.log(
                "Reschedule modal - Gender preference:",
                booking.gender_preference
            );
            console.log(
                "Reschedule modal - Gender preference being sent:",
                booking.gender_preference || "not set"
            );
            console.log("Reschedule modal - Booking data:", {
                bookingId: booking.id,
                serviceId: booking.service_id,
                pricingTier: booking.pricingTier,
                pricingTierId: booking.pricingTier?.id,
                pricingTierDuration: booking.pricingTier?.duration_minutes,
                serviceDuration: booking.service.duration,
                totalDuration: totalDuration,
                extras: booking.extras,
            });

            // Use GET request exactly like the normal booking flow
            const response = await fetch(
                `${route("booking.available-slots")}?${params.toString()}`
            );

            const result = await response.json();
            console.log("Reschedule modal - API response:", result);

            if (result.slots) {
                console.log(
                    "Reschedule modal - Available slots:",
                    result.slots
                );

                // Filter out the current booking's time slot
                const currentBookingTime = dayjs(booking.appointment_time);
                const filteredSlots = result.slots.filter((slot) => {
                    const slotTime = dayjs(selectedDate)
                        .hour(parseInt(slot.start.split(":")[0]))
                        .minute(parseInt(slot.start.split(":")[1]));

                    // Don't show the current booking's time slot
                    return !slotTime.isSame(currentBookingTime, "minute");
                });

                console.log(
                    "Reschedule modal - Filtered slots (excluding current):",
                    filteredSlots
                );

                setAvailableSlots(filteredSlots || []);
            } else {
                setAvailableSlots([]);
                message.error(
                    result.message ||
                        result.error ||
                        "Failed to fetch available slots"
                );
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
            setAvailableSlots([]);
            message.error("Failed to fetch available slots");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        fetchAvailableSlots(date);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) {
            message.error("Please select both date and time");
            return;
        }

        const newDateTime = dayjs(selectedDate)
            .hour(selectedTime.hour())
            .minute(selectedTime.minute())
            .second(0);

        setLoading(true);

        try {
            const response = await fetch(
                route("customer.bookings.reschedule", booking.id),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        new_appointment_time: newDateTime.format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {
                // Check if payment is required
                if (result.requires_payment) {
                    await handleReschedulePayment(result.data);
                } else {
                    message.success("Booking rescheduled successfully!");
                    onSuccess(result.data);
                    form.resetFields();
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setAvailableSlots([]);
                }
            } else {
                // Show detailed error message with reason
                const errorMessage =
                    result.reason ||
                    result.message ||
                    "Failed to reschedule booking";
                message.error(errorMessage);

                // Log detailed error information
                console.error("Reschedule failed:", {
                    message: result.message,
                    reason: result.reason,
                    details: result.details,
                });
            }
        } catch (error) {
            console.error("Error rescheduling booking:", error);
            message.error("Failed to reschedule booking");
        } finally {
            setLoading(false);
        }
    };

    const handleReschedulePayment = async (paymentData) => {
        try {
            // Load Razorpay script if not already loaded
            if (!window.Razorpay) {
                await loadRazorpayScript();
            }

            const options = {
                key: paymentData.key_id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: "Booking Reschedule Fee",
                description: `Reschedule fee for booking #${booking.id}`,
                order_id: paymentData.order_id,
                handler: async function (response) {
                    try {
                        // Send payment success to backend
                        const successResponse = await fetch(
                            route("customer.reschedule.payment-success"),
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-TOKEN": document
                                        .querySelector(
                                            'meta[name="csrf-token"]'
                                        )
                                        .getAttribute("content"),
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                }),
                            }
                        );

                        const successResult = await successResponse.json();

                        if (successResult.success) {
                            message.success(
                                "Booking rescheduled successfully!"
                            );
                            onSuccess(successResult.data);
                            form.resetFields();
                            setSelectedDate(null);
                            setSelectedTime(null);
                            setAvailableSlots([]);
                        } else {
                            message.error(
                                successResult.message ||
                                    "Payment verification failed"
                            );
                        }
                    } catch (error) {
                        console.error(
                            "Payment success handling failed:",
                            error
                        );
                        message.error("Failed to verify payment");
                    }
                },
                prefill: {
                    name: booking.customer?.name || "Customer",
                    email: booking.customer?.email || "",
                    contact: booking.customer?.phone_number || "",
                },
                theme: {
                    color: "#1890ff",
                },
                modal: {
                    ondismiss: function () {
                        // Handle payment cancellation
                        handlePaymentCancellation();
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment setup failed:", error);
            message.error("Failed to setup payment");
        }
    };

    const handlePaymentCancellation = async () => {
        try {
            await fetch(route("customer.reschedule.payment-failed"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
        } catch (error) {
            console.error("Payment cancellation handling failed:", error);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () =>
                reject(new Error("Failed to load Razorpay script"));
            document.head.appendChild(script);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableSlots([]);
        onCancel();
    };

    const formatTime = (time) => {
        try {
            if (!time) return "Invalid Time";

            let timeString = time;
            if (time && typeof time === "object" && time.format) {
                timeString = time.format("HH:mm");
            } else if (typeof time === "object" && time.start) {
                timeString = time.start;
            }

            if (!timeString || typeof timeString !== "string") {
                return "Invalid Time";
            }

            const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})$/);
            if (!timeMatch) return "Invalid Time";

            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);

            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                return "Invalid Time";
            }

            const period = hours >= 12 ? "PM" : "AM";
            const displayHours =
                hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            return `${displayHours}:${minutes
                .toString()
                .padStart(2, "0")} ${period}`;
        } catch (error) {
            console.error("Error formatting time:", error);
            return "Invalid Time";
        }
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

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    // Calendar navigation functions
    const handlePrevMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, "month"));
    };

    const isDateSelectable = (date) => {
        const today = dayjs();

        // Get schedule settings for date range calculation
        const defaultSchedule = scheduleSettings?.[0];
        if (!defaultSchedule) {
            // No fallback - if no schedule settings, return false
            return false;
        }

        // Use schedule settings for date range
        const minAdvanceHours = defaultSchedule.min_advance_hours;
        const maxAdvanceDays = defaultSchedule.max_advance_days;
        const workingDays = defaultSchedule.working_days;

        // Check if date is within booking window
        const minDate = today.add(minAdvanceHours, "hour");
        const maxDate = today.add(maxAdvanceDays, "day");

        // Allow today's date to be selectable (the backend will handle minimum advance time)
        const isToday = date.isSame(today, "day");
        const isWithinRange =
            isToday ||
            (date.isAfter(minDate) &&
                (date.isBefore(maxDate) || date.isSame(maxDate, "day")));

        // Check if date is a working day
        const dayOfWeek = date.day(); // 0=Sunday, 1=Monday, etc.
        const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert to 1-7 format
        const isWorkingDay = workingDays.includes(adjustedDayOfWeek);

        const isSelectable = isWithinRange && isWorkingDay;

        // Debug logging for troubleshooting
        if (
            date.isSame(today, "day") ||
            date.format("YYYY-MM-DD") === "2025-08-18"
        ) {
            console.log("RescheduleModal - Date selectability check:", {
                date: date.format("YYYY-MM-DD"),
                isToday,
                isWithinRange,
                isWorkingDay,
                isSelectable,
                minAdvanceHours,
                maxAdvanceDays,
                workingDays,
                adjustedDayOfWeek,
                minDate: minDate.format("YYYY-MM-DD"),
                maxDate: maxDate.format("YYYY-MM-DD"),
                scheduleSettings: scheduleSettings,
                defaultSchedule: defaultSchedule,
            });
        }

        return isSelectable;
    };

    const getDaysInMonth = (month) => {
        const start = month.startOf("month");
        const end = month.endOf("month");
        const startDay = start.day(); // 0 = Sunday, 1 = Monday, etc.

        const days = [];

        // Add days from previous month to fill the first week
        const prevMonth = month.subtract(1, "month");
        const daysInPrevMonth = prevMonth.daysInMonth();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push(prevMonth.date(daysInPrevMonth - i));
        }

        // Add days from current month
        for (let i = 1; i <= end.date(); i++) {
            days.push(month.date(i));
        }

        // Add days from next month to fill the last week
        const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
        for (let i = 1; i <= remainingDays; i++) {
            days.push(month.add(1, "month").date(i));
        }

        return days;
    };

    // Determine if rescheduling is allowed based on policy and current state
    const canReschedule = () => {
        if (!policyInfo?.reschedule) {
            return false;
        }

        // Check if rescheduling is completely disabled
        if (
            policyInfo.reschedule.window_hours === 0 &&
            policyInfo.reschedule.max_attempts === 0
        ) {
            return false;
        }

        // Check if max attempts reached
        if (
            policyInfo.reschedule.max_attempts > 0 &&
            booking.reschedule_attempts >= policyInfo.reschedule.max_attempts
        ) {
            return false;
        }

        // Check if appointment is in the past
        const now = dayjs();
        const appointmentTime = dayjs(booking.appointment_time);
        if (appointmentTime.isBefore(now)) {
            return false;
        }

        // Check if within reschedule window
        const hoursUntilAppointment = appointmentTime.diff(now, "hour", true);
        if (
            policyInfo.reschedule.window_hours > 0 &&
            hoursUntilAppointment < policyInfo.reschedule.window_hours
        ) {
            return false;
        }

        return true;
    };

    const currentAttempts = booking?.reschedule_attempts || 0;
    const maxAttempts = policyInfo?.reschedule?.max_attempts || 0;
    const advanceNoticeHours =
        policyInfo?.reschedule?.advance_notice_hours || 0;

    return (
        <Modal
            title="Reschedule Booking"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            centered
        >
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                {/* Current Booking Information */}
                <Card style={{ marginBottom: 16 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <InfoCircleOutlined
                            style={{ color: "#1890ff", marginRight: 8 }}
                        />
                        <Text strong>Current Booking</Text>
                    </div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Text type="secondary">Date:</Text>
                            <br />
                            <Text strong>
                                {dayjs(booking?.appointment_time).format(
                                    "MMMM D, YYYY"
                                )}
                            </Text>
                        </Col>
                        <Col span={8}>
                            <Text type="secondary">Time:</Text>
                            <br />
                            <Text strong>
                                {dayjs(booking?.appointment_time).format(
                                    "h:mm A"
                                )}
                            </Text>
                        </Col>
                        <Col span={8}>
                            <Text type="secondary">Service:</Text>
                            <br />
                            <Text strong>{booking?.service?.name}</Text>
                        </Col>
                    </Row>
                </Card>

                {/* Policy Information */}
                {policyLoading ? (
                    <Card style={{ marginBottom: 16 }}>
                        <Spin size="small" /> Loading policy information...
                    </Card>
                ) : policyInfo ? (
                    <Card style={{ marginBottom: 16 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <Text strong>Policy: {policyInfo.name}</Text>
                                <br />
                                <Text type="secondary">
                                    {policyInfo.reschedule?.window_hours || 0}h
                                    window • Max{" "}
                                    {policyInfo.reschedule?.max_attempts || 0}{" "}
                                    attempts
                                </Text>
                                {policyInfo.reschedule?.fee > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <Tag color="orange">
                                            Reschedule Fee: ₹
                                            {policyInfo.reschedule.fee}
                                        </Tag>
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <Text type="secondary">Attempts:</Text>
                                <br />
                                <Text strong style={{ color: "#1890ff" }}>
                                    {currentAttempts}/{maxAttempts}
                                </Text>
                            </div>
                        </div>
                    </Card>
                ) : null}

                {/* Reschedule Not Allowed Warning */}
                {!canReschedule() && policyInfo && (
                    <Alert
                        message="Rescheduling Not Allowed"
                        description={
                            <div>
                                {policyInfo.reschedule?.window_hours === 0 &&
                                    policyInfo.reschedule?.max_attempts ===
                                        0 && (
                                        <p>
                                            Rescheduling is disabled for this
                                            booking.
                                        </p>
                                    )}
                                {policyInfo.reschedule?.max_attempts > 0 &&
                                    booking?.reschedule_attempts >=
                                        policyInfo.reschedule?.max_attempts && (
                                        <p>
                                            You have already used all your
                                            reschedule attempts (
                                            {currentAttempts}/{maxAttempts}).
                                        </p>
                                    )}
                                {dayjs(booking?.appointment_time).isBefore(
                                    dayjs()
                                ) && (
                                    <p>
                                        Cannot reschedule appointments in the
                                        past.
                                    </p>
                                )}
                                {policyInfo.reschedule?.window_hours > 0 &&
                                    dayjs(booking?.appointment_time).diff(
                                        dayjs(),
                                        "hour",
                                        true
                                    ) < policyInfo.reschedule?.window_hours && (
                                        <p>
                                            Your appointment is within the
                                            reschedule window (
                                            {
                                                policyInfo.reschedule
                                                    ?.window_hours
                                            }{" "}
                                            hours).
                                        </p>
                                    )}
                            </div>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Calendar and Time Selection */}
                {canReschedule() && (
                    <>
                        {/* Reschedule Fee Warning */}
                        {policyInfo?.reschedule?.fee > 0 && (
                            <Alert
                                message="Reschedule Fee Required"
                                description={`A reschedule fee of ₹${policyInfo.reschedule.fee} will be charged to complete the rescheduling process.`}
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        {/* Calendar Section */}
                        <Card style={{ marginBottom: 16 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <CalendarOutlined style={{ marginRight: 8 }} />
                                Select New Date
                            </Title>

                            {/* Custom Calendar */}
                            <div
                                style={{
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                    background: "white",
                                }}
                            >
                                {/* Calendar Header */}
                                <div
                                    style={{
                                        padding: "16px 20px",
                                        borderBottom: "1px solid #f0f0f0",
                                        background: "#fafafa",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        size="small"
                                        onClick={handlePrevMonth}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                    >
                                        ‹
                                    </Button>
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            minWidth: "120px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {currentMonth.format("MMMM YYYY")}
                                    </span>
                                    <Button
                                        size="small"
                                        onClick={handleNextMonth}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                    >
                                        ›
                                    </Button>
                                </div>

                                {/* Calendar Grid */}
                                <div style={{ padding: "16px" }}>
                                    {/* Day Headers */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(7, 1fr)",
                                            gap: "4px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        {[
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa",
                                        ].map((day) => (
                                            <div
                                                key={day}
                                                style={{
                                                    textAlign: "center",
                                                    fontWeight: "600",
                                                    color: "#666",
                                                    padding: "8px 4px",
                                                    fontSize: "12px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                }}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Date Grid */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(7, 1fr)",
                                            gap: "4px",
                                        }}
                                    >
                                        {getDaysInMonth(currentMonth).map(
                                            (date, index) => {
                                                const today = dayjs();
                                                const isPast = date.isBefore(
                                                    today,
                                                    "day"
                                                );
                                                const isToday = date.isSame(
                                                    today,
                                                    "day"
                                                );
                                                const isSelected =
                                                    selectedDate &&
                                                    selectedDate.isSame(
                                                        date,
                                                        "day"
                                                    );
                                                const isCurrentMonth =
                                                    date.month() ===
                                                    currentMonth.month();
                                                const isSelectable =
                                                    isDateSelectable(date);

                                                const cellStyle = {
                                                    height: "48px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    cursor:
                                                        isSelectable && !isPast
                                                            ? "pointer"
                                                            : "default",
                                                    transition: "all 0.2s ease",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    opacity: isCurrentMonth
                                                        ? 1
                                                        : 0.3,
                                                };

                                                let backgroundColor =
                                                    "transparent";
                                                let color = "#333";
                                                let border =
                                                    "1px solid transparent";

                                                if (isPast) {
                                                    color = "#999";
                                                } else if (isSelected) {
                                                    backgroundColor = "#e6f7ff";
                                                    color = "#1890ff";
                                                    border =
                                                        "2px solid #1890ff";
                                                } else if (
                                                    isToday &&
                                                    !selectedDate
                                                ) {
                                                    backgroundColor = "#1890ff";
                                                    color = "white";
                                                    border = "none";
                                                } else if (isSelectable) {
                                                    color = "#333";
                                                } else {
                                                    color = "#ccc";
                                                }

                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            ...cellStyle,
                                                            backgroundColor,
                                                            color,
                                                            border,
                                                        }}
                                                        onClick={() => {
                                                            if (
                                                                isSelectable &&
                                                                !isPast
                                                            ) {
                                                                handleDateSelect(
                                                                    date
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {date.date()}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Time Slots Section */}
                        {selectedDate && (
                            <Card>
                                <Title level={4} style={{ marginBottom: 16 }}>
                                    <ClockCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Available Time Slots
                                    {booking.gender_preference &&
                                    booking.gender_preference !==
                                        "no_preference" ? (
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 8,
                                            }}
                                        >
                                            (Filtered for{" "}
                                            {booking.gender_preference ===
                                            "male"
                                                ? "Male"
                                                : "Female"}{" "}
                                            HospiPal)
                                        </Text>
                                    ) : (
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 8,
                                            }}
                                        >
                                            (All available HospiPals)
                                        </Text>
                                    )}
                                </Title>

                                {loading ? (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                        }}
                                    >
                                        <Spin size="large" />
                                        <div style={{ marginTop: 16 }}>
                                            <Text type="secondary">
                                                Loading available slots...
                                            </Text>
                                        </div>
                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <Empty
                                        description="No available slots for this date"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ) : (
                                    <Row gutter={[12, 12]}>
                                        {availableSlots
                                            .map((slot, index) => {
                                                const slotStart =
                                                    typeof slot === "object"
                                                        ? slot.start
                                                        : slot;

                                                if (
                                                    !slotStart ||
                                                    typeof slotStart !==
                                                        "string"
                                                ) {
                                                    return null;
                                                }

                                                const timeParts =
                                                    slotStart.split(":");
                                                if (timeParts.length !== 2) {
                                                    return null;
                                                }

                                                const hours = parseInt(
                                                    timeParts[0],
                                                    10
                                                );
                                                const minutes = parseInt(
                                                    timeParts[1],
                                                    10
                                                );

                                                if (
                                                    hours < 0 ||
                                                    hours > 23 ||
                                                    minutes < 0 ||
                                                    minutes > 59
                                                ) {
                                                    return null;
                                                }

                                                const slotTime = dayjs()
                                                    .hour(hours)
                                                    .minute(minutes)
                                                    .second(0)
                                                    .millisecond(0);
                                                const isSelected =
                                                    selectedTime &&
                                                    selectedTime.format(
                                                        "HH:mm"
                                                    ) === slotStart;

                                                // Check if slot is available (from backend or fallback)
                                                const isAvailable =
                                                    typeof slot === "object"
                                                        ? slot.available !==
                                                          false
                                                        : true;

                                                return (
                                                    <Col
                                                        xs={12}
                                                        sm={8}
                                                        md={6}
                                                        key={index}
                                                    >
                                                        <Button
                                                            size="large"
                                                            disabled={
                                                                !isAvailable
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                height: 48,
                                                                border: isSelected
                                                                    ? "2px solid #1890ff"
                                                                    : isAvailable
                                                                    ? "1px solid #d9d9d9"
                                                                    : "1px solid #ffccc7",
                                                                backgroundColor:
                                                                    isSelected
                                                                        ? "#e6f7ff"
                                                                        : isAvailable
                                                                        ? "white"
                                                                        : "#fff2f0",
                                                                opacity:
                                                                    isAvailable
                                                                        ? 1
                                                                        : 0.6,
                                                            }}
                                                            onClick={() =>
                                                                isAvailable &&
                                                                handleTimeSelect(
                                                                    slotTime
                                                                )
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    {isSelected && (
                                                                        <CheckOutlined
                                                                            style={{
                                                                                marginRight: 8,
                                                                                color: "#1890ff",
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {formatTime(
                                                                        slotStart
                                                                    )}
                                                                </div>
                                                                {!isAvailable && (
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                            marginTop:
                                                                                "2px",
                                                                            color: "#ff4d4f",
                                                                            fontWeight:
                                                                                "normal",
                                                                        }}
                                                                    >
                                                                        Unavailable
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Button>
                                                    </Col>
                                                );
                                            })
                                            .filter(Boolean)}
                                    </Row>
                                )}
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 16,
                            }}
                        >
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={loading}
                                disabled={!selectedDate || !selectedTime}
                            >
                                {policyInfo?.reschedule?.fee > 0
                                    ? `Reschedule & Pay ₹${policyInfo.reschedule.fee}`
                                    : "Reschedule Booking"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
