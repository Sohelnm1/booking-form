import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Table,
    Tag,
    Typography,
    Space,
    Button,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Statistic,
    Progress,
    Badge,
    message,
    Tooltip,
    Modal,
    Descriptions,
    Divider,
} from "antd";
import {
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    DownloadOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import RefundModal from "../../Components/RefundModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default function Refunds({ auth, refunds, analytics }) {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState(null);
    const [refundModalVisible, setRefundModalVisible] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleProcessRefund = (booking) => {
        setSelectedRefund(booking);
        setRefundModalVisible(true);
    };

    const handleRefundSuccess = (data) => {
        setRefundModalVisible(false);
        setSelectedRefund(null);
        message.success("Refund processed successfully");
        window.location.reload();
    };

    const handleRefundModalCancel = () => {
        setRefundModalVisible(false);
        setSelectedRefund(null);
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setDetailsModalVisible(true);
    };

    const handleDetailsModalCancel = () => {
        setDetailsModalVisible(false);
        setSelectedBooking(null);
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

    const formatTime = (time) => {
        return dayjs(time).tz("Asia/Kolkata").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).tz("Asia/Kolkata").format("MMM DD, YYYY");
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).tz("Asia/Kolkata").format("MMM DD, YYYY h:mm A");
    };

    // Filter refunds based on search and filters
    const filteredRefunds = refunds.filter((refund) => {
        const matchesSearch =
            searchText === "" ||
            refund.customer.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            refund.customer.email
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            refund.service.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            (refund.refund_transaction_id &&
                refund.refund_transaction_id
                    .toLowerCase()
                    .includes(searchText.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" || refund.refund_status === statusFilter;

        const matchesDate =
            !dateFilter ||
            dayjs(refund.cancelled_at)
                .tz("Asia/Kolkata")
                .isSame(dateFilter, "day");

        return matchesSearch && matchesStatus && matchesDate;
    });

    const refundColumns = [
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text strong>{record.customer.name}</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.customer.email}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.customer.phone_number}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Service & Booking",
            key: "service",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Text strong>{record.service.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {formatDateTime(record.appointment_time)}
                        </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Booking ID: #{record.id}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Amounts",
            key: "amounts",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Original: ₹{record.total_amount}
                        </Text>
                    </div>
                    {record.refund_amount > 0 && (
                        <div>
                            <Text strong style={{ color: "#52c41a" }}>
                                Refund: ₹{record.refund_amount}
                            </Text>
                        </div>
                    )}
                    {record.cancellation_fee_charged > 0 && (
                        <div>
                            <Text
                                type="secondary"
                                style={{ fontSize: "12px", color: "#ff4d4f" }}
                            >
                                Fee: ₹{record.cancellation_fee_charged}
                            </Text>
                        </div>
                    )}
                </Space>
            ),
        },
        {
            title: "Status & Timeline",
            key: "status",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Badge
                        status={getStatusColor(record.refund_status)}
                        text={record.refund_status_text || record.refund_status}
                    />
                    <div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Cancelled: {formatDate(record.cancelled_at)}
                        </Text>
                    </div>
                    {record.refund_processed_at && (
                        <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Processed:{" "}
                                {formatDate(record.refund_processed_at)}
                            </Text>
                        </div>
                    )}
                </Space>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetails(record)}
                        style={{ width: "100%" }}
                    >
                        View Details
                    </Button>
                    {record.refund_status === "pending" &&
                        record.payment_status === "paid" && (
                            <Button
                                type="default"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#52c41a",
                                    color: "white",
                                    borderColor: "#52c41a",
                                }}
                                size="small"
                                onClick={() => handleProcessRefund(record)}
                            >
                                Process Refund
                            </Button>
                        )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Refund Management" />

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
                            <DollarOutlined style={{ marginRight: 8 }} />
                            Refund Management
                        </Title>
                        <Space>
                            <Text type="secondary">
                                Total: {filteredRefunds.length} refunds
                            </Text>
                        </Space>
                    </div>

                    {/* Analytics Cards */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={6}>
                            <Card size="small">
                                <Statistic
                                    title="Total Refunds"
                                    value={analytics.total_refunds}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: "#1890ff" }}
                                />
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
                            </Card>
                        </Col>
                    </Row>

                    {/* Progress Bar */}
                    <Card size="small" style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8 }}>
                            <Text strong>Refund Processing Rate</Text>
                        </div>
                        <Progress
                            percent={analytics.processing_rate}
                            status="active"
                            strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                            }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {analytics.processed_refunds} of{" "}
                            {analytics.total_refunds} refunds processed
                        </Text>
                    </Card>

                    {/* Filters */}
                    <div style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Search
                                    placeholder="Search by customer, service, or transaction ID"
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
                                    <Option value="pending">Pending</Option>
                                    <Option value="processed">Processed</Option>
                                    <Option value="failed">Failed</Option>
                                    <Option value="not_applicable">
                                        Not Applicable
                                    </Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <DatePicker
                                    placeholder="Filter by date"
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                    style={{ width: "100%" }}
                                />
                            </Col>
                            <Col span={6}>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        setSearchText("");
                                        setStatusFilter("all");
                                        setDateFilter(null);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Refunds Table */}
                    <Table
                        columns={refundColumns}
                        dataSource={filteredRefunds}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} refunds`,
                        }}
                    />
                </Card>

                {/* Refund Modal */}
                <RefundModal
                    visible={refundModalVisible}
                    onCancel={handleRefundModalCancel}
                    onSuccess={handleRefundSuccess}
                    booking={selectedRefund}
                />

                {/* Refund Details Modal */}
                <Modal
                    title="Refund Details"
                    open={detailsModalVisible}
                    onCancel={handleDetailsModalCancel}
                    footer={[
                        <Button key="close" onClick={handleDetailsModalCancel}>
                            Close
                        </Button>,
                    ]}
                    width={800}
                >
                    {selectedBooking && (
                        <div>
                            {/* Customer Information */}
                            <Descriptions
                                title="Customer Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Name" span={2}>
                                    {selectedBooking.customer.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email" span={2}>
                                    {selectedBooking.customer.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone" span={2}>
                                    {selectedBooking.customer.phone_number}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {/* Refund Information */}
                            <Descriptions
                                title="Refund Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Refund Status">
                                    <Badge
                                        status={getStatusColor(
                                            selectedBooking.refund_status
                                        )}
                                        text={
                                            selectedBooking.refund_status_text ||
                                            selectedBooking.refund_status
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Original Amount">
                                    <Text strong style={{ color: "#1890ff" }}>
                                        ₹{selectedBooking.total_amount}
                                    </Text>
                                </Descriptions.Item>
                                {selectedBooking.refund_amount > 0 && (
                                    <Descriptions.Item label="Refund Amount">
                                        <Text
                                            strong
                                            style={{ color: "#52c41a" }}
                                        >
                                            ₹{selectedBooking.refund_amount}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.cancellation_fee_charged >
                                    0 && (
                                    <Descriptions.Item label="Cancellation Fee">
                                        <Text
                                            strong
                                            style={{ color: "#ff4d4f" }}
                                        >
                                            ₹
                                            {
                                                selectedBooking.cancellation_fee_charged
                                            }
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.refund_transaction_id && (
                                    <Descriptions.Item label="Transaction ID">
                                        <Text copyable>
                                            {
                                                selectedBooking.refund_transaction_id
                                            }
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.refund_method && (
                                    <Descriptions.Item label="Refund Method">
                                        {selectedBooking.refund_method}
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.refund_processed_at && (
                                    <Descriptions.Item label="Processed At">
                                        {formatDateTime(
                                            selectedBooking.refund_processed_at
                                        )}
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.cancelled_at && (
                                    <Descriptions.Item label="Cancelled At">
                                        {formatDateTime(
                                            selectedBooking.cancelled_at
                                        )}
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.refund_notes && (
                                    <Descriptions.Item
                                        label="Refund Notes"
                                        span={2}
                                    >
                                        <Text>
                                            {selectedBooking.refund_notes}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.cancellation_reason && (
                                    <Descriptions.Item
                                        label="Cancellation Reason"
                                        span={2}
                                    >
                                        <Text>
                                            {
                                                selectedBooking.cancellation_reason
                                            }
                                        </Text>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}
