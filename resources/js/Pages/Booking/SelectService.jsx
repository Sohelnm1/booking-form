import React, { useState } from "react";
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
    Layout,
} from "antd";
import { ClockCircleOutlined, CheckOutlined } from "@ant-design/icons";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SelectService({ services, auth }) {
    const [selectedService, setSelectedService] = useState(null);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        // Automatically navigate to extras page when service is selected
        router.visit(route("booking.select-extras"), {
            data: { service_id: service.id },
        });
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

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title="Select Service - Book Appointment" />

            <BookingHeader auth={auth} />

            <Content>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "24px",
                    }}
                >
                    {/* Add responsive top spacing for mobile */}
                    <div className="mobile-top-spacing" />
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <Logo
                            variant="primary"
                            color="color"
                            background="white"
                            size="large"
                        />
                        <Title
                            level={2}
                            style={{ marginTop: 24, marginBottom: 8 }}
                        >
                            Choose Your Service
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Select the service you'd like to book
                        </Text>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 32 }}>
                        <Progress
                            percent={20}
                            showInfo={false}
                            strokeColor="#1890ff"
                            trailColor="#f0f0f0"
                        />
                        <div style={{ textAlign: "center", marginTop: 8 }}>
                            <Text type="secondary">Step 1 of 5</Text>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <Row gutter={[32, 32]}>
                        {services.map((service) => (
                            <Col xs={24} sm={12} lg={8} key={service.id}>
                                <Card
                                    hoverable
                                    style={{
                                        height: "100%",
                                        cursor: "pointer",
                                        border:
                                            selectedService?.id === service.id
                                                ? "2px solid #1890ff"
                                                : "1px solid #e8e8e8",
                                        borderRadius: "16px",
                                        boxShadow:
                                            selectedService?.id === service.id
                                                ? "0 8px 25px rgba(24, 144, 255, 0.15)"
                                                : "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        transition:
                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        overflow: "hidden",
                                        position: "relative",
                                    }}
                                    onClick={() => handleServiceSelect(service)}
                                    styles={{
                                        body: {
                                            padding: 0,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        },
                                    }}
                                >
                                    {/* Selection Indicator */}
                                    {selectedService?.id === service.id && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 16,
                                                right: 16,
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                background:
                                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                zIndex: 10,
                                                boxShadow:
                                                    "0 4px 12px rgba(24, 144, 255, 0.3)",
                                                border: "3px solid white",
                                            }}
                                        >
                                            <CheckOutlined
                                                style={{ fontSize: 18 }}
                                            />
                                        </div>
                                    )}

                                    {/* Service Header Image */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 180,
                                            background: `linear-gradient(135deg, ${
                                                service.color || "#667eea"
                                            } 0%, ${
                                                service.color
                                                    ? service.color + "80"
                                                    : "#764ba2"
                                            } 100%)`,
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Overlay Pattern */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background:
                                                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                            }}
                                        />

                                        {/* Service Icon */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform:
                                                    "translate(-50%, -50%)",
                                                width: 80,
                                                height: 80,
                                                borderRadius: "50%",
                                                background:
                                                    "rgba(255, 255, 255, 0.2)",
                                                backdropFilter: "blur(10px)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontSize: 36,
                                                fontWeight: "bold",
                                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                            }}
                                        >
                                            {service.name.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Service Content */}
                                    <div
                                        style={{
                                            padding: "24px",
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* Service Title */}
                                        <Title
                                            level={4}
                                            style={{
                                                marginBottom: 12,
                                                color: "#1f1f1f",
                                                fontSize: "20px",
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {service.name}
                                        </Title>

                                        {/* Service Description */}
                                        {service.description && (
                                            <Text
                                                type="secondary"
                                                style={{
                                                    marginBottom: 20,
                                                    display: "block",
                                                    fontSize: "14px",
                                                    lineHeight: 1.5,
                                                    color: "#666",
                                                    minHeight: "42px",
                                                }}
                                            >
                                                {service.description}
                                            </Text>
                                        )}

                                        {/* Service Details */}
                                        <div style={{ marginBottom: 20 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: "8px",
                                                            background:
                                                                "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <ClockCircleOutlined
                                                            style={{
                                                                color: "#1890ff",
                                                                fontSize: 16,
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#999",
                                                                display:
                                                                    "block",
                                                            }}
                                                        >
                                                            Duration
                                                        </Text>
                                                        <Text
                                                            strong
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                color: "#1f1f1f",
                                                            }}
                                                        >
                                                            {formatDuration(
                                                                service.duration
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: "8px",
                                                            background:
                                                                "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#52c41a",
                                                                fontSize: 16,
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            ₹
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#999",
                                                                display:
                                                                    "block",
                                                            }}
                                                        >
                                                            Price
                                                        </Text>
                                                        <Text
                                                            strong
                                                            style={{
                                                                fontSize:
                                                                    "16px",
                                                                color: "#1f1f1f",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                service.price
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Tag */}
                                        {service.category && (
                                            <div style={{ marginBottom: 20 }}>
                                                <Tag
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                                                        border: "1px solid #bae7ff",
                                                        color: "#1890ff",
                                                        borderRadius: "8px",
                                                        padding: "4px 12px",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {service.category}
                                                </Tag>
                                            </div>
                                        )}

                                        {/* Bottom Section */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: "auto",
                                                paddingTop: 16,
                                                borderTop: "1px solid #f0f0f0",
                                            }}
                                        >
                                            <div>
                                                {service.is_active ? (
                                                    <Tag
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                                            border: "1px solid #b7eb8f",
                                                            color: "#52c41a",
                                                            borderRadius: "8px",
                                                            padding: "4px 12px",
                                                            fontSize: "12px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Available
                                                    </Tag>
                                                ) : (
                                                    <Tag
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)",
                                                            border: "1px solid #ffa39e",
                                                            color: "#ff4d4f",
                                                            borderRadius: "8px",
                                                            padding: "4px 12px",
                                                            fontSize: "12px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Unavailable
                                                    </Tag>
                                                )}
                                            </div>

                                            <Button
                                                type={
                                                    selectedService?.id ===
                                                    service.id
                                                        ? "primary"
                                                        : "default"
                                                }
                                                size="middle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleServiceSelect(
                                                        service
                                                    );
                                                }}
                                                style={{
                                                    minWidth: 100,
                                                    height: 36,
                                                    fontWeight: 500,
                                                    borderRadius: "8px",
                                                    border:
                                                        selectedService?.id ===
                                                        service.id
                                                            ? "none"
                                                            : "1px solid #d9d9d9",
                                                    background:
                                                        selectedService?.id ===
                                                        service.id
                                                            ? "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)"
                                                            : "#fff",
                                                    boxShadow:
                                                        selectedService?.id ===
                                                        service.id
                                                            ? "0 4px 12px rgba(24, 144, 255, 0.3)"
                                                            : "none",
                                                }}
                                            >
                                                {selectedService?.id ===
                                                service.id
                                                    ? "Selected"
                                                    : "Choose"}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </Layout>
    );
}
