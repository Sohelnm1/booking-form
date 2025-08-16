import React from "react";
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
} from "@ant-design/icons";
import Logo from "../../Components/Logo";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;

export default function BookingDetail({ auth, booking }) {
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
                                </Row>
                            </Card>

                            {/* Extras */}
                            {booking.extras && booking.extras.length > 0 && (
                                <Card
                                    title="Additional Services"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Row gutter={[16, 16]}>
                                        {booking.extras.map((extra) => (
                                            <Col xs={24} sm={12} key={extra.id}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        padding: "12px",
                                                        border: "1px solid #f0f0f0",
                                                        borderRadius: "8px",
                                                    }}
                                                >
                                                    <div>
                                                        <Text strong>
                                                            {extra.name}
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
                                                                extra.duration ||
                                                                    0
                                                            )}
                                                        </Text>
                                                    </div>
                                                    <Text>
                                                        {formatPrice(
                                                            extra.pivot
                                                                ?.price ||
                                                                extra.price
                                                        )}
                                                    </Text>
                                                </div>
                                            </Col>
                                        ))}
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
                                        <Text>Service</Text>
                                        <Text>
                                            {formatPrice(
                                                booking.service?.price || 0
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
                                                            (sum, extra) =>
                                                                sum +
                                                                parseFloat(
                                                                    extra.pivot
                                                                        ?.price ||
                                                                        extra.price ||
                                                                        0
                                                                ),
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
                                    {booking.status === "pending" && (
                                        <Button
                                            type="primary"
                                            block
                                            danger
                                            onClick={() =>
                                                message.info(
                                                    "Cancel booking functionality coming soon"
                                                )
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
                                                message.info(
                                                    "Reschedule functionality coming soon"
                                                )
                                            }
                                        >
                                            Reschedule
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
        </Layout>
    );
}
