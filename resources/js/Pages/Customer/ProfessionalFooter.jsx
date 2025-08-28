import React from "react";
import { Layout, Typography, Row, Col, Divider } from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link, Title } = Typography;

const ProfessionalFooter = () => {
    return (
        <Footer
            style={{
                background: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "28px 24px 24px",
                marginTop: "48px",
                color: "#ffffff",
                width: "100vw",
                marginLeft: "calc(-50vw + 50%)",
                marginRight: "calc(-50vw + 50%)",
                borderRadius: "24px 24px 0 0",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 20px",
                }}
            >
                {/* Main Footer Content */}
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ marginBottom: "24px" }}>
                            <Title
                                level={4}
                                style={{ color: "#fff", marginBottom: "16px" }}
                            >
                                HospiPal Health
                            </Title>
                            <Text
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    lineHeight: "1.6",
                                }}
                            >
                                Providing compassionate non-medical companion
                                support for patients and their families during
                                hospital stays.
                            </Text>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{ color: "#fff", marginBottom: "16px" }}
                        >
                            Quick Links
                        </Title>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Terms & Conditions
                            </Link>
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Booking Consent
                            </Link>
                            <Link
                                href="#"
                                style={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                                FAQ
                            </Link>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{ color: "#fff", marginBottom: "16px" }}
                        >
                            Our Services
                        </Title>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Overnight Stay Companion
                            </Link>
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Daytime Support
                            </Link>
                            <Link
                                href="#"
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "12px",
                                }}
                            >
                                Specialized Care
                            </Link>
                            <Link
                                href="#"
                                style={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                                Emergency Assistance
                            </Link>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{ color: "#fff", marginBottom: "16px" }}
                        >
                            Contact Us
                        </Title>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <PhoneOutlined
                                    style={{
                                        color: "#1890ff",
                                        marginRight: "8px",
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    +91 99872 49625
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <MailOutlined
                                    style={{
                                        color: "#1890ff",
                                        marginRight: "8px",
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    support@hospipalhealth.com
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <GlobalOutlined
                                    style={{
                                        color: "#1890ff",
                                        marginRight: "8px",
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    Hospital Health LLP
                                </Text>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div style={{ marginTop: "20px" }}>
                            <Title
                                level={5}
                                style={{ color: "#fff", marginBottom: "12px" }}
                            >
                                Follow Us
                            </Title>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <Link
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    <FacebookOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                </Link>
                                <Link
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    <TwitterOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                </Link>
                                <Link
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    <InstagramOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                </Link>
                                <Link
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    <LinkedinOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider
                    style={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        margin: "32px 0",
                    }}
                />

                {/* Copyright Section */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <Text style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        © {new Date().getFullYear()} HospiPal Health LLP. All
                        rights reserved.
                    </Text>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <Link
                            href="#"
                            style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "12px",
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "12px",
                            }}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "12px",
                            }}
                        >
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default ProfessionalFooter;
