import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Space,
    DatePicker,
    Select,
    Button,
    Table,
    Progress,
    Badge,
    Divider,
} from "antd";
import {
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    TrendingUpOutlined,
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function RefundAnalytics({ auth, analytics, refunds, charts }) {
    const [dateRange, setDateRange] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDate = (date) => {
        return dayjs(date).format("MMM DD, YYYY");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "processed":
                return "success";
            case "failed":
                return "error";
            case "not_applicable":
                return "default";
            default:
                return "default";
        }
    };

    const analyticsColumns = [
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text strong>{record.customer.name}</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.customer.email}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Service",
            key: "service",
            render: (_, record) => <Text>{record.service.name}</Text>,
        },
        {
            title: "Amount",
            key: "amount",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Original: {formatCurrency(record.total_amount)}
                    </Text>
                    <Text strong style={{ color: "#52c41a" }}>
                        Refund: {formatCurrency(record.refund_amount)}
                    </Text>
                    {record.cancellation_fee_charged > 0 && (
                        <Text
                            type="secondary"
                            style={{ fontSize: "12px", color: "#ff4d4f" }}
                        >
                            Fee:{" "}
                            {formatCurrency(record.cancellation_fee_charged)}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Badge
                    status={getStatusColor(record.refund_status)}
                    text={record.refund_status_text || record.refund_status}
                />
            ),
        },
        {
            title: "Date",
            key: "date",
            render: (_, record) => (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                    {formatDate(record.cancelled_at)}
                </Text>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Refund Analytics" />

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
                            <BarChartOutlined style={{ marginRight: 8 }} />
                            Refund Analytics
                        </Title>
                        <Space>
                            <RangePicker
                                value={dateRange}
                                onChange={setDateRange}
                                placeholder={["Start Date", "End Date"]}
                            />
                            <Select
                                placeholder="Filter by Status"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                style={{ width: 150 }}
                            >
                                <Option value="all">All Status</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="processed">Processed</Option>
                                <Option value="failed">Failed</Option>
                            </Select>
                            <Button
                                type="primary"
                                icon={<BarChartOutlined />}
                                onClick={() => {
                                    setDateRange(null);
                                    setStatusFilter("all");
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Space>
                    </div>

                    {/* Key Metrics */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={6}>
                            <Card size="small">
                                <Statistic
                                    title="Total Refunds"
                                    value={analytics.total_refunds}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: "#1890ff" }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    All time refunds
                                </Text>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Statistic
                                    title="Pending Refunds"
                                    value={analytics.pending_refunds}
                                    prefix={<ClockCircleOutlined />}
                                    valueStyle={{ color: "#faad14" }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Awaiting processing
                                </Text>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Statistic
                                    title="Processed Refunds"
                                    value={analytics.processed_refunds}
                                    prefix={<CheckCircleOutlined />}
                                    valueStyle={{ color: "#52c41a" }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Successfully processed
                                </Text>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small">
                                <Statistic
                                    title="Total Refund Amount"
                                    value={analytics.total_refund_amount}
                                    prefix="₹"
                                    valueStyle={{ color: "#52c41a" }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Total amount refunded
                                </Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Processing Rate and Trends */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={12}>
                            <Card size="small" title="Refund Processing Rate">
                                <Progress
                                    percent={analytics.processing_rate}
                                    status="active"
                                    strokeColor={{
                                        "0%": "#108ee9",
                                        "100%": "#87d068",
                                    }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    {analytics.processed_refunds} of{" "}
                                    {analytics.total_refunds} refunds processed
                                </Text>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" title="Average Processing Time">
                                <Statistic
                                    title="Days"
                                    value={analytics.avg_processing_days || 0}
                                    prefix={<ClockCircleOutlined />}
                                    valueStyle={{ color: "#1890ff" }}
                                />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Average time to process refunds
                                </Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Monthly Trends */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={12}>
                            <Card size="small" title="Monthly Refund Trends">
                                <div
                                    style={{
                                        height: 200,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text type="secondary">
                                        Chart will be implemented here
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                size="small"
                                title="Refund Status Distribution"
                            >
                                <div
                                    style={{
                                        height: 200,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text type="secondary">
                                        Pie chart will be implemented here
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Top Services by Refunds */}
                    <Card
                        size="small"
                        title="Top Services by Refund Amount"
                        style={{ marginBottom: 24 }}
                    >
                        <Table
                            columns={[
                                {
                                    title: "Service",
                                    key: "service",
                                    render: (_, record) => (
                                        <Text strong>
                                            {record.service_name}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Refund Count",
                                    key: "count",
                                    render: (_, record) => (
                                        <Text>{record.refund_count}</Text>
                                    ),
                                },
                                {
                                    title: "Total Refund Amount",
                                    key: "amount",
                                    render: (_, record) => (
                                        <Text
                                            strong
                                            style={{ color: "#52c41a" }}
                                        >
                                            {formatCurrency(
                                                record.total_refund_amount
                                            )}
                                        </Text>
                                    ),
                                },
                                {
                                    title: "Percentage",
                                    key: "percentage",
                                    render: (_, record) => (
                                        <Progress
                                            percent={record.percentage}
                                            size="small"
                                            showInfo={false}
                                        />
                                    ),
                                },
                            ]}
                            dataSource={analytics.top_services || []}
                            pagination={false}
                            size="small"
                        />
                    </Card>

                    {/* Recent Refunds */}
                    <Card size="small" title="Recent Refunds">
                        <Table
                            columns={analyticsColumns}
                            dataSource={refunds}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} refunds`,
                            }}
                            size="small"
                        />
                    </Card>
                </Card>
            </div>
        </AdminLayout>
    );
}
