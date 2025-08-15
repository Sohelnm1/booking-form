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
            onClick: () => router.visit(route("welcome")),
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
        },
        {
            title: "Employee",
            dataIndex: "employee",
            key: "employee",
            render: (employee) => employee?.name || "Auto-assigned",
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
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => {
                            // TODO: Add view booking details functionality
                            console.log("View booking:", record.id);
                        }}
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
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="medium"
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Menu
                        mode="horizontal"
                        items={menuItems}
                        selectedKeys={["bookings"]}
                        style={{ border: "none", background: "transparent" }}
                    />

                    <Space>
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
                        >
                            Logout
                        </Button>
                    </Space>
                </div>
            </Header>

            {/* Content */}
            <Content style={{ padding: "24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
