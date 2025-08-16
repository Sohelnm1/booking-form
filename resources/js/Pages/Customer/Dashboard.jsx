import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Layout,
    Menu,
    Avatar,
    message,
    Alert,
    Divider,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    SendOutlined,
    LogoutOutlined,
    BookOutlined,
    SettingOutlined,
    SafetyCertificateOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import Logo from "../../Components/Logo";
import CustomerLoginModal from "../../Components/CustomerLoginModal";

const { Title, Paragraph, Text } = Typography;
const { Header, Content } = Layout;

export default function CustomerDashboard({ auth }) {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Add safety check for auth prop
        if (auth && auth.user) {
            setIsLoggedIn(true);
            setCurrentUser(auth.user);
        }
    }, [auth]);

    const handleBookAppointment = () => {
        router.visit(route("booking.select-service"));
    };

    const handleLogin = () => {
        setIsLoginModalVisible(true);
    };

    const handleLoginSuccess = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        // Use the proper logout route
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

    const getInitials = (name) => {
        if (!name) return "CU"; // Default initials if no name
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const menuItems = [
        {
            key: "services",
            icon: <BookOutlined />,
            label: "Services",
            onClick: () => router.visit(route("booking.select-service")),
        },
        ...(isLoggedIn && currentUser
            ? [
                  {
                      key: "bookings",
                      icon: <CalendarOutlined />,
                      label: "Your Bookings",
                      onClick: () => router.visit(route("customer.bookings")),
                  },
              ]
            : []),
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title="HospiPal - Customer Dashboard" />

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
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "14px",
                            minWidth: 0,
                            flexShrink: 1,
                            maxWidth: "100%",
                        }}
                    />

                    {isLoggedIn && currentUser ? (
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
                                {getInitials(currentUser?.name)}
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
                    ) : (
                        <Button
                            type="primary"
                            onClick={handleLogin}
                            size="middle"
                            className="header-signin-btn"
                        >
                            <span className="hidden-xs">Sign In</span>
                            <span className="visible-xs">Login</span>
                        </Button>
                    )}
                </div>
            </Header>

            {/* Content */}
            <Content style={{ padding: "16px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Add responsive top spacing for mobile */}
                    <div className="mobile-top-spacing" />
                    {/* Hero Section */}
                    <div
                        style={{
                            background:
                                "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                            padding: "32px 16px",
                            borderRadius: "16px",
                            textAlign: "center",
                            marginBottom: 32,
                        }}
                    >
                        <Title
                            level={1}
                            style={{ marginBottom: 24, color: "#1f1f1f" }}
                        >
                            Welcome to HospiPal
                        </Title>
                        <Paragraph
                            style={{
                                fontSize: 18,
                                color: "#666",
                                maxWidth: 600,
                                margin: "0 auto 32px auto",
                            }}
                        >
                            Experience seamless booking with our modern,
                            user-friendly platform. Find and reserve your
                            perfect spot with just a few clicks.
                        </Paragraph>
                        <Space
                            size="large"
                            direction="vertical"
                            style={{ width: "100%" }}
                            className="hero-buttons-container"
                        >
                            <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={handleBookAppointment}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    border: "none",
                                    height: 48,
                                    padding: "0 32px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    width: "100%",
                                }}
                                className="hero-primary-button"
                            >
                                {isLoggedIn && currentUser
                                    ? "Book Appointment Now"
                                    : "Book Appointment"}
                            </Button>
                        </Space>
                    </div>

                    {/* Features Section */}
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card>
                                <div style={{ textAlign: "center" }}>
                                    <CalendarOutlined
                                        style={{
                                            fontSize: 48,
                                            color: "#1890ff",
                                            marginBottom: 16,
                                        }}
                                    />
                                    <Title level={4}>Easy Booking</Title>
                                    <Paragraph>
                                        Book your appointments in just a few
                                        clicks with our streamlined booking
                                        process.
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <div style={{ textAlign: "center" }}>
                                    <SafetyCertificateOutlined
                                        style={{
                                            fontSize: 48,
                                            color: "#52c41a",
                                            marginBottom: 16,
                                        }}
                                    />
                                    <Title level={4}>Secure & Safe</Title>
                                    <Paragraph>
                                        Your data is protected with
                                        industry-standard security measures.
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <div style={{ textAlign: "center" }}>
                                    <MobileOutlined
                                        style={{
                                            fontSize: 48,
                                            color: "#722ed1",
                                            marginBottom: 16,
                                        }}
                                    />
                                    <Title level={4}>Mobile Friendly</Title>
                                    <Paragraph>
                                        Access our platform from any device with
                                        our responsive design.
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            {/* Customer Login Modal */}
            <CustomerLoginModal
                isVisible={isLoginModalVisible}
                onClose={() => setIsLoginModalVisible(false)}
                onSuccess={handleLoginSuccess}
            />
        </Layout>
    );
}
