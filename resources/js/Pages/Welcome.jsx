import React from "react";
import { Head, router } from "@inertiajs/react";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
    CalendarOutlined,
    SafetyCertificateOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import AppLayout from "../Layouts/AppLayout";
import Logo from "../Components/Logo";

const { Title, Paragraph } = Typography;

export default function Welcome() {
    return (
        <AppLayout>
            <Head title="Welcome" />
            <div
                style={{
                    background:
                        "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                    padding: "64px 24px",
                    borderRadius: "8px",
                    margin: "16px 0",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <div style={{ marginBottom: 32 }}>
                            <Logo
                                variant="primary"
                                color="color"
                                background="white"
                                size="large"
                            />
                        </div>
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
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={() =>
                                    router.visit(
                                        route("booking.select-service")
                                    )
                                }
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    border: "none",
                                    height: 48,
                                    padding: "0 32px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                Book Appointment Now
                            </Button>
                            <Button
                                size="large"
                                onClick={() => router.visit(route("register"))}
                            >
                                Get Started
                            </Button>
                            <Button
                                size="large"
                                onClick={() => router.visit(route("login"))}
                            >
                                Sign In
                            </Button>
                        </Space>
                    </div>

                    {/* Test Navigation - Remove in Production */}
                    <div
                        style={{
                            background: "#fff3cd",
                            border: "1px solid #ffeaa7",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 32,
                            textAlign: "center",
                        }}
                    >
                        <Title
                            level={4}
                            style={{ marginBottom: 16, color: "#856404" }}
                        >
                            🧪 Testing Navigation
                        </Title>
                        <Space wrap>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(
                                        route("booking.select-service")
                                    )
                                }
                            >
                                Step 1: Select Service
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(route("booking.select-extras"))
                                }
                            >
                                Step 2: Select Extras
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(
                                        route("booking.select-datetime")
                                    )
                                }
                            >
                                Step 3: Select Date/Time
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(route("booking.consent"))
                                }
                            >
                                Step 4: Consent
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(route("booking.confirm"))
                                }
                            >
                                Step 5: Confirm & Pay
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    router.visit(route("booking.success"))
                                }
                            >
                                Success Page
                            </Button>
                        </Space>
                    </div>

                    <Row gutter={[24, 24]} justify="center">
                        <Col xs={24} md={8}>
                            <Card
                                style={{ textAlign: "center", height: "100%" }}
                                styles={{ body: { padding: 32 } }}
                            >
                                <CalendarOutlined
                                    style={{
                                        fontSize: 48,
                                        color: "#1890ff",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} style={{ marginBottom: 16 }}>
                                    Easy Booking
                                </Title>
                                <Paragraph style={{ color: "#666" }}>
                                    Simple and intuitive booking process that
                                    takes just minutes to complete.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                style={{ textAlign: "center", height: "100%" }}
                                styles={{ body: { padding: 32 } }}
                            >
                                <SafetyCertificateOutlined
                                    style={{
                                        fontSize: 48,
                                        color: "#1890ff",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} style={{ marginBottom: 16 }}>
                                    Secure Payments
                                </Title>
                                <Paragraph style={{ color: "#666" }}>
                                    Your transactions are protected with
                                    industry-standard security measures.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                style={{ textAlign: "center", height: "100%" }}
                                styles={{ body: { padding: 32 } }}
                            >
                                <MobileOutlined
                                    style={{
                                        fontSize: 48,
                                        color: "#1890ff",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} style={{ marginBottom: 16 }}>
                                    Mobile Friendly
                                </Title>
                                <Paragraph style={{ color: "#666" }}>
                                    Book on the go with our responsive design
                                    that works on all devices.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}
