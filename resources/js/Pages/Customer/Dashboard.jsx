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
    Modal,
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
    BankOutlined,
    TrophyOutlined,
    StarOutlined,
} from "@ant-design/icons";
// Import Lucide React icons
import {
    Shield,
    Clock,
    MapPin,
    Heart,
    Users,
    Award,
    Star,
    Phone,
    Mail,
    MessageCircle,
    CheckCircle,
    BookOpen,
    Calendar,
    Globe,
    FileText,
    Lock,
    Zap,
    UserCheck,
    HandHeart,
    ClipboardList,
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BookingHeader from "../../Components/BookingHeader";
import CustomerLoginModal from "../../Components/CustomerLoginModal";
import DynamicSlot from "../../Components/DynamicSlot";

const { Title, Paragraph, Text } = Typography;

export default function CustomerDashboard({
    auth,
    services = [],
    extras = [],
    dynamicSlots = [],
}) {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );
    const [activeExtraCard, setActiveExtraCard] = useState(0); // Track which extra card is active
    // Modal state for service/extra details
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(""); // 'service' or 'extra'

    const showDetailModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setDetailModalVisible(true);
    };

    const hideDetailModal = () => {
        setDetailModalVisible(false);
        setSelectedItem(null);
        setModalType("");
    };

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
                showIndicators: false,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        } else if (windowWidth >= 768) {
            return {
                centerMode: true,
                centerSlidePercentage: 50,
                showArrows: true,
                showIndicators: false,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        } else {
            return {
                centerMode: false,
                centerSlidePercentage: 100,
                showArrows: true,
                showIndicators: false,
                infiniteLoop: true,
                autoPlay: true,
                interval: 5000,
            };
        }
    };

    const carouselSettings = getCarouselSettings();

    // Helper function to truncate text
    const truncateText = (text, maxLength = 80) => {
        if (!text) return "";
        const cleanText = text.replace(/<[^>]*>/g, "").trim();
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substring(0, maxLength) + "...";
    };

    // Handle extra card click
    const handleExtraCardClick = (index) => {
        setActiveExtraCard(index);
    };

    // Use services from database
    const servicesData = services || [];
    // Filter invalid/empty services to avoid blank cards
    const validServices = Array.isArray(servicesData)
        ? servicesData.filter((s) => {
              if (!s) return false;
              const hasName =
                  typeof s.name === "string" && s.name.trim().length > 1;
              const descOk =
                  s.description == null ||
                  (typeof s.description === "string" &&
                      s.description.replace(/<[^>]*>/g, "").trim().length >= 0);
              const isActive =
                  s.is_active === undefined ||
                  s.is_active === true ||
                  s.is_active === 1 ||
                  s.is_active === "1";
              return hasName && descOk && isActive;
          })
        : [];
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

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "24px 24px 0px",
                }}
            >
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
                                    height: windowWidth >= 768 ? 56 : 44,
                                    padding:
                                        windowWidth >= 768
                                            ? "0 32px"
                                            : "0 20px",
                                    fontSize: windowWidth >= 768 ? 16 : 16,
                                    fontWeight: 600,
                                    borderRadius: "12px",
                                    boxShadow:
                                        "0 6px 16px rgba(24, 144, 255, 0.25)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width:
                                        windowWidth >= 768 ? "240px" : "280px",
                                    minWidth:
                                        windowWidth >= 768 ? "240px" : "280px",
                                    maxWidth:
                                        windowWidth >= 768 ? "240px" : "280px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                                className="hero-primary-button"
                                onMouseEnter={(e) => {
                                    e.target.style.transform =
                                        "translateY(-2px)";
                                    e.target.style.boxShadow =
                                        "0 8px 24px rgba(24, 144, 255, 0.35)";
                                    e.target.style.background = "#40a9ff";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow =
                                        "0 6px 16px rgba(24, 144, 255, 0.25)";
                                    e.target.style.background = "#1890ff";
                                }}
                            >
                                Book a HospiPal
                            </Button>

                            {/* Secondary CTA - WhatsApp */}
                            <Button
                                type="default"
                                size="large"
                                onClick={handleChatWithUs}
                                style={{
                                    height: windowWidth >= 768 ? 56 : 44,
                                    padding:
                                        windowWidth >= 768
                                            ? "0 32px"
                                            : "0 20px",
                                    fontSize: windowWidth >= 768 ? 16 : 16,
                                    fontWeight: 600,
                                    borderRadius: "12px",
                                    border: "2px solid #25D366",
                                    color: "#25D366",
                                    background: "#ffffff",
                                    minWidth:
                                        windowWidth >= 768 ? "240px" : "280px",
                                    maxWidth:
                                        windowWidth >= 768 ? "240px" : "280px",
                                    transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow:
                                        "0 2px 8px rgba(37, 211, 102, 0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width:
                                        windowWidth >= 768 ? "240px" : "280px",
                                }}
                                className="hero-whatsapp-button"
                                onMouseEnter={(e) => {
                                    e.target.style.transform =
                                        "translateY(-2px)";
                                    e.target.style.boxShadow =
                                        "0 4px 12px rgba(37, 211, 102, 0.25)";
                                    e.target.style.background =
                                        "rgba(37, 211, 102, 0.05)";
                                    e.target.style.borderColor = "#22C55E";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow =
                                        "0 2px 8px rgba(37, 211, 102, 0.15)";
                                    e.target.style.background = "#ffffff";
                                    e.target.style.borderColor = "#25D366";
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 360 362"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ flexShrink: 0 }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M307.546 52.5655C273.709 18.685 228.706 0.0171895 180.756 0C81.951 0 1.53846 80.404 1.50408 179.235C1.48689 210.829 9.74646 241.667 25.4319 268.844L0 361.736L95.0236 336.811C121.203 351.096 150.683 358.616 180.679 358.625H180.756C279.544 358.625 359.966 278.212 360 179.381C360.017 131.483 341.392 86.4547 307.546 52.5741V52.5655ZM180.756 328.354H180.696C153.966 328.346 127.744 321.16 104.865 307.589L99.4242 304.358L43.034 319.149L58.0834 264.168L54.5423 258.53C39.6304 234.809 31.749 207.391 31.7662 179.244C31.8006 97.1036 98.6334 30.2707 180.817 30.2707C220.61 30.2879 258.015 45.8015 286.145 73.9665C314.276 102.123 329.755 139.562 329.738 179.364C329.703 261.513 262.871 328.346 180.756 328.346V328.354ZM262.475 216.777C257.997 214.534 235.978 203.704 231.869 202.209C227.761 200.713 224.779 199.966 221.796 204.452C218.814 208.939 210.228 219.029 207.615 222.011C205.002 225.002 202.389 225.372 197.911 223.128C193.434 220.885 179.003 216.158 161.891 200.902C148.578 189.024 139.587 174.362 136.975 169.875C134.362 165.389 136.7 162.965 138.934 160.739C140.945 158.728 143.412 155.505 145.655 152.892C147.899 150.279 148.638 148.406 150.133 145.423C151.629 142.432 150.881 139.82 149.764 137.576C148.646 135.333 139.691 113.287 135.952 104.323C132.316 95.5909 128.621 96.777 125.879 96.6309C123.266 96.5019 120.284 96.4762 117.293 96.4762C114.302 96.4762 109.454 97.5935 105.346 102.08C101.238 106.566 89.6691 117.404 89.6691 139.441C89.6691 161.478 105.716 182.785 107.959 185.776C110.202 188.767 139.544 234.001 184.469 253.408C195.153 258.023 203.498 260.782 210.004 262.845C220.731 266.257 230.494 265.776 238.212 264.624C246.816 263.335 264.71 253.786 268.44 243.326C272.17 232.866 272.17 223.893 271.053 222.028C269.936 220.163 266.945 219.037 262.467 216.794L262.475 216.777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Chat with Us
                            </Button>
                        </div>

                        {/* Trust Indicators - Professional symmetric cards */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    windowWidth >= 992
                                        ? "repeat(3, 1fr)"
                                        : windowWidth >= 768
                                        ? "repeat(3, 1fr)"
                                        : "repeat(1, 1fr)",
                                gap: windowWidth >= 768 ? 16 : 12,
                                width: "100%",
                                maxWidth: 1000,
                                margin: "0 auto",
                            }}
                        >
                            {[
                                {
                                    icon: <Shield size={20} color="#52c41a" />,
                                    title: "Secure global booking",
                                    caption:
                                        "Bank-grade security for every transaction",
                                },
                                {
                                    icon: <Zap size={20} color="#ff4d4f" />,
                                    title: "Instant confirmation",
                                    caption: "Get your booking ID in seconds",
                                },
                                {
                                    icon: <MapPin size={20} color="#1890ff" />,
                                    title: "Local care, delivered",
                                    caption:
                                        "Trusted HospiPals at your hospital",
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            windowWidth >= 768
                                                ? "center"
                                                : "flex-start",
                                        gap: 12,
                                        padding:
                                            windowWidth >= 768
                                                ? "14px 16px"
                                                : "12px 14px",
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
                                        border: "1px solid #eaeaea",
                                        borderRadius: 12,
                                        boxShadow:
                                            "0 2px 10px rgba(0,0,0,0.05)",
                                        minHeight: 64,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            background: "#ffffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "inset 0 0 0 1px rgba(0,0,0,0.06)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            textAlign: "left",
                                            alignItems:
                                                windowWidth >= 768
                                                    ? "center"
                                                    : "flex-start",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#1a1a1a",
                                                fontSize:
                                                    windowWidth >= 768
                                                        ? 16
                                                        : 15,
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#666",
                                                fontSize:
                                                    windowWidth >= 768
                                                        ? 13
                                                        : 12,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {item.caption}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dynamic Slots Section */}
                <DynamicSlot
                    dynamicSlots={dynamicSlots}
                    windowWidth={windowWidth}
                />

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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "rgba(24, 144, 255, 0.1)",
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
                                        color: "#1890ff",
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
                                    Trained & Verified Companions
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "rgba(24, 144, 255, 0.1)",
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
                                        color: "#1890ff",
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
                                    Transparent Pricing
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "rgba(24, 144, 255, 0.1)",
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
                                        color: "#1890ff",
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
                                    Flexible Rescheduling
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="trust-anchor-item"
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "rgba(24, 144, 255, 0.1)",
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
                                        color: "#1890ff",
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
                                    Global Booking. Local Care.
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
                        {/* OUR KEY BENEFITS Label */}
                        <div
                            style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                background: "transparent",
                                border: "1px solid #d9d9d9",
                                borderRadius: "20px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                }}
                            >
                                OUR SERVICES
                            </Text>
                        </div>
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
                            // minHeight: "320px",
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
                            centerMode={false}
                            centerSlidePercentage={
                                carouselSettings.centerSlidePercentage
                            }
                            selectedItem={0}
                            transitionTime={500}
                            width="100%"
                            className="services-carousel"
                        >
                            {validServices && validServices.length > 0 ? (
                                validServices.map((service, index) => (
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
                                                border: "2px dashed #d9d9d9",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                transition:
                                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                height: "280px",
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow:
                                                    "0 4px 12px rgba(0, 0, 0, 0.06)",
                                                position: "relative",
                                            }}
                                            hoverable
                                            className="service-card"
                                            bodyStyle={{
                                                padding: "24px",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* Service Icon */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "flex-start",
                                                    marginBottom: "16px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "12px",
                                                        background:
                                                            "rgba(24, 144, 255, 0.1)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        color: "#1890ff",
                                                        fontSize: "24px",
                                                    }}
                                                >
                                                    {index === 0 && (
                                                        <UserOutlined />
                                                    )}
                                                    {index === 1 && (
                                                        <BankOutlined />
                                                    )}
                                                    {index === 2 && (
                                                        <CheckCircleOutlined />
                                                    )}
                                                    {index === 3 && (
                                                        <TrophyOutlined />
                                                    )}
                                                    {index > 3 && (
                                                        <StarOutlined />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Service Content */}
                                            <div
                                                className="service-content"
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                {/* Service Title */}
                                                <Title
                                                    level={4}
                                                    className="service-title"
                                                    style={{
                                                        color: "#1a1a1a",
                                                        fontSize: "18px",
                                                        fontWeight: 700,
                                                        lineHeight: 1.3,
                                                        marginBottom: "12px",
                                                        textAlign: "left",
                                                        letterSpacing:
                                                            "-0.01em",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "100%",
                                                    }}
                                                    title={
                                                        service.name ||
                                                        "Service"
                                                    }
                                                >
                                                    {service.name || "Service"}
                                                </Title>

                                                {/* Service Description */}
                                                <div>
                                                    <Text
                                                        className="service-description"
                                                        style={{
                                                            color: "#4a4a4a",
                                                            fontSize: "14px",
                                                            lineHeight: 1.5,
                                                            textAlign: "left",
                                                            fontWeight: 400,
                                                            letterSpacing:
                                                                "0.01em",
                                                            overflow: "hidden",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            textOverflow:
                                                                "ellipsis",
                                                            maxHeight: "42px",
                                                        }}
                                                        title={
                                                            service.description &&
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
                                                                  } support for your needs.`
                                                        }
                                                    >
                                                        {truncateText(
                                                            service.description &&
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
                                                                  } support for your needs.`,
                                                            80
                                                        )}
                                                    </Text>
                                                    {((service.description &&
                                                        service.description
                                                            .replace(
                                                                /<[^>]*>/g,
                                                                ""
                                                            )
                                                            .trim().length >
                                                            80) ||
                                                        false) && (
                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDetailModal(
                                                                    service,
                                                                    "service"
                                                                );
                                                            }}
                                                            style={{
                                                                padding: 0,
                                                                marginTop: 8,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Read more
                                                        </Button>
                                                    )}
                                                </div>
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
                                        {validServices.length === 0
                                            ? "No services available at the moment. Please check back later."
                                            : "Loading services..."}
                                    </Text>
                                    {validServices.length === 0 && (
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 48,
                            padding: "24px 32px",
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "16px",
                            border: "1px solid rgba(24, 144, 255, 0.2)",
                            maxWidth: "800px",
                            margin: "48px auto 0",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "16px",
                                flexShrink: 0,
                                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                            }}
                        >
                            <MapPin size={16} color="white" />
                        </div>
                        <Text
                            style={{
                                color: "#1a1a1a",
                                fontSize: "15px",
                                lineHeight: 1.6,
                                fontWeight: 500,
                                margin: 0,
                            }}
                        >
                            HospiPals provide non-medical companion support
                            only. All medical/nursing care is handled by
                            hospital staff.
                        </Text>
                    </div>

                    {/* Final CTA */}
                    <div style={{ textAlign: "center", marginTop: 48 }}>
                        <Button
                            type="primary"
                            size="middle"
                            icon={<BookOutlined style={{ fontSize: 16 }} />}
                            onClick={handleBookAppointment}
                            style={{
                                background:
                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                border: "none",
                                height: windowWidth >= 768 ? 48 : 44,
                                padding:
                                    windowWidth >= 768 ? "0 32px" : "0 20px",
                                fontSize: 16,
                                fontWeight: 600,
                                borderRadius: "12px",
                                boxShadow: "0 6px 20px rgba(24, 144, 255, 0.2)",
                                width: windowWidth >= 768 ? "240px" : "280px",
                                minWidth:
                                    windowWidth >= 768 ? "240px" : "280px",
                                maxWidth:
                                    windowWidth >= 768 ? "240px" : "280px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition:
                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                            className="services-cta-button"
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow =
                                    "0 8px 24px rgba(24, 144, 255, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow =
                                    "0 6px 20px rgba(24, 144, 255, 0.2)";
                            }}
                        >
                            Book a HospiPal
                        </Button>

                        {/* Button Description */}
                        <div style={{ marginTop: 16 }}>
                            <Text
                                style={{
                                    color: "#666",
                                    fontSize: "14px",
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                }}
                            >
                                Quick booking • Secure payment • Instant
                                confirmation
                            </Text>
                        </div>
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
                            {/* EXTRAS Label */}
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "8px 16px",
                                    background: "transparent",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "20px",
                                    marginBottom: "16px",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#1a1a1a",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    EXTRAS
                                </Text>
                            </div>

                            <Title
                                level={2}
                                style={{
                                    color: "#1a1a1a",
                                    marginBottom: 16,
                                    fontSize:
                                        windowWidth >= 768 ? "2.5rem" : "2rem",
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                }}
                            >
                                Enhance your HospiPal experience
                            </Title>

                            <Paragraph
                                style={{
                                    color: "#666",
                                    fontSize: 18,
                                    margin: 0,
                                }}
                            >
                                Additional services to make your booking
                                smoother, safer, and stress-free.
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
                                        onClick={() =>
                                            handleExtraCardClick(index)
                                        }
                                        style={{
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
                                                activeExtraCard === index
                                                    ? "0 8px 24px rgba(24, 144, 255, 0.15)"
                                                    : "0 4px 12px rgba(0, 0, 0, 0.06)",
                                            flexShrink: 0,
                                            position: "relative",
                                        }}
                                        hoverable
                                        className={`extra-card ${
                                            activeExtraCard === index
                                                ? "active-extra"
                                                : ""
                                        }`}
                                        bodyStyle={{
                                            padding: "24px",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        {/* Extra Icon */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "12px",
                                                    background:
                                                        activeExtraCard ===
                                                        index
                                                            ? "rgba(24, 144, 255, 0.15)"
                                                            : "rgba(24, 144, 255, 0.1)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color:
                                                        activeExtraCard ===
                                                        index
                                                            ? "#1890ff"
                                                            : "#1890ff",
                                                    fontSize: "24px",
                                                }}
                                            >
                                                <Star size={24} />
                                            </div>
                                        </div>

                                        {/* Extra Content */}
                                        <div
                                            className="extra-content"
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* Extra Title */}
                                            <Title
                                                level={5}
                                                className="extra-title"
                                                style={{
                                                    color: "#1a1a1a",
                                                    fontSize: "18px",
                                                    fontWeight: 700,
                                                    lineHeight: 1.3,
                                                    marginBottom: "12px",
                                                    textAlign: "left",
                                                    letterSpacing: "-0.01em",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "100%",
                                                }}
                                                title={extra.name || "Extra"}
                                            >
                                                {extra.name || "Extra"}
                                            </Title>

                                            {/* Extra Description */}
                                            {extra.description &&
                                                extra.description.trim() !==
                                                    "" && (
                                                    <div>
                                                        <Text
                                                            className="extra-description"
                                                            style={{
                                                                color: "#4a4a4a",
                                                                fontSize:
                                                                    "14px",
                                                                lineHeight: 1.5,
                                                                textAlign:
                                                                    "left",
                                                                fontWeight: 400,
                                                                letterSpacing:
                                                                    "0.01em",
                                                                marginBottom:
                                                                    "16px",
                                                                overflow:
                                                                    "hidden",
                                                                display:
                                                                    "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                maxHeight:
                                                                    "42px",
                                                            }}
                                                            title={extra.description
                                                                .replace(
                                                                    /<[^>]*>/g,
                                                                    ""
                                                                )
                                                                .trim()}
                                                        >
                                                            {truncateText(
                                                                extra.description,
                                                                80
                                                            )}
                                                        </Text>
                                                        {extra.description &&
                                                            extra.description
                                                                .replace(
                                                                    /<[^>]*>/g,
                                                                    ""
                                                                )
                                                                .trim().length >
                                                                80 && (
                                                                <Button
                                                                    type="link"
                                                                    size="small"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        showDetailModal(
                                                                            extra,
                                                                            "extra"
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        padding: 0,
                                                                        marginTop: 4,
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Read more
                                                                </Button>
                                                            )}
                                                    </div>
                                                )}

                                            {/* Extra Price removed on landing page cards */}
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
                                Extras are available only when a main HospiPal
                                service is booked.
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
                        {/* HOW IT WORKS Label */}
                        <div
                            style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                background: "transparent",
                                border: "1px solid #d9d9d9",
                                borderRadius: "20px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                }}
                            >
                                HOW IT WORKS
                            </Text>
                        </div>

                        <Title
                            level={2}
                            style={{
                                color: "#1a1a1a",
                                marginBottom: 16,
                                fontSize:
                                    windowWidth >= 768 ? "2.5rem" : "2rem",
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                        >
                            Simple 3-step booking process
                        </Title>

                        <Paragraph
                            style={{ color: "#666", fontSize: 18, margin: 0 }}
                        >
                            Quick and secure booking for your peace of mind.
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                position: "relative",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#1890ff",
                                    fontWeight: "bold",
                                    border: "2px solid rgba(24, 144, 255, 0.3)",
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                position: "relative",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#1890ff",
                                    fontWeight: "bold",
                                    border: "2px solid rgba(24, 144, 255, 0.3)",
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
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "20px",
                                border: "1px solid rgba(24, 144, 255, 0.2)",
                                position: "relative",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                            }}
                            className="step-card"
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px auto",
                                    fontSize: "24px",
                                    color: "#1890ff",
                                    fontWeight: "bold",
                                    border: "2px solid rgba(24, 144, 255, 0.3)",
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
                            You'll receive booking confirmations and updates
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
                        {/* WHY FAMILIES TRUST Label */}
                        <div
                            style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                background: "transparent",
                                border: "1px solid #d9d9d9",
                                borderRadius: "20px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#1a1a1a",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                }}
                            >
                                WHY FAMILIES TRUST
                            </Text>
                        </div>

                        <Title
                            level={2}
                            style={{
                                color: "#1a1a1a",
                                marginBottom: 16,
                                fontSize:
                                    windowWidth >= 768 ? "2.5rem" : "2rem",
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
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
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#1890ff",
                                }}
                            >
                                <Shield size={20} />
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
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#1890ff",
                                }}
                            >
                                <Users size={20} />
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
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#1890ff",
                                }}
                            >
                                <Heart size={20} />
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
                                    background: "rgba(24, 144, 255, 0.1)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    fontSize: "20px",
                                    color: "#1890ff",
                                }}
                            >
                                <ClipboardList size={20} />
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
                                marginBottom: "20px",
                                paddingBottom: "16px",
                                borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.15)",
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
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                    className="footer-link"
                                    onMouseEnter={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.25)";
                                        e.target.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.05)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.1)";
                                        e.target.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Terms & Conditions
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(24, 144, 255, 0.4)",
                                        fontSize: "14px",
                                        fontWeight: 300,
                                    }}
                                >
                                    |
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                    className="footer-link"
                                    onClick={handlePrivacyPolicy}
                                    onMouseEnter={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.25)";
                                        e.target.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.05)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.1)";
                                        e.target.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Privacy Policy
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(24, 144, 255, 0.4)",
                                        fontSize: "14px",
                                        fontWeight: 300,
                                    }}
                                >
                                    |
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                    className="footer-link"
                                    onClick={handleBookingConsent}
                                    onMouseEnter={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.25)";
                                        e.target.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.05)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.1)";
                                        e.target.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Booking Consent
                                </Text>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div
                            style={{
                                marginBottom: "20px",
                                paddingBottom: "16px",
                                borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.15)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "32px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "10px 16px",
                                        borderRadius: "10px",
                                        background: "rgba(255, 255, 255, 0.08)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.12)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.25)";
                                        e.target.style.transform =
                                            "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.08)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.target.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "6px",
                                            background:
                                                "rgba(255, 255, 255, 0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            color: "#ffffff",
                                        }}
                                    >
                                        <Phone size={16} />
                                    </div>
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "14px",
                                            fontWeight: 600,
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
                                        gap: "10px",
                                        padding: "10px 16px",
                                        borderRadius: "10px",
                                        background: "rgba(255, 255, 255, 0.08)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.12)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.25)";
                                        e.target.style.transform =
                                            "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "rgba(255, 255, 255, 0.08)";
                                        e.target.style.borderColor =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.target.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "6px",
                                            background:
                                                "rgba(255, 255, 255, 0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            color: "#ffffff",
                                        }}
                                    >
                                        <Mail size={16} />
                                    </div>
                                    <Text
                                        style={{
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "14px",
                                            fontWeight: 600,
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
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    letterSpacing: "0.01em",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    display: "inline-block",
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

                {/* Service/Extra Detail Modal */}
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
                                    borderRadius: 8,
                                    background:
                                        modalType === "service"
                                            ? "rgba(24, 144, 255, 0.1)"
                                            : "rgba(82, 196, 26, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color:
                                        modalType === "service"
                                            ? "#1890ff"
                                            : "#52c41a",
                                }}
                            >
                                {modalType === "service" ? (
                                    <UserOutlined />
                                ) : (
                                    <Star size={20} />
                                )}
                            </div>
                            <span style={{ fontSize: 18, fontWeight: 600 }}>
                                {selectedItem?.name || "Details"}
                            </span>
                        </div>
                    }
                    open={detailModalVisible}
                    onCancel={hideDetailModal}
                    footer={null}
                    width={windowWidth >= 768 ? 600 : "90%"}
                    style={{ top: 20 }}
                >
                    {selectedItem && (
                        <div style={{ padding: "8px 0" }}>
                            {/* Description */}
                            <div style={{ marginBottom: 24 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        marginBottom: 8,
                                        display: "block",
                                    }}
                                >
                                    Description
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        color: "#4a4a4a",
                                    }}
                                >
                                    {selectedItem.description
                                        ? selectedItem.description
                                              .replace(/<[^>]*>/g, "")
                                              .trim()
                                        : `Professional ${selectedItem.name} support for your needs.`}
                                </Text>
                            </div>

                            {/* Pricing & Duration */}
                            <div
                                style={{
                                    background: "#f8f9fa",
                                    padding: 16,
                                    borderRadius: 12,
                                    border: "1px solid #e9ecef",
                                    marginBottom: 24,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        marginBottom: 12,
                                        display: "block",
                                    }}
                                >
                                    Pricing & Duration
                                </Text>

                                {modalType === "service" ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#666",
                                                }}
                                            >
                                                Base Price:
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    color: "#1890ff",
                                                }}
                                            >
                                                ₹
                                                {selectedItem.price
                                                    ? parseFloat(
                                                          selectedItem.price
                                                      ).toFixed(2)
                                                    : "Contact for pricing"}
                                            </Text>
                                        </div>
                                        {selectedItem.duration && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#666",
                                                    }}
                                                >
                                                    Duration:
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {selectedItem.duration}{" "}
                                                    hours
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#666",
                                                }}
                                            >
                                                Price:
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    color: "#52c41a",
                                                }}
                                            >
                                                ₹
                                                {selectedItem.price
                                                    ? parseFloat(
                                                          selectedItem.price
                                                      ).toFixed(2)
                                                    : "Contact for pricing"}
                                            </Text>
                                        </div>
                                        {selectedItem.duration && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#666",
                                                    }}
                                                >
                                                    Duration:
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {selectedItem.duration}{" "}
                                                    hours
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Additional Info */}
                            {selectedItem.additional_info && (
                                <div style={{ marginBottom: 24 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            marginBottom: 8,
                                            display: "block",
                                        }}
                                    >
                                        Additional Information
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.6,
                                            color: "#4a4a4a",
                                        }}
                                    >
                                        {selectedItem.additional_info}
                                    </Text>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button onClick={hideDetailModal}>Close</Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        hideDetailModal();
                                        handleBookAppointment();
                                    }}
                                    icon={<BookOutlined />}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
