import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Table,
    Typography,
    Tag,
    Row,
    Col,
    Statistic,
    Space,
    Button,
    Input,
    Select,
    DatePicker,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    DollarOutlined,
    SearchOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Configure dayjs plugins
dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function Customers({ auth, customers }) {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState(null);

    // Calculate statistics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
        (customer) => customer.is_active
    ).length;
    const totalBookings = customers.reduce(
        (sum, customer) => sum + (customer.customer_bookings_count || 0),
        0
    );
    const totalRevenue = customers.reduce(
        (sum, customer) =>
            sum + parseFloat(customer.customer_bookings_sum_total_amount || 0),
        0
    );

    // Filter customers based on search and filters
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.phone_number?.includes(searchText);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && customer.is_active) ||
            (statusFilter === "inactive" && !customer.is_active);

        const matchesDate =
            !dateFilter || dayjs(customer.created_at).isSame(dateFilter, "day");

        return matchesSearch && matchesStatus && matchesDate;
    });

    const customerColumns = [
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        {record.name || "N/A"}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        <MailOutlined style={{ marginRight: 4 }} />
                        {record.email || "No email"}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        <PhoneOutlined style={{ marginRight: 4 }} />
                        {record.phone_number || "No phone"}
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <Tag color={isActive ? "success" : "error"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Bookings",
            dataIndex: "customer_bookings_count",
            key: "bookings",
            render: (count) => (
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#1890ff",
                        }}
                    >
                        {count || 0}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Total Bookings
                    </Text>
                </div>
            ),
        },
        {
            title: "Total Spent",
            dataIndex: "customer_bookings_sum_total_amount",
            key: "total_spent",
            render: (amount) => (
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#52c41a",
                        }}
                    >
                        ${parseFloat(amount || 0).toFixed(2)}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Total Spent
                    </Text>
                </div>
            ),
        },
        {
            title: "Member Since",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {dayjs(date).format("MMM DD, YYYY")}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(date).fromNow()}
                    </Text>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => {
                            // TODO: Implement view customer details
                            console.log("View customer:", record.id);
                        }}
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Customer Management" />

            <div style={{ padding: "24px" }}>
                <Card>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <Title level={2} style={{ margin: 0 }}>
                            Customer Management
                        </Title>
                    </div>

                    {/* Statistics Row */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Total Customers"
                                    value={totalCustomers}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: "#1890ff" }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Active Customers"
                                    value={activeCustomers}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: "#52c41a" }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Total Bookings"
                                    value={totalBookings}
                                    prefix={<CalendarOutlined />}
                                    valueStyle={{ color: "#722ed1" }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Total Revenue"
                                    value={totalRevenue}
                                    prefix={<DollarOutlined />}
                                    precision={2}
                                    valueStyle={{ color: "#fa8c16" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Filters */}
                    <div style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Search
                                    placeholder="Search by name, email, or phone"
                                    allowClear
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    prefix={<SearchOutlined />}
                                />
                            </Col>
                            <Col span={4}>
                                <Select
                                    placeholder="Status"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    style={{ width: "100%" }}
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <DatePicker
                                    placeholder="Join Date"
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                    style={{ width: "100%" }}
                                    allowClear
                                />
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={customerColumns}
                        dataSource={filteredCustomers}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} customers`,
                        }}
                    />
                </Card>
            </div>
        </AdminLayout>
    );
}
