import React from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Button,
    Typography,
    Space,
    Descriptions,
    Divider,
    Result,
    Tag,
    Row,
    Col,
} from "antd";
import {
    CheckCircle,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    CreditCard,
    MessageCircle,
    MapPin,
    Bell,
} from "lucide-react";
import dayjs from "dayjs";
import BookingHeader from "../../Components/BookingHeader";
import Logo from "../../Components/Logo";

const { Title, Text, Paragraph } = Typography;

export default function Success({ booking, payment_id, auth }) {
    // Debug logging for booking data
    console.log("Success component - Booking data:", {
        bookingId: booking?.id,
        serviceName: booking?.service?.name,
        pricingTierId: booking?.pricing_tier_id,
        pricingTier: booking?.pricingTier,
        pricingTierName: booking?.pricingTier?.name,
        servicePrice: booking?.service?.price,
        pricingTierPrice: booking?.pricingTier?.price,
        pricingTierPriceParsed: parseFloat(booking?.pricingTier?.price),
        totalAmount: booking?.total_amount,
    });

    // If no booking data is provided, show a generic success message
    if (!booking) {
        return (
            <div>
                <Head title="Success" />
                <BookingHeader auth={auth} />
                <div
                    style={{
                        padding: "24px",
                        maxWidth: "800px",
                        margin: "0 auto",
                    }}
                >
                    <Card>
                        <Result
                            status="success"
                            icon={<CheckCircle size={24} />}
                            title="Success!"
                            subTitle="Your action has been completed successfully."
                            extra={[
                                <Button
                                    type="primary"
                                    key="home"
                                    onClick={() => (window.location.href = "/")}
                                >
                                    Back to Home
                                </Button>,
                            ]}
                        />
                    </Card>
                </div>
            </div>
        );
    }
    const formatTime = (time) => {
        return dayjs(time).format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("MMM DD, YYYY");
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).format("MMM DD, YYYY h:mm A");
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

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "success";
            case "pending":
                return "warning";
            case "completed":
                return "processing";
            case "cancelled":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <div>
            <Head title="Booking Confirmed" />

            <BookingHeader auth={auth} />

            <div
                style={{
                    padding: "24px",
                    maxWidth: "1000px",
                    margin: "0 auto",
                }}
            >
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
                                "linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)",
                            borderRadius: "20px",
                            padding: "32px 24px",
                            marginTop: 24,
                            border: "1px solid #b7eb8f",
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                boxShadow: "0 8px 25px rgba(82, 196, 26, 0.3)",
                            }}
                        >
                            <CheckCircle size={40} color="white" />
                        </div>
                        <Title
                            level={2}
                            style={{
                                marginBottom: 16,
                                background:
                                    "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Your HospiPal is Confirmed{" "}
                            <CheckCircle
                                size={20}
                                style={{
                                    verticalAlign: "middle",
                                    marginLeft: "8px",
                                }}
                            />
                        </Title>
                        <Text style={{ fontSize: 16, color: "#595959" }}>
                            Your booking has been successfully confirmed and
                            payment completed
                        </Text>
                    </div>
                </div>

                <Row gutter={[32, 32]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        <Card
                            style={{
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            {/* Booking Information */}
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
                                        width:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        height:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <Calendar
                                        size={
                                            window.innerWidth <= 768 ? 18 : 24
                                        }
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Booking Information
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Your HospiPal will be assigned shortly.
                                        Updates will be shared before your
                                        booking time.
                                    </Text>
                                </div>
                            </div>

                            <Descriptions
                                bordered
                                column={1}
                                size="small"
                                style={{ marginBottom: 24 }}
                            >
                                <Descriptions.Item label="HospiPal Booking ID">
                                    <Text strong>
                                        HP-
                                        {booking?.id
                                            ?.toString()
                                            .padStart(6, "0")}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Service">
                                    {booking?.service?.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Date & Time">
                                    <Space>
                                        <Calendar size={16} />
                                        {formatDateTime(
                                            booking?.appointment_time
                                        )}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Hospital">
                                    {booking?.hospital_name ||
                                        "To be confirmed"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Patient">
                                    {(() => {
                                        const parts = [booking?.customer?.name];
                                        if (booking?.patient_age)
                                            parts.push(booking.patient_age);
                                        if (booking?.patient_gender)
                                            parts.push(booking.patient_gender);
                                        return parts.join(" • ");
                                    })()}
                                </Descriptions.Item>
                                {booking?.extras &&
                                    booking.extras.length > 0 && (
                                        <Descriptions.Item label="Extras Added">
                                            {booking.extras.map(
                                                (extra, index) => (
                                                    <Tag
                                                        key={extra.id}
                                                        color="blue"
                                                        style={{
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        {extra.name}
                                                    </Tag>
                                                )
                                            )}
                                        </Descriptions.Item>
                                    )}
                            </Descriptions>

                            {/* Customer Information */}
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
                                        width:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        height:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <User
                                        size={
                                            window.innerWidth <= 768 ? 18 : 24
                                        }
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Customer Information
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Your contact details for booking updates
                                    </Text>
                                </div>
                            </div>

                            <Descriptions
                                bordered
                                column={1}
                                size="small"
                                style={{ marginBottom: 24 }}
                            >
                                <Descriptions.Item label="Name">
                                    <Space>
                                        <User size={16} />
                                        {booking?.customer?.name}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    <Space>
                                        <Phone size={16} />
                                        {booking?.customer?.phone_number}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <Space>
                                        <Mail size={16} />
                                        {booking?.customer?.email ||
                                            "Not provided"}
                                    </Space>
                                </Descriptions.Item>
                                {(booking?.pickup_location ||
                                    booking?.dropoff_location) && (
                                    <Descriptions.Item label="Pickup/Drop (if selected)">
                                        {booking?.pickup_location && (
                                            <div style={{ marginBottom: 8 }}>
                                                <Text strong>Pickup:</Text>{" "}
                                                {booking.pickup_location}
                                            </div>
                                        )}
                                        {booking?.dropoff_location && (
                                            <div>
                                                <Text strong>Drop-off:</Text>{" "}
                                                {booking.dropoff_location}
                                            </div>
                                        )}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            {/* Payment Information */}
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
                                        width:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        height:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <CreditCard
                                        size={
                                            window.innerWidth <= 768 ? 18 : 24
                                        }
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Payment Information
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Payment processed securely through
                                        Razorpay
                                    </Text>
                                </div>
                            </div>

                            <Descriptions
                                bordered
                                column={1}
                                size="small"
                                style={{ marginBottom: 24 }}
                            >
                                <Descriptions.Item label="Payment ID">
                                    {payment_id ||
                                        booking?.transaction_id ||
                                        "N/A"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Amount Paid">
                                    <Text
                                        strong
                                        style={{
                                            fontSize: "16px",
                                            color: "#52c41a",
                                        }}
                                    >
                                        ₹{booking?.total_amount}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Status">
                                    <Tag color="success">
                                        <CheckCircle
                                            size={12}
                                            style={{ marginRight: "4px" }}
                                        />
                                        Successful
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Important Information */}
                            <div
                                style={{
                                    marginBottom: 24,
                                    padding: "20px",
                                    background:
                                        "linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid #b7eb8f",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <CheckCircle
                                            size={16}
                                            color="#52c41a"
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            HospiPal companions provide
                                            non-medical support only
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <CheckCircle
                                            size={16}
                                            color="#52c41a"
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            Flexible rescheduling available
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <CheckCircle
                                            size={16}
                                            color="#52c41a"
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            Cancellations subject to booking
                                            policy
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            {/* Communication Confirmation */}
                            <div
                                style={{
                                    marginBottom: 24,
                                    padding: "20px",
                                    background:
                                        "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid #e9ecef",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                        }}
                                    >
                                        <Bell size={16} color="white" />
                                    </div>
                                    <Title
                                        level={5}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Communication Confirmation
                                    </Title>
                                </div>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#595959",
                                        marginBottom: 12,
                                    }}
                                >
                                    A confirmation has also been sent to you
                                    via:
                                </Text>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                                                fill="#262626"
                                            />
                                        </svg>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            WhatsApp
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <Mail size={16} />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            Email
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <MessageCircle size={16} />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            SMS
                                        </Text>
                                    </div>
                                </div>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#495057",
                                        marginTop: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    Please check your messages for quick access
                                    to booking details.
                                </Text>
                            </div>

                            {/* Contact Information */}
                            <div
                                style={{
                                    marginBottom: 24,
                                    padding: "20px",
                                    background:
                                        "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid #e9ecef",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                        }}
                                    >
                                        <Phone size={16} color="white" />
                                    </div>
                                    <Title
                                        level={5}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Need help with your booking?
                                    </Title>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <Phone size={16} />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            Call: +91 1234567890
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                                                fill="#262626"
                                            />
                                        </svg>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            WhatsApp: +91 1234567890
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <Mail size={16} />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#262626",
                                            }}
                                        >
                                            Email: support@hospipal.com
                                        </Text>
                                    </div>
                                </div>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#495057",
                                        marginTop: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    We're here to assist you anytime.
                                </Text>
                            </div>

                            {/* Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ width: "100%" }}
                                    onClick={() => (window.location.href = "/")}
                                >
                                    Add Extras to My Booking
                                </Button>
                                <Button
                                    size="large"
                                    style={{ width: "100%" }}
                                    onClick={() =>
                                        (window.location.href =
                                            "/customer/bookings")
                                    }
                                >
                                    Go to My Bookings
                                </Button>
                                <Button
                                    size="large"
                                    style={{ width: "100%" }}
                                    onClick={() => (window.location.href = "/")}
                                >
                                    Chat with HospiPal Support
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    {/* Sidebar */}
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
                                        width:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        height:
                                            window.innerWidth <= 768
                                                ? "40px"
                                                : "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <CheckCircle
                                        size={
                                            window.innerWidth <= 768 ? 20 : 24
                                        }
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: "#262626" }}
                                    >
                                        Booking Summary
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Your confirmed booking details
                                    </Text>
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text strong>{booking?.service?.name}</Text>
                                    <Text>₹{booking?.total_amount}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDateTime(booking?.appointment_time)}
                                </Text>
                            </div>

                            {booking?.extras && booking.extras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {booking.extras.map((extra) => {
                                        const quantity =
                                            extra.pivot?.quantity || 1;
                                        const totalPrice =
                                            parseFloat(extra.pivot.price) *
                                            quantity;
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
                                                    <Text>+ {extra.name}</Text>
                                                    <Text>
                                                        ₹{totalPrice.toFixed(2)}
                                                    </Text>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            <Divider style={{ margin: "16px 0" }} />
                            <div style={{ marginBottom: 8 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text strong>Total Amount</Text>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            color: "#52c41a",
                                        }}
                                    >
                                        ₹{booking?.total_amount}
                                    </Text>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: 16,
                                    padding: "12px",
                                    background: "rgba(82, 196, 26, 0.1)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(82, 196, 26, 0.2)",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#52c41a",
                                        textAlign: "center",
                                    }}
                                >
                                    <CheckCircle
                                        size={12}
                                        style={{
                                            marginRight: "4px",
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Payment Successful
                                </Text>
                            </div>
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
                            maxWidth: 800,
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
                            <MapPin
                                size={window.innerWidth <= 768 ? 16 : 20}
                                color="white"
                            />
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
                            By completing this booking, you agreed to HospiPal's
                            Terms & Conditions, Privacy Policy, and Booking
                            Consent. HospiPal Health provides trained,
                            non-medical companion support only. All medical
                            responsibility remains with hospital staff and
                            doctors.
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
