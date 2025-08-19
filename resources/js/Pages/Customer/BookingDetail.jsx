import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Typography,
    Space,
    Layout,
    Menu,
    Avatar,
    Tag,
    Divider,
    Row,
    Col,
    Descriptions,
    Badge,
    message,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    LogoutOutlined,
    BookOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    PrinterOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import Logo from "../../Components/Logo";
import RescheduleModal from "../../Components/RescheduleModal";
import CancelModal from "../../Components/CancelModal";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;

export default function BookingDetail({ auth, booking }) {
    const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    // Debug logging for schedule settings
    console.log("BookingDetail component - Schedule settings:", {
        scheduleSettings: booking?.schedule_settings,
        scheduleSettingsLength: booking?.schedule_settings?.length,
        firstSchedule: booking?.schedule_settings?.[0],
    });

    // Debug logging for booking data
    console.log("BookingDetail component - Booking data:", {
        bookingId: booking?.id,
        serviceName: booking?.service?.name,
        pricingTierId: booking?.pricing_tier_id,
        pricingTier: booking?.pricingTier,
        pricingTierName: booking?.pricingTier?.name,
        servicePrice: booking?.service?.price,
        pricingTierPrice: booking?.pricingTier?.price,
        pricingTierPriceParsed: parseFloat(booking?.pricingTier?.price),
        totalAmount: booking?.total_amount,
    });

    const handleRescheduleSuccess = (data) => {
        setRescheduleModalVisible(false);
        // Refresh the page to show updated booking details
        window.location.reload();
    };

    const handleRescheduleCancel = () => {
        setRescheduleModalVisible(false);
    };

    const handleCancelSuccess = (data) => {
        setCancelModalVisible(false);
        message.success("Booking cancelled successfully");
        // Refresh the page to show updated booking details
        window.location.reload();
    };

    const handleCancelModalCancel = () => {
        setCancelModalVisible(false);
    };

    // Add safety check for auth prop
    if (!auth || !auth.user) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <Title level={2}>Access Denied</Title>
                <Text>Please log in to view booking details.</Text>
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircleOutlined />;
            case "pending":
                return <ExclamationCircleOutlined />;
            case "completed":
                return <CheckCircleOutlined />;
            case "cancelled":
                return <CloseCircleOutlined />;
            case "no_show":
                return <CloseCircleOutlined />;
            default:
                return <ExclamationCircleOutlined />;
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

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const getInitials = (name) => {
        if (!name) return "CU";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    window.location.reload();
                },
            }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const menuItems = [
        {
            key: "services",
            icon: <BookOutlined />,
            label: "Services",
            onClick: () => router.visit(route("booking.select-service")),
        },
        {
            key: "bookings",
            icon: <CalendarOutlined />,
            label: "Your Bookings",
            onClick: () => router.visit(route("customer.bookings")),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title={`Booking #${booking.id} - HospiPal`} />

            {/* Header */}
            <Header
                style={{
                    background: "#fff",
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    height: "auto",
                    minHeight: 64,
                    maxWidth: "100vw",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        minWidth: 0,
                    }}
                >
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="medium"
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flex: 1,
                        justifyContent: "flex-end",
                        minWidth: 0,
                        overflow: "hidden",
                    }}
                >
                    <Menu
                        mode="horizontal"
                        items={menuItems}
                        selectedKeys={["bookings"]}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "14px",
                            minWidth: 0,
                            flexShrink: 1,
                            maxWidth: "100%",
                        }}
                    />

                    <Space size="small" style={{ flexShrink: 0 }}>
                        <Avatar
                            style={{
                                backgroundColor: "#1890ff",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                message.info("Profile settings coming soon")
                            }
                        >
                            {getInitials(auth.user?.name)}
                        </Avatar>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            size="small"
                        >
                            <span className="hidden-xs">Logout</span>
                        </Button>
                    </Space>
                </div>
            </Header>

            {/* Content */}
            <Content style={{ padding: "16px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Add responsive top spacing for mobile */}
                    <div className="mobile-top-spacing" />
                    {/* Header */}
                    <div style={{ marginBottom: 24 }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() =>
                                router.visit(route("customer.bookings"))
                            }
                            style={{ marginBottom: 16 }}
                        >
                            Back to Bookings
                        </Button>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: 16,
                            }}
                        >
                            <div>
                                <Title level={2} style={{ marginBottom: 8 }}>
                                    Booking #{booking.id}
                                </Title>
                                <Text type="secondary">
                                    {booking.service?.name}
                                    {booking?.pricingTier && (
                                        <Tag
                                            color="blue"
                                            style={{
                                                marginLeft: 8,
                                                fontSize: 10,
                                            }}
                                        >
                                            {booking.pricingTier.name}
                                        </Tag>
                                    )}
                                </Text>
                            </div>
                            <Space>
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                >
                                    <span className="hidden-xs">Print</span>
                                </Button>
                            </Space>
                        </div>
                    </div>

                    <Row gutter={[24, 24]}>
                        {/* Main Booking Details */}
                        <Col xs={24} lg={16}>
                            <Card
                                title="Booking Details"
                                style={{ marginBottom: 24 }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Service</Text>
                                            <div>
                                                <Text>
                                                    {booking.service?.name}
                                                    {booking?.pricingTier && (
                                                        <Tag
                                                            color="blue"
                                                            style={{
                                                                marginLeft: 8,
                                                                fontSize: 10,
                                                            }}
                                                        >
                                                            {
                                                                booking
                                                                    .pricingTier
                                                                    .name
                                                            }
                                                        </Tag>
                                                    )}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Employee</Text>
                                            <div>
                                                <Text>
                                                    {booking.employee?.name ||
                                                        "Auto-assigned"}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Date & Time</Text>
                                            <div>
                                                <Text>
                                                    {formatDateTime(
                                                        booking.appointment_time
                                                    )}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Duration</Text>
                                            <div>
                                                <Text>
                                                    {formatDuration(
                                                        booking.duration
                                                    )}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Status</Text>
                                            <div>
                                                <Tag
                                                    color={getStatusColor(
                                                        booking.status
                                                    )}
                                                    icon={getStatusIcon(
                                                        booking.status
                                                    )}
                                                >
                                                    {booking.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        booking.status.slice(1)}
                                                </Tag>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Payment Status</Text>
                                            <div>
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
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>
                                                Reschedule Attempts
                                            </Text>
                                            <div>
                                                <Text>
                                                    {booking.reschedule_attempts ||
                                                        0}{" "}
                                                    attempts
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    {booking.rescheduled_at && (
                                        <Col xs={24} sm={12}>
                                            <div style={{ marginBottom: 16 }}>
                                                <Text strong>
                                                    Last Rescheduled
                                                </Text>
                                                <div>
                                                    <Text>
                                                        {formatDateTime(
                                                            booking.rescheduled_at
                                                        )}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Card>

                            {/* Extras */}
                            {booking.extras && booking.extras.length > 0 && (
                                <Card
                                    title="Additional Services"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Row gutter={[16, 16]}>
                                        {booking.extras.map((extra) => {
                                            const quantity =
                                                extra.pivot?.quantity || 1;
                                            const totalPrice =
                                                parseFloat(
                                                    extra.pivot?.price ||
                                                        extra.price
                                                ) * quantity;
                                            const totalDuration =
                                                extra.duration_relation
                                                    ? (extra.duration_relation
                                                          .hours *
                                                          60 +
                                                          extra
                                                              .duration_relation
                                                              .minutes) *
                                                      quantity
                                                    : (extra.total_duration ||
                                                          0) * quantity;

                                            return (
                                                <Col
                                                    xs={24}
                                                    sm={12}
                                                    key={extra.id}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                            padding: "12px",
                                                            border: "1px solid #f0f0f0",
                                                            borderRadius: "8px",
                                                        }}
                                                    >
                                                        <div>
                                                            <Text strong>
                                                                {extra.name}
                                                                {quantity >
                                                                    1 && (
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{
                                                                            fontSize: 12,
                                                                            marginLeft: 8,
                                                                        }}
                                                                    >
                                                                        ×{" "}
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </Text>
                                                                )}
                                                            </Text>
                                                            <br />
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                {formatDuration(
                                                                    totalDuration
                                                                )}
                                                            </Text>
                                                        </div>
                                                        <Text>
                                                            {formatPrice(
                                                                totalPrice
                                                            )}
                                                        </Text>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Card>
                            )}

                            {/* Form Responses */}
                            {booking.formResponses &&
                                booking.formResponses.length > 0 && (
                                    <Card
                                        title="Form Responses"
                                        style={{ marginBottom: 24 }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            {booking.formResponses.map(
                                                (response) => (
                                                    <Col
                                                        xs={24}
                                                        sm={12}
                                                        key={response.id}
                                                    >
                                                        <div
                                                            style={{
                                                                marginBottom: 16,
                                                            }}
                                                        >
                                                            <Text strong>
                                                                {response
                                                                    .formField
                                                                    ?.label ||
                                                                    response
                                                                        .formField
                                                                        ?.name}
                                                            </Text>
                                                            <div>
                                                                <Text>
                                                                    {
                                                                        response.value
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            )}
                                        </Row>
                                    </Card>
                                )}

                            {/* Notes */}
                            {booking.notes && (
                                <Card
                                    title="Notes"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Paragraph>{booking.notes}</Paragraph>
                                </Card>
                            )}

                            {/* Reschedule Information */}
                            {(booking.reschedule_attempts > 0 ||
                                booking.reschedule_payment_amount > 0) && (
                                <Card
                                    title="Reschedule Information"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Row gutter={[16, 16]}>
                                        {booking.reschedule_attempts > 0 && (
                                            <Col xs={24} sm={12}>
                                                <div
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Text strong>
                                                        Reschedule Attempts
                                                    </Text>
                                                    <div>
                                                        <Text>
                                                            {
                                                                booking.reschedule_attempts
                                                            }{" "}
                                                            time(s)
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {booking.rescheduled_at && (
                                            <Col xs={24} sm={12}>
                                                <div
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Text strong>
                                                        Last Rescheduled
                                                    </Text>
                                                    <div>
                                                        <Text>
                                                            {formatDateTime(
                                                                booking.rescheduled_at
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {booking.reschedule_payment_amount >
                                            0 && (
                                            <Col xs={24} sm={12}>
                                                <div
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Text strong>
                                                        Reschedule Fee Paid
                                                    </Text>
                                                    <div>
                                                        <Text
                                                            style={{
                                                                color: "#52c41a",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            ₹
                                                            {
                                                                booking.reschedule_payment_amount
                                                            }
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {booking.reschedule_payment_id && (
                                            <Col xs={24} sm={12}>
                                                <div
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Text strong>
                                                        Payment ID
                                                    </Text>
                                                    <div>
                                                        <Text code>
                                                            {
                                                                booking.reschedule_payment_id
                                                            }
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {booking.reschedule_payment_date && (
                                            <Col xs={24} sm={12}>
                                                <div
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Text strong>
                                                        Payment Date
                                                    </Text>
                                                    <div>
                                                        <Text>
                                                            {formatDateTime(
                                                                booking.reschedule_payment_date
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </Card>
                            )}
                        </Col>

                        {/* Sidebar - Payment & Actions */}
                        <Col xs={24} lg={8}>
                            <Card
                                title="Payment Details"
                                style={{ marginBottom: 24 }}
                            >
                                <div style={{ marginBottom: 16 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text>
                                            Service
                                            {booking?.pricingTier && (
                                                <Tag
                                                    color="blue"
                                                    style={{
                                                        marginLeft: 8,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {booking.pricingTier.name}
                                                </Tag>
                                            )}
                                        </Text>
                                        <Text>
                                            {formatPrice(
                                                parseFloat(
                                                    booking?.pricingTier?.price
                                                ) ||
                                                    parseFloat(
                                                        booking.service?.price
                                                    ) ||
                                                    0
                                            )}
                                        </Text>
                                    </div>
                                    {booking.extras &&
                                        booking.extras.length > 0 && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <Text>Extras</Text>
                                                <Text>
                                                    {formatPrice(
                                                        booking.extras.reduce(
                                                            (sum, extra) => {
                                                                const quantity =
                                                                    extra.pivot
                                                                        ?.quantity ||
                                                                    1;
                                                                const price =
                                                                    parseFloat(
                                                                        extra
                                                                            .pivot
                                                                            ?.price ||
                                                                            extra.price ||
                                                                            0
                                                                    );
                                                                return (
                                                                    sum +
                                                                    price *
                                                                        quantity
                                                                );
                                                            },
                                                            0
                                                        )
                                                    )}
                                                </Text>
                                            </div>
                                        )}
                                    {booking.discount_amount > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 8,
                                                color: "#52c41a",
                                            }}
                                        >
                                            <Text>Discount</Text>
                                            <Text>
                                                -
                                                {formatPrice(
                                                    booking.discount_amount
                                                )}
                                            </Text>
                                        </div>
                                    )}
                                    <Divider style={{ margin: "12px 0" }} />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <Text strong>Total</Text>
                                        <Text strong>
                                            {formatPrice(booking.total_amount)}
                                        </Text>
                                    </div>
                                </div>

                                {booking.payment_method && (
                                    <div style={{ marginBottom: 16 }}>
                                        <Text type="secondary">
                                            Payment Method
                                        </Text>
                                        <div>
                                            <Text>
                                                {booking.payment_method}
                                            </Text>
                                        </div>
                                    </div>
                                )}

                                {booking.transaction_id && (
                                    <div style={{ marginBottom: 16 }}>
                                        <Text type="secondary">
                                            Transaction ID
                                        </Text>
                                        <div>
                                            <Text code>
                                                {booking.transaction_id}
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Actions */}
                            <Card title="Actions">
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    {(booking.status === "pending" ||
                                        booking.status === "confirmed") && (
                                        <Button
                                            type="primary"
                                            block
                                            danger
                                            onClick={() =>
                                                setCancelModalVisible(true)
                                            }
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                    {booking.status === "confirmed" && (
                                        <Button
                                            type="primary"
                                            block
                                            onClick={() =>
                                                setRescheduleModalVisible(true)
                                            }
                                        >
                                            Reschedule
                                        </Button>
                                    )}
                                    {booking.invoice && (
                                        <Button
                                            icon={<DownloadOutlined />}
                                            block
                                            onClick={() =>
                                                window.open(
                                                    `/customer/invoices/${booking.invoice.id}/download`,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            Download Invoice
                                        </Button>
                                    )}
                                    <Button
                                        block
                                        onClick={() =>
                                            message.info(
                                                "Contact support functionality coming soon"
                                            )
                                        }
                                    >
                                        Contact Support
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            {/* Reschedule Modal */}
            <RescheduleModal
                visible={rescheduleModalVisible}
                onCancel={handleRescheduleCancel}
                onSuccess={handleRescheduleSuccess}
                booking={booking}
                scheduleSettings={booking.schedule_settings || []}
            />

            {/* Cancel Modal */}
            <CancelModal
                visible={cancelModalVisible}
                onCancel={handleCancelModalCancel}
                onSuccess={handleCancelSuccess}
                booking={booking}
            />
        </Layout>
    );
}
