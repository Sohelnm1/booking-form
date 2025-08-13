<<<<<<< HEAD
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
    Progress,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    SettingOutlined,
    DollarOutlined,
    TeamOutlined,
    AppstoreOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;

export default function AdminDashboard({ auth }) {
    const recentBookingsColumns = [
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
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `₹${amount}`,
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
                        View
                    </Button>
                    <Button size="small">Edit</Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Admin Dashboard" />
            <div>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Admin Dashboard
                    </Title>
                    <Text type="secondary">
                        Welcome back, {auth.user.name}! Manage your booking
                        platform
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
                                title="Total Revenue"
                                value={0}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                                suffix="₹"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Active Services"
                                value={0}
                                prefix={<AppstoreOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Employees"
                                value={0}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Recent Bookings"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    View All
                                </Button>
                            }
                        >
                            <Table
                                columns={recentBookingsColumns}
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
                                                No bookings yet
                                            </Title>
                                            <Text type="secondary">
                                                Bookings will appear here once
                                                customers start booking
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
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<AppstoreOutlined />}
                                >
                                    Manage Services
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<TeamOutlined />}
                                >
                                    Manage Employees
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
                                    icon={<SettingOutlined />}
                                >
                                    System Settings
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card title="Revenue Overview">
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <Progress
                                    type="circle"
                                    percent={0}
                                    format={() => "₹0"}
                                    size={120}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">
                                        Total revenue this month
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Booking Statistics">
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <Progress
                                    type="circle"
                                    percent={0}
                                    format={() => "0"}
                                    size={120}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">
                                        Bookings this month
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
}
=======
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
    Progress,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    SettingOutlined,
    DollarOutlined,
    TeamOutlined,
    AppstoreOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;

export default function AdminDashboard({ auth }) {
    const recentBookingsColumns = [
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
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `₹${amount}`,
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
                        View
                    </Button>
                    <Button size="small">Edit</Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Admin Dashboard" />
            <div>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Admin Dashboard
                    </Title>
                    <Text type="secondary">
                        Welcome back, {auth.user.name}! Manage your booking
                        platform
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
                                title="Total Revenue"
                                value={0}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                                suffix="₹"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Active Services"
                                value={0}
                                prefix={<AppstoreOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Employees"
                                value={0}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Recent Bookings"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    View All
                                </Button>
                            }
                        >
                            <Table
                                columns={recentBookingsColumns}
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
                                                No bookings yet
                                            </Title>
                                            <Text type="secondary">
                                                Bookings will appear here once
                                                customers start booking
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
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<AppstoreOutlined />}
                                >
                                    Manage Services
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<TeamOutlined />}
                                >
                                    Manage Employees
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
                                    icon={<SettingOutlined />}
                                >
                                    System Settings
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card title="Revenue Overview">
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <Progress
                                    type="circle"
                                    percent={0}
                                    format={() => "₹0"}
                                    size={120}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">
                                        Total revenue this month
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Booking Statistics">
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <Progress
                                    type="circle"
                                    percent={0}
                                    format={() => "0"}
                                    size={120}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">
                                        Bookings this month
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
}
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
