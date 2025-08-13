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
import AppLayout from "../../Layouts/AppLayout";
import Logo from "../../Components/Logo";

const { Title, Text, Paragraph } = Typography;

export default function Success({ booking, payment_id }) {
    const formatTime = (time) => {
        return dayjs(time).format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("MMM DD, YYYY");
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).format("MMM DD, YYYY h:mm A");
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
        <AppLayout>
            <Head title="Booking Confirmed" />

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
                            {booking?.service?.name}
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
                                {booking?.duration} minutes
                            </Space>
                        </Descriptions.Item>
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
                            {booking.extras.map((extra) => (
                                <Descriptions.Item
                                    key={extra.id}
                                    label={extra.name}
                                >
                                    ₹{extra.pivot.price}
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
        </AppLayout>
    );
}
