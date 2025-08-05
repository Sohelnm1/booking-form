import React from "react";
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
    Result,
    Descriptions,
    Alert,
} from "antd";
import {
    CheckCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    DownloadOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AppLayout from "../../Layouts/AppLayout";
import Logo from "../../Components/Logo";

const { Title, Text, Paragraph } = Typography;

export default function Success() {
    const handleGoHome = () => {
        router.visit(route("welcome"));
    };

    const handleNewBooking = () => {
        router.visit(route("booking.select-service"));
    };

    const handleDownloadReceipt = () => {
        // TODO: Implement receipt download
        console.log("Downloading receipt...");
    };

    const handleShareBooking = () => {
        // TODO: Implement sharing functionality
        if (navigator.share) {
            navigator.share({
                title: "My Appointment Booking",
                text: "I've successfully booked an appointment with HospiPal!",
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    // Mock booking data (in real app, this would come from the session or props)
    const bookingData = {
        booking_id:
            "BK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        service_name: "Consultation",
        appointment_date: dayjs().add(2, "day").format("YYYY-MM-DD"),
        appointment_time: "10:00",
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "+91 98765 43210",
        total_price: 1500.0,
        payment_status: "Paid",
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const formatTime = (time) => {
        return dayjs(time, "HH:mm").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, MMMM D, YYYY");
    };

    return (
        <AppLayout>
            <Head title="Booking Confirmed - HospiPal" />

            <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
                {/* Success Result */}
                <Result
                    status="success"
                    icon={
                        <CheckCircleOutlined
                            style={{ fontSize: 72, color: "#52c41a" }}
                        />
                    }
                    title="Booking Confirmed!"
                    subTitle={`Your appointment has been successfully booked. Booking ID: ${bookingData.booking_id}`}
                    extra={[
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={handleGoHome}
                            key="home"
                        >
                            Go to Home
                        </Button>,
                        <Button
                            size="large"
                            icon={<CalendarOutlined />}
                            onClick={handleNewBooking}
                            key="new"
                        >
                            Book Another
                        </Button>,
                    ]}
                />

                {/* Booking Details */}
                <Card style={{ marginTop: 32 }}>
                    <Title level={4} style={{ marginBottom: 16 }}>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Appointment Details
                    </Title>

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Booking ID">
                            <Tag color="blue" style={{ fontSize: 14 }}>
                                {bookingData.booking_id}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Service">
                            <Text strong>{bookingData.service_name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Appointment Date">
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            {formatDate(bookingData.appointment_date)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Appointment Time">
                            <ClockCircleOutlined style={{ marginRight: 8 }} />
                            {formatTime(bookingData.appointment_time)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Customer Name">
                            <Text>{bookingData.customer_name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <MailOutlined style={{ marginRight: 8 }} />
                            {bookingData.customer_email}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phone">
                            <PhoneOutlined style={{ marginRight: 8 }} />
                            {bookingData.customer_phone}
                        </Descriptions.Item>

                        <Descriptions.Item label="Total Amount">
                            <Text
                                strong
                                style={{ fontSize: 16, color: "#52c41a" }}
                            >
                                {formatPrice(bookingData.total_price)}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Payment Status">
                            <Tag color="green">
                                {bookingData.payment_status}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Next Steps */}
                <Card style={{ marginTop: 24 }}>
                    <Title level={4} style={{ marginBottom: 16 }}>
                        What's Next?
                    </Title>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Alert
                                message="Confirmation Email"
                                description="You'll receive a confirmation email with all the details shortly."
                                type="info"
                                showIcon
                                icon={<MailOutlined />}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Alert
                                message="Reminder SMS"
                                description="We'll send you a reminder SMS 24 hours before your appointment."
                                type="info"
                                showIcon
                                icon={<PhoneOutlined />}
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <Title level={5}>Important Information:</Title>
                    <ul style={{ paddingLeft: 20 }}>
                        <li>
                            <Text>
                                Please arrive 10 minutes before your scheduled
                                appointment time.
                            </Text>
                        </li>
                        <li>
                            <Text>
                                Bring a valid ID and any relevant medical
                                documents.
                            </Text>
                        </li>
                        <li>
                            <Text>
                                If you need to reschedule, please contact us at
                                least 24 hours in advance.
                            </Text>
                        </li>
                        <li>
                            <Text>
                                Face masks are recommended for in-person
                                appointments.
                            </Text>
                        </li>
                    </ul>
                </Card>

                {/* Action Buttons */}
                <Card style={{ marginTop: 24 }}>
                    <Row gutter={[16, 16]} justify="center">
                        <Col>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadReceipt}
                                size="large"
                            >
                                Download Receipt
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                icon={<ShareAltOutlined />}
                                onClick={handleShareBooking}
                                size="large"
                            >
                                Share Booking
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleNewBooking} size="large">
                                Book Another Appointment
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Contact Information */}
                <Card style={{ marginTop: 24 }}>
                    <Title level={4} style={{ marginBottom: 16 }}>
                        Need Help?
                    </Title>

                    <Row gutter={[24, 16]}>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                                <PhoneOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#1890ff",
                                        marginBottom: 8,
                                    }}
                                />
                                <div>
                                    <Text strong>Call Us</Text>
                                    <br />
                                    <Text type="secondary">
                                        +91 98765 43210
                                    </Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                                <MailOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#1890ff",
                                        marginBottom: 8,
                                    }}
                                />
                                <div>
                                    <Text strong>Email Us</Text>
                                    <br />
                                    <Text type="secondary">
                                        support@hospipal.com
                                    </Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                                <ClockCircleOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#1890ff",
                                        marginBottom: 8,
                                    }}
                                />
                                <div>
                                    <Text strong>Business Hours</Text>
                                    <br />
                                    <Text type="secondary">
                                        Mon-Sat: 9 AM - 6 PM
                                    </Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Footer */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 48,
                        padding: "24px 0",
                    }}
                >
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="medium"
                    />
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">
                            Thank you for choosing HospiPal for your healthcare
                            needs.
                        </Text>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
