import React, { useState } from "react";
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
    Badge,
    message,
    Statistic,
} from "antd";
import {
    FileTextOutlined,
    DownloadOutlined,
    EyeOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PrinterOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import Logo from "../../Components/Logo";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Invoices({ auth, invoices, stats }) {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedInvoice(null);
    };

    const handleDownloadPdf = (invoiceId) => {
        window.open(`/customer/invoices/${invoiceId}/download`, "_blank");
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
                    {record.reschedule_fee > 0 && (
                        <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Reschedule Fee:{" "}
                                {formatPrice(record.reschedule_fee)}
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
                </Space>
            ),
        },
    ];

    const handleLogout = () => {
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    window.location.reload();
                },
            }
        );
    };

    const menuItems = [
        {
            key: "services",
            icon: <FileTextOutlined />,
            label: "Services",
            onClick: () => router.visit(route("booking.select-service")),
        },
        {
            key: "bookings",
            icon: <FileTextOutlined />,
            label: "Your Bookings",
            onClick: () => router.visit(route("customer.bookings")),
        },
        {
            key: "invoices",
            icon: <FileTextOutlined />,
            label: "Invoices",
            onClick: () => router.visit(route("customer.invoices")),
        },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <Head title="My Invoices - HospiPal" />

            {/* Header */}
            <div
                style={{
                    background: "#fff",
                    padding: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: 24,
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <Logo
                            variant="primary"
                            color="color"
                            background="white"
                            size="medium"
                        />
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() =>
                                router.visit(route("customer.bookings"))
                            }
                        >
                            Back to Bookings
                        </Button>
                    </div>
                    <Space>
                        <Text>Welcome, {auth.user?.name}</Text>
                        <Button type="text" onClick={handleLogout} size="small">
                            Logout
                        </Button>
                    </Space>
                </div>
            </div>

            <div
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Invoices"
                                value={stats.total_invoices}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Paid Invoices"
                                value={stats.paid_invoices}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Spent"
                                value={stats.total_spent}
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
                            My Invoices
                        </Title>
                        <Text type="secondary">
                            Total: {invoices.total} invoices
                        </Text>
                    </div>

                    <Table
                        columns={invoiceColumns}
                        dataSource={invoices.data}
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

                            {/* Invoice Items */}
                            {selectedInvoice.invoice_items && (
                                <>
                                    <Divider />
                                    <Descriptions
                                        title="Invoice Items"
                                        bordered
                                        size="small"
                                    >
                                        {selectedInvoice.invoice_items.map(
                                            (item, index) => (
                                                <Descriptions.Item
                                                    key={index}
                                                    label={`${item.description} (${item.type})`}
                                                >
                                                    <div>
                                                        <Text>
                                                            Qty: {item.quantity}
                                                        </Text>
                                                        <br />
                                                        <Text>
                                                            Unit Price:{" "}
                                                            {formatPrice(
                                                                item.unit_price
                                                            )}
                                                        </Text>
                                                        <br />
                                                        <Text strong>
                                                            Total:{" "}
                                                            {formatPrice(
                                                                item.total
                                                            )}
                                                        </Text>
                                                    </div>
                                                </Descriptions.Item>
                                            )
                                        )}
                                    </Descriptions>
                                </>
                            )}

                            {/* Totals */}
                            <Divider />
                            <div
                                style={{
                                    textAlign: "right",
                                    padding: "16px",
                                    background: "#f9f9f9",
                                }}
                            >
                                <div style={{ marginBottom: 8 }}>
                                    <Text>
                                        Subtotal:{" "}
                                        {formatPrice(selectedInvoice.subtotal)}
                                    </Text>
                                </div>
                                {selectedInvoice.discount_amount > 0 && (
                                    <div
                                        style={{
                                            marginBottom: 8,
                                            color: "#52c41a",
                                        }}
                                    >
                                        <Text>
                                            Discount: -
                                            {formatPrice(
                                                selectedInvoice.discount_amount
                                            )}
                                        </Text>
                                    </div>
                                )}
                                {selectedInvoice.reschedule_fee > 0 && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>
                                            Reschedule Fee:{" "}
                                            {formatPrice(
                                                selectedInvoice.reschedule_fee
                                            )}
                                        </Text>
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "#1890ff",
                                    }}
                                >
                                    <Text>
                                        Total:{" "}
                                        {formatPrice(
                                            selectedInvoice.total_amount
                                        )}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
