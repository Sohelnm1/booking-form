import React from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Table,
    Tag,
    Typography,
    Space,
    Layout,
    Menu,
    Avatar,
    Empty,
    message,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    LogoutOutlined,
    BookOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import Logo from "../../Components/Logo";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function CustomerBookings({ auth, bookings }) {
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

    const getInitials = (name) => {
        if (!name) return "CU"; // Default initials if no name
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
                    // Force a page refresh to get a new CSRF token
                    window.location.reload();
                },
            }
        );
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
        },
    ];

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
            render: (duration) => `${duration} minutes`,
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
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title="Your Bookings - HospiPal" />

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
                                                        alignItems:
                                                            "flex-start",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        {booking.service?.name}
                                                    </Text>
                                                    <Tag
                                                        color={getStatusColor(
                                                            booking.status
                                                        )}
                                                    >
                                                        {booking.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            booking.status.slice(
                                                                1
                                                            )}
                                                    </Tag>
                                                </div>
                                                <Text type="secondary">
                                                    {formatDateTime(
                                                        booking.appointment_time
                                                    )}
                                                </Text>
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
                                                        {booking.duration}{" "}
                                                        minutes
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
                </div>
            </Content>
        </Layout>
    );
}
