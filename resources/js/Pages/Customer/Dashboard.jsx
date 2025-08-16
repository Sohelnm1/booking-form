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
    Modal,
    Input,
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

const { Title, Paragraph, Text } = Typography;
const { Header, Content } = Layout;

export default function CustomerDashboard({ auth }) {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState(""); // For testing
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

    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            message.error("Please enter a valid phone number");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(route("booking.send-otp"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success("OTP sent successfully to your phone number");
                setOtpSent(true);

                // For testing - store the OTP if it's returned by the server
                if (result.otp) {
                    setReceivedOtp(result.otp);
                }
            } else {
                message.error(result.error || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            message.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            message.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(route("customer.login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success("Login successful!");
                setIsLoggedIn(true);
                setCurrentUser(result.user);
                setIsLoginModalVisible(false);
                setOtpSent(false);
                setOtp("");
                setPhoneNumber("");

                // Reload the page to get the authenticated state
                window.location.reload();
            } else {
                message.error(result.error || "Invalid OTP");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            message.error("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
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
            onClick: () => router.visit(route("welcome")),
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
                            size="small"
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
                            >
                                {isLoggedIn && currentUser
                                    ? "Book Appointment Now"
                                    : "Book Appointment"}
                            </Button>
                            {!isLoggedIn && (
                                <Button
                                    size="large"
                                    onClick={handleLogin}
                                    style={{
                                        height: 48,
                                        padding: "0 32px",
                                        fontSize: 16,
                                        width: "100%",
                                    }}
                                >
                                    Log In
                                </Button>
                            )}
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

            {/* Login Modal */}
            <Modal
                title="Customer Login"
                open={isLoginModalVisible}
                onCancel={() => {
                    setIsLoginModalVisible(false);
                    setOtpSent(false);
                    setOtp("");
                    setPhoneNumber("");
                }}
                footer={null}
                width={480}
                centered
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: 32 }}>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 16,
                                lineHeight: 1.6,
                                color: "#595959",
                            }}
                        >
                            {!otpSent
                                ? "Enter your phone number to receive a verification code"
                                : `We've sent a 6-digit code to ${phoneNumber}`}
                        </Text>

                        {/* For testing - show the OTP if available */}
                        {otpSent && receivedOtp && (
                            <Alert
                                message="Testing Mode - OTP Code"
                                description={`Your verification code is: ${receivedOtp}`}
                                type="info"
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </div>

                    {!otpSent ? (
                        <div>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        position: "relative",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Input
                                        size="large"
                                        placeholder="+91 98765 43210"
                                        prefix={
                                            <PhoneOutlined
                                                style={{ color: "#bfbfbf" }}
                                            />
                                        }
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        style={{
                                            height: 48,
                                            fontSize: 16,
                                            borderRadius: 8,
                                            border: "1px solid #d9d9d9",
                                        }}
                                    />
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    We'll send you a verification code via SMS
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SendOutlined />}
                                onClick={handleSendOtp}
                                loading={loading}
                                disabled={
                                    !phoneNumber || phoneNumber.length < 10
                                }
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderRadius: 8,
                                    width: "100%",
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 12px rgba(24, 144, 255, 0.3)",
                                }}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send Verification Code"}
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ marginBottom: 32 }}>
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 8,
                                        marginBottom: 16,
                                    }}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        style={{
                                            position: "absolute",
                                            opacity: 0,
                                            zIndex: 10,
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        autoFocus
                                    />
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <div
                                            key={index}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                border: "2px solid #d9d9d9",
                                                borderRadius: 8,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                background: "#fff",
                                                color: otp[index]
                                                    ? "#1890ff"
                                                    : "#d9d9d9",
                                                borderColor: otp[index]
                                                    ? "#1890ff"
                                                    : "#d9d9d9",
                                            }}
                                        >
                                            {otp[index] || ""}
                                        </div>
                                    ))}
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Enter the 6-digit code sent to your phone
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleVerifyOtp}
                                loading={loading}
                                disabled={otp.length !== 6}
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderRadius: 8,
                                    width: "100%",
                                    background:
                                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 12px rgba(82, 196, 26, 0.3)",
                                }}
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </Layout>
    );
}
