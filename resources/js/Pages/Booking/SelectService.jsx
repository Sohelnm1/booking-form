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
    Modal,
} from "antd";
import {
    ClockCircleOutlined,
    CheckOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SelectService({ services, upcomingServices, auth }) {
    const [selectedService, setSelectedService] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [serviceForDetail, setServiceForDetail] = useState(null);
    const [pricingTierModalVisible, setPricingTierModalVisible] =
        useState(false);
    const [serviceForPricingTier, setServiceForPricingTier] = useState(null);
    const [selectedPricingTier, setSelectedPricingTier] = useState(null);

    const handleServiceSelect = (service) => {
        setSelectedService(service);

        // Check if service has pricing tiers
        if (service.pricing_tiers && service.pricing_tiers.length > 0) {
            // Show pricing tier selection modal
            setServiceForPricingTier(service);
            setPricingTierModalVisible(true);
        } else {
            // No pricing tiers, proceed directly to extras page
            router.visit(route("booking.select-extras"), {
                data: { service_id: service.id },
            });
        }
    };

    const handlePricingTierSelect = (tier) => {
        setSelectedPricingTier(tier);
    };

    const handlePricingTierConfirm = () => {
        if (selectedPricingTier && serviceForPricingTier) {
            // Navigate to extras page with service and pricing tier info
            router.visit(route("booking.select-extras"), {
                data: {
                    service_id: serviceForPricingTier.id,
                    pricing_tier_id: selectedPricingTier.id,
                    selected_duration: selectedPricingTier.duration_minutes,
                    selected_price: selectedPricingTier.price,
                },
            });
        }
    };

    const handlePricingTierModalCancel = () => {
        setPricingTierModalVisible(false);
        setServiceForPricingTier(null);
        setSelectedPricingTier(null);
        setSelectedService(null);
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

    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) {
            return text;
        }

        // For HTML content, we need to be more careful about truncation
        // Create a temporary div to parse HTML and get text content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";

        if (textContent.length <= maxLength) {
            return text; // Return original HTML if text content is short enough
        }

        // Truncate the text content and add ellipsis
        const truncatedText =
            textContent.substring(0, maxLength).trim() + "...";
        return truncatedText;
    };

    const handleViewDetails = (service, e) => {
        e.stopPropagation();
        console.log("Opening modal for service:", service);
        console.log(
            "Current modal state - visible:",
            detailModalVisible,
            "service:",
            serviceForDetail
        );
        setServiceForDetail(service);
        setDetailModalVisible(true);
        console.log("Modal state set to true");
    };

    const handleCloseDetailModal = () => {
        setDetailModalVisible(false);
        setServiceForDetail(null);
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
                    <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
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
                                            <div style={{ marginBottom: 20 }}>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        lineHeight: 1.5,
                                                        color: "#666",
                                                        minHeight: "42px",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: truncateText(
                                                            service.description,
                                                            80
                                                        ),
                                                    }}
                                                />
                                                {service.description.length >
                                                    80 && (
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={
                                                            <InfoCircleOutlined />
                                                        }
                                                        onClick={(e) =>
                                                            handleViewDetails(
                                                                service,
                                                                e
                                                            )
                                                        }
                                                        style={{
                                                            padding: 0,
                                                            height: "auto",
                                                            fontSize: "12px",
                                                            color: "#1890ff",
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        Read More
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* Service Details */}
                                        {/* Pricing Tiers or Standard Pricing */}
                                        {service.pricing_tiers &&
                                        service.pricing_tiers.length > 0 ? (
                                            <div style={{ marginBottom: 20 }}>
                                                <div
                                                    style={{ marginBottom: 12 }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: 14,
                                                            color: "#1f1f1f",
                                                        }}
                                                    >
                                                        Pricing Options:
                                                    </Text>
                                                </div>
                                                {service.pricing_tiers
                                                    .slice(0, 3)
                                                    .map((tier, index) => (
                                                        <div
                                                            key={tier.id}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
                                                                padding:
                                                                    "8px 12px",
                                                                backgroundColor:
                                                                    index === 0
                                                                        ? "#f0f8ff"
                                                                        : "#fafafa",
                                                                borderRadius:
                                                                    "8px",
                                                                marginBottom: 8,
                                                                border:
                                                                    index === 0
                                                                        ? "1px solid #bae7ff"
                                                                        : "1px solid #f0f0f0",
                                                            }}
                                                        >
                                                            <div>
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    {tier.name}
                                                                    {tier.is_popular && (
                                                                        <Tag
                                                                            color="gold"
                                                                            size="small"
                                                                            style={{
                                                                                marginLeft: 8,
                                                                            }}
                                                                        >
                                                                            Popular
                                                                        </Tag>
                                                                    )}
                                                                </Text>
                                                                <br />
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 11,
                                                                    }}
                                                                >
                                                                    {formatDuration(
                                                                        tier.duration_minutes
                                                                    )}
                                                                </Text>
                                                            </div>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: "#1890ff",
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    tier.price
                                                                )}
                                                            </Text>
                                                        </div>
                                                    ))}
                                                {service.pricing_tiers.length >
                                                    3 && (
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 11,
                                                            textAlign: "center",
                                                            display: "block",
                                                        }}
                                                    >
                                                        +
                                                        {service.pricing_tiers
                                                            .length - 3}{" "}
                                                        more options
                                                    </Text>
                                                )}
                                            </div>
                                        ) : (
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
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius:
                                                                    "8px",
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
                                                                {service.duration_label ||
                                                                    formatDuration(
                                                                        service.duration
                                                                    )}
                                                            </Text>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius:
                                                                    "8px",
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

                    {/* Upcoming Services Section */}
                    {upcomingServices && upcomingServices.length > 0 && (
                        <div style={{ marginBottom: 48 }}>
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: 32,
                                }}
                            >
                                <Title
                                    level={3}
                                    style={{
                                        color: "#666",
                                        marginBottom: 8,
                                    }}
                                >
                                    Coming Soon
                                </Title>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    Services launching soon - Stay tuned!
                                </Text>
                            </div>

                            <Row gutter={[32, 32]}>
                                {upcomingServices.map((service) => (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                        key={service.id}
                                    >
                                        <Card
                                            style={{
                                                height: "100%",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                boxShadow:
                                                    "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                border: "1px solid #e8e8e8",
                                                position: "relative",
                                                opacity: 0.75,
                                                filter: "grayscale(20%)",
                                            }}
                                            styles={{
                                                body: {
                                                    padding: 0,
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                },
                                            }}
                                        >
                                            {/* Coming Soon Badge */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    backgroundColor: "#722ed1",
                                                    color: "white",
                                                    padding: "6px 12px",
                                                    borderRadius: "12px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    zIndex: 1,
                                                    boxShadow:
                                                        "0 2px 8px rgba(114, 46, 209, 0.3)",
                                                }}
                                            >
                                                Coming Soon
                                            </div>

                                            {/* Service Header Image */}
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: 180,
                                                    background: `linear-gradient(135deg, ${
                                                        service.color ||
                                                        "#667eea"
                                                    } 0%, ${
                                                        service.color
                                                            ? service.color +
                                                              "80"
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
                                                        backdropFilter:
                                                            "blur(10px)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
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

                                                {/* Service Description or Coming Soon Description */}
                                                {(service.coming_soon_description ||
                                                    service.description) && (
                                                    <div
                                                        style={{
                                                            marginBottom: 20,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                lineHeight: 1.5,
                                                                color: "#666",
                                                                minHeight:
                                                                    "42px",
                                                            }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: truncateText(
                                                                    service.coming_soon_description ||
                                                                        service.description,
                                                                    80
                                                                ),
                                                            }}
                                                        />
                                                        {(
                                                            service.coming_soon_description ||
                                                            service.description ||
                                                            ""
                                                        ).length > 80 && (
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                icon={
                                                                    <InfoCircleOutlined />
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    console.log(
                                                                        "Read More clicked for service:",
                                                                        service
                                                                    );
                                                                    console.log(
                                                                        "Event:",
                                                                        e
                                                                    );
                                                                    handleViewDetails(
                                                                        service,
                                                                        e
                                                                    );
                                                                }}
                                                                style={{
                                                                    padding: 0,
                                                                    height: "auto",
                                                                    fontSize:
                                                                        "12px",
                                                                    color: "#1890ff",
                                                                    marginTop: 4,
                                                                }}
                                                            >
                                                                Read More
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Service Details */}
                                                <div
                                                    style={{ marginBottom: 20 }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                            marginBottom: 12,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius:
                                                                        "8px",
                                                                    background:
                                                                        "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                                                                    display:
                                                                        "flex",
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
                                                                    {service.has_flexible_duration ? (
                                                                        <Tag
                                                                            color="blue"
                                                                            style={{
                                                                                margin: 0,
                                                                            }}
                                                                        >
                                                                            Flexible
                                                                        </Tag>
                                                                    ) : (
                                                                        service.duration_label ||
                                                                        formatDuration(
                                                                            service.duration
                                                                        )
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius:
                                                                        "8px",
                                                                    background:
                                                                        "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                                                    display:
                                                                        "flex",
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
                                                                            "14px",
                                                                        color: "#1f1f1f",
                                                                    }}
                                                                >
                                                                    {service.has_tba_pricing ? (
                                                                        <Tag
                                                                            color="orange"
                                                                            style={{
                                                                                margin: 0,
                                                                            }}
                                                                        >
                                                                            To
                                                                            be
                                                                            announced
                                                                        </Tag>
                                                                    ) : (
                                                                        formatPrice(
                                                                            service.price
                                                                        )
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Section */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        marginTop: "auto",
                                                        paddingTop: 16,
                                                        borderTop:
                                                            "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    <Tag
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                                                            border: "1px solid #c084fc",
                                                            color: "#722ed1",
                                                            borderRadius: "8px",
                                                            padding: "4px 12px",
                                                            fontSize: "12px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Coming Soon
                                                    </Tag>

                                                    <Button
                                                        disabled
                                                        style={{
                                                            minWidth: 100,
                                                            height: 36,
                                                            fontWeight: 500,
                                                            borderRadius: "8px",
                                                            border: "1px solid #d9d9d9",
                                                            color: "#999",
                                                        }}
                                                    >
                                                        Not Available
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </div>
            </Content>

            {/* Service Detail Modal */}
            {console.log(
                "Rendering modal - visible:",
                detailModalVisible,
                "service:",
                serviceForDetail
            )}
            <Modal
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${
                                    serviceForDetail?.color || "#667eea"
                                } 0%, ${
                                    serviceForDetail?.color
                                        ? serviceForDetail.color + "80"
                                        : "#764ba2"
                                } 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            {serviceForDetail?.name?.charAt(0)}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    color: "#1f1f1f",
                                }}
                            >
                                {serviceForDetail?.name}
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    marginTop: 2,
                                }}
                            >
                                Service Details
                            </div>
                        </div>
                    </div>
                }
                open={detailModalVisible}
                onCancel={handleCloseDetailModal}
                footer={[
                    <Button key="close" onClick={handleCloseDetailModal}>
                        Close
                    </Button>,
                    <Button
                        key="select"
                        type="primary"
                        onClick={() => {
                            handleServiceSelect(serviceForDetail);
                            handleCloseDetailModal();
                        }}
                        disabled={
                            !serviceForDetail?.is_active ||
                            serviceForDetail?.is_upcoming
                        }
                    >
                        {serviceForDetail?.is_upcoming
                            ? "Coming Soon"
                            : "Select This Service"}
                    </Button>,
                ]}
                width={600}
                centered
            >
                {serviceForDetail && (
                    <div style={{ padding: "16px 0" }}>
                        {/* Full Description */}
                        {(serviceForDetail.coming_soon_description ||
                            serviceForDetail.description) && (
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#1f1f1f",
                                        marginBottom: 8,
                                    }}
                                >
                                    {serviceForDetail.is_upcoming
                                        ? "Coming Soon Description"
                                        : "Description"}
                                </div>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        color: "#666",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            serviceForDetail.coming_soon_description ||
                                            serviceForDetail.description,
                                    }}
                                />
                            </div>
                        )}

                        {/* Service Details */}
                        <div style={{ marginBottom: 24 }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#1f1f1f",
                                    marginBottom: 12,
                                }}
                            >
                                Service Information
                            </div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div
                                        style={{
                                            padding: "16px",
                                            background: "#f8f9fa",
                                            borderRadius: "8px",
                                            border: "1px solid #e8e8e8",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <ClockCircleOutlined
                                                style={{
                                                    color: "#1890ff",
                                                    fontSize: 16,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                }}
                                            >
                                                Duration
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#1f1f1f",
                                            }}
                                        >
                                            {serviceForDetail.duration_label ||
                                                formatDuration(
                                                    serviceForDetail.duration
                                                )}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            padding: "16px",
                                            background: "#f8f9fa",
                                            borderRadius: "8px",
                                            border: "1px solid #e8e8e8",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#52c41a",
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ₹
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                }}
                                            >
                                                Price
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#1f1f1f",
                                            }}
                                        >
                                            {formatPrice(
                                                serviceForDetail.price
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Status */}
                        <div style={{ marginBottom: 24 }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#1f1f1f",
                                    marginBottom: 8,
                                }}
                            >
                                Availability
                            </div>
                            {serviceForDetail.is_active ? (
                                <Tag
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                        border: "1px solid #b7eb8f",
                                        color: "#52c41a",
                                        borderRadius: "8px",
                                        padding: "6px 16px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Available for Booking
                                </Tag>
                            ) : (
                                <Tag
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)",
                                        border: "1px solid #ffa39e",
                                        color: "#ff4d4f",
                                        borderRadius: "8px",
                                        padding: "6px 16px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Currently Unavailable
                                </Tag>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div
                            style={{
                                padding: "16px",
                                background: "#f0f8ff",
                                borderRadius: "8px",
                                border: "1px solid #bae7ff",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#1890ff",
                                    marginBottom: 8,
                                }}
                            >
                                What's Included
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    lineHeight: 1.5,
                                    color: "#666",
                                }}
                            >
                                This service includes professional care, quality
                                products, and expert consultation. Our trained
                                professionals ensure you receive the best
                                experience possible.
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Pricing Tier Selection Modal */}
            <Modal
                title={`Select Pricing Option - ${serviceForPricingTier?.name}`}
                open={pricingTierModalVisible}
                onOk={handlePricingTierConfirm}
                onCancel={handlePricingTierModalCancel}
                okText="Continue"
                cancelText="Cancel"
                width={600}
                okButtonProps={{
                    disabled: !selectedPricingTier,
                    style: {
                        background: selectedPricingTier ? "#1890ff" : "#d9d9d9",
                        borderColor: selectedPricingTier
                            ? "#1890ff"
                            : "#d9d9d9",
                    },
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                        Choose the pricing option that best fits your needs:
                    </Text>
                </div>

                {serviceForPricingTier?.pricing_tiers?.map((tier, index) => (
                    <div
                        key={tier.id}
                        style={{
                            border:
                                selectedPricingTier?.id === tier.id
                                    ? "2px solid #1890ff"
                                    : "1px solid #d9d9d9",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "12px",
                            cursor: "pointer",
                            backgroundColor:
                                selectedPricingTier?.id === tier.id
                                    ? "#f0f8ff"
                                    : "#fff",
                            transition: "all 0.3s ease",
                        }}
                        onClick={() => handlePricingTierSelect(tier)}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text
                                        strong
                                        style={{ fontSize: 16, marginRight: 8 }}
                                    >
                                        {tier.name}
                                    </Text>
                                    {tier.is_popular && (
                                        <Tag color="gold" style={{ margin: 0 }}>
                                            Popular
                                        </Tag>
                                    )}
                                </div>

                                {tier.description && (
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 13,
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        {tier.description}
                                    </Text>
                                )}

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        <ClockCircleOutlined
                                            style={{
                                                color: "#1890ff",
                                                fontSize: 14,
                                            }}
                                        />
                                        <Text style={{ fontSize: 13 }}>
                                            {formatDuration(
                                                tier.duration_minutes
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <Text
                                    strong
                                    style={{ fontSize: 18, color: "#1890ff" }}
                                >
                                    {formatPrice(tier.price)}
                                </Text>
                            </div>
                        </div>
                    </div>
                ))}

                {selectedPricingTier && (
                    <div
                        style={{
                            marginTop: 16,
                            padding: 12,
                            backgroundColor: "#f6ffed",
                            border: "1px solid #b7eb8f",
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontSize: 14 }}>
                            <strong>Selected:</strong>{" "}
                            {selectedPricingTier.name} -{" "}
                            {formatDuration(
                                selectedPricingTier.duration_minutes
                            )}{" "}
                            for {formatPrice(selectedPricingTier.price)}
                        </Text>
                    </div>
                )}
            </Modal>
        </Layout>
    );
}
