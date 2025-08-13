import React from "react";
import { Head, router } from "@inertiajs/react";
import { Card, Button, Typography, Space, Result, Alert } from "antd";
import {
    CloseCircleOutlined,
    HomeOutlined,
    ReloadOutlined,
    PhoneOutlined,
    MailOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";

const { Title, Text, Paragraph } = Typography;

export default function Failed({ error, booking_id }) {
    const handleGoHome = () => {
        router.visit(route("welcome"));
    };

    const handleTryAgain = () => {
        router.visit(route("booking.select-service"));
    };

    return (
        <AppLayout>
            <Head title="Payment Failed" />

            <div
                style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}
            >
                <Card>
                    <Result
                        status="error"
                        icon={<CloseCircleOutlined />}
                        title="Payment Failed"
                        subTitle={
                            error ||
                            "Your payment could not be processed. Please try again."
                        }
                        extra={[
                            <Button
                                type="primary"
                                key="home"
                                icon={<HomeOutlined />}
                                onClick={handleGoHome}
                            >
                                Go to Home
                            </Button>,
                            <Button
                                key="retry"
                                icon={<ReloadOutlined />}
                                onClick={handleTryAgain}
                            >
                                Try Again
                            </Button>,
                        ]}
                    />

                    <Alert
                        message="What went wrong?"
                        description="There could be several reasons for the payment failure. Please check your payment method and try again."
                        type="info"
                        showIcon
                        style={{ marginTop: 24 }}
                    />

                    <Card
                        title="Common Issues & Solutions"
                        style={{ marginTop: 24 }}
                        type="inner"
                    >
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ width: "100%" }}
                        >
                            <div>
                                <Title level={5}>Insufficient Funds</Title>
                                <Text type="secondary">
                                    Ensure your account has sufficient balance
                                    for the transaction.
                                </Text>
                            </div>

                            <div>
                                <Title level={5}>Card Expired</Title>
                                <Text type="secondary">
                                    Check if your card is still valid and not
                                    expired.
                                </Text>
                            </div>

                            <div>
                                <Title level={5}>Network Issues</Title>
                                <Text type="secondary">
                                    Poor internet connection can cause payment
                                    failures. Try again with a stable
                                    connection.
                                </Text>
                            </div>

                            <div>
                                <Title level={5}>Bank Restrictions</Title>
                                <Text type="secondary">
                                    Some banks may block online transactions.
                                    Contact your bank if the issue persists.
                                </Text>
                            </div>
                        </Space>
                    </Card>

                    <Card
                        title="Need Help?"
                        style={{ marginTop: 24 }}
                        type="inner"
                    >
                        <Space direction="vertical" size="small">
                            <Text>
                                <PhoneOutlined style={{ marginRight: 8 }} />
                                <strong>Call us:</strong> +91 1234567890
                            </Text>
                            <Text>
                                <MailOutlined style={{ marginRight: 8 }} />
                                <strong>Email us:</strong> support@hospipal.com
                            </Text>
                            <Text type="secondary">
                                Our support team is available Monday to
                                Saturday, 9 AM to 6 PM.
                            </Text>
                        </Space>
                    </Card>

                    {booking_id && (
                        <Alert
                            message="Booking Reference"
                            description={`Booking ID: ${booking_id}`}
                            type="warning"
                            showIcon
                            style={{ marginTop: 24 }}
                        />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
