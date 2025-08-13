<<<<<<< HEAD
import React from "react";
import { Head } from "@inertiajs/react";
import { Card, Row, Col, Typography, Button, Space, Statistic } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";

const { Title, Text } = Typography;

export default function CustomerDashboard({ auth }) {
    return (
        <AppLayout>
            <Head title="Customer Dashboard" />
            <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Welcome back, {auth.user.name}!
                    </Title>
                    <Text type="secondary">
                        Manage your appointments and book new services
                    </Text>
                </div>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Bookings"
                                value={0}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Upcoming"
                                value={0}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Completed"
                                value={0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Cancelled"
                                value={0}
                                valueStyle={{ color: "#ff4d4f" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Recent Bookings"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    New Booking
                                </Button>
                            }
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                }}
                            >
                                <CalendarOutlined
                                    style={{
                                        fontSize: 48,
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={4} type="secondary">
                                    No bookings yet
                                </Title>
                                <Text type="secondary">
                                    Start by booking your first appointment
                                </Text>
                                <div style={{ marginTop: 16 }}>
                                    <Button type="primary" size="large">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Quick Actions">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<PlusOutlined />}
                                >
                                    Book New Appointment
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<CalendarOutlined />}
                                >
                                    View All Bookings
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<UserOutlined />}
                                >
                                    Profile Settings
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    );
}
=======
import React from "react";
import { Head } from "@inertiajs/react";
import { Card, Row, Col, Typography, Button, Space, Statistic } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";

const { Title, Text } = Typography;

export default function CustomerDashboard({ auth }) {
    return (
        <AppLayout>
            <Head title="Customer Dashboard" />
            <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Welcome back, {auth.user.name}!
                    </Title>
                    <Text type="secondary">
                        Manage your appointments and book new services
                    </Text>
                </div>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Bookings"
                                value={0}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Upcoming"
                                value={0}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Completed"
                                value={0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Cancelled"
                                value={0}
                                valueStyle={{ color: "#ff4d4f" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Recent Bookings"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    New Booking
                                </Button>
                            }
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                }}
                            >
                                <CalendarOutlined
                                    style={{
                                        fontSize: 48,
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={4} type="secondary">
                                    No bookings yet
                                </Title>
                                <Text type="secondary">
                                    Start by booking your first appointment
                                </Text>
                                <div style={{ marginTop: 16 }}>
                                    <Button type="primary" size="large">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Quick Actions">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<PlusOutlined />}
                                >
                                    Book New Appointment
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<CalendarOutlined />}
                                >
                                    View All Bookings
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<UserOutlined />}
                                >
                                    Profile Settings
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    );
}
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
