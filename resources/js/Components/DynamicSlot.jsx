import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Space, Tag, Badge } from "antd";
import { Carousel } from "react-responsive-carousel";
import {
    CloseOutlined,
    GiftOutlined,
    FireOutlined,
    BellOutlined,
    StarOutlined,
    GlobalOutlined,
    HeartOutlined,
    TrophyOutlined,
    CrownOutlined,
    ThunderboltOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const { Title, Paragraph, Text } = Typography;

export default function DynamicSlot({ dynamicSlots = [], windowWidth = 1200 }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Filter slots based on device type
    const filteredSlots = dynamicSlots.filter((slot) => {
        if (!slot.is_active) return false;

        if (windowWidth >= 768) {
            return (
                slot.show_on_desktop === true ||
                slot.show_on_desktop === undefined
            );
        } else {
            return (
                slot.show_on_mobile === true ||
                slot.show_on_mobile === undefined
            );
        }
    });

    const slotsToShow =
        filteredSlots.length > 0
            ? filteredSlots
            : dynamicSlots.filter((slot) => slot.is_active);

    // Get professional icon based on type
    const getProfessionalIcon = (type, customIcon) => {
        if (customIcon && customIcon.startsWith("🎉")) return <GiftOutlined />;
        if (customIcon && customIcon.startsWith("🔥")) return <FireOutlined />;
        if (customIcon && customIcon.startsWith("⭐")) return <StarOutlined />;
        if (customIcon && customIcon.startsWith("🌍"))
            return <GlobalOutlined />;
        if (customIcon && customIcon.startsWith("💝")) return <HeartOutlined />;
        if (customIcon && customIcon.startsWith("🏆"))
            return <TrophyOutlined />;
        if (customIcon && customIcon.startsWith("👑")) return <CrownOutlined />;
        if (customIcon && customIcon.startsWith("⚡"))
            return <ThunderboltOutlined />;

        switch (type) {
            case "offer":
                return <GiftOutlined />;
            case "promotion":
                return <FireOutlined />;
            case "announcement":
                return <BellOutlined />;
            case "festival":
                return <StarOutlined />;
            case "news":
                return <GlobalOutlined />;
            default:
                return <InfoCircleOutlined />;
        }
    };

    // Get professional color scheme with transparency
    const getProfessionalColors = (type, customBg, customText) => {
        const colorSchemes = {
            offer: {
                background:
                    "linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(56, 158, 13, 0.1) 100%)",
                border: "2px solid rgba(82, 196, 26, 0.3)",
                text: "#1a1a1a",
                accent: "#52c41a",
                iconBg: "rgba(82, 196, 26, 0.1)",
                boxShadow: "0 8px 32px rgba(82, 196, 26, 0.15)",
                badgeBg: "#52c41a",
                badgeText: "#ffffff",
            },
            promotion: {
                background:
                    "linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(9, 109, 217, 0.1) 100%)",
                border: "2px solid rgba(24, 144, 255, 0.3)",
                text: "#1a1a1a",
                accent: "#1890ff",
                iconBg: "rgba(24, 144, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(24, 144, 255, 0.15)",
                badgeBg: "#1890ff",
                badgeText: "#ffffff",
            },
            announcement: {
                background:
                    "linear-gradient(135deg, rgba(250, 173, 20, 0.15) 0%, rgba(212, 136, 6, 0.1) 100%)",
                border: "2px solid rgba(250, 173, 20, 0.3)",
                text: "#1a1a1a",
                accent: "#faad14",
                iconBg: "rgba(250, 173, 20, 0.1)",
                boxShadow: "0 8px 32px rgba(250, 173, 20, 0.15)",
                badgeBg: "#faad14",
                badgeText: "#ffffff",
            },
            festival: {
                background:
                    "linear-gradient(135deg, rgba(114, 46, 209, 0.15) 0%, rgba(83, 29, 171, 0.1) 100%)",
                border: "2px solid rgba(114, 46, 209, 0.3)",
                text: "#1a1a1a",
                accent: "#722ed1",
                iconBg: "rgba(114, 46, 209, 0.1)",
                boxShadow: "0 8px 32px rgba(114, 46, 209, 0.15)",
                badgeBg: "#722ed1",
                badgeText: "#ffffff",
            },
            news: {
                background:
                    "linear-gradient(135deg, rgba(19, 194, 194, 0.15) 0%, rgba(8, 151, 156, 0.1) 100%)",
                border: "2px solid rgba(19, 194, 194, 0.3)",
                text: "#1a1a1a",
                accent: "#13c2c2",
                iconBg: "rgba(19, 194, 194, 0.1)",
                boxShadow: "0 8px 32px rgba(19, 194, 194, 0.15)",
                badgeBg: "#13c2c2",
                badgeText: "#ffffff",
            },
        };

        if (customBg && customText) {
            return {
                background: `linear-gradient(135deg, ${customBg}15 0%, ${customBg}10 100%)`,
                border: `2px solid ${customBg}30`,
                text: "#1a1a1a",
                accent: customBg,
                iconBg: `${customBg}10`,
                boxShadow: `0 8px 32px ${customBg}15`,
                badgeBg: customBg,
                badgeText: "#ffffff",
            };
        }

        return colorSchemes[type] || colorSchemes.announcement;
    };

    // Auto-hide slots after display duration
    useEffect(() => {
        if (slotsToShow.length === 0) return;

        const currentSlot = slotsToShow[currentSlide];
        if (currentSlot.display_duration) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, currentSlot.display_duration * 1000);

            return () => clearTimeout(timer);
        }
    }, [currentSlide, slotsToShow]);

    // Reset visibility when slots change
    useEffect(() => {
        setIsVisible(true);
    }, [slotsToShow]);

    if (slotsToShow.length === 0 || !isVisible) {
        return null;
    }

    const handleSlotClick = (slot) => {
        if (slot.action_url) {
            window.open(slot.action_url, "_blank");
        }
    };

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
        setIsVisible(true);
    };

    // If only one slot, don't use carousel
    if (slotsToShow.length === 1) {
        const slot = slotsToShow[0];
        const colors = getProfessionalColors(
            slot.type,
            slot.background_color,
            slot.text_color
        );

        return (
            <div
                style={{
                    background: colors.background,
                    border: colors.border,
                    borderRadius: "20px",
                    padding: windowWidth >= 768 ? "28px" : "24px",
                    marginBottom: 32,
                    position: "relative",
                    cursor: "default",
                    boxShadow: colors.boxShadow,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: slot.icon ? (windowWidth >= 768 ? 20 : 16) : 0,
                    }}
                >
                    {/* Icon - Only show if icon is selected */}
                    {slot.icon && (
                        <div
                            style={{
                                background: colors.iconBg,
                                color: colors.accent,
                                width: windowWidth >= 768 ? 56 : 48,
                                height: windowWidth >= 768 ? 56 : 48,
                                borderRadius:
                                    windowWidth >= 768 ? "14px" : "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: windowWidth >= 768 ? "24px" : "20px",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                            }}
                        >
                            {getProfessionalIcon(slot.type, slot.icon)}
                        </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                        {/* Header with tags */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: windowWidth >= 768 ? 10 : 8,
                                marginBottom: windowWidth >= 768 ? 12 : 10,
                            }}
                        >
                            <Badge
                                color={colors.badgeText}
                                text={
                                    slot.type.charAt(0).toUpperCase() +
                                    slot.type.slice(1)
                                }
                                style={{
                                    fontSize:
                                        windowWidth >= 768 ? "12px" : "11px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.8px",
                                    background: colors.badgeBg,
                                    border: `1px solid ${colors.badgeText}`,
                                    borderRadius: "12px",
                                    padding: "4px 12px",
                                }}
                            />
                            {slot.priority >= 8 && (
                                <Badge
                                    color="red"
                                    text="Priority"
                                    style={{
                                        fontSize:
                                            windowWidth >= 768
                                                ? "12px"
                                                : "11px",
                                    }}
                                />
                            )}
                        </div>

                        {/* Title */}
                        <Title
                            level={windowWidth >= 768 ? 4 : 5}
                            style={{
                                color: colors.text,
                                margin: "0 0 10px 0",
                                fontWeight: 700,
                                lineHeight: 1.3,
                                fontSize: windowWidth >= 768 ? "20px" : "16px",
                            }}
                        >
                            {slot.title}
                        </Title>

                        {/* Description */}
                        <Paragraph
                            style={{
                                color: colors.text,
                                fontSize: windowWidth >= 768 ? "15px" : "13px",
                                margin: "0 0 18px 0",
                                lineHeight: 1.5,
                                opacity: 0.9,
                                fontWeight: 400,
                            }}
                        >
                            {slot.content}
                        </Paragraph>

                        {/* Action button */}
                        {slot.action_text && slot.action_text.trim() && (
                            <Button
                                type="primary"
                                size={windowWidth >= 768 ? "middle" : "small"}
                                onClick={() => handleSlotClick(slot)}
                                style={{
                                    background: colors.accent,
                                    borderColor: colors.accent,
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    height:
                                        windowWidth >= 768 ? "40px" : "36px",
                                    padding:
                                        windowWidth >= 768
                                            ? "0 24px"
                                            : "0 16px",
                                    fontSize:
                                        windowWidth >= 768 ? "14px" : "13px",
                                    boxShadow: `0 2px 8px ${colors.accent}30`,
                                    transition: "all 0.2s ease",
                                    color: "#ffffff",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform =
                                        "translateY(-1px)";
                                    e.target.style.boxShadow =
                                        "0 4px 12px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow =
                                        "0 2px 8px rgba(0, 0, 0, 0.15)";
                                }}
                            >
                                {slot.action_text}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Multiple slots - use carousel
    return (
        <div style={{ marginBottom: 32 }}>
            <Carousel
                autoPlay={true}
                interval={8000}
                showArrows={true}
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                infiniteLoop={true}
                stopOnHover={true}
                swipeable={true}
                emulateTouch={true}
                dynamicHeight={false}
                centerMode={false}
                selectedItem={0}
                transitionTime={500}
                width="100%"
                onChange={handleSlideChange}
                className="dynamic-slots-carousel"
            >
                {slotsToShow.map((slot, index) => {
                    const colors = getProfessionalColors(
                        slot.type,
                        slot.background_color,
                        slot.text_color
                    );

                    return (
                        <div
                            key={slot.id || index}
                            className="dynamic-slot-slide"
                        >
                            <div
                                style={{
                                    background: colors.background,
                                    border: colors.border,
                                    borderRadius: "20px",
                                    padding:
                                        windowWidth >= 768 ? "28px" : "24px",
                                    cursor: "default",
                                    boxShadow: colors.boxShadow,
                                    position: "relative",
                                    minHeight:
                                        windowWidth >= 768 ? "180px" : "160px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: slot.icon
                                            ? windowWidth >= 768
                                                ? 20
                                                : 16
                                            : 0,
                                    }}
                                >
                                    {/* Icon - Only show if icon is selected */}
                                    {slot.icon && (
                                        <div
                                            style={{
                                                background: colors.iconBg,
                                                color: colors.accent,
                                                width:
                                                    windowWidth >= 768
                                                        ? 56
                                                        : 48,
                                                height:
                                                    windowWidth >= 768
                                                        ? 56
                                                        : 48,
                                                borderRadius:
                                                    windowWidth >= 768
                                                        ? "14px"
                                                        : "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize:
                                                    windowWidth >= 768
                                                        ? "24px"
                                                        : "20px",
                                                flexShrink: 0,
                                                boxShadow:
                                                    "0 2px 8px rgba(0, 0, 0, 0.08)",
                                            }}
                                        >
                                            {getProfessionalIcon(
                                                slot.type,
                                                slot.icon
                                            )}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            paddingTop: 2,
                                        }}
                                    >
                                        {/* Header with tags */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap:
                                                    windowWidth >= 768 ? 10 : 8,
                                                marginBottom:
                                                    windowWidth >= 768
                                                        ? 12
                                                        : 10,
                                            }}
                                        >
                                            <Badge
                                                color={colors.badgeText}
                                                text={
                                                    slot.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    slot.type.slice(1)
                                                }
                                                style={{
                                                    fontSize:
                                                        windowWidth >= 768
                                                            ? "12px"
                                                            : "11px",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.8px",
                                                    background: colors.badgeBg,
                                                    border: `1px solid ${colors.badgeText}`,
                                                    borderRadius: "12px",
                                                    padding: "4px 12px",
                                                }}
                                            />
                                            {slot.priority >= 8 && (
                                                <Badge
                                                    color="red"
                                                    text="Priority"
                                                    style={{
                                                        fontSize:
                                                            windowWidth >= 768
                                                                ? "12px"
                                                                : "11px",
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Title */}
                                        <Title
                                            level={windowWidth >= 768 ? 4 : 5}
                                            style={{
                                                color: colors.text,
                                                margin: "0 0 10px 0",
                                                fontWeight: 700,
                                                lineHeight: 1.3,
                                                fontSize:
                                                    windowWidth >= 768
                                                        ? "20px"
                                                        : "16px",
                                            }}
                                        >
                                            {slot.title}
                                        </Title>

                                        {/* Description */}
                                        <Paragraph
                                            style={{
                                                color: colors.text,
                                                fontSize:
                                                    windowWidth >= 768
                                                        ? "15px"
                                                        : "13px",
                                                margin: "0 0 18px 0",
                                                lineHeight: 1.5,
                                                opacity: 0.9,
                                                fontWeight: 400,
                                            }}
                                        >
                                            {slot.content}
                                        </Paragraph>

                                        {/* Action button */}
                                        {slot.action_text &&
                                            slot.action_text.trim() && (
                                                <Button
                                                    type="primary"
                                                    size={
                                                        windowWidth >= 768
                                                            ? "middle"
                                                            : "small"
                                                    }
                                                    onClick={() =>
                                                        handleSlotClick(slot)
                                                    }
                                                    style={{
                                                        background:
                                                            colors.accent,
                                                        borderColor:
                                                            colors.accent,
                                                        borderRadius: "8px",
                                                        fontWeight: 600,
                                                        height:
                                                            windowWidth >= 768
                                                                ? "40px"
                                                                : "36px",
                                                        padding:
                                                            windowWidth >= 768
                                                                ? "0 24px"
                                                                : "0 16px",
                                                        fontSize:
                                                            windowWidth >= 768
                                                                ? "14px"
                                                                : "13px",
                                                        boxShadow: `0 2px 8px ${colors.accent}30`,
                                                        transition:
                                                            "all 0.2s ease",
                                                        color: "#ffffff",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                        e.target.style.boxShadow =
                                                            "0 4px 12px rgba(0, 0, 0, 0.2)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                        e.target.style.boxShadow =
                                                            "0 2px 8px rgba(0, 0, 0, 0.15)";
                                                    }}
                                                >
                                                    {slot.action_text}
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
}
