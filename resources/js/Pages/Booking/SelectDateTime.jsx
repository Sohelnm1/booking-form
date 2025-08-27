import React, { useState, useEffect } from "react";
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
    Badge,
    Spin,
    Alert,
    Empty,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import {
    Clock,
    Calendar,
    Clock3,
    CalendarDays,
    Users,
    Handshake,
    User,
    UserCheck,
    CheckCircle,
    MessageCircle,
} from "lucide-react";
import dayjs from "dayjs";

import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;

export default function SelectDateTime({
    service,
    selectedExtras,
    scheduleSettings,
    selectedPricingTier,
    selectedDuration,
    selectedPrice,
    bookingSettings,
    auth,
}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [genderPreference, setGenderPreference] = useState("no_preference");
    const [showTimeResetAlert, setShowTimeResetAlert] = useState(false);

    // Debug logging for schedule settings
    console.log("SelectDateTime component - Schedule settings:", {
        scheduleSettings,
        scheduleSettingsLength: scheduleSettings?.length,
        firstSchedule: scheduleSettings?.[0],
    });

    // Calculate total duration for slot calculation
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

    const handleBack = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        const extraQuantitiesData = selectedExtras.map((extra) => ({
            id: extra.id,
            quantity: extra.quantity || 1,
        }));
        const extraQuantitiesJson = encodeURIComponent(
            JSON.stringify(extraQuantitiesData)
        );

        router.visit(route("booking.select-extras"), {
            data: {
                service_id: service.id,
                pricing_tier_id: selectedPricingTier?.id,
                selected_duration:
                    selectedPricingTier?.duration_minutes || service.duration,
                selected_price: selectedPricingTier?.price || service.price,
                extras: extraIds,
                extra_quantities_json: extraQuantitiesJson,
            },
        });
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            const extraIds = selectedExtras.map((extra) => extra.id);
            const extraQuantitiesData = selectedExtras.map((extra) => ({
                id: extra.id,
                quantity: extra.quantity || 1,
            }));
            const extraQuantitiesJson = encodeURIComponent(
                JSON.stringify(extraQuantitiesData)
            );

            router.visit(route("booking.consent"), {
                data: {
                    service_id: service.id,
                    pricing_tier_id: selectedPricingTier?.id,
                    selected_duration:
                        selectedPricingTier?.duration_minutes ||
                        service.duration,
                    selected_price: selectedPricingTier?.price || service.price,
                    extras: extraIds,
                    extra_quantities_json: extraQuantitiesJson,
                    date: selectedDate.format("YYYY-MM-DD"),
                    time: selectedTime.format("HH:mm"),
                    gender_preference: genderPreference,
                },
            });
        }
    };

    const fetchAvailableSlots = async (date) => {
        setLoading(true);
        try {
            console.log("Fetching slots for date:", date.format("YYYY-MM-DD"));
            console.log("Service ID:", service.id);
            console.log("Service duration:", service.duration);
            console.log("Selected extras:", selectedExtras);
            console.log("Total duration:", totalDuration);
            console.log("Gender preference:", genderPreference);

            // Build query parameters
            const params = new URLSearchParams({
                date: date.format("YYYY-MM-DD"),
                service_id: service.id,
            });

            // Add pricing tier information if selected
            if (selectedPricingTier) {
                params.append("pricing_tier_id", selectedPricingTier.id);
                params.append(
                    "selected_duration",
                    selectedPricingTier.duration_minutes
                );
                params.append("selected_price", selectedPricingTier.price);
            }

            // Add extras if any are selected
            if (selectedExtras.length > 0) {
                selectedExtras.forEach((extra) => {
                    params.append("extras[]", extra.id);
                });
            }

            // Add gender preference
            if (bookingSettings?.enable_gender_preference) {
                params.append("gender_preference", genderPreference);
            }

            console.log("Normal booking - Request params:", params.toString());
            console.log("Normal booking - Selected extras:", selectedExtras);

            const response = await fetch(
                `${route("booking.available-slots")}?${params.toString()}`
            );
            const data = await response.json();
            console.log("Available slots response:", data);

            if (data.slots && data.slots.length > 0) {
                setAvailableSlots(data.slots);
            } else {
                console.log("No slots returned from backend");
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        fetchAvailableSlots(date);
    };

    // Refetch slots when gender preference changes
    useEffect(() => {
        if (selectedDate && bookingSettings?.enable_gender_preference) {
            // Clear the selected time when gender preference changes
            // because the available slots will be different
            if (selectedTime) {
                setSelectedTime(null);
                setShowTimeResetAlert(true);
                // Hide the alert after 5 seconds
                setTimeout(() => setShowTimeResetAlert(false), 5000);
            }
            fetchAvailableSlots(selectedDate);
        }
    }, [genderPreference]);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
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
        try {
            // Handle null/undefined values
            if (!time) {
                console.error("Time is null or undefined");
                return "Invalid Time";
            }

            // Handle different time formats
            let timeString = time;

            // If it's a dayjs object, format it as HH:mm
            if (time && typeof time === "object" && time.format) {
                timeString = time.format("HH:mm");
            } else if (typeof time === "object" && time.start) {
                timeString = time.start;
            }

            // Ensure we have a valid time string
            if (!timeString || typeof timeString !== "string") {
                console.error("Invalid time format:", time);
                return "Invalid Time";
            }

            // Parse time string manually to avoid timezone issues
            const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})$/);
            if (!timeMatch) {
                console.error("Invalid time string format:", timeString);
                return "Invalid Time";
            }

            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);

            // Validate hours and minutes
            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                console.error("Invalid time values:", hours, minutes);
                return "Invalid Time";
            }

            // Format as 12-hour time with AM/PM
            const period = hours >= 12 ? "PM" : "AM";
            const displayHours =
                hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            const displayMinutes = minutes.toString().padStart(2, "0");

            return `${displayHours}:${displayMinutes} ${period}`;
        } catch (error) {
            console.error("Error formatting time:", error, time);
            return "Invalid Time";
        }
    };

    // Custom calendar functions
    const getDaysInMonth = (date) => {
        const year = date.year();
        const month = date.month();
        const firstDay = dayjs(new Date(year, month, 1));
        const lastDay = dayjs(new Date(year, month + 1, 0));
        const startDate = firstDay.startOf("week");
        const endDate = lastDay.endOf("week");

        const days = [];
        let current = startDate;

        while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
            days.push(current);
            current = current.add(1, "day");
        }

        return days;
    };

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
            console.log("Date selectability check:", {
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

    return (
        <div>
            <Head title="Select Date & Time - Book Appointment" />

            <BookingHeader auth={auth} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
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
                    <Title
                        level={2}
                        style={{
                            marginTop: 24,
                            marginBottom: 8,
                            textAlign: "center",
                        }}
                    >
                        Choose Your Date & Time{" "}
                        <Clock
                            size={24}
                            style={{
                                verticalAlign: "middle",
                                marginLeft: "8px",
                            }}
                        />
                    </Title>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 16,
                            textAlign: "center",
                            display: "block",
                        }}
                    >
                        Book your HospiPal at the time you need most — secure
                        your slot now before it fills.
                    </Text>
                    {scheduleSettings && scheduleSettings.length > 0 && (
                        <div style={{ marginTop: 8, textAlign: "center" }}>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                <Calendar size={14} />
                                Booking window:{" "}
                                {scheduleSettings[0].booking_window_days} days
                                ahead • <Clock size={14} />
                                Min advance:{" "}
                                {scheduleSettings[0].min_advance_hours} hours •
                                <Clock3 size={14} />
                                Working hours: {
                                    scheduleSettings[0].start_time
                                }{" "}
                                - {scheduleSettings[0].end_time} •{" "}
                                <CalendarDays size={14} />
                                Working days:{" "}
                                {scheduleSettings[0].working_days_text}
                            </Text>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 32 }}>
                    <Progress
                        percent={60}
                        showInfo={false}
                        strokeColor="#1890ff"
                        trailColor="#f0f0f0"
                    />
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Text type="secondary">Step 3 of 5</Text>
                    </div>
                </div>

                {/* Instruction Line */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            lineHeight: 1.5,
                        }}
                    >
                        Select your preferred date and time for HospiPal
                        support. Early booking ensures availability.
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Main Content */}
                    <Col xs={24} xl={16} lg={14}>
                        {/* Calendar Section */}
                        <Card style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <CalendarOutlined style={{ marginRight: 8 }} />
                                Select Date
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
                                                    // Selected date takes priority over today
                                                    backgroundColor = "#e6f7ff";
                                                    color = "#1890ff";
                                                    border =
                                                        "2px solid #1890ff";
                                                } else if (
                                                    isToday &&
                                                    !selectedDate
                                                ) {
                                                    // Only show today as highlighted if no date is selected
                                                    backgroundColor = "#1890ff";
                                                    color = "white";
                                                    border = "none";
                                                } else if (isSelectable) {
                                                    color = "#333";
                                                } else {
                                                    color = "#999";
                                                }

                                                // Generate tooltip text
                                                let tooltipText = "";
                                                if (isPast) {
                                                    tooltipText =
                                                        "Past date - cannot be selected";
                                                } else if (!isSelectable) {
                                                    const dayOfWeek =
                                                        date.day();
                                                    const adjustedDayOfWeek =
                                                        dayOfWeek === 0
                                                            ? 7
                                                            : dayOfWeek;
                                                    const defaultSchedule =
                                                        scheduleSettings?.[0];
                                                    const workingDays =
                                                        defaultSchedule?.working_days;

                                                    if (
                                                        workingDays &&
                                                        !workingDays.includes(
                                                            adjustedDayOfWeek
                                                        )
                                                    ) {
                                                        tooltipText = `${date.format(
                                                            "dddd"
                                                        )} - Not a working day`;
                                                    } else {
                                                        tooltipText =
                                                            "Date not available for booking";
                                                    }
                                                } else {
                                                    tooltipText = `Available for booking on ${date.format(
                                                        "dddd, MMMM D"
                                                    )}`;
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
                                                        title={tooltipText}
                                                        onMouseEnter={(e) => {
                                                            if (
                                                                isSelectable &&
                                                                !isPast &&
                                                                !isSelected
                                                            ) {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "#f5f5f5";
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (
                                                                isSelectable &&
                                                                !isPast &&
                                                                !isSelected
                                                            ) {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "transparent";
                                                            }
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
                                                        {isToday && (
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "8px",
                                                                    lineHeight:
                                                                        "1",
                                                                    marginTop:
                                                                        "2px",
                                                                    fontWeight:
                                                                        "normal",
                                                                }}
                                                            >
                                                                Today
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Gender Preference Section */}
                        {bookingSettings?.enable_gender_preference && (
                            <Card
                                style={{
                                    marginBottom: 24,
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <div style={{ marginBottom: 24 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "8px",
                                                background: "#f5f5f5",
                                                border: "1px solid #e8e8e8",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: 12,
                                            }}
                                        >
                                            <Users size={18} color="#666" />
                                        </div>
                                        <Title
                                            level={4}
                                            style={{
                                                margin: 0,
                                                color: "#1f1f1f",
                                            }}
                                        >
                                            {bookingSettings?.gender_preference_label ||
                                                "Preferred HospiPal"}
                                        </Title>
                                    </div>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            color: "#666",
                                            marginLeft: 52,
                                        }}
                                    >
                                        {bookingSettings?.gender_preference_description ||
                                            "Select your preferred HospiPal gender. Choosing a specific gender may incur an additional fee."}
                                    </Text>
                                </div>

                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={8}>
                                        <div
                                            style={{
                                                border:
                                                    genderPreference ===
                                                    "no_preference"
                                                        ? "2px solid #1890ff"
                                                        : "2px solid #f0f0f0",
                                                borderRadius: "16px",
                                                padding: "24px 16px",
                                                background:
                                                    genderPreference ===
                                                    "no_preference"
                                                        ? "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)"
                                                        : "#fff",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                            onClick={() =>
                                                setGenderPreference(
                                                    "no_preference"
                                                )
                                            }
                                        >
                                            {genderPreference ===
                                                "no_preference" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 12,
                                                        right: 12,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        background: "#1890ff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        color: "white",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    ✓
                                                </div>
                                            )}
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <div
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: "8px",
                                                        background: "#f6ffed",
                                                        border: "1px solid #b7eb8f",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        margin: "0 auto 16px",
                                                        fontSize: 24,
                                                    }}
                                                >
                                                    <Handshake
                                                        size={24}
                                                        color="#faad14"
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        color: "#1f1f1f",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    No Preference
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        color: "#52c41a",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Auto-assign
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <div
                                            style={{
                                                border:
                                                    genderPreference === "male"
                                                        ? "2px solid #1890ff"
                                                        : "2px solid #f0f0f0",
                                                borderRadius: "16px",
                                                padding: "24px 16px",
                                                background:
                                                    genderPreference === "male"
                                                        ? "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)"
                                                        : "#fff",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                            onClick={() =>
                                                setGenderPreference("male")
                                            }
                                        >
                                            {genderPreference === "male" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 12,
                                                        right: 12,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        background: "#1890ff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        color: "white",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    <CheckCircle
                                                        size={12}
                                                        color="white"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <div
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: "8px",
                                                        background: "#f0f8ff",
                                                        border: "1px solid #bae7ff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        margin: "0 auto 16px",
                                                        fontSize: 24,
                                                    }}
                                                >
                                                    <User
                                                        size={24}
                                                        color="#1890ff"
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        color: "#1f1f1f",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    Male
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        color: "#1890ff",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    +₹
                                                    {bookingSettings?.male_preference_fee ||
                                                        0}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <div
                                            style={{
                                                border:
                                                    genderPreference ===
                                                    "female"
                                                        ? "2px solid #1890ff"
                                                        : "2px solid #f0f0f0",
                                                borderRadius: "16px",
                                                padding: "24px 16px",
                                                background:
                                                    genderPreference ===
                                                    "female"
                                                        ? "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)"
                                                        : "#fff",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                            onClick={() =>
                                                setGenderPreference("female")
                                            }
                                        >
                                            {genderPreference === "female" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 12,
                                                        right: 12,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        background: "#1890ff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        color: "white",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    <CheckCircle
                                                        size={12}
                                                        color="white"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <div
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: "8px",
                                                        background: "#fff0f6",
                                                        border: "1px solid #ffadd2",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        margin: "0 auto 16px",
                                                        fontSize: 24,
                                                    }}
                                                >
                                                    <UserCheck
                                                        size={24}
                                                        color="#eb2f96"
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        color: "#1f1f1f",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    Female
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        color: "#eb2f96",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    +₹
                                                    {bookingSettings?.female_preference_fee ||
                                                        0}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        {/* Alert when time is reset due to gender preference change */}
                        {showTimeResetAlert && (
                            <Alert
                                message="Time slot reset"
                                description="Your selected time has been cleared because the available slots changed with your gender preference. Please select a new time slot."
                                type="info"
                                showIcon
                                closable
                                onClose={() => setShowTimeResetAlert(false)}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        {/* Time Slots Section */}
                        {selectedDate && (
                            <Card>
                                <Title level={4} style={{ marginBottom: 16 }}>
                                    <ClockCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Available Time Slots
                                    {bookingSettings?.enable_gender_preference &&
                                        genderPreference !==
                                            "no_preference" && (
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 14,
                                                    marginLeft: 8,
                                                }}
                                            >
                                                (Filtered for{" "}
                                                {genderPreference === "male"
                                                    ? "Male"
                                                    : "Female"}{" "}
                                                HospiPal)
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
                                                // Handle both object format (from backend) and string format (fallback)
                                                const slotStart =
                                                    typeof slot === "object"
                                                        ? slot.start
                                                        : slot;

                                                // Validate slotStart before processing
                                                if (
                                                    !slotStart ||
                                                    typeof slotStart !==
                                                        "string"
                                                ) {
                                                    console.error(
                                                        "Invalid slot start time:",
                                                        slotStart,
                                                        "for slot:",
                                                        slot
                                                    );
                                                    return null; // Skip rendering this slot
                                                }

                                                // Parse time string manually to create a valid dayjs object
                                                const timeParts =
                                                    slotStart.split(":");
                                                if (timeParts.length !== 2) {
                                                    console.error(
                                                        "Invalid time format:",
                                                        slotStart
                                                    );
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

                                                // Validate hours and minutes
                                                if (
                                                    isNaN(hours) ||
                                                    isNaN(minutes) ||
                                                    hours < 0 ||
                                                    hours > 23 ||
                                                    minutes < 0 ||
                                                    minutes > 59
                                                ) {
                                                    console.error(
                                                        "Invalid time values:",
                                                        hours,
                                                        minutes,
                                                        "for slot:",
                                                        slotStart
                                                    );
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
                                                                        Booked
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
                    </Col>

                    {/* Sidebar - Summary */}
                    <Col xs={24} xl={8} lg={10}>
                        <Card
                            style={{
                                position: "sticky",
                                top: 24,
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 24,
                                    padding: "16px 0",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <CheckCircle size={24} color="white" />
                                </div>
                                <div>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Booking Summary
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Review your booking details
                                    </Text>
                                </div>
                            </div>

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

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => {
                                        const quantity = extra.quantity || 1;
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
                                                                }}
                                                            >
                                                                {" "}
                                                                × {quantity}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        {formatPrice(
                                                            parseFloat(
                                                                extra.price
                                                            ) * quantity
                                                        )}
                                                    </Text>
                                                </div>
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
                                </>
                            )}

                            {/* Gender Preference Fee */}
                            {bookingSettings?.enable_gender_preference &&
                                genderPreference !== "no_preference" && (
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
                                                {genderPreference === "male"
                                                    ? "Male"
                                                    : "Female"}{" "}
                                                Preference
                                            </Text>
                                            <Text>
                                                {formatPrice(
                                                    genderPreference === "male"
                                                        ? bookingSettings?.male_preference_fee ||
                                                              0
                                                        : bookingSettings?.female_preference_fee ||
                                                              0
                                                )}
                                            </Text>
                                        </div>
                                    </>
                                )}

                            {/* Total */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text strong>Total Price</Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {formatPrice(
                                        (selectedPricingTier
                                            ? parseFloat(
                                                  selectedPricingTier.price
                                              )
                                            : parseFloat(service.price)) +
                                            selectedExtras.reduce(
                                                (sum, extra) => {
                                                    const quantity =
                                                        extra.quantity || 1;
                                                    return (
                                                        sum +
                                                        parseFloat(
                                                            extra.price
                                                        ) *
                                                            quantity
                                                    );
                                                },
                                                0
                                            ) +
                                            (bookingSettings?.enable_gender_preference &&
                                            genderPreference !== "no_preference"
                                                ? genderPreference === "male"
                                                    ? bookingSettings?.male_preference_fee ||
                                                      0
                                                    : bookingSettings?.female_preference_fee ||
                                                      0
                                                : 0)
                                    )}
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

                            {/* Selected Date & Time */}
                            {(selectedDate || selectedTime) && (
                                <>
                                    <Divider style={{ margin: "16px 0" }} />
                                    <div style={{ marginBottom: 8 }}>
                                        <Text type="secondary">
                                            Selected Date
                                        </Text>
                                        <div>
                                            <Text strong>
                                                {selectedDate
                                                    ? selectedDate.format(
                                                          "dddd, MMMM D, YYYY"
                                                      )
                                                    : "Not selected"}
                                            </Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary">
                                            Selected Time
                                        </Text>
                                        <div>
                                            <Text strong>
                                                {selectedTime &&
                                                selectedTime.isValid()
                                                    ? formatTime(selectedTime)
                                                    : "Not selected"}
                                            </Text>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Action Buttons */}
                            <div style={{ marginTop: 24 }}>
                                <Button
                                    block
                                    style={{
                                        marginBottom: 12,
                                        height: "40px",
                                        fontSize: "13px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    style={{
                                        height: "44px",
                                        fontSize: "13px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    icon={<ArrowRightOutlined />}
                                    onClick={handleContinue}
                                    disabled={!selectedDate || !selectedTime}
                                >
                                    Continue
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Trust Anchors */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 48,
                        padding: "32px 0",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 32,
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <CheckCircle size={16} color="#52c41a" />
                            <Text style={{ fontSize: 14, color: "#666" }}>
                                Flexible rescheduling available
                            </Text>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <CheckCircle size={16} color="#52c41a" />
                            <Text style={{ fontSize: 14, color: "#666" }}>
                                Reliable on-time arrival by your HospiPal
                            </Text>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <CheckCircle size={16} color="#52c41a" />
                            <Text style={{ fontSize: 14, color: "#666" }}>
                                Families trust us for critical moments
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Helper Option */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 48,
                        padding: "24px 0",
                    }}
                >
                    <div
                        style={{
                            padding: "20px",
                            background:
                                "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                            borderRadius: "16px",
                            border: "1px solid #bae7ff",
                            display: "inline-block",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#1890ff",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                justifyContent: "center",
                            }}
                        >
                            <MessageCircle size={18} />
                            Not sure what time to book? Chat with us on WhatsApp
                            for quick guidance.
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
