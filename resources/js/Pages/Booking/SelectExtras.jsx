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
    message,
    Modal,
} from "antd";
import {
    PlusOutlined,
    MinusOutlined,
    DollarOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;

export default function SelectExtras({
    service,
    extras,
    bookingSettings,
    selectedPricingTier,
    selectedDuration,
    selectedPrice,
    auth,
}) {
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [extraQuantities, setExtraQuantities] = useState({});
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [extraForDetail, setExtraForDetail] = useState(null);

    // Get settings with defaults
    const maxExtrasPerBooking = bookingSettings?.max_extras_per_booking || 10;
    const enableExtraQuantities =
        bookingSettings?.enable_extra_quantities !== false;

    // Debug logging
    console.log("SelectExtras component - Extras data:", extras);
    console.log("SelectExtras component - Selected extras:", selectedExtras);
    console.log("SelectExtras component - Booking settings:", bookingSettings);

    // Debug individual extras
    extras.forEach((extra, index) => {
        console.log(`Extra ${index + 1}:`, {
            id: extra.id,
            name: extra.name,
            duration_id: extra.duration_id,
            durationRelation: extra.durationRelation,
            hasDurationRelation: !!extra.durationRelation,
            durationLabel: extra.durationRelation?.label,
        });
    });

    const handleExtraToggle = (extra) => {
        setSelectedExtras((prev) => {
            const isSelected = prev.find((e) => e.id === extra.id);
            if (isSelected) {
                // Remove extra and its quantity
                setExtraQuantities((prevQuantities) => {
                    const newQuantities = { ...prevQuantities };
                    delete newQuantities[extra.id];
                    return newQuantities;
                });
                return prev.filter((e) => e.id !== extra.id);
            } else {
                // Check if we've reached the maximum number of extras
                if (prev.length >= maxExtrasPerBooking) {
                    message.warning(
                        `You can only select up to ${maxExtrasPerBooking} different extras.`
                    );
                    return prev;
                }

                // Add extra with default quantity of 1
                setExtraQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [extra.id]: 1,
                }));
                return [...prev, extra];
            }
        });
    };

    const handleQuantityChange = (extraId, newQuantity) => {
        if (newQuantity < 1) {
            // Remove extra if quantity is 0 or less
            setSelectedExtras((prev) => prev.filter((e) => e.id !== extraId));
            setExtraQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                delete newQuantities[extraId];
                return newQuantities;
            });
        } else {
            // Get the max quantity for this specific extra
            const extra = selectedExtras.find((e) => e.id === extraId);
            const maxQuantityForThisExtra = extra?.max_quantity || 5;

            if (newQuantity > maxQuantityForThisExtra) {
                // Check if we've reached the maximum quantity for this extra
                message.warning(
                    `You can only add up to ${maxQuantityForThisExtra} of this extra.`
                );
                return;
            }

            setExtraQuantities((prevQuantities) => ({
                ...prevQuantities,
                [extraId]: newQuantity,
            }));
        }
    };

    const handleBack = () => {
        router.visit(route("booking.select-service"));
    };

    const handleContinue = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        const extraQuantitiesData = selectedExtras.map((extra) => ({
            id: extra.id,
            quantity: extraQuantities[extra.id] || 1,
        }));

        // Encode extra quantities as JSON string for URL parameter
        const extraQuantitiesJson = encodeURIComponent(
            JSON.stringify(extraQuantitiesData)
        );

        router.visit(route("booking.select-datetime"), {
            data: {
                service_id: service.id,
                pricing_tier_id: selectedPricingTier?.id,
                selected_duration:
                    selectedPricingTier?.duration_minutes || service.duration,
                selected_price: selectedPricingTier?.price || service.price,
                extras: extraIds,
                extra_quantities_json: extraQuantitiesJson,
            },
        });
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const calculateTotalPrice = () => {
        const servicePrice = selectedPricingTier
            ? parseFloat(selectedPricingTier.price)
            : parseFloat(service.price);
        const extrasPrice = selectedExtras.reduce((sum, extra) => {
            const quantity = extraQuantities[extra.id] || 1;
            return sum + parseFloat(extra.price) * quantity;
        }, 0);
        return servicePrice + extrasPrice;
    };

    const calculateTotalDuration = () => {
        const serviceDuration = selectedPricingTier
            ? selectedPricingTier.duration_minutes
            : service.duration;

        const extrasDuration = selectedExtras.reduce((sum, extra) => {
            const quantity = extraQuantities[extra.id] || 1;
            // Check if durationRelation exists and calculate total minutes
            if (extra.durationRelation) {
                const totalMinutes =
                    extra.durationRelation.hours * 60 +
                    extra.durationRelation.minutes;
                return sum + totalMinutes * quantity;
            }
            // Fallback to total_duration if available
            return sum + (extra.total_duration || 0) * quantity;
        }, 0);

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

    const truncateText = (text, maxLength = 60) => {
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

    const handleViewDetails = (extra, e) => {
        e.stopPropagation();
        setExtraForDetail(extra);
        setDetailModalVisible(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalVisible(false);
        setExtraForDetail(null);
    };

    return (
        <div>
            <Head title="Select Extras - Book Appointment" />

            <BookingHeader auth={auth} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
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
                                        {selectedPricingTier && (
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {selectedPricingTier.name}
                                            </Tag>
                                        )}
                                    </Title>
                                    <Space size="large">
                                        <Text type="secondary">
                                            {selectedPricingTier
                                                ? formatDuration(
                                                      selectedPricingTier.duration_minutes
                                                  )
                                                : service.duration_label ||
                                                  formatDuration(
                                                      service.duration
                                                  )}
                                        </Text>
                                        <Text strong>
                                            {selectedPricingTier
                                                ? formatPrice(
                                                      selectedPricingTier.price
                                                  )
                                                : formatPrice(service.price)}
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
                            ) : selectedExtras.length >= maxExtrasPerBooking ? (
                                <Alert
                                    message="Maximum extras reached"
                                    description={`You have selected the maximum number of extras (${maxExtrasPerBooking}). Please remove some extras to add others.`}
                                    type="warning"
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
                                                        cursor:
                                                            selectedExtras.length >=
                                                                maxExtrasPerBooking &&
                                                            !isSelected
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        border: isSelected
                                                            ? "2px solid #1890ff"
                                                            : "1px solid #f0f0f0",
                                                        opacity:
                                                            selectedExtras.length >=
                                                                maxExtrasPerBooking &&
                                                            !isSelected
                                                                ? 0.6
                                                                : 1,
                                                        transition:
                                                            "all 0.3s ease",
                                                    }}
                                                    onClick={() => {
                                                        if (
                                                            selectedExtras.length >=
                                                                maxExtrasPerBooking &&
                                                            !isSelected
                                                        ) {
                                                            message.warning(
                                                                `You can only select up to ${maxExtrasPerBooking} different extras.`
                                                            );
                                                            return;
                                                        }
                                                        handleExtraToggle(
                                                            extra
                                                        );
                                                    }}
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
                                                                <div
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: "#666",
                                                                        marginBottom: 4,
                                                                    }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: truncateText(
                                                                            extra.description,
                                                                            60
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                icon={
                                                                    <InfoCircleOutlined />
                                                                }
                                                                onClick={(e) =>
                                                                    handleViewDetails(
                                                                        extra,
                                                                        e
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: 0,
                                                                    height: "auto",
                                                                    fontSize:
                                                                        "10px",
                                                                    color: "#1890ff",
                                                                    marginTop: 2,
                                                                }}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                }}
                                                            >
                                                                <Space size="small">
                                                                    {extra.durationRelation && (
                                                                        <Tag size="small">
                                                                            {
                                                                                extra
                                                                                    .durationRelation
                                                                                    .label
                                                                            }
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
                                                        {isSelected &&
                                                            enableExtraQuantities && (
                                                                <div
                                                                    style={{
                                                                        marginLeft: 12,
                                                                    }}
                                                                >
                                                                    <Space>
                                                                        <Button
                                                                            size="small"
                                                                            icon={
                                                                                <MinusOutlined />
                                                                            }
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                const currentQty =
                                                                                    extraQuantities[
                                                                                        extra
                                                                                            .id
                                                                                    ] ||
                                                                                    1;
                                                                                handleQuantityChange(
                                                                                    extra.id,
                                                                                    currentQty -
                                                                                        1
                                                                                );
                                                                            }}
                                                                        />
                                                                        <Text
                                                                            strong
                                                                            style={{
                                                                                minWidth: 20,
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {extraQuantities[
                                                                                extra
                                                                                    .id
                                                                            ] ||
                                                                                1}
                                                                        </Text>
                                                                        <Button
                                                                            size="small"
                                                                            icon={
                                                                                <PlusOutlined />
                                                                            }
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                const currentQty =
                                                                                    extraQuantities[
                                                                                        extra
                                                                                            .id
                                                                                    ] ||
                                                                                    1;
                                                                                handleQuantityChange(
                                                                                    extra.id,
                                                                                    currentQty +
                                                                                        1
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Space>
                                                                </div>
                                                            )}
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
                                    <Text strong>
                                        {service.name}
                                        {selectedPricingTier && (
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {selectedPricingTier.name}
                                            </Tag>
                                        )}
                                    </Text>
                                    <Text>
                                        {selectedPricingTier
                                            ? formatPrice(
                                                  selectedPricingTier.price
                                              )
                                            : formatPrice(service.price)}
                                    </Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {selectedPricingTier
                                        ? formatDuration(
                                              selectedPricingTier.duration_minutes
                                          )
                                        : service.duration_label ||
                                          formatDuration(service.duration)}
                                </Text>
                            </div>

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => {
                                        const quantity =
                                            extraQuantities[extra.id] || 1;
                                        const totalPrice =
                                            parseFloat(extra.price) * quantity;
                                        return (
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
                                                    <Text>
                                                        + {extra.name}
                                                        {quantity > 1 && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {" "}
                                                                × {quantity}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        {formatPrice(
                                                            totalPrice
                                                        )}
                                                    </Text>
                                                </div>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {extra.duration_relation
                                                        ? extra
                                                              .duration_relation
                                                              .label
                                                        : "No additional time"}
                                                    {quantity > 1 && (
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            {" "}
                                                            × {quantity}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </div>
                                        );
                                    })}
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
                            {/* <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text type="secondary">Total Duration</Text>
                                <Text type="secondary">
                                    {formatDuration(calculateTotalDuration())}
                                </Text>
                            </div> */}

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

            {/* Extra Detail Modal */}
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
                                width: 40,
                                height: 40,
                                borderRadius: "8px",
                                background:
                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            {extraForDetail?.name?.charAt(0)}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#1f1f1f",
                                }}
                            >
                                {extraForDetail?.name}
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginTop: 2,
                                }}
                            >
                                Extra Service Details
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
                            handleExtraToggle(extraForDetail);
                            handleCloseDetailModal();
                        }}
                    >
                        Add This Extra
                    </Button>,
                ]}
                width={500}
                centered
            >
                {extraForDetail && (
                    <div style={{ padding: "16px 0" }}>
                        {/* Full Description */}
                        {extraForDetail.description && (
                            <div style={{ marginBottom: 20 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#1f1f1f",
                                        marginBottom: 8,
                                    }}
                                >
                                    Description
                                </div>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.5,
                                        color: "#666",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: extraForDetail.description,
                                    }}
                                />
                            </div>
                        )}

                        {/* Extra Details */}
                        <div style={{ marginBottom: 20 }}>
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
                                            padding: "12px",
                                            background: "#f8f9fa",
                                            borderRadius: "6px",
                                            border: "1px solid #e8e8e8",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <ClockCircleOutlined
                                                style={{
                                                    color: "#1890ff",
                                                    fontSize: 14,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#999",
                                                }}
                                            >
                                                Duration
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#1f1f1f",
                                            }}
                                        >
                                            {extraForDetail.duration_relation
                                                ? extraForDetail
                                                      .duration_relation.label
                                                : "No additional time"}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            padding: "12px",
                                            background: "#f8f9fa",
                                            borderRadius: "6px",
                                            border: "1px solid #e8e8e8",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#52c41a",
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ₹
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#999",
                                                }}
                                            >
                                                Regular
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#1f1f1f",
                                            }}
                                        >
                                            {formatPrice(extraForDetail.price)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Max Quantity Info */}
                        <div
                            style={{
                                padding: "12px",
                                background: "#f0f8ff",
                                borderRadius: "6px",
                                border: "1px solid #bae7ff",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#1890ff",
                                    marginBottom: 4,
                                }}
                            >
                                Quantity Limit
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    lineHeight: 1.4,
                                    color: "#666",
                                }}
                            >
                                You can add up to{" "}
                                {extraForDetail.max_quantity || 5} of this extra
                                service to your booking.
                            </div>
                        </div>

                        {/* Additional Information */}
                        {(extraForDetail?.disclaimer_title ||
                            extraForDetail?.disclaimer_content) && (
                            <div
                                style={{
                                    padding: "16px",
                                    background: "#f0f8ff",
                                    borderRadius: "8px",
                                    border: "1px solid #bae7ff",
                                    marginTop: 16,
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
                                    {extraForDetail?.disclaimer_title ||
                                        "What's Included"}
                                </div>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.5,
                                        color: "#666",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            extraForDetail?.disclaimer_content ||
                                            "This extra service includes professional care and quality products to enhance your experience.",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
