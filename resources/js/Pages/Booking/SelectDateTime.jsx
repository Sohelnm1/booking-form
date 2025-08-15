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
import dayjs from "dayjs";

import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;

export default function SelectDateTime({
    service,
    selectedExtras,
    scheduleSettings,
    auth,
}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    // Calculate total duration for slot calculation
    const totalDuration =
        service.duration +
        selectedExtras.reduce((sum, extra) => sum + (extra.duration || 0), 0);

    const handleBack = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        router.visit(route("booking.select-extras"), {
            data: {
                service_id: service.id,
                extras: extraIds,
            },
        });
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            const extraIds = selectedExtras.map((extra) => extra.id);
            router.visit(route("booking.consent"), {
                data: {
                    service_id: service.id,
                    extras: extraIds,
                    date: selectedDate.format("YYYY-MM-DD"),
                    time: selectedTime.format("HH:mm"),
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

            // Build query parameters
            const params = new URLSearchParams({
                date: date.format("YYYY-MM-DD"),
                service_id: service.id,
            });

            // Add extras if any are selected
            if (selectedExtras.length > 0) {
                selectedExtras.forEach((extra) => {
                    params.append("extras[]", extra.id);
                });
            }

            const response = await fetch(
                `${route("booking.available-slots")}?${params.toString()}`
            );
            const data = await response.json();
            console.log("Available slots response:", data);

            if (data.slots && data.slots.length > 0) {
                setAvailableSlots(data.slots);
            } else {
                console.log("No slots returned from backend, using fallback");
                // Fallback time slots for testing - show as unavailable
                const fallbackSlots = [
                    {
                        start: "09:00",
                        end: "09:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "09:30",
                        end: "10:00",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "10:00",
                        end: "10:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "10:30",
                        end: "11:00",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "11:00",
                        end: "11:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "11:30",
                        end: "12:00",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "14:00",
                        end: "14:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "14:30",
                        end: "15:00",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "15:00",
                        end: "15:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "15:30",
                        end: "16:00",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "16:00",
                        end: "16:30",
                        available: false,
                        available_employees: 0,
                    },
                    {
                        start: "16:30",
                        end: "17:00",
                        available: false,
                        available_employees: 0,
                    },
                ];
                setAvailableSlots(fallbackSlots);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
            // Fallback time slots for testing - show as unavailable
            const fallbackSlots = [
                {
                    start: "09:00",
                    end: "09:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "09:30",
                    end: "10:00",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "10:00",
                    end: "10:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "10:30",
                    end: "11:00",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "11:00",
                    end: "11:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "11:30",
                    end: "12:00",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "14:00",
                    end: "14:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "14:30",
                    end: "15:00",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "15:00",
                    end: "15:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "15:30",
                    end: "16:00",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "16:00",
                    end: "16:30",
                    available: false,
                    available_employees: 0,
                },
                {
                    start: "16:30",
                    end: "17:00",
                    available: false,
                    available_employees: 0,
                },
            ];
            setAvailableSlots(fallbackSlots);
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
        console.log("formatTime called with:", time, typeof time);
        try {
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
            // Fallback to basic logic if no schedule settings
            return (
                date.isAfter(today.subtract(1, "day")) &&
                date.isBefore(today.add(31, "day"))
            );
        }

        // Use schedule settings for date range
        const minAdvanceHours = defaultSchedule.min_advance_hours || 2;
        const maxAdvanceDays = defaultSchedule.max_advance_days || 30;
        const workingDays = defaultSchedule.working_days || [1, 2, 3, 4, 5];

        // Check if date is within booking window
        const minDate = today.add(minAdvanceHours, "hour");
        const maxDate = today.add(maxAdvanceDays, "day");

        // Allow today's date to be selectable (the backend will handle minimum advance time)
        const isToday = date.isSame(today, "day");
        const isWithinRange =
            isToday || (date.isAfter(minDate) && date.isBefore(maxDate));

        // Check if date is a working day
        const dayOfWeek = date.day(); // 0=Sunday, 1=Monday, etc.
        const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert to 1-7 format
        const isWorkingDay = workingDays.includes(adjustedDayOfWeek);

        const isSelectable = isWithinRange && isWorkingDay;

        // Debug logging
        if (date.isSame(today, "day")) {
            console.log("Today date check:", {
                date: date.format("YYYY-MM-DD"),
                isToday,
                isWithinRange,
                isWorkingDay,
                isSelectable,
                minAdvanceHours,
                workingDays,
            });
        }

        return isSelectable;
    };

    return (
        <div>
            <Head title="Select Date & Time - Book Appointment" />

            <BookingHeader auth={auth} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="large"
                    />
                    <Title level={2} style={{ marginTop: 24, marginBottom: 8 }}>
                        Choose Date & Time
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Select your preferred appointment date and time
                    </Text>
                    {scheduleSettings && scheduleSettings.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                📅 Booking window:{" "}
                                {scheduleSettings[0].booking_window_days} days
                                ahead • ⏰ Min advance:{" "}
                                {scheduleSettings[0].min_advance_hours} hours •
                                🕐 Working hours:{" "}
                                {scheduleSettings[0].start_time} -{" "}
                                {scheduleSettings[0].end_time} • 📆 Working
                                days: {scheduleSettings[0].working_days_text}
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

                <Row gutter={[32, 32]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
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
                                                        defaultSchedule?.working_days || [
                                                            1, 2, 3, 4, 5,
                                                        ];

                                                    if (
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

                        {/* Time Slots Section */}
                        {selectedDate && (
                            <Card>
                                <Title level={4} style={{ marginBottom: 16 }}>
                                    <ClockCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Available Time Slots
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
                                        {availableSlots.map((slot, index) => {
                                            // Handle both object format (from backend) and string format (fallback)
                                            const slotStart =
                                                typeof slot === "object"
                                                    ? slot.start
                                                    : slot;

                                            console.log("Rendering slot:", {
                                                slot,
                                                slotStart,
                                                index,
                                            });

                                            const slotTime = dayjs(
                                                slotStart,
                                                "HH:mm"
                                            );
                                            const isSelected =
                                                selectedTime &&
                                                selectedTime.format("HH:mm") ===
                                                    slotStart;

                                            // Check if slot is available (from backend or fallback)
                                            const isAvailable =
                                                typeof slot === "object"
                                                    ? slot.available !== false
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
                                                        disabled={!isAvailable}
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
                                                            opacity: isAvailable
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
                                                                display: "flex",
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
                                        })}
                                    </Row>
                                )}
                            </Card>
                        )}
                    </Col>

                    {/* Sidebar - Summary */}
                    <Col xs={24} lg={8}>
                        <Card style={{ position: "sticky", top: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Booking Summary
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
                                    <Text strong>{service.name}</Text>
                                    <Text>{formatPrice(service.price)}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDuration(service.duration)}
                                </Text>
                            </div>

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => (
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
                                                <Text>+ {extra.name}</Text>
                                                <Text>
                                                    {formatPrice(extra.price)}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
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
                                        parseFloat(service.price) +
                                            selectedExtras.reduce(
                                                (sum, extra) =>
                                                    sum +
                                                    parseFloat(extra.price),
                                                0
                                            )
                                    )}
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text type="secondary">Total Duration</Text>
                                <Text type="secondary">
                                    {formatDuration(totalDuration)}
                                </Text>
                            </div>

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
                                                {selectedTime
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
                                    style={{ marginBottom: 12 }}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                >
                                    Back to Extras
                                </Button>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={handleContinue}
                                    disabled={!selectedDate || !selectedTime}
                                >
                                    Continue to Consent
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
