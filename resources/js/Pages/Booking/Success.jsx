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
    CheckCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
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
                            icon={<CheckCircleOutlined />}
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
                            <CheckCircleOutlined
                                style={{ fontSize: 40, color: "white" }}
                            />
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
                            Your HospiPal is Confirmed ✅
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
                                    <CalendarOutlined
                                        style={{ fontSize: 24, color: "white" }}
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
                                        <CalendarOutlined />
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
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <UserOutlined
                                        style={{ fontSize: 24, color: "white" }}
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
                                        <UserOutlined />
                                        {booking?.customer?.name}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    <Space>
                                        <PhoneOutlined />
                                        {booking?.customer?.phone_number}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <Space>
                                        <MailOutlined />
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
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <CreditCardOutlined
                                        style={{ fontSize: 24, color: "white" }}
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
                                    <Tag color="success">✅ Successful</Tag>
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
                                        <CheckCircleOutlined
                                            style={{
                                                color: "#52c41a",
                                                fontSize: 16,
                                            }}
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
                                        <CheckCircleOutlined
                                            style={{
                                                color: "#52c41a",
                                                fontSize: 16,
                                            }}
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
                                        <CheckCircleOutlined
                                            style={{
                                                color: "#52c41a",
                                                fontSize: 16,
                                            }}
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
                                        "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid #bae7ff",
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
                                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 16,
                                                color: "white",
                                            }}
                                        >
                                            📲
                                        </span>
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
                                        <span style={{ fontSize: 16 }}>💬</span>
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
                                        <span style={{ fontSize: 16 }}>📧</span>
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
                                        <span style={{ fontSize: 16 }}>📩</span>
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
                                        color: "#1890ff",
                                        marginTop: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    👉 Please check your messages for quick
                                    access to booking details.
                                </Text>
                            </div>

                            {/* Contact Information */}
                            <div
                                style={{
                                    marginBottom: 24,
                                    padding: "20px",
                                    background:
                                        "linear-gradient(135deg, #fff7e6 0%, #fff2e8 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid #ffd591",
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
                                                "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 16,
                                                color: "white",
                                            }}
                                        >
                                            📞
                                        </span>
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
                                        <span style={{ fontSize: 16 }}>📞</span>
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
                                        <span style={{ fontSize: 16 }}>💬</span>
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
                                        <span style={{ fontSize: 16 }}>📧</span>
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
                                        color: "#fa8c16",
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
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <CheckCircleOutlined
                                        style={{ fontSize: 24, color: "white" }}
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
                                    ✅ Payment Successful
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
