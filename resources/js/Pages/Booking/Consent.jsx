import React, { useState, useEffect } from "react";
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
    Checkbox,
    Collapse,
    Alert,
    Modal,
    Input,
    Form,
    message,
    Spin,
    Layout,
} from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    EyeOutlined,
    PhoneOutlined,
    SendOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;

export default function Consent({
    service,
    selectedExtras,
    date,
    time,
    consentSettings,
    selectedPricingTier,
    selectedDuration,
    selectedPrice,
    bookingSettings,
    auth,
}) {
    const [acceptedConsents, setAcceptedConsents] = useState([]);
    const [viewingConsent, setViewingConsent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Phone verification states
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [verificationCompleted, setVerificationCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phoneVerificationModal, setPhoneVerificationModal] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState(""); // For testing - store the OTP received from server

    // Check if user is already logged in (phone already verified)
    useEffect(() => {
        if (auth && auth.user && auth.user.phone_number) {
            setOtpVerified(true);
            setVerificationCompleted(true);
            setPhoneNumber(auth.user.phone_number);
        }

        // Test CSRF token on component mount
        testCsrfToken();
    }, [auth]);

    const handleBack = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        const extraQuantitiesData = selectedExtras.map((extra) => ({
            id: extra.id,
            quantity: extra.quantity || 1,
        }));
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

    const handleContinue = () => {
        const requiredConsents = consentSettings.filter(
            (consent) => consent.is_required
        );
        const allRequiredAccepted = requiredConsents.every((consent) =>
            acceptedConsents.includes(consent.id)
        );

        console.log("handleContinue called", {
            allRequiredAccepted,
            otpVerified,
            verificationCompleted,
            requiredConsents: requiredConsents.length,
            acceptedConsents: acceptedConsents.length,
        });

        if (!allRequiredAccepted) {
            message.error("Please accept all required agreements to continue");
            return;
        }

        // If all required consents are accepted but phone not verified, show phone verification
        if (
            requiredConsents.length > 0 &&
            !otpVerified &&
            !verificationCompleted
        ) {
            console.log("Showing phone verification modal");
            setPhoneVerificationModal(true);
            return;
        }

        // If verification is completed but otpVerified is false, set it to true
        if (verificationCompleted && !otpVerified) {
            setOtpVerified(true);
        }

        console.log("Proceeding to confirmation page");

        const extraIds = selectedExtras.map((extra) => extra.id);
        const extraQuantitiesData = selectedExtras.map((extra) => ({
            id: extra.id,
            quantity: extra.quantity || 1,
        }));
        const extraQuantitiesJson = encodeURIComponent(
            JSON.stringify(extraQuantitiesData)
        );
        const consentIds = acceptedConsents;

        const data = {
            service_id: service.id,
            pricing_tier_id: selectedPricingTier?.id,
            selected_duration:
                selectedPricingTier?.duration_minutes || service.duration,
            selected_price: selectedPricingTier?.price || service.price,
            extras: extraIds,
            extra_quantities_json: extraQuantitiesJson,
            date: date,
            time: time,
            consents: consentIds,
            gender_preference: window.location.search.includes(
                "gender_preference="
            )
                ? new URLSearchParams(window.location.search).get(
                      "gender_preference"
                  )
                : "no_preference",
        };

        // Include verified phone number if available
        if ((otpVerified || verificationCompleted) && phoneNumber) {
            data.verified_phone = phoneNumber;
        }

        console.log("Navigating to confirm page with data:", data);

        router.visit(route("booking.confirm"), {
            data: data,
        });
    };

    const handleViewConsent = (consent) => {
        setViewingConsent(consent);
        setIsModalVisible(true);
    };

    // Phone verification functions
    const handleConsentToggle = (consentId) => {
        setAcceptedConsents((prev) => {
            if (prev.includes(consentId)) {
                return prev.filter((id) => id !== consentId);
            } else {
                return [...prev, consentId];
            }
        });
    };

    // Debug function to test CSRF token
    const getCsrfToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (!token) {
            console.error("CSRF token not found in meta tag");
            message.error("CSRF token not found. Please refresh the page.");
            return null;
        }
        return token;
    };

    // Function to handle CSRF token errors
    const handleCsrfError = () => {
        message.error(
            "Session expired. Please refresh the page and try again."
        );
        // Optionally, you could automatically refresh the page here
        // window.location.reload();
    };

    // Test CSRF token function
    const testCsrfToken = async () => {
        const csrfToken = getCsrfToken();
        if (!csrfToken) return false;

        try {
            const response = await fetch(route("test-csrf"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                console.log("CSRF token is valid");
                return true;
            } else {
                console.error("CSRF token validation failed:", response.status);
                return false;
            }
        } catch (error) {
            console.error("Error testing CSRF token:", error);
            return false;
        }
    };

    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            message.error("Please enter a valid phone number");
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) return;

        try {
            setLoading(true);

            const response = await fetch(route("booking.send-otp"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                }),
            });

            if (!response.ok) {
                if (response.status === 419) {
                    handleCsrfError();
                    return;
                }
                const errorData = await response.json().catch(() => ({}));
                message.error(errorData.error || "Failed to send OTP");
                return;
            }

            const result = await response.json();

            message.success("OTP sent successfully to your phone number");
            setOtpSent(true);

            // For testing - store the OTP if it's returned by the server
            if (result.otp) {
                setReceivedOtp(result.otp);
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            message.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            message.error("Please enter a valid 6-digit OTP");
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) return;

        try {
            setLoading(true);

            const response = await fetch(route("customer.login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp,
                }),
            });

            if (!response.ok) {
                if (response.status === 419) {
                    handleCsrfError();
                    return;
                }
                const errorData = await response.json().catch(() => ({}));
                message.error(errorData.error || "Invalid OTP");
                return;
            }

            const result = await response.json();

            message.success("Phone number verified successfully!");

            // Set verification state BEFORE closing modal
            setOtpVerified(true);
            setVerificationCompleted(true);
            setPhoneVerificationModal(false);

            // Use the formatted phone number returned from the backend
            if (result.formatted_phone) {
                setPhoneNumber(result.formatted_phone);
            }

            // Update auth state if user data is returned
            if (result.user) {
                // Update the auth state locally instead of reloading
                // The header will update automatically when auth prop changes
            }

            // Now add the consent to accepted list
            const requiredConsents = consentSettings.filter(
                (c) => c.is_required
            );
            const pendingConsent = requiredConsents.find(
                (c) => !acceptedConsents.includes(c.id)
            );
            if (pendingConsent) {
                setAcceptedConsents((prev) => [...prev, pendingConsent.id]);
            }

            // Don't automatically proceed - let user click continue manually
            // The modal will close and user can click continue again
        } catch (error) {
            console.error("Error verifying OTP:", error);
            message.error("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneVerificationCancel = () => {
        setPhoneVerificationModal(false);
        setPhoneNumber("");
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setVerificationCompleted(false);
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

    const formatTime = (time) => {
        return dayjs(time, "HH:mm").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, MMMM D, YYYY");
    };

    const requiredConsents = consentSettings.filter(
        (consent) => consent.is_required
    );
    const optionalConsents = consentSettings.filter(
        (consent) => !consent.is_required
    );
    const allRequiredAccepted = requiredConsents.every((consent) =>
        acceptedConsents.includes(consent.id)
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title="Consent & Terms - Book Appointment" />

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
                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                                borderRadius: "20px",
                                padding: "32px 24px",
                                marginTop: 24,
                                border: "1px solid #e6f7ff",
                            }}
                        >
                            <Title
                                level={2}
                                style={{
                                    marginBottom: 16,
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Confirm & Secure Your Booking
                            </Title>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#595959",
                                    marginBottom: 24,
                                    display: "block",
                                }}
                            >
                                To make sure your booking is safe and personally
                                agreed by you, please:
                            </Text>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    maxWidth: 500,
                                    margin: "0 auto",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        background: "white",
                                        borderRadius: "12px",
                                        border: "1px solid #e6f7ff",
                                        boxShadow:
                                            "0 2px 8px rgba(24, 144, 255, 0.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "16px",
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        1
                                    </div>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: "#262626",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Review and agree to our terms
                                    </Text>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        background: "white",
                                        borderRadius: "12px",
                                        border: "1px solid #e6f7ff",
                                        boxShadow:
                                            "0 2px 8px rgba(24, 144, 255, 0.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "16px",
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        2
                                    </div>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: "#262626",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Verify your phone number to confirm
                                        consent
                                    </Text>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: 20,
                                    padding: "16px 20px",
                                    background: "rgba(82, 196, 26, 0.1)",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(82, 196, 26, 0.2)",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#52c41a",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        margin: 0,
                                    }}
                                >
                                    🛡️ This step protects you, your family, and
                                    your HospiPal journey
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 32 }}>
                        <Progress
                            percent={80}
                            showInfo={false}
                            strokeColor="#1890ff"
                            trailColor="#f0f0f0"
                        />
                        <div style={{ textAlign: "center", marginTop: 8 }}>
                            <Text type="secondary">Step 4 of 5</Text>
                        </div>
                    </div>

                    <Row gutter={[32, 32]}>
                        {/* Main Content */}
                        <Col xs={24} lg={16}>
                            {/* Required Consents */}
                            {requiredConsents.length > 0 && (
                                <Card
                                    style={{
                                        marginBottom: 24,
                                        borderRadius: "16px",
                                        boxShadow:
                                            "0 4px 20px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 24,
                                            padding: "16px 0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "12px",
                                                background:
                                                    "linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "16px",
                                            }}
                                        >
                                            <FileTextOutlined
                                                style={{
                                                    fontSize: 24,
                                                    color: "white",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Title
                                                level={4}
                                                style={{
                                                    margin: 0,
                                                    color: "#262626",
                                                }}
                                            >
                                                Required Agreements
                                            </Title>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 14 }}
                                            >
                                                Please review and accept these
                                                terms to continue
                                            </Text>
                                        </div>
                                    </div>

                                    {requiredConsents.map((consent) => {
                                        const isAccepted =
                                            acceptedConsents.includes(
                                                consent.id
                                            );

                                        return (
                                            <div
                                                key={consent.id}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems:
                                                            "flex-start",
                                                        padding: "24px",
                                                        border: isAccepted
                                                            ? "2px solid #52c41a"
                                                            : "2px solid #f0f0f0",
                                                        borderRadius: "16px",
                                                        backgroundColor:
                                                            isAccepted
                                                                ? "rgba(82, 196, 26, 0.05)"
                                                                : "white",
                                                        transition:
                                                            "all 0.3s ease",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {isAccepted && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                right: 0,
                                                                background:
                                                                    "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                                                color: "white",
                                                                padding:
                                                                    "4px 12px",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "bold",
                                                                borderBottomLeftRadius:
                                                                    "12px",
                                                            }}
                                                        >
                                                            ✓ ACCEPTED
                                                        </div>
                                                    )}

                                                    <Checkbox
                                                        checked={isAccepted}
                                                        onChange={() =>
                                                            handleConsentToggle(
                                                                consent.id
                                                            )
                                                        }
                                                        style={{
                                                            marginRight: 16,
                                                            marginTop: 4,
                                                        }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "flex-start",
                                                                marginBottom: 12,
                                                            }}
                                                        >
                                                            <Title
                                                                level={5}
                                                                style={{
                                                                    margin: 0,
                                                                    color: "#262626",
                                                                    fontSize:
                                                                        "16px",
                                                                }}
                                                            >
                                                                {consent.title}
                                                            </Title>
                                                            <Space>
                                                                <Tag
                                                                    color="red"
                                                                    style={{
                                                                        borderRadius:
                                                                            "6px",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    Required
                                                                </Tag>
                                                                <Button
                                                                    type="primary"
                                                                    size="small"
                                                                    icon={
                                                                        <EyeOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        handleViewConsent(
                                                                            consent
                                                                        )
                                                                    }
                                                                    style={{
                                                                        borderRadius:
                                                                            "8px",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    View
                                                                </Button>
                                                            </Space>
                                                        </div>
                                                        {consent.summary && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 14,
                                                                    lineHeight: 1.6,
                                                                    color: "#595959",
                                                                }}
                                                            >
                                                                {
                                                                    consent.summary
                                                                }
                                                            </Text>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Card>
                            )}

                            {/* Optional Consents */}
                            {optionalConsents.length > 0 && (
                                <Card>
                                    <Title
                                        level={4}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <FileTextOutlined
                                            style={{
                                                marginRight: 8,
                                                color: "#1890ff",
                                            }}
                                        />
                                        Optional Agreements
                                    </Title>

                                    {optionalConsents.map((consent) => {
                                        const isAccepted =
                                            acceptedConsents.includes(
                                                consent.id
                                            );

                                        return (
                                            <div
                                                key={consent.id}
                                                style={{ marginBottom: 16 }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems:
                                                            "flex-start",
                                                        padding: 16,
                                                        border: "1px solid #f0f0f0",
                                                        borderRadius: 8,
                                                        backgroundColor:
                                                            isAccepted
                                                                ? "#f6ffed"
                                                                : "white",
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={isAccepted}
                                                        onChange={() =>
                                                            handleConsentToggle(
                                                                consent.id
                                                            )
                                                        }
                                                        style={{
                                                            marginRight: 12,
                                                            marginTop: 2,
                                                        }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
                                                                marginBottom: 8,
                                                            }}
                                                        >
                                                            <Title
                                                                level={5}
                                                                style={{
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                {consent.title}
                                                            </Title>
                                                            <Space>
                                                                <Tag color="blue">
                                                                    Optional
                                                                </Tag>
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    icon={
                                                                        <EyeOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        handleViewConsent(
                                                                            consent
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </Button>
                                                            </Space>
                                                        </div>
                                                        {consent.summary && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 14,
                                                                }}
                                                            >
                                                                {
                                                                    consent.summary
                                                                }
                                                            </Text>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Card>
                            )}

                            {consentSettings.length === 0 && (
                                <Card>
                                    <Alert
                                        message="No consent documents available"
                                        description="There are no terms and conditions to review at this time."
                                        type="info"
                                        showIcon
                                    />
                                </Card>
                            )}
                        </Col>

                        {/* Sidebar - Summary */}
                        <Col xs={24} lg={8}>
                            <Card
                                style={{
                                    position: "sticky",
                                    top: 24,
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 24,
                                        padding: "16px 0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "12px",
                                            background:
                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "16px",
                                        }}
                                    >
                                        <CheckCircleOutlined
                                            style={{
                                                fontSize: 24,
                                                color: "white",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Title
                                            level={4}
                                            style={{
                                                margin: 0,
                                                color: "#262626",
                                            }}
                                        >
                                            Booking Summary
                                        </Title>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 14 }}
                                        >
                                            Review your booking details
                                        </Text>
                                    </div>
                                </div>

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
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
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
                                                extra.quantity || 1;
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
                                                                parseFloat(
                                                                    extra.price
                                                                ) * quantity
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

                                {/* Gender Preference Fee */}
                                {window.location.search.includes(
                                    "gender_preference="
                                ) &&
                                    new URLSearchParams(
                                        window.location.search
                                    ).get("gender_preference") !==
                                        "no_preference" && (
                                        <>
                                            <Divider
                                                style={{ margin: "12px 0" }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <Text>
                                                    +{" "}
                                                    {new URLSearchParams(
                                                        window.location.search
                                                    ).get(
                                                        "gender_preference"
                                                    ) === "male"
                                                        ? "Male"
                                                        : "Female"}{" "}
                                                    Preference
                                                </Text>
                                                <Text>
                                                    {formatPrice(
                                                        new URLSearchParams(
                                                            window.location.search
                                                        ).get(
                                                            "gender_preference"
                                                        ) === "male"
                                                            ? bookingSettings?.male_preference_fee ||
                                                                  0
                                                            : bookingSettings?.female_preference_fee ||
                                                                  0
                                                    )}
                                                </Text>
                                            </div>
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
                                        {formatPrice(
                                            (selectedPricingTier
                                                ? parseFloat(
                                                      selectedPricingTier.price
                                                  )
                                                : parseFloat(service.price)) +
                                                selectedExtras.reduce(
                                                    (sum, extra) => {
                                                        const quantity =
                                                            extra.quantity || 1;
                                                        return (
                                                            sum +
                                                            parseFloat(
                                                                extra.price
                                                            ) *
                                                                quantity
                                                        );
                                                    },
                                                    0
                                                ) +
                                                (window.location.search.includes(
                                                    "gender_preference="
                                                ) &&
                                                new URLSearchParams(
                                                    window.location.search
                                                ).get("gender_preference") !==
                                                    "no_preference"
                                                    ? new URLSearchParams(
                                                          window.location.search
                                                      ).get(
                                                          "gender_preference"
                                                      ) === "male"
                                                        ? bookingSettings?.male_preference_fee ||
                                                          0
                                                        : bookingSettings?.female_preference_fee ||
                                                          0
                                                    : 0)
                                        )}
                                    </Text>
                                </div>

                                {/* Appointment Details */}
                                <Divider style={{ margin: "16px 0" }} />
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">
                                        Appointment Date
                                    </Text>
                                    <div>
                                        <Text strong>{formatDate(date)}</Text>
                                    </div>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">
                                        Appointment Time
                                    </Text>
                                    <div>
                                        <Text strong>{formatTime(time)}</Text>
                                    </div>
                                </div>

                                {/* Consent Status */}
                                <Divider style={{ margin: "16px 0" }} />
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">
                                        Required Agreements
                                    </Text>
                                    <div>
                                        <Text
                                            strong
                                            style={{
                                                color: allRequiredAccepted
                                                    ? "#52c41a"
                                                    : "#ff4d4f",
                                            }}
                                        >
                                            {
                                                acceptedConsents.filter((id) =>
                                                    requiredConsents.find(
                                                        (c) => c.id === id
                                                    )
                                                ).length
                                            }{" "}
                                            of {requiredConsents.length}{" "}
                                            accepted
                                        </Text>
                                    </div>
                                </div>

                                {/* Phone Verification Status */}
                                {requiredConsents.length > 0 && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Text type="secondary">
                                            Phone Verification
                                        </Text>
                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    color: otpVerified
                                                        ? "#52c41a"
                                                        : "#ff4d4f",
                                                }}
                                            >
                                                {otpVerified
                                                    ? "✓ Verified"
                                                    : "✗ Not Verified"}
                                            </Text>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ marginTop: 24 }}>
                                    <Button
                                        block
                                        style={{ marginBottom: 12 }}
                                        icon={<ArrowLeftOutlined />}
                                        onClick={handleBack}
                                    >
                                        Back to Date & Time
                                    </Button>
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        onClick={handleContinue}
                                        disabled={
                                            !allRequiredAccepted || loading
                                        }
                                        loading={loading}
                                    >
                                        {requiredConsents.length > 0 &&
                                        !otpVerified
                                            ? "Verify Phone Number"
                                            : "Verify & Confirm My Consent"}
                                    </Button>
                                </div>

                                {!allRequiredAccepted && (
                                    <Alert
                                        message="Required agreements not accepted"
                                        description="Please accept all required terms and conditions to continue."
                                        type="warning"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                )}

                                {allRequiredAccepted &&
                                    !otpVerified &&
                                    requiredConsents.length > 0 && (
                                        <Alert
                                            message="Phone verification required"
                                            description="Please verify your phone number to continue with the booking."
                                            type="warning"
                                            showIcon
                                            style={{ marginTop: 16 }}
                                        />
                                    )}

                                {allRequiredAccepted && otpVerified && (
                                    <Alert
                                        message="All requirements completed"
                                        description="You can now proceed to the confirmation page."
                                        type="success"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {/* Bottom Note */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 48,
                            padding: "32px 24px",
                            background:
                                "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                            borderRadius: "20px",
                            border: "1px solid #e6f7ff",
                            boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                maxWidth: 600,
                                margin: "0 auto",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background:
                                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "16px",
                                    flexShrink: 0,
                                }}
                            >
                                <span style={{ fontSize: 20, color: "white" }}>
                                    📌
                                </span>
                            </div>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "#262626",
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                By verifying, you agree to receive
                                booking-related updates and important
                                communication on this number. This helps us
                                serve you better.
                            </Text>
                        </div>
                    </div>

                    {/* Consent View Modal */}
                    <Modal
                        title={viewingConsent?.title}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={[
                            <Button
                                key="close"
                                onClick={() => setIsModalVisible(false)}
                            >
                                Close
                            </Button>,
                        ]}
                        width={800}
                    >
                        {viewingConsent && (
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    <Tag
                                        color={
                                            viewingConsent.is_required
                                                ? "red"
                                                : "blue"
                                        }
                                    >
                                        {viewingConsent.is_required
                                            ? "Required"
                                            : "Optional"}
                                    </Tag>
                                    <Text
                                        type="secondary"
                                        style={{ marginLeft: 8 }}
                                    >
                                        Version {viewingConsent.version}
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        maxHeight: 400,
                                        overflowY: "auto",
                                        padding: 16,
                                        border: "1px solid #f0f0f0",
                                        borderRadius: 8,
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <Paragraph
                                        style={{
                                            whiteSpace: "pre-line",
                                            margin: 0,
                                        }}
                                    >
                                        {viewingConsent.content}
                                    </Paragraph>
                                </div>
                            </div>
                        )}
                    </Modal>

                    {/* Phone Verification Modal */}
                    <Modal
                        title={
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "8px 0",
                                }}
                            >
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        backgroundColor: "#f0f8ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px",
                                        border: "2px solid #e6f7ff",
                                    }}
                                >
                                    <PhoneOutlined
                                        style={{
                                            fontSize: 28,
                                            color: "#1890ff",
                                        }}
                                    />
                                </div>
                                <Title
                                    level={3}
                                    style={{ margin: 0, color: "#262626" }}
                                >
                                    Phone Verification
                                </Title>
                            </div>
                        }
                        open={phoneVerificationModal}
                        onCancel={handlePhoneVerificationCancel}
                        footer={null}
                        width={480}
                        closable={!loading}
                        centered
                        style={{ top: 20 }}
                        styles={{ body: { padding: "32px 24px" } }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div style={{ marginBottom: 32 }}>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 16,
                                        lineHeight: 1.6,
                                        color: "#595959",
                                    }}
                                >
                                    {!otpSent
                                        ? "Enter your phone number to receive a verification code"
                                        : `We've sent a 6-digit code to ${phoneNumber}`}
                                </Text>

                                {/* For testing - show the OTP if available */}
                                {otpSent && receivedOtp && (
                                    <Alert
                                        message="Testing Mode - OTP Code"
                                        description={`Your verification code is: ${receivedOtp}`}
                                        type="info"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                )}
                            </div>

                            {!otpSent ? (
                                <div>
                                    <div style={{ marginBottom: 24 }}>
                                        <div
                                            style={{
                                                position: "relative",
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Input
                                                size="large"
                                                placeholder="+91 98765 43210"
                                                prefix={
                                                    <PhoneOutlined
                                                        style={{
                                                            color: "#bfbfbf",
                                                        }}
                                                    />
                                                }
                                                value={phoneNumber}
                                                onChange={(e) =>
                                                    setPhoneNumber(
                                                        e.target.value
                                                    )
                                                }
                                                style={{
                                                    height: 48,
                                                    fontSize: 16,
                                                    borderRadius: 8,
                                                    border: "1px solid #d9d9d9",
                                                }}
                                            />
                                        </div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            We'll send you a verification code
                                            via SMS
                                        </Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<SendOutlined />}
                                        onClick={handleSendOtp}
                                        loading={loading}
                                        disabled={
                                            !phoneNumber ||
                                            phoneNumber.length < 10
                                        }
                                        style={{
                                            height: 48,
                                            fontSize: 16,
                                            fontWeight: 500,
                                            borderRadius: 8,
                                            width: "100%",
                                            background:
                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            border: "none",
                                            boxShadow:
                                                "0 4px 12px rgba(24, 144, 255, 0.3)",
                                        }}
                                    >
                                        {loading
                                            ? "Sending..."
                                            : "Send Verification Code"}
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ marginBottom: 32 }}>
                                        <div
                                            style={{
                                                position: "relative",
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 8,
                                                marginBottom: 16,
                                            }}
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Enter 6-digit code"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value)
                                                }
                                                maxLength={6}
                                                style={{
                                                    position: "absolute",
                                                    opacity: 0,
                                                    zIndex: 10,
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                autoFocus
                                            />
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        width: 48,
                                                        height: 56,
                                                        border: "2px solid #d9d9d9",
                                                        borderRadius: 8,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: 20,
                                                        fontWeight: 600,
                                                        backgroundColor: otp[
                                                            index
                                                        ]
                                                            ? "#f6ffed"
                                                            : "#fafafa",
                                                        borderColor: otp[index]
                                                            ? "#52c41a"
                                                            : "#d9d9d9",
                                                        transition:
                                                            "all 0.2s ease",
                                                        cursor: "text",
                                                    }}
                                                >
                                                    {otp[index] || ""}
                                                </div>
                                            ))}
                                        </div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 14 }}
                                        >
                                            Enter the 6-digit verification code
                                        </Text>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                setOtpSent(false);
                                                setOtp("");
                                            }}
                                            disabled={loading}
                                            style={{
                                                height: 44,
                                                borderRadius: 8,
                                                border: "1px solid #d9d9d9",
                                                color: "#595959",
                                            }}
                                        >
                                            Change Number
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={handleVerifyOtp}
                                            loading={loading}
                                            disabled={!otp || otp.length !== 6}
                                            style={{
                                                height: 44,
                                                borderRadius: 8,
                                                background:
                                                    "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 12px rgba(82, 196, 26, 0.3)",
                                            }}
                                        >
                                            {loading
                                                ? "Verifying..."
                                                : "Verify Code"}
                                        </Button>
                                    </div>

                                    <div style={{ marginTop: 24 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Didn't receive the code?{" "}
                                            <Button
                                                type="link"
                                                size="small"
                                                style={{
                                                    padding: 0,
                                                    height: "auto",
                                                }}
                                                onClick={handleSendOtp}
                                                disabled={loading}
                                            >
                                                Resend
                                            </Button>
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
}
