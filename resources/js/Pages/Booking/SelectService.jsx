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
import {
    ClockCircleOutlined,
    DollarOutlined,
    CheckOutlined,
} from "@ant-design/icons";
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
                    <Row gutter={[24, 24]}>
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
                                                : "1px solid #f0f0f0",
                                        transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleServiceSelect(service)}
                                    styles={{ body: { padding: 24 } }}
                                >
                                    <div style={{ position: "relative" }}>
                                        {selectedService?.id === service.id && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: -12,
                                                    right: -12,
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#1890ff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <CheckOutlined />
                                            </div>
                                        )}

                                        {/* Service Image Placeholder */}
                                        <div
                                            style={{
                                                width: "100%",
                                                height: 160,
                                                backgroundColor:
                                                    service.color || "#f0f0f0",
                                                borderRadius: 8,
                                                marginBottom: 16,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontSize: 48,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {service.name.charAt(0)}
                                        </div>

                                        {/* Service Details */}
                                        <Title
                                            level={4}
                                            style={{ marginBottom: 8 }}
                                        >
                                            {service.name}
                                        </Title>

                                        {service.description && (
                                            <Text
                                                type="secondary"
                                                style={{
                                                    marginBottom: 16,
                                                    display: "block",
                                                }}
                                            >
                                                {service.description}
                                            </Text>
                                        )}

                                        <Space
                                            size="large"
                                            style={{ marginBottom: 16 }}
                                        >
                                            <Space>
                                                <ClockCircleOutlined
                                                    style={{ color: "#1890ff" }}
                                                />
                                                <Text>
                                                    {formatDuration(
                                                        service.duration
                                                    )}
                                                </Text>
                                            </Space>
                                            <Space>
                                                <DollarOutlined
                                                    style={{ color: "#52c41a" }}
                                                />
                                                <Text strong>
                                                    {formatPrice(service.price)}
                                                </Text>
                                            </Space>
                                        </Space>

                                        {service.category && (
                                            <Tag
                                                color="blue"
                                                style={{ marginBottom: 8 }}
                                            >
                                                {service.category}
                                            </Tag>
                                        )}

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 16,
                                            }}
                                        >
                                            <div>
                                                {service.is_active ? (
                                                    <Tag color="green">
                                                        Available
                                                    </Tag>
                                                ) : (
                                                    <Tag color="red">
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
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleServiceSelect(
                                                        service
                                                    );
                                                }}
                                                style={{
                                                    minWidth: 80,
                                                    fontWeight: 500,
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
