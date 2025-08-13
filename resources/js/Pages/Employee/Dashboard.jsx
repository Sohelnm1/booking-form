import React from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Space,
    Statistic,
    Table,
    Tag,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";

const { Title, Text } = Typography;

export default function EmployeeDashboard({ auth }) {
    const columns = [
        {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
        },
        {
            title: "Service",
            dataIndex: "service_name",
            key: "service_name",
        },
        {
            title: "Date & Time",
            dataIndex: "appointment_time",
            key: "appointment_time",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "confirmed"
                            ? "green"
                            : status === "pending"
                            ? "orange"
                            : "red"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space>
                    <Button size="small" type="primary">
                        View Details
                    </Button>
                    <Button size="small">Update Status</Button>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Employee Dashboard" />
            <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Welcome, {auth.user.name}!
                    </Title>
                    <Text type="secondary">
                        Manage your assigned appointments and customer bookings
                    </Text>
                </div>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Assigned Bookings"
                                value={0}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Today's Appointments"
                                value={0}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Completed Today"
                                value={0}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Pending"
                                value={0}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card title="Today's Appointments">
                            <Table
                                columns={columns}
                                dataSource={[]}
                                pagination={false}
                                locale={{
                                    emptyText: (
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
                                                No appointments today
                                            </Title>
                                            <Text type="secondary">
                                                You have no assigned
                                                appointments for today
                                            </Text>
                                        </div>
                                    ),
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Quick Actions">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Button
                                    block
                                    size="large"
                                    icon={<CalendarOutlined />}
                                >
                                    View All Appointments
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<UserOutlined />}
                                >
                                    Profile Settings
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<ClockCircleOutlined />}
                                >
                                    Working Hours
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    );
}
