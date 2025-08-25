import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    message,
    Alert,
    Divider,
    Carousel,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    SendOutlined,
    BookOutlined,
    SafetyCertificateOutlined,
    MobileOutlined,
    MessageOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import BookingHeader from "../../Components/BookingHeader";
import CustomerLoginModal from "../../Components/CustomerLoginModal";

const { Title, Paragraph, Text } = Typography;

export default function CustomerDashboard({ auth, services = [] }) {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Fallback services if none are found in database
    const fallbackServices = [
        {
            id: 1,
            name: "HospiPal for OPD Visits",
            description:
                "Escort and assist during doctor visits & diagnostics.",
            icon: "🧑‍⚕",
            color: "#1890ff",
        },
        {
            id: 2,
            name: "HospiPal for Elderly Care",
            description:
                "Respectful companion for seniors (single visit or packages).",
            icon: "👵",
            color: "#52c41a",
        },
        {
            id: 3,
            name: "HospiPal On-Call (Emergency)",
            description: "Quick HospiPal when family can't reach in time.",
            icon: "⚡",
            color: "#faad14",
        },
    ];

    // Use services from database, fallback to static data if empty
    const servicesData = services.length > 0 ? services : fallbackServices;

    // Debug: Log the services being used
    console.log("Services from backend:", services);
    console.log("Services being used in carousel:", servicesData);
    console.log("First service data:", servicesData[0]);
    console.log("ServicesData length:", servicesData.length);
    console.log("ServicesData type:", typeof servicesData);
    console.log("Is servicesData array:", Array.isArray(servicesData));

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

    const handleChatWithUs = () => {
        // TODO: Implement chat functionality
        message.info("Chat feature coming soon!");
    };

    const handleLogin = () => {
        setIsLoginModalVisible(true);
    };

    const handleLoginSuccess = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const handleServiceClick = (service) => {
        router.visit(route("booking.select-service"));
    };

    return (
        <div>
            <Head title="HospiPal - Customer Dashboard" />
            <BookingHeader auth={auth} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Add responsive top spacing for mobile */}
                <div className="mobile-top-spacing" />

                {/* Hero Section */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "64px 32px",
                        borderRadius: "24px",
                        textAlign: "center",
                        marginBottom: 64,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                        border: "1px solid #f5f5f5",
                        position: "relative",
                        overflow: "hidden",
                    }}
                    className="hero-section"
                >
                    {/* Background Pattern */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                                "linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(24, 144, 255, 0.01) 100%)",
                            zIndex: 0,
                        }}
                    />

                    <div style={{ position: "relative", zIndex: 1 }}>
                        <Title
                            level={1}
                            style={{
                                color: "#1a1a1a",
                                fontSize: "3rem",
                                fontWeight: 800,
                                lineHeight: 1.1,
                                maxWidth: 900,
                                margin: "0 auto 32px auto",
                                letterSpacing: "-0.02em",
                            }}
                            className="hero-title"
                        >
                            Book a HospiPal Anytime,
                            <br />
                            From Anywhere
                        </Title>

                        <Paragraph
                            style={{
                                fontSize: 20,
                                color: "#4a4a4a",
                                maxWidth: 800,
                                margin: "0 auto 48px auto",
                                lineHeight: 1.7,
                                fontWeight: 400,
                            }}
                            className="hero-subtitle"
                        >
                            Whether you're in Mumbai or miles away in Dubai,
                            London, or New York — you can book a HospiPal for
                            your loved ones. Families abroad, locals, and even
                            foreigners trust us for trained, non-medical
                            companion support in hospitals.
                        </Paragraph>

                        {/* CTA Buttons Container */}
                        <div
                            style={{
                                marginBottom: 40,
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                                flexWrap: "wrap",
                            }}
                            className="hero-cta-container"
                        >
                            {/* Primary CTA */}
                            <Button
                                type="primary"
                                size="large"
                                icon={
                                    <BookOutlined
                                        style={{
                                            fontSize: 18,
                                            color: "#ffffff",
                                        }}
                                    />
                                }
                                onClick={handleBookAppointment}
                                style={{
                                    background: "#1890ff",
                                    border: "none",
                                    height: 60,
                                    padding: "0 48px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    borderRadius: "14px",
                                    boxShadow:
                                        "0 6px 16px rgba(24, 144, 255, 0.25)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    minWidth: "280px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                className="hero-primary-button"
                            >
                                Book a HospiPal
                            </Button>

                            {/* Secondary CTA */}
                            <Button
                                type="default"
                                size="large"
                                icon={<MessageOutlined />}
                                onClick={handleChatWithUs}
                                style={{
                                    height: 60,
                                    padding: "0 40px",
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderRadius: "14px",
                                    border: "2px solid #1890ff",
                                    color: "#1890ff",
                                    background: "#ffffff",
                                    minWidth: "200px",
                                }}
                                className="hero-secondary-button"
                            >
                                💬 Chat with Us
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 16,
                                padding: "24px 40px",
                                background:
                                    "linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.04) 100%)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.12)",
                                maxWidth: "fit-content",
                            }}
                            className="hero-trust-indicator"
                        >
                            <CheckCircleOutlined
                                style={{
                                    color: "#52c41a",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                }}
                            />
                            <Text
                                style={{
                                    color: "#4a4a4a",
                                    fontSize: 16,
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                }}
                                className="hero-trust-text"
                            >
                                Secure global booking.
                            </Text>
                            <span style={{ color: "#ff4d4f", fontSize: 20 }}>
                                📌
                            </span>
                            <Text
                                style={{
                                    color: "#4a4a4a",
                                    fontSize: 16,
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                }}
                                className="hero-trust-text"
                            >
                                Instant confirmation.
                            </Text>
                            <Text
                                style={{
                                    color: "#4a4a4a",
                                    fontSize: 16,
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                }}
                                className="hero-trust-text"
                            >
                                Local support delivered by HospiPals.
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Quick Trust Anchors Section */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "48px 32px",
                        borderRadius: "20px",
                        marginBottom: 48,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                        border: "1px solid #f5f5f5",
                    }}
                    className="trust-anchors-section"
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "32px",
                            maxWidth: "1000px",
                            margin: "0 auto",
                        }}
                        className="trust-anchors-grid"
                    >
                        {/* Trained & Verified Companions */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "24px",
                                background:
                                    "linear-gradient(135deg, rgba(82, 196, 26, 0.05) 0%, rgba(82, 196, 26, 0.02) 100%)",
                                borderRadius: "16px",
                                border: "1px solid rgba(82, 196, 26, 0.1)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#52c41a",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <SafetyCertificateOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#ffffff",
                                    }}
                                />
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        display: "block",
                                        marginBottom: "4px",
                                    }}
                                >
                                    ✅ Trained & Verified Companions
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    All our HospiPals are thoroughly vetted and
                                    trained
                                </Text>
                            </div>
                        </div>

                        {/* Transparent Pricing */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "24px",
                                background:
                                    "linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%)",
                                borderRadius: "16px",
                                border: "1px solid rgba(24, 144, 255, 0.1)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#1890ff",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <BookOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#ffffff",
                                    }}
                                />
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        display: "block",
                                        marginBottom: "4px",
                                    }}
                                >
                                    ✅ Transparent Pricing
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    No hidden fees, clear pricing upfront
                                </Text>
                            </div>
                        </div>

                        {/* Flexible Rescheduling */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "24px",
                                background:
                                    "linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(250, 173, 20, 0.02) 100%)",
                                borderRadius: "16px",
                                border: "1px solid rgba(250, 173, 20, 0.1)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#faad14",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <CalendarOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#ffffff",
                                    }}
                                />
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        display: "block",
                                        marginBottom: "4px",
                                    }}
                                >
                                    ✅ Flexible Rescheduling
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Easy to reschedule or cancel when needed
                                </Text>
                            </div>
                        </div>

                        {/* Global Booking. Local Care. */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "24px",
                                background:
                                    "linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.02) 100%)",
                                borderRadius: "16px",
                                border: "1px solid rgba(114, 46, 209, 0.1)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#722ed1",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <GlobalOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#ffffff",
                                    }}
                                />
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        display: "block",
                                        marginBottom: "4px",
                                    }}
                                >
                                    ✅ Global Booking. Local Care.
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Book from anywhere, care delivered locally
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Services Section */}
                <div
                    style={{
                        background: "#f8f9fa",
                        padding: "64px 32px",
                        borderRadius: "24px",
                        marginBottom: 48,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                        border: "1px solid #e9ecef",
                    }}
                    className="our-services-section"
                >
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <Title
                            level={2}
                            style={{ color: "#1a1a1a", marginBottom: 16 }}
                        >
                            Our Services
                        </Title>
                        <Paragraph
                            style={{ color: "#666", fontSize: 18, margin: 0 }}
                        >
                            Choose the perfect HospiPal for your loved ones.
                        </Paragraph>
                    </div>

                    <div
                        style={{
                            position: "relative",
                            maxWidth: "1200px",
                            margin: "0 auto",
                            minHeight: "500px",
                        }}
                    >
                        <Carousel
                            autoplay={true}
                            autoplaySpeed={5000}
                            dots={true}
                            arrows={true}
                            infinite={true}
                            speed={500}
                            slidesToShow={3}
                            slidesToScroll={3}
                            swipeable={true}
                            emulateTouch={true}
                            adaptiveHeight={true}
                            draggable={true}
                            fade={true}
                            responsive={[
                                {
                                    breakpoint: 1200,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 2,
                                        dots: true,
                                        arrows: true,
                                        swipeable: true,
                                        emulateTouch: true,
                                    },
                                },
                                {
                                    breakpoint: 768,
                                    settings: {
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        dots: true,
                                        arrows: false,
                                        centerMode: false,
                                        swipeable: true,
                                        emulateTouch: true,
                                    },
                                },
                                {
                                    breakpoint: 480,
                                    settings: {
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        dots: true,
                                        arrows: false,
                                        centerMode: false,
                                        swipeable: true,
                                        emulateTouch: true,
                                    },
                                },
                            ]}
                            style={{
                                padding: "0 40px",
                            }}
                            className="services-carousel"
                        >
                            {servicesData && servicesData.length > 0 ? (
                                servicesData.map((service, index) => (
                                    <div
                                        key={service.id || index}
                                        style={{ padding: "0 24px" }}
                                        className="service-slide"
                                    >
                                        <Card
                                            onClick={() =>
                                                handleServiceClick(service)
                                            }
                                            style={{
                                                background: "#ffffff",
                                                border: "1px solid #e8e8e8",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                transition:
                                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                height: "420px",
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow:
                                                    "0 4px 12px rgba(0, 0, 0, 0.08)",
                                            }}
                                            hoverable
                                            className="service-card"
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            {/* Service Header with Gradient Background */}
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: 180,
                                                    background: `linear-gradient(135deg, ${
                                                        service.color ||
                                                        "#1890ff"
                                                    } 0%, ${
                                                        service.color
                                                            ? service.color +
                                                              "80"
                                                            : "#1890ff80"
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
                                                        fontSize: "64px",
                                                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                                                    }}
                                                >
                                                    {service.icon || "🏥"}
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
                                                        fontSize: "18px",
                                                        fontWeight: 600,
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {service.name || "Service"}
                                                </Title>

                                                {/* Service Description */}
                                                {(service.description ||
                                                    service.name) && (
                                                    <Text
                                                        style={{
                                                            color: "#666",
                                                            fontSize: "14px",
                                                            lineHeight: 1.5,
                                                            marginBottom: 20,
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {service.description ||
                                                            `Professional ${
                                                                service.name ||
                                                                "service"
                                                            } for your needs.`}
                                                    </Text>
                                                )}

                                                {/* Service Details */}
                                                <div
                                                    style={{
                                                        marginTop: "auto",
                                                        paddingTop: 16,
                                                    }}
                                                >
                                                    {/* Action Button */}
                                                    <Button
                                                        type="primary"
                                                        size="middle"
                                                        style={{
                                                            width: "100%",
                                                            height: 40,
                                                            fontWeight: 500,
                                                            borderRadius: "8px",
                                                            background:
                                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                                            border: "none",
                                                            boxShadow:
                                                                "0 2px 8px rgba(24, 144, 255, 0.2)",
                                                        }}
                                                    >
                                                        Choose Service
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                // Fallback content if no services
                                <div
                                    style={{
                                        padding: "0 24px",
                                        textAlign: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#666",
                                            fontSize: "16px",
                                        }}
                                    >
                                        Loading services...
                                    </Text>
                                </div>
                            )}
                        </Carousel>
                    </div>

                    {/* Disclaimer */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 48,
                            padding: "24px 32px",
                            background: "rgba(24, 144, 255, 0.08)",
                            borderRadius: "16px",
                            border: "1px solid rgba(24, 144, 255, 0.15)",
                            maxWidth: "800px",
                            margin: "48px auto 0",
                        }}
                    >
                        <Text
                            style={{
                                color: "#4a4a4a",
                                fontSize: "15px",
                                lineHeight: 1.5,
                                fontWeight: 500,
                            }}
                        >
                            📌 HospiPals provide non-medical companion support
                            only. All medical/nursing care is handled by
                            hospital staff.
                        </Text>
                    </div>

                    {/* Final CTA */}
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<BookOutlined />}
                            onClick={handleBookAppointment}
                            style={{
                                background:
                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                border: "none",
                                height: 56,
                                padding: "0 32px",
                                fontSize: "16px",
                                fontWeight: 600,
                                borderRadius: "14px",
                                boxShadow:
                                    "0 8px 24px rgba(24, 144, 255, 0.25)",
                                minWidth: "280px",
                                maxWidth: "400px",
                                width: "auto",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            className="services-cta-button"
                        >
                            Book a HospiPal
                        </Button>
                    </div>
                </div>

                {/* Carousel and Mobile Responsive CSS */}
                <style jsx>{`
                    /* Global Carousel Styles */
                    .services-carousel .slick-dots {
                        position: relative !important;
                        bottom: -20px !important;
                        z-index: 10 !important;
                    }

                    .services-carousel .slick-dots li button {
                        width: 12px !important;
                        height: 12px !important;
                        border-radius: 50% !important;
                        background: #d9d9d9 !important;
                        border: 2px solid #ffffff !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        opacity: 1 !important;
                    }

                    .services-carousel .slick-dots li.slick-active button {
                        background: #1890ff !important;
                        border: 2px solid #ffffff !important;
                        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                    }

                    .services-carousel .slick-prev,
                    .services-carousel .slick-next {
                        width: 44px !important;
                        height: 44px !important;
                        background: #ffffff !important;
                        border: 2px solid #1890ff !important;
                        border-radius: 50% !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                        z-index: 10 !important;
                        opacity: 1 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-family: "Ant Design Icons", Arial, sans-serif !important;
                        position: absolute !important;
                        top: 0 !important;
                    }

                    .services-carousel .slick-prev:hover,
                    .services-carousel .slick-next:hover {
                        background: #1890ff !important;
                        color: #ffffff !important;
                    }
                        .services-carousel .slick-prev{

                        }

                    .services-carousel .slick-prev:before,
                    .services-carousel .slick-next:before {
                        color: #1890ff !important;
                        font-size: 20px !important;
                        font-weight: bold !important;
                        opacity: 1 !important;
                        content: "‹" !important;
                    }

                    .services-carousel .slick-next:before {
                        content: "›" !important;
                    }

                    .services-carousel .slick-prev:hover:before,
                    .services-carousel .slick-next:hover:before {
                        color: #ffffff !important;
                    }

                    @media (max-width: 1200px) {
                    @media (max-width: 1200px) {
                        .services-carousel {
                            padding: 0 20px !important;
                        }

                        .service-slide {
                            padding: 0 16px !important;
                        }
                    }

                    @media (max-width: 768px) {
                        .hero-section {
                            padding: 32px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 16px !important;
                        }

                        .hero-title {
                            font-size: 2rem !important;
                            line-height: 1.2 !important;
                            margin-bottom: 24px !important;
                            padding: 0 8px !important;
                        }

                        .hero-subtitle {
                            font-size: 16px !important;
                            line-height: 1.6 !important;
                            margin-bottom: 32px !important;
                            padding: 0 8px !important;
                        }

                        .hero-cta-container {
                            display: flex !important;
                            justify-content: center !important;
                            gap: 16px !important;
                            flex-wrap: wrap !important;
                        }

                        .hero-primary-button {
                            width: 100% !important;
                            min-width: unset !important;
                            height: 56px !important;
                            font-size: 16px !important;
                            padding: 0 24px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                        }

                        .hero-primary-button span {
                            font-size: 16px !important;
                            line-height: 1.2 !important;
                        }

                        .hero-secondary-button {
                            width: 100% !important;
                            min-width: unset !important;
                            height: 56px !important;
                            font-size: 15px !important;
                            padding: 0 28px !important;
                        }

                        .hero-trust-indicator {
                            flex-wrap: wrap !important;
                            gap: 12px !important;
                            padding: 20px 24px !important;
                            text-align: center !important;
                            justify-content: center !important;
                        }

                        .hero-trust-text {
                            font-size: 14px !important;
                            text-align: center !important;
                        }

                        /* Trust Anchors Mobile Styles */
                        .trust-anchors-section {
                            padding: 32px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 16px !important;
                        }

                        .trust-anchors-grid {
                            grid-template-columns: 1fr !important;
                            gap: 20px !important;
                        }

                        .trust-anchor-item {
                            padding: 20px !important;
                            border-radius: 12px !important;
                        }

                        /* Our Services Mobile Styles */
                        .our-services-section {
                            padding: 48px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 20px !important;
                        }

                        .services-carousel {
                            padding: 0 10px !important;
                        }

                        .service-slide {
                            padding: 0 8px !important;
                        }

                        .service-card {
                            height: 400px !important;
                            border-radius: 16px !important;
                        }

                        .service-card .ant-card-body {
                            padding: 0 !important;
                        }

                        .service-card h4 {
                            font-size: 16px !important;
                            margin-bottom: 8px !important;
                        }

                        .service-card .ant-typography {
                            font-size: 13px !important;
                            margin-bottom: 16px !important;
                        }

                        .service-card .ant-btn {
                            height: 36px !important;
                            font-size: 14px !important;
                        }

                        /* CTA Button Mobile Styles */
                        .our-services-section .ant-btn,
                        .services-cta-button {
                            width: 100% !important;
                            max-width: 300px !important;
                            height: 48px !important;
                            font-size: 16px !important;
                            padding: 0 20px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                            line-height: 1.4 !important;
                            min-width: unset !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                        }

                        /* Carousel Navigation Mobile Styles */
                        .services-carousel .slick-dots {
                            bottom: -30px !important;
                            z-index: 10 !important;
                        }

                        .services-carousel .slick-dots li button {
                            width: 10px !important;
                            height: 10px !important;
                            border-radius: 50% !important;
                            background: #d9d9d9 !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        }

                        .services-carousel .slick-dots li.slick-active button {
                            background: #1890ff !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                        }

                        /* Carousel Arrow Styles */
                        .services-carousel .slick-prev,
                        .services-carousel .slick-next {
                            width: 40px !important;
                            height: 40px !important;
                            background: #ffffff !important;
                            border: 2px solid #1890ff !important;
                            border-radius: 50% !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                            z-index: 10 !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-family: "Ant Design Icons", Arial, sans-serif !important;
                        }

                        .services-carousel .slick-prev:hover,
                        .services-carousel .slick-next:hover {
                            background: #1890ff !important;
                            color: #ffffff !important;
                        }

                        .services-carousel .slick-prev:before,
                        .services-carousel .slick-next:before {
                            color: #1890ff !important;
                            font-size: 18px !important;
                            font-weight: bold !important;
                        }

                        .services-carousel .slick-prev:hover:before,
                        .services-carousel .slick-next:hover:before {
                            color: #ffffff !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .hero-section {
                            padding: 24px 12px !important;
                        }

                        .hero-title {
                            font-size: 1.75rem !important;
                            padding: 0 4px !important;
                        }

                        .hero-subtitle {
                            font-size: 15px !important;
                            padding: 0 4px !important;
                        }

                        .hero-primary-button {
                            height: 48px !important;
                            font-size: 14px !important;
                            padding: 0 20px !important;
                        }

                        .hero-secondary-button {
                            height: 44px !important;
                            font-size: 13px !important;
                            padding: 0 16px !important;
                        }

                        .hero-trust-indicator {
                            padding: 12px 16px !important;
                        }

                        .hero-trust-text {
                            font-size: 13px !important;
                        }

                        /* Trust Anchors Small Mobile Styles */
                        .trust-anchors-section {
                            padding: 24px 12px !important;
                        }

                        .trust-anchors-grid {
                            gap: 16px !important;
                        }

                        .trust-anchor-item {
                            padding: 16px !important;
                            gap: 12px !important;
                        }

                        .trust-anchor-item > div:first-child {
                            width: 40px !important;
                            height: 40px !important;
                        }

                        .trust-anchor-item > div:first-child > * {
                            font-size: 20px !important;
                        }

                        /* Our Services Small Mobile Styles */
                        .our-services-section {
                            padding: 32px 12px !important;
                        }

                        .services-carousel {
                            padding: 0 8px !important;
                        }

                        .service-slide {
                            padding: 0 6px !important;
                        }

                        .service-card {
                            height: 380px !important;
                            border-radius: 14px !important;
                        }

                        .service-card h4 {
                            font-size: 15px !important;
                            margin-bottom: 6px !important;
                        }

                        .service-card .ant-typography {
                            font-size: 12px !important;
                            margin-bottom: 12px !important;
                        }

                        .service-card .ant-btn {
                            height: 32px !important;
                            font-size: 13px !important;
                        }

                        /* CTA Button Small Mobile Styles */
                        .our-services-section .ant-btn,
                        .services-cta-button {
                            width: 100% !important;
                            max-width: 280px !important;
                            height: 44px !important;
                            font-size: 15px !important;
                            padding: 0 16px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                            line-height: 1.3 !important;
                            min-width: unset !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                        }

                        /* Carousel Navigation Small Mobile Styles */
                        .services-carousel .slick-dots {
                            bottom: -25px !important;
                            z-index: 10 !important;
                        }

                        .services-carousel .slick-dots li button {
                            width: 8px !important;
                            height: 8px !important;
                            border-radius: 50% !important;
                            background: #d9d9d9 !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        }

                        .services-carousel .slick-dots li.slick-active button {
                            background: #1890ff !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                        }
                    }
                `}</style>

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
                                    Book your appointments in just a few clicks
                                    with our streamlined booking process.
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
                                    Access our platform from any device with our
                                    responsive design.
                                </Paragraph>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Customer Login Modal */}
                <CustomerLoginModal
                    isVisible={isLoginModalVisible}
                    onClose={() => setIsLoginModalVisible(false)}
                    onSuccess={handleLoginSuccess}
                />
            </div>
        </div>
    );
}
