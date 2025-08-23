import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Table,
    Tag,
    Typography,
    Space,
    Empty,
    message,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import BookingHeader from "../../Components/BookingHeader";
import CancelModal from "../../Components/CancelModal";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function CustomerBookings({ auth, bookings }) {
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Add safety check for auth prop
    if (!auth || !auth.user) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <Title level={2}>Access Denied</Title>
                <Text>Please log in to view your bookings.</Text>
                <br />
                <Button
                    type="primary"
                    onClick={() => router.visit(route("welcome"))}
                    style={{ marginTop: 16 }}
                >
                    Go to Home
                </Button>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "success";
            case "pending":
                return "warning";
            case "completed":
                return "processing";
            case "cancelled":
                return "error";
            case "no_show":
                return "default";
            default:
                return "default";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "failed":
                return "error";
            case "refunded":
                return "default";
            default:
                return "default";
        }
    };

    const formatTime = (time) => {
        return dayjs(time).format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("MMM DD, YYYY");
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).format("MMM DD, YYYY h:mm A");
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

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setCancelModalVisible(true);
    };

    const handleCancelSuccess = (data) => {
        setCancelModalVisible(false);
        setSelectedBooking(null);
        message.success("Booking cancelled successfully");
        // Refresh the page to show updated booking details
        window.location.reload();
    };

    const handleCancelModalCancel = () => {
        setCancelModalVisible(false);
        setSelectedBooking(null);
    };

    const columns = [
        {
            title: "Service",
            dataIndex: "service",
            key: "service",
            render: (service) => service?.name || "N/A",
            responsive: ["md"],
        },
        {
            title: "Employee",
            dataIndex: "employee",
            key: "employee",
            render: (employee) => employee?.name || "Auto-assigned",
            responsive: ["lg"],
        },
        {
            title: "Date & Time",
            dataIndex: "appointment_time",
            key: "appointment_time",
            render: (datetime) => formatDateTime(datetime),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration) => formatDuration(duration),
            responsive: ["md"],
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: "Payment",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (status) => (
                <Tag color={getPaymentStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
            responsive: ["md"],
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
            responsive: ["sm"],
        },
        {
            title: "Reschedule",
            key: "reschedule",
            render: (_, record) => (
                <div>
                    {record.reschedule_attempts > 0 ? (
                        <Space direction="vertical" size="small">
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {record.reschedule_attempts} time(s)
                            </Text>
                            {record.reschedule_payment_amount > 0 && (
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: "12px",
                                        color: "#52c41a",
                                    }}
                                >
                                    Fee: ₹{record.reschedule_payment_amount}
                                </Text>
                            )}
                        </Space>
                    ) : (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Never
                        </Text>
                    )}
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() =>
                            router.visit(
                                route("customer.bookings.show", record.id)
                            )
                        }
                    >
                        View
                    </Button>
                    {(record.status === "pending" ||
                        record.status === "confirmed") && (
                        <Button
                            size="small"
                            danger
                            onClick={() => handleCancelBooking(record)}
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Head title="Your Bookings - HospiPal" />
            <BookingHeader auth={auth} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Add responsive top spacing for mobile */}
                <div className="mobile-top-spacing" />
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.visit(route("welcome"))}
                        style={{ marginBottom: 16 }}
                    >
                        Back to Home
                    </Button>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Your Bookings
                    </Title>
                    <Text type="secondary">
                        View and manage all your appointments
                    </Text>
                </div>

                {/* Bookings Table */}
                <Card>
                    {bookings && bookings.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden-xs">
                                <Table
                                    columns={columns}
                                    dataSource={bookings}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} bookings`,
                                    }}
                                />
                            </div>

                            {/* Mobile Card View */}
                            <div className="visible-xs">
                                {bookings.map((booking) => (
                                    <Card
                                        key={booking.id}
                                        style={{ marginBottom: 16 }}
                                        styles={{ body: { padding: 16 } }}
                                    >
                                        <div style={{ marginBottom: 12 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <div>
                                                    <Text strong>
                                                        {booking.service?.name}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        {formatDateTime(
                                                            booking.appointment_time
                                                        )}
                                                    </Text>
                                                </div>
                                                <Tag
                                                    color={getStatusColor(
                                                        booking.status
                                                    )}
                                                >
                                                    {booking.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        booking.status.slice(1)}
                                                </Tag>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <div>
                                                    <Text type="secondary">
                                                        Duration:{" "}
                                                    </Text>
                                                    <Text>
                                                        {formatDuration(
                                                            booking.duration
                                                        )}
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text type="secondary">
                                                        Amount:{" "}
                                                    </Text>
                                                    <Text strong>
                                                        ₹
                                                        {parseFloat(
                                                            booking.total_amount
                                                        ).toFixed(2)}
                                                    </Text>
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Tag
                                                    color={getPaymentStatusColor(
                                                        booking.payment_status
                                                    )}
                                                >
                                                    {booking.payment_status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        booking.payment_status.slice(
                                                            1
                                                        )}
                                                </Tag>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "customer.bookings.show",
                                                                booking.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Empty
                            description="No bookings found"
                            style={{ padding: "40px 0" }}
                        >
                            <Button
                                type="primary"
                                onClick={() =>
                                    router.visit(
                                        route("booking.select-service")
                                    )
                                }
                            >
                                Book Your First Appointment
                            </Button>
                        </Empty>
                    )}
                </Card>

                {/* Cancel Modal */}
                <CancelModal
                    visible={cancelModalVisible}
                    onCancel={handleCancelModalCancel}
                    onSuccess={handleCancelSuccess}
                    booking={selectedBooking}
                />
            </div>
        </div>
    );
}
