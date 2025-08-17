import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Table,
    Tag,
    Space,
    Typography,
    Button,
    Modal,
    Descriptions,
    Divider,
    Row,
    Col,
    Select,
    DatePicker,
    Input,
    Badge,
    Tooltip,
    message,
    Statistic,
    Progress,
} from "antd";
import {
    FileTextOutlined,
    DownloadOutlined,
    MailOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PrinterOutlined,
    SendOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default function Invoices({ auth, invoices, stats }) {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedInvoice(null);
    };

    const handleDownloadPdf = (invoiceId) => {
        window.open(`/admin/invoices/${invoiceId}/download`, "_blank");
    };

    const handleSendEmail = async (invoiceId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/admin/invoices/${invoiceId}/send-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            const result = await response.json();
            if (result.success) {
                message.success(result.message);
            } else {
                message.error(result.message || "Failed to send email");
            }
        } catch (error) {
            message.error("Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (invoiceId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/admin/invoices/${invoiceId}/mark-paid`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            const result = await response.json();
            if (result.success) {
                message.success(result.message);
                window.location.reload();
            } else {
                message.error(result.message || "Failed to mark as paid");
            }
        } catch (error) {
            message.error("Failed to mark as paid");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsCancelled = async (invoiceId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/admin/invoices/${invoiceId}/mark-cancelled`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            const result = await response.json();
            if (result.success) {
                message.success(result.message);
                window.location.reload();
            } else {
                message.error(result.message || "Failed to mark as cancelled");
            }
        } catch (error) {
            message.error("Failed to mark as cancelled");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
                return "error";
            case "draft":
                return "default";
            default:
                return "default";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "failed":
                return "error";
            case "refunded":
                return "default";
            default:
                return "default";
        }
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).format("MMM DD, YYYY h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("MMM DD, YYYY");
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    // Filter invoices based on search and filters
    const filteredInvoices = invoices.data.filter((invoice) => {
        const matchesSearch =
            searchText === "" ||
            invoice.invoice_number
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            invoice.customer?.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            invoice.customer?.email
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            invoice.booking?.service?.name
                .toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || invoice.status === statusFilter;

        const matchesDate =
            !dateFilter ||
            dayjs(invoice.issued_date).isBetween(
                dateFilter[0],
                dateFilter[1],
                "day",
                "[]"
            );

        return matchesSearch && matchesStatus && matchesDate;
    });

    const invoiceColumns = [
        {
            title: "Invoice #",
            key: "invoice_number",
            render: (_, record) => (
                <div>
                    <Text strong>{record.invoice_number}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatDate(record.issued_date)}
                    </Text>
                </div>
            ),
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <div>
                    <Text strong>{record.customer?.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.customer?.email}
                    </Text>
                </div>
            ),
        },
        {
            title: "Service",
            key: "service",
            render: (_, record) => (
                <div>
                    <Text>{record.booking?.service?.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Booking #{record.booking?.id}
                    </Text>
                </div>
            ),
        },
        {
            title: "Amount",
            key: "total_amount",
            render: (_, record) => (
                <div>
                    <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                        {formatPrice(record.total_amount)}
                    </Text>
                    {record.discount_amount > 0 && (
                        <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Discount: {formatPrice(record.discount_amount)}
                            </Text>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Badge
                        status={getStatusColor(record.status)}
                        text={
                            record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)
                        }
                    />
                    <Badge
                        status={getPaymentStatusColor(record.payment_status)}
                        text={
                            record.payment_status.charAt(0).toUpperCase() +
                            record.payment_status.slice(1)
                        }
                    />
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
                        onClick={() => handleViewInvoice(record)}
                        style={{ width: "100%" }}
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => handleDownloadPdf(record.id)}
                        style={{ width: "100%" }}
                    >
                        Download
                    </Button>
                    {record.status === "pending" && (
                        <Button
                            type="default"
                            icon={<SendOutlined />}
                            size="small"
                            onClick={() => handleSendEmail(record.id)}
                            loading={loading}
                            style={{ width: "100%" }}
                        >
                            Send Email
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Invoices" />

            <div style={{ padding: "24px" }}>
                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Invoices"
                                value={stats.total_invoices}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Paid Invoices"
                                value={stats.paid_invoices}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Pending Invoices"
                                value={stats.pending_invoices}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Revenue"
                                value={stats.total_revenue}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                                formatter={(value) =>
                                    `₹${parseFloat(value).toFixed(2)}`
                                }
                            />
                        </Card>
                    </Col>
                </Row>

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
                            Invoices
                        </Title>
                        <Space>
                            <Text type="secondary">
                                Total: {invoices.total} invoices
                            </Text>
                        </Space>
                    </div>

                    {/* Filters */}
                    <div style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Search
                                    placeholder="Search by invoice #, customer, or service"
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
                                    <Option value="paid">Paid</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="cancelled">Cancelled</Option>
                                    <Option value="draft">Draft</Option>
                                </Select>
                            </Col>
                            <Col span={6}>
                                <RangePicker
                                    placeholder={["From Date", "To Date"]}
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                    style={{ width: "100%" }}
                                    allowClear
                                />
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={invoiceColumns}
                        dataSource={filteredInvoices}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} invoices`,
                        }}
                    />
                </Card>

                {/* Invoice Details Modal */}
                <Modal
                    title="Invoice Details"
                    open={isModalVisible}
                    onCancel={handleModalCancel}
                    footer={[
                        <Button
                            key="download"
                            icon={<DownloadOutlined />}
                            onClick={() =>
                                handleDownloadPdf(selectedInvoice?.id)
                            }
                        >
                            Download PDF
                        </Button>,
                        <Button
                            key="print"
                            icon={<PrinterOutlined />}
                            onClick={() => window.print()}
                        >
                            Print
                        </Button>,
                        <Button key="close" onClick={handleModalCancel}>
                            Close
                        </Button>,
                    ]}
                    width={800}
                >
                    {selectedInvoice && (
                        <div>
                            {/* Invoice Information */}
                            <Descriptions
                                title="Invoice Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Invoice Number">
                                    {selectedInvoice.invoice_number}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Badge
                                        status={getStatusColor(
                                            selectedInvoice.status
                                        )}
                                        text={
                                            selectedInvoice.status
                                                .charAt(0)
                                                .toUpperCase() +
                                            selectedInvoice.status.slice(1)
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Issued Date">
                                    {formatDateTime(
                                        selectedInvoice.issued_date
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Due Date">
                                    {formatDateTime(selectedInvoice.due_date)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Total Amount"
                                    span={2}
                                >
                                    <Text strong style={{ fontSize: "16px" }}>
                                        {formatPrice(
                                            selectedInvoice.total_amount
                                        )}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {/* Customer Information */}
                            <Descriptions
                                title="Customer Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Name">
                                    {selectedInvoice.customer?.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {selectedInvoice.customer?.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {selectedInvoice.customer?.phone_number}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {/* Booking Information */}
                            {selectedInvoice.booking && (
                                <>
                                    <Descriptions
                                        title="Booking Information"
                                        bordered
                                        size="small"
                                    >
                                        <Descriptions.Item label="Booking ID">
                                            {selectedInvoice.booking.id}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Service">
                                            {
                                                selectedInvoice.booking.service
                                                    ?.name
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Appointment">
                                            {formatDateTime(
                                                selectedInvoice.booking
                                                    .appointment_time
                                            )}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Employee">
                                            {selectedInvoice.booking.employee
                                                ?.name || "Auto-assigned"}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Divider />
                                </>
                            )}

                            {/* Payment Information */}
                            <Descriptions
                                title="Payment Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Payment Status">
                                    <Badge
                                        status={getPaymentStatusColor(
                                            selectedInvoice.payment_status
                                        )}
                                        text={
                                            selectedInvoice.payment_status
                                                .charAt(0)
                                                .toUpperCase() +
                                            selectedInvoice.payment_status.slice(
                                                1
                                            )
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Method">
                                    {selectedInvoice.payment_method ||
                                        "Not specified"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Transaction ID">
                                    {selectedInvoice.transaction_id ||
                                        "Not available"}
                                </Descriptions.Item>
                                {selectedInvoice.payment_date && (
                                    <Descriptions.Item label="Payment Date">
                                        {formatDateTime(
                                            selectedInvoice.payment_date
                                        )}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            {/* Action Buttons */}
                            <Divider />
                            <div style={{ textAlign: "center" }}>
                                <Space>
                                    {selectedInvoice.status === "pending" && (
                                        <>
                                            <Button
                                                type="primary"
                                                icon={<CheckCircleOutlined />}
                                                onClick={() =>
                                                    handleMarkAsPaid(
                                                        selectedInvoice.id
                                                    )
                                                }
                                                loading={loading}
                                            >
                                                Mark as Paid
                                            </Button>
                                            <Button
                                                danger
                                                icon={
                                                    <ExclamationCircleOutlined />
                                                }
                                                onClick={() =>
                                                    handleMarkAsCancelled(
                                                        selectedInvoice.id
                                                    )
                                                }
                                                loading={loading}
                                            >
                                                Mark as Cancelled
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        icon={<MailOutlined />}
                                        onClick={() =>
                                            handleSendEmail(selectedInvoice.id)
                                        }
                                        loading={loading}
                                    >
                                        Send Email
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}
