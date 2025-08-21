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
                style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}
            >
                <Card>
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined />}
                        title="Booking Confirmed!"
                        subTitle="Your appointment has been successfully booked and payment completed."
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

                    <Divider />

                    {/* Payment Information */}
                    <Descriptions
                        title="Payment Information"
                        bordered
                        size="small"
                        style={{ marginBottom: 24 }}
                    >
                        <Descriptions.Item label="Payment Status">
                            <Tag color="success">Paid</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Method">
                            {booking?.payment_method || "Razorpay"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Transaction ID">
                            {payment_id || booking?.transaction_id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount Paid">
                            <Text strong style={{ fontSize: "16px" }}>
                                ₹{booking?.total_amount}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Customer Information */}
                    <Descriptions
                        title="Customer Information"
                        bordered
                        size="small"
                        style={{ marginBottom: 24 }}
                    >
                        <Descriptions.Item label="Name" span={2}>
                            <Space>
                                <UserOutlined />
                                {booking?.customer?.name}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email" span={2}>
                            <Space>
                                <MailOutlined />
                                {booking?.customer?.email}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone" span={2}>
                            <Space>
                                <PhoneOutlined />
                                {booking?.customer?.phone_number}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Booking Information */}
                    <Descriptions
                        title="Booking Information"
                        bordered
                        size="small"
                        style={{ marginBottom: 24 }}
                    >
                        <Descriptions.Item label="Service">
                            <div>
                                <Text>{booking?.service?.name}</Text>
                                {booking?.pricingTier && (
                                    <Tag
                                        color="blue"
                                        style={{ marginLeft: 8, fontSize: 10 }}
                                    >
                                        {booking.pricingTier.name}
                                    </Tag>
                                )}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Employee">
                            {booking?.employee?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date & Time">
                            <Space>
                                <CalendarOutlined />
                                {formatDateTime(booking?.appointment_time)}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">
                            <Space>
                                <ClockCircleOutlined />
                                {formatDuration(booking?.duration)}
                            </Space>
                        </Descriptions.Item>
                        {booking?.gender_preference &&
                            booking.gender_preference !== "no_preference" && (
                                <Descriptions.Item label="HospiPal Preference">
                                    <Space>
                                        <Text>
                                            {booking.gender_preference ===
                                            "male"
                                                ? "Male"
                                                : "Female"}{" "}
                                            HospiPal
                                        </Text>
                                        {booking.gender_preference_fee > 0 && (
                                            <Tag color="blue">
                                                +₹
                                                {booking.gender_preference_fee}
                                            </Tag>
                                        )}
                                    </Space>
                                </Descriptions.Item>
                            )}
                        <Descriptions.Item label="Status">
                            <Tag color={getStatusColor(booking?.status)}>
                                {booking?.status_text || booking?.status}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Extras */}
                    {booking?.extras && booking.extras.length > 0 && (
                        <Descriptions
                            title="Selected Extras"
                            bordered
                            size="small"
                            style={{ marginBottom: 24 }}
                        >
                            {booking.extras.map((extra) => {
                                const quantity = extra.pivot?.quantity || 1;
                                const totalPrice =
                                    parseFloat(extra.pivot.price) * quantity;
                                return (
                                    <Descriptions.Item
                                        key={extra.id}
                                        label={
                                            <div>
                                                {extra.name}
                                                {quantity > 1 && (
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 12,
                                                            marginLeft: 8,
                                                        }}
                                                    >
                                                        × {quantity}
                                                    </Text>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div>
                                            <div>₹{totalPrice.toFixed(2)}</div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                }}
                                            >
                                                {extra.duration_relation
                                                    ? extra.duration_relation
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
                                            </div>
                                        </div>
                                    </Descriptions.Item>
                                );
                            })}
                        </Descriptions>
                    )}

                    {/* Custom Field Responses */}
                    {booking?.form_responses &&
                        booking.form_responses.length > 0 && (
                            <Descriptions
                                title="Additional Information"
                                bordered
                                size="small"
                                style={{ marginBottom: 24 }}
                            >
                                {booking.form_responses
                                    .filter(
                                        (response) =>
                                            response.form_field &&
                                            !response.form_field.is_primary
                                    )
                                    .map((response) => (
                                        <Descriptions.Item
                                            key={response.id}
                                            label={response.form_field.label}
                                        >
                                            {response.formatted_value ||
                                                response.response_value ||
                                                "Not provided"}
                                        </Descriptions.Item>
                                    ))}
                            </Descriptions>
                        )}

                    {/* Important Notes */}
                    <Card
                        title="Important Information"
                        style={{ marginTop: 24 }}
                        type="inner"
                    >
                        <ul>
                            <li>
                                <Text>
                                    Please arrive 10 minutes before your
                                    scheduled appointment time.
                                </Text>
                            </li>
                            <li>
                                <Text>
                                    A confirmation SMS and email will be sent to
                                    your registered contact details.
                                </Text>
                            </li>
                            <li>
                                <Text>
                                    If you need to reschedule or cancel, please
                                    contact us at least 24 hours in advance.
                                </Text>
                            </li>
                            <li>
                                <Text>
                                    Please bring a valid ID proof for
                                    verification.
                                </Text>
                            </li>
                        </ul>
                    </Card>

                    {/* Contact Information */}
                    <Card
                        title="Contact Information"
                        style={{ marginTop: 24 }}
                        type="inner"
                    >
                        <Space direction="vertical" size="small">
                            <Text>
                                <strong>Phone:</strong> +91 1234567890
                            </Text>
                            <Text>
                                <strong>Email:</strong> support@hospipal.com
                            </Text>
                            <Text>
                                <strong>Address:</strong> 123 Healthcare Street,
                                Medical District, City - 123456
                            </Text>
                        </Space>
                    </Card>
                </Card>
            </div>
        </div>
    );
}
