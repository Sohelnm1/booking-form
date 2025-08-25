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
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BookingHeader from "../../Components/BookingHeader";
import CustomerLoginModal from "../../Components/CustomerLoginModal";

const { Title, Paragraph, Text } = Typography;

export default function CustomerDashboard({
    auth,
    services = [],
    extras = [],
}) {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );

    // Handle window resize for responsive carousel
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine carousel settings based on screen size
    const getCarouselSettings = () => {
        if (windowWidth >= 1200) {
            return {
                centerMode: true,
                centerSlidePercentage: 33.33,
                showArrows: true,
                showIndicators: true,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        } else if (windowWidth >= 768) {
            return {
                centerMode: true,
                centerSlidePercentage: 50,
                showArrows: true,
                showIndicators: true,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        } else {
            return {
                centerMode: false,
                centerSlidePercentage: 100,
                showArrows: true,
                showIndicators: true,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        }
    };

    const carouselSettings = getCarouselSettings();

    // Use services from database
    const servicesData = services || [];
    const extrasData = extras || [];

    // Debug: Log the services and extras being used
    console.log("Services from backend:", services);
    console.log("Services being used in carousel:", servicesData);
    console.log("ServicesData length:", servicesData.length);
    console.log("Is servicesData array:", Array.isArray(servicesData));
    console.log("Carousel settings:", carouselSettings);
    console.log("Extras from backend:", extras);
    console.log("Extras being used:", extrasData);
    console.log("ExtrasData length:", extrasData.length);

    // Debug: Check image data
    if (servicesData.length > 0) {
        servicesData.forEach((service, index) => {
            console.log(`Service ${index + 1}:`, {
                id: service.id,
                name: service.name,
                description: service.description,
                image: service.image,
                hasImage: !!service.image,
                imageType: typeof service.image,
                is_active: service.is_active,
                is_upcoming: service.is_upcoming,
            });
        });
    } else {
        console.log("No services found in servicesData");
    }

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
        // Open WhatsApp chat with the specified number
        window.open("https://wa.me/917979911483", "_blank");
    };

    const handleTermsConditions = () => {
        console.log("Terms & Conditions clicked");
        try {
            const url = route("pdf.terms-conditions");
            console.log("Generated URL:", url);
            console.log("Ziggy routes:", window.Ziggy?.routes);
            window.open(url, "_blank");
        } catch (error) {
            console.error("Error generating route:", error);
            // Fallback to direct URL
            window.open("/pdf/terms-conditions", "_blank");
        }
    };

    const handlePrivacyPolicy = () => {
        window.open(route("pdf.privacy-policy"), "_blank");
    };

    const handleBookingConsent = () => {
        window.open(route("pdf.booking-consent"), "_blank");
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
                        padding: windowWidth >= 768 ? "64px 32px" : "48px 24px",
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
                                fontSize:
                                    windowWidth >= 768 ? "3rem" : "2.2rem",
                                fontWeight: 800,
                                lineHeight: 1.1,
                                maxWidth: 900,
                                margin: "0 auto 32px auto",
                                letterSpacing: "-0.02em",
                                padding: windowWidth < 768 ? "0 8px" : "0",
                            }}
                            className="hero-title"
                        >
                            Book a HospiPal Anytime,
                            <br />
                            From Anywhere
                        </Title>

                        <Paragraph
                            style={{
                                fontSize: windowWidth >= 768 ? 20 : 16,
                                color: "#4a4a4a",
                                maxWidth: 800,
                                margin: "0 auto 48px auto",
                                lineHeight: 1.7,
                                fontWeight: 400,
                                padding: windowWidth < 768 ? "0 16px" : "0",
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
                                gap: windowWidth >= 768 ? "20px" : "16px",
                                flexWrap: "wrap",
                                flexDirection:
                                    windowWidth < 768 ? "column" : "row",
                                alignItems: "center",
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
                                            fontSize:
                                                windowWidth >= 768 ? 18 : 16,
                                            color: "#ffffff",
                                        }}
                                    />
                                }
                                onClick={handleBookAppointment}
                                style={{
                                    background: "#1890ff",
                                    border: "none",
                                    height: windowWidth >= 768 ? 60 : 48,
                                    padding:
                                        windowWidth >= 768
                                            ? "0 48px"
                                            : "0 24px",
                                    fontSize: windowWidth >= 768 ? 16 : 14,
                                    fontWeight: 600,
                                    borderRadius: "12px",
                                    boxShadow:
                                        "0 6px 16px rgba(24, 144, 255, 0.25)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    minWidth:
                                        windowWidth >= 768 ? "280px" : "auto",
                                    maxWidth:
                                        windowWidth >= 768 ? "none" : "280px",
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
                                    height: windowWidth >= 768 ? 60 : 48,
                                    padding:
                                        windowWidth >= 768
                                            ? "0 40px"
                                            : "0 24px",
                                    fontSize: windowWidth >= 768 ? 16 : 14,
                                    fontWeight: 500,
                                    borderRadius: "12px",
                                    border: "2px solid #1890ff",
                                    color: "#1890ff",
                                    background: "#ffffff",
                                    minWidth:
                                        windowWidth >= 768 ? "200px" : "auto",
                                    maxWidth:
                                        windowWidth >= 768 ? "none" : "280px",
                                }}
                                className="hero-secondary-button"
                            >
                                💬 Chat with Us
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div
                            style={{
                                display:
                                    windowWidth >= 768 ? "inline-flex" : "flex",
                                flexDirection:
                                    windowWidth >= 768 ? "row" : "column",
                                alignItems: "center",
                                gap: windowWidth >= 768 ? 16 : 12,
                                padding:
                                    windowWidth >= 768
                                        ? "24px 40px"
                                        : "20px 24px",
                                background:
                                    "linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.04) 100%)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.12)",
                                maxWidth:
                                    windowWidth >= 768 ? "fit-content" : "100%",
                                width: windowWidth < 768 ? "100%" : "auto",
                            }}
                            className="hero-trust-indicator"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                <CheckCircleOutlined
                                    style={{
                                        color: "#52c41a",
                                        fontSize: windowWidth >= 768 ? 24 : 20,
                                        fontWeight: "bold",
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "#4a4a4a",
                                        fontSize: windowWidth >= 768 ? 16 : 14,
                                        fontWeight: 500,
                                        lineHeight: 1.4,
                                        textAlign:
                                            windowWidth >= 768
                                                ? "left"
                                                : "center",
                                    }}
                                    className="hero-trust-text"
                                >
                                    Secure global booking.
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                <span
                                    style={{
                                        color: "#ff4d4f",
                                        fontSize: windowWidth >= 768 ? 20 : 18,
                                    }}
                                >
                                    📌
                                </span>
                                <Text
                                    style={{
                                        color: "#4a4a4a",
                                        fontSize: windowWidth >= 768 ? 16 : 14,
                                        fontWeight: 500,
                                        lineHeight: 1.4,
                                        textAlign:
                                            windowWidth >= 768
                                                ? "left"
                                                : "center",
                                    }}
                                    className="hero-trust-text"
                                >
                                    Instant confirmation.
                                </Text>
                            </div>

                            <Text
                                style={{
                                    color: "#4a4a4a",
                                    fontSize: windowWidth >= 768 ? 16 : 14,
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    textAlign:
                                        windowWidth >= 768 ? "left" : "center",
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
                            autoPlay={carouselSettings.autoPlay}
                            interval={carouselSettings.interval}
                            showArrows={carouselSettings.showArrows}
                            showStatus={false}
                            showIndicators={carouselSettings.showIndicators}
                            showThumbs={false}
                            infiniteLoop={carouselSettings.infiniteLoop}
                            stopOnHover={true}
                            swipeable={true}
                            emulateTouch={true}
                            dynamicHeight={false}
                            centerMode={carouselSettings.centerMode}
                            centerSlidePercentage={
                                carouselSettings.centerSlidePercentage
                            }
                            selectedItem={0}
                            transitionTime={500}
                            width="100%"
                            className="services-carousel"
                        >
                            {servicesData && servicesData.length > 0 ? (
                                servicesData.map((service, index) => (
                                    <div
                                        key={service.id || index}
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
                                                height: "480px",
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
                                                className="service-header"
                                                style={{
                                                    width: "100%",
                                                    height: "140px",
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

                                                {/* Service Image */}
                                                {service.image &&
                                                    service.image !== null &&
                                                    service.image !== "" &&
                                                    service.image !==
                                                        undefined && (
                                                        <img
                                                            src={service.image}
                                                            alt={
                                                                service.name ||
                                                                "Service"
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "12px",
                                                            }}
                                                            onError={(e) => {
                                                                console.log(
                                                                    "Image failed to load:",
                                                                    service.image
                                                                );
                                                                e.target.style.display =
                                                                    "none";
                                                            }}
                                                            onLoad={(e) => {
                                                                console.log(
                                                                    "Image loaded successfully:",
                                                                    service.image
                                                                );
                                                            }}
                                                        />
                                                    )}
                                            </div>

                                            {/* Service Content */}
                                            <div
                                                className="service-content"
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    minHeight: 0,
                                                    padding: "20px",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {/* Service Title */}
                                                <Title
                                                    level={4}
                                                    className="service-title"
                                                    style={{
                                                        color: "#1a1a1a",
                                                        fontSize: "20px",
                                                        fontWeight: 700,
                                                        lineHeight: 1.2,
                                                        minHeight: "48px",
                                                        overflow: "hidden",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        marginBottom: "16px",
                                                        textAlign: "center",
                                                        letterSpacing:
                                                            "-0.01em",
                                                    }}
                                                >
                                                    {service.name || "Service"}
                                                </Title>

                                                {/* Service Description */}
                                                {(service.description ||
                                                    service.name) && (
                                                    <Text
                                                        className="service-description"
                                                        style={{
                                                            color: "#4a4a4a",
                                                            fontSize: "15px",
                                                            lineHeight: 1.5,
                                                            minHeight: "72px",
                                                            overflow: "hidden",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            marginBottom: "0px",
                                                            textAlign: "center",
                                                            fontWeight: 400,
                                                            letterSpacing:
                                                                "0.01em",
                                                        }}
                                                    >
                                                        {service.description &&
                                                        service.description.trim() !==
                                                            ""
                                                            ? service.description
                                                                  .replace(
                                                                      /<[^>]*>/g,
                                                                      ""
                                                                  )
                                                                  .trim()
                                                            : `Professional ${
                                                                  service.name ||
                                                                  "service"
                                                              } support for your needs.`}
                                                    </Text>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                // Fallback content if no services
                                <div
                                    style={{
                                        padding: "48px 24px",
                                        textAlign: "center",
                                        background: "#f8f9fa",
                                        borderRadius: "16px",
                                        border: "1px solid #e9ecef",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#666",
                                            fontSize: "18px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {servicesData.length === 0
                                            ? "No services available at the moment. Please check back later."
                                            : "Loading services..."}
                                    </Text>
                                    {servicesData.length === 0 && (
                                        <Text
                                            style={{
                                                color: "#999",
                                                fontSize: "14px",
                                                marginTop: "8px",
                                                display: "block",
                                            }}
                                        >
                                            We're working on adding more
                                            services for you.
                                        </Text>
                                    )}
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

                {/* Extras Section */}
                {extrasData && extrasData.length > 0 && (
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "64px 32px",
                            borderRadius: "24px",
                            marginBottom: 48,
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                            border: "1px solid #f5f5f5",
                        }}
                        className="extras-section"
                    >
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <Title
                                level={2}
                                style={{ color: "#1a1a1a", marginBottom: 16 }}
                            >
                                Extras
                            </Title>
                            <Paragraph
                                style={{
                                    color: "#666",
                                    fontSize: 18,
                                    margin: 0,
                                }}
                            >
                                Enhance your HospiPal experience with these
                                additional services.
                            </Paragraph>
                        </div>

                        {/* Extras Horizontal Scroll Container */}
                        <div
                            style={{
                                position: "relative",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            }}
                        >
                            {/* Scroll Container */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    overflowX: "auto",
                                    padding: "0 4px",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#c1c1c1 #f1f1f1",
                                    maxWidth: "100%",
                                    scrollBehavior: "smooth",
                                }}
                                className="extras-scroll-container"
                                id="extras-scroll-container"
                            >
                                {extrasData.map((extra, index) => (
                                    <Card
                                        key={extra.id || index}
                                        style={{
                                            background: "#ffffff",
                                            border: "1px solid #e8e8e8",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition:
                                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            height: "280px",
                                            width: "280px",
                                            minWidth: "280px",
                                            display: "flex",
                                            flexDirection: "column",
                                            boxShadow:
                                                "0 4px 12px rgba(0, 0, 0, 0.08)",
                                            flexShrink: 0,
                                        }}
                                        hoverable
                                        className="extra-card"
                                        bodyStyle={{ padding: 0 }}
                                    >
                                        {/* Extra Header with Gradient Background */}
                                        <div
                                            className="extra-header"
                                            style={{
                                                width: "100%",
                                                height: "120px",
                                                background: `linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)`,
                                                position: "relative",
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {/* Extra Image */}
                                            {extra.image &&
                                                extra.image !== null &&
                                                extra.image !== "" &&
                                                extra.image !== undefined && (
                                                    <img
                                                        src={extra.image}
                                                        alt={
                                                            extra.name ||
                                                            "Extra"
                                                        }
                                                        style={{
                                                            // width: "60px",
                                                            // height: "60px",
                                                            objectFit: "cover",
                                                            borderRadius:
                                                                "12px",
                                                        }}
                                                        onError={(e) => {
                                                            console.log(
                                                                "Extra image failed to load:",
                                                                extra.image
                                                            );
                                                            e.target.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                )}

                                            {/* Fallback Icon */}
                                            {(!extra.image ||
                                                extra.image === null ||
                                                extra.image === "" ||
                                                extra.image === undefined) && (
                                                <div
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        background: "#1890ff",
                                                        borderRadius: "12px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: "24px",
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    ⭐
                                                </div>
                                            )}
                                        </div>

                                        {/* Extra Content */}
                                        <div
                                            className="extra-content"
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: "20px",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* Extra Title */}
                                            <Title
                                                level={5}
                                                className="extra-title"
                                                style={{
                                                    color: "#1a1a1a",
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    lineHeight: 1.3,
                                                    height: "42px",
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    marginBottom: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {extra.name || "Extra"}
                                            </Title>

                                            {/* Extra Description */}
                                            {extra.description &&
                                                extra.description.trim() !==
                                                    "" && (
                                                    <Text
                                                        className="extra-description"
                                                        style={{
                                                            color: "#666",
                                                            fontSize: "13px",
                                                            lineHeight: 1.4,
                                                            height: "36px",
                                                            overflow: "hidden",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            marginBottom:
                                                                "12px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {extra.description
                                                            .replace(
                                                                /<[^>]*>/g,
                                                                ""
                                                            )
                                                            .trim()}
                                                    </Text>
                                                )}

                                            {/* Extra Price */}
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    marginTop: "auto",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#1890ff",
                                                        fontSize: "18px",
                                                        fontWeight: 700,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    ₹
                                                    {parseFloat(
                                                        extra.price
                                                    ).toFixed(2)}
                                                </Text>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            {extrasData.length > 4 && (
                                <>
                                    <Button
                                        type="text"
                                        icon={<LeftOutlined />}
                                        style={{
                                            position: "absolute",
                                            left: "-40px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background:
                                                "rgba(255, 255, 255, 0.9)",
                                            border: "1px solid #e8e8e8",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.1)",
                                            zIndex: 10,
                                        }}
                                        onClick={() => {
                                            const container =
                                                document.getElementById(
                                                    "extras-scroll-container"
                                                );
                                            if (container) {
                                                container.scrollBy({
                                                    left: -300,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }}
                                    />
                                    <Button
                                        type="text"
                                        icon={<RightOutlined />}
                                        style={{
                                            position: "absolute",
                                            right: "-40px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background:
                                                "rgba(255, 255, 255, 0.9)",
                                            border: "1px solid #e8e8e8",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.1)",
                                            zIndex: 10,
                                        }}
                                        onClick={() => {
                                            const container =
                                                document.getElementById(
                                                    "extras-scroll-container"
                                                );
                                            if (container) {
                                                container.scrollBy({
                                                    left: 300,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Disclaimer */}
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: 48,
                                padding: "20px 32px",
                                background: "rgba(255, 193, 7, 0.08)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255, 193, 7, 0.15)",
                                maxWidth: "800px",
                                margin: "48px auto 0",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#856404",
                                    fontSize: "15px",
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                }}
                            >
                                📌 Extras are available only when a main
                                HospiPal service is booked.
                            </Text>
                        </div>
                    </div>
                )}

                {/* How It Works Section */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "64px 32px",
                        borderRadius: "24px",
                        marginBottom: 48,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                        border: "1px solid #f5f5f5",
                    }}
                    className="how-it-works-section"
                >
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <Title
                            level={2}
                            style={{ color: "#1a1a1a", marginBottom: 16 }}
                        >
                            How It Works (3 Steps)
                        </Title>
                        <Paragraph
                            style={{ color: "#666", fontSize: 18, margin: 0 }}
                        >
                            Simple and secure booking process for your peace of
                            mind.
                        </Paragraph>
                    </div>

                    {/* Steps Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                windowWidth >= 768
                                    ? "repeat(3, 1fr)"
                                    : "repeat(1, 1fr)",
                            gap: "32px",
                            maxWidth: "1000px",
                            margin: "0 auto",
                        }}
                        className="steps-grid"
                    >
                        {/* Step 1 */}
                        <div
                            style={{
                                textAlign: "center",
                                padding: "32px 24px",
                                background:
                                    "linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.1)",
                                position: "relative",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 4px 12px rgba(24, 144, 255, 0.3)",
                                }}
                            >
                                1
                            </div>
                            <Title
                                level={4}
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    marginBottom: "12px",
                                }}
                            >
                                Tap Book a HospiPal
                            </Title>
                            <Text
                                style={{
                                    color: "#666",
                                    fontSize: "15px",
                                    lineHeight: 1.5,
                                }}
                            >
                                Start your journey with a simple tap on our
                                booking button.
                            </Text>
                        </div>

                        {/* Step 2 */}
                        <div
                            style={{
                                textAlign: "center",
                                padding: "32px 24px",
                                background:
                                    "linear-gradient(135deg, rgba(82, 196, 26, 0.05) 0%, rgba(82, 196, 26, 0.02) 100%)",
                                borderRadius: "20px",
                                border: "1px solid rgba(82, 196, 26, 0.1)",
                                position: "relative",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background:
                                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 4px 12px rgba(82, 196, 26, 0.3)",
                                }}
                            >
                                2
                            </div>
                            <Title
                                level={4}
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    marginBottom: "12px",
                                }}
                            >
                                Choose Service → Enter Details
                            </Title>
                            <Text
                                style={{
                                    color: "#666",
                                    fontSize: "15px",
                                    lineHeight: 1.5,
                                }}
                            >
                                Select your service and provide hospital &
                                patient information.
                            </Text>
                        </div>

                        {/* Step 3 */}
                        <div
                            style={{
                                textAlign: "center",
                                padding: "32px 24px",
                                background:
                                    "linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(250, 173, 20, 0.02) 100%)",
                                borderRadius: "20px",
                                border: "1px solid rgba(250, 173, 20, 0.1)",
                                position: "relative",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background:
                                        "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 4px 12px rgba(250, 173, 20, 0.3)",
                                }}
                            >
                                3
                            </div>
                            <Title
                                level={4}
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    marginBottom: "12px",
                                }}
                            >
                                Pay Securely → Get Confirmation
                            </Title>
                            <Text
                                style={{
                                    color: "#666",
                                    fontSize: "15px",
                                    lineHeight: 1.5,
                                }}
                            >
                                Complete secure payment and receive booking ID
                                with HospiPal assignment.
                            </Text>
                        </div>
                    </div>

                    {/* Communication Notice */}
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
                            📌 You'll receive booking confirmations and updates
                            through our secure communication channels.
                        </Text>
                    </div>
                </div>

                {/* Why Families Trust HospiPal Section */}
                <div
                    style={{
                        background: "#f8f9fa",
                        padding: "64px 32px",
                        borderRadius: "24px",
                        marginBottom: 48,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                        border: "1px solid #e9ecef",
                    }}
                    className="trust-section"
                >
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <Title
                            level={2}
                            style={{ color: "#1a1a1a", marginBottom: 16 }}
                        >
                            Why Families Trust HospiPal
                        </Title>
                        <Paragraph
                            style={{ color: "#666", fontSize: 18, margin: 0 }}
                        >
                            Providing peace of mind when it matters most.
                        </Paragraph>
                    </div>

                    {/* Trust Points Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                windowWidth >= 1200
                                    ? "repeat(2, 1fr)"
                                    : windowWidth >= 768
                                    ? "repeat(2, 1fr)"
                                    : "repeat(1, 1fr)",
                            gap: "24px",
                            maxWidth: "1000px",
                            margin: "0 auto",
                        }}
                        className="trust-points-grid"
                    >
                        {/* Trust Point 1 */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                padding: "24px",
                                background: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e8e8e8",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            }}
                            className="trust-point"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background:
                                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#ffffff",
                                }}
                            >
                                🛡️
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        lineHeight: 1.4,
                                        marginBottom: "4px",
                                    }}
                                >
                                    Patients are never left alone
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Whether family is present or away, we ensure
                                    continuous support.
                                </Text>
                            </div>
                        </div>

                        {/* Trust Point 2 */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                padding: "24px",
                                background: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e8e8e8",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            }}
                            className="trust-point"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#ffffff",
                                }}
                            >
                                🤝
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        lineHeight: 1.4,
                                        marginBottom: "4px",
                                    }}
                                >
                                    Extra help for families at hospital
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Additional support for families already
                                    present at the hospital.
                                </Text>
                            </div>
                        </div>

                        {/* Trust Point 3 */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                padding: "24px",
                                background: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e8e8e8",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            }}
                            className="trust-point"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background:
                                        "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#ffffff",
                                }}
                            >
                                💙
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        lineHeight: 1.4,
                                        marginBottom: "4px",
                                    }}
                                >
                                    Relief from caregiver burnout
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Prevent compassion fatigue and provide
                                    much-needed respite.
                                </Text>
                            </div>
                        </div>

                        {/* Trust Point 4 */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                padding: "24px",
                                background: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e8e8e8",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            }}
                            className="trust-point"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background:
                                        "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#ffffff",
                                }}
                            >
                                📋
                            </div>
                            <div>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#1a1a1a",
                                        lineHeight: 1.4,
                                        marginBottom: "4px",
                                    }}
                                >
                                    Clear scope: non-medical support only
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    We provide companion support only, medical
                                    care remains with hospital staff.
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer
                    style={{
                        background: "#1a1a1a",
                        padding: "32px 24px 24px",
                        marginTop: "48px",
                        color: "#ffffff",
                        width: "100vw",
                        marginLeft: "calc(-50vw + 50%)",
                        marginRight: "calc(-50vw + 50%)",
                        borderRadius: "24px 24px 0 0",
                        fontFamily:
                            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                    className="footer-section"
                >
                    <div
                        style={{
                            maxWidth: "1000px",
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        {/* Footer Links */}
                        <div
                            style={{
                                marginBottom: "24px",
                                paddingBottom: "20px",
                                borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.12)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "color 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                    }}
                                    className="footer-link"
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = "#ffffff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color =
                                            "rgba(255, 255, 255, 0.85)")
                                    }
                                >
                                    Terms & Conditions
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.4)",
                                        fontSize: "14px",
                                        fontWeight: 300,
                                    }}
                                >
                                    |
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "color 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                    }}
                                    className="footer-link"
                                    onClick={handlePrivacyPolicy}
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = "#ffffff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color =
                                            "rgba(255, 255, 255, 0.85)")
                                    }
                                >
                                    Privacy Policy
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.4)",
                                        fontSize: "14px",
                                        fontWeight: 300,
                                    }}
                                >
                                    |
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "color 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                    }}
                                    className="footer-link"
                                    onClick={handleBookingConsent}
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = "#ffffff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color =
                                            "rgba(255, 255, 255, 0.85)")
                                    }
                                >
                                    Booking Consent
                                </Text>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div
                            style={{
                                marginBottom: "24px",
                                paddingBottom: "20px",
                                borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.12)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "28px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.85)",
                                            fontSize: "15px",
                                        }}
                                    >
                                        📞
                                    </Text>
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.85)",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            letterSpacing: "0.02em",
                                        }}
                                    >
                                        99872 49625
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.85)",
                                            fontSize: "15px",
                                        }}
                                    >
                                        📧
                                    </Text>
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.85)",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            letterSpacing: "0.02em",
                                        }}
                                    >
                                        support@hospipalhealth.com
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div>
                            <Text
                                style={{
                                    color: "rgba(255, 255, 255, 0.5)",
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    letterSpacing: "0.01em",
                                }}
                            >
                                © HospiPal Health LLP
                            </Text>
                        </div>
                    </div>
                </footer>

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
