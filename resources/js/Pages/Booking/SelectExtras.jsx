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
    Checkbox,
    Divider,
    Progress,
    Alert,
} from "antd";
import {
    PlusOutlined,
    DollarOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;

export default function SelectExtras({ service, extras }) {
    const [selectedExtras, setSelectedExtras] = useState([]);

    const handleExtraToggle = (extra) => {
        setSelectedExtras((prev) => {
            const isSelected = prev.find((e) => e.id === extra.id);
            if (isSelected) {
                return prev.filter((e) => e.id !== extra.id);
            } else {
                return [...prev, extra];
            }
        });
    };

    const handleBack = () => {
        router.visit(route("booking.select-service"));
    };

    const handleContinue = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        router.visit(route("booking.select-datetime"), {
            data: {
                service_id: service.id,
                extras: extraIds,
            },
        });
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const calculateTotalPrice = () => {
        const servicePrice = parseFloat(service.price);
        const extrasPrice = selectedExtras.reduce(
            (sum, extra) => sum + parseFloat(extra.price),
            0
        );
        return servicePrice + extrasPrice;
    };

    const calculateTotalDuration = () => {
        const serviceDuration = service.duration;
        const extrasDuration = selectedExtras.reduce(
            (sum, extra) => sum + (extra.duration || 0),
            0
        );
        return serviceDuration + extrasDuration;
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
        <AppLayout>
            <Head title="Select Extras - Book Appointment" />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="large"
                    />
                    <Title level={2} style={{ marginTop: 24, marginBottom: 8 }}>
                        Add Extras (Optional)
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Enhance your experience with additional services
                    </Text>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 32 }}>
                    <Progress
                        percent={40}
                        showInfo={false}
                        strokeColor="#1890ff"
                        trailColor="#f0f0f0"
                    />
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Text type="secondary">Step 2 of 5</Text>
                    </div>
                </div>

                <Row gutter={[32, 32]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        {/* Selected Service Summary */}
                        <Card style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Selected Service
                            </Title>
                            <Row align="middle" gutter={16}>
                                <Col>
                                    <div
                                        style={{
                                            width: 60,
                                            height: 60,
                                            backgroundColor:
                                                service.color || "#f0f0f0",
                                            borderRadius: 8,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: 24,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {service.name.charAt(0)}
                                    </div>
                                </Col>
                                <Col flex="1">
                                    <Title level={5} style={{ margin: 0 }}>
                                        {service.name}
                                    </Title>
                                    <Space size="large">
                                        <Text type="secondary">
                                            {formatDuration(service.duration)}
                                        </Text>
                                        <Text strong>
                                            {formatPrice(service.price)}
                                        </Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>

                        {/* Extras Selection */}
                        <Card>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Available Extras
                            </Title>

                            {extras.length === 0 ? (
                                <Alert
                                    message="No extras available"
                                    description="There are currently no additional services available for this booking."
                                    type="info"
                                    showIcon
                                />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {extras.map((extra) => {
                                        const isSelected = selectedExtras.find(
                                            (e) => e.id === extra.id
                                        );

                                        return (
                                            <Col xs={24} sm={12} key={extra.id}>
                                                <Card
                                                    hoverable
                                                    style={{
                                                        cursor: "pointer",
                                                        border: isSelected
                                                            ? "2px solid #1890ff"
                                                            : "1px solid #f0f0f0",
                                                        transition:
                                                            "all 0.3s ease",
                                                    }}
                                                    onClick={() =>
                                                        handleExtraToggle(extra)
                                                    }
                                                    styles={{
                                                        body: { padding: 16 },
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={isSelected}
                                                            style={{
                                                                marginRight: 12,
                                                            }}
                                                        />
                                                        <div
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Title
                                                                level={5}
                                                                style={{
                                                                    margin: 0,
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                {extra.name}
                                                            </Title>
                                                            {extra.description && (
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    {
                                                                        extra.description
                                                                    }
                                                                </Text>
                                                            )}
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                }}
                                                            >
                                                                <Space size="small">
                                                                    {extra.duration && (
                                                                        <Tag size="small">
                                                                            {formatDuration(
                                                                                extra.duration
                                                                            )}
                                                                        </Tag>
                                                                    )}
                                                                    <Tag
                                                                        size="small"
                                                                        color="green"
                                                                    >
                                                                        {formatPrice(
                                                                            extra.price
                                                                        )}
                                                                    </Tag>
                                                                </Space>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )}
                        </Card>
                    </Col>

                    {/* Sidebar - Summary */}
                    <Col xs={24} lg={8}>
                        <Card style={{ position: "sticky", top: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Booking Summary
                            </Title>

                            {/* Service */}
                            <div style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text strong>{service.name}</Text>
                                    <Text>{formatPrice(service.price)}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDuration(service.duration)}
                                </Text>
                            </div>

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => (
                                        <div
                                            key={extra.id}
                                            style={{ marginBottom: 8 }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Text>+ {extra.name}</Text>
                                                <Text>
                                                    {formatPrice(extra.price)}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Total */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text strong>Total Price</Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {formatPrice(calculateTotalPrice())}
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text type="secondary">Total Duration</Text>
                                <Text type="secondary">
                                    {formatDuration(calculateTotalDuration())}
                                </Text>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ marginTop: 24 }}>
                                <Button
                                    block
                                    style={{ marginBottom: 12 }}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                >
                                    Back to Services
                                </Button>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={handleContinue}
                                >
                                    Continue to Date & Time
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    );
}
