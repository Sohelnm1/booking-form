import React, { useState } from "react";
import { Head } from "@inertiajs/react";
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
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    PrinterOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import CancelModal from "../../Components/CancelModal";
import RefundModal from "../../Components/RefundModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function Appointments({ auth, bookings }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [refundModalVisible, setRefundModalVisible] = useState(false);
    const [bookingToRefund, setBookingToRefund] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState(null);

    const handleViewBooking = (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const handleDownloadPdf = (bookingId) => {
        window.open(`/admin/appointments/${bookingId}/pdf`, "_blank");
    };

    const handleExportExcel = () => {
        window.open("/admin/appointments/export-excel", "_blank");
    };

    const handleCancelBooking = (booking) => {
        setBookingToCancel(booking);
        setCancelModalVisible(true);
    };

    const handleCancelSuccess = (data) => {
        setCancelModalVisible(false);
        setBookingToCancel(null);
        message.success("Booking cancelled successfully");
        // Refresh the page to show updated booking details
        window.location.reload();
    };

    const handleCancelModalCancel = () => {
        setCancelModalVisible(false);
        setBookingToCancel(null);
    };

    const handleProcessRefund = (booking) => {
        setBookingToRefund(booking);
        setRefundModalVisible(true);
    };

    const handleRefundSuccess = (data) => {
        setRefundModalVisible(false);
        setBookingToRefund(null);
        message.success("Refund processed successfully");
        window.location.reload();
    };

    const handleRefundModalCancel = () => {
        setRefundModalVisible(false);
        setBookingToRefund(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "success";
            case "pending":
                return "warning";
            case "completed":
                return "processing";
            case "cancelled":
                return "error";
            case "no_show":
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

    const getRefundStatusColor = (status) => {
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

    const formatDuration = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    };

    const renderCustomField = (response) => {
        // Use form_field (snake_case) instead of formField (camelCase)
        const field = response.form_field;

        // Handle case where form_field is not loaded or undefined
        if (!field) {
            return (
                <div key={response.id} style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: "12px", color: "#666" }}>
                        Unknown Field (ID: {response.form_field_id}):
                    </Text>
                    <br />
                    <Text>{response.response_value || "Not provided"}</Text>
                </div>
            );
        }

        const value = response.formatted_value || response.response_value;

        return (
            <div key={response.id} style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: "12px", color: "#666" }}>
                    {field.label}:
                </Text>
                <br />
                <Text>{value || "Not provided"}</Text>
            </div>
        );
    };

    // Filter bookings based on search and filters
    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            searchText === "" ||
            booking.customer.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            booking.customer.email
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            booking.service.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            booking.employee.name
                .toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || booking.status === statusFilter;
        const matchesDate =
            !dateFilter ||
            dayjs(booking.appointment_time)
                .tz("Asia/Kolkata")
                .isSame(dateFilter, "day");

        return matchesSearch && matchesStatus && matchesDate;
    });

    const appointmentColumns = [
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <UserOutlined />
                        <Text strong>{record.customer.name}</Text>
                    </Space>
                    <Space>
                        <MailOutlined />
                        <Text copyable style={{ fontSize: "12px" }}>
                            {record.customer.email}
                        </Text>
                    </Space>
                    <Space>
                        <PhoneOutlined />
                        <Text copyable style={{ fontSize: "12px" }}>
                            {record.customer.phone_number}
                        </Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: "Service & Employee",
            key: "service",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Text strong>{record.service.name}</Text>
                        {record.pricingTier && (
                            <Tag
                                color="blue"
                                style={{ marginLeft: 8, fontSize: 10 }}
                            >
                                {record.pricingTier.name}
                            </Tag>
                        )}
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {formatDuration(
                                record.pricingTier?.duration_minutes ||
                                    record.service.duration
                            )}{" "}
                            • ₹
                            {record.pricingTier?.price || record.service.price}
                        </Text>
                    </div>
                    <div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Assigned to: {record.employee.name}
                            <Badge
                                status={
                                    record.employee.is_active
                                        ? "success"
                                        : "error"
                                }
                                text={
                                    record.employee.is_active
                                        ? "Active"
                                        : "Inactive"
                                }
                                style={{ marginLeft: 4, fontSize: "10px" }}
                            />
                        </Text>
                        {record.gender_preference &&
                            record.gender_preference !== "no_preference" && (
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "11px" }}
                                    >
                                        Preference:{" "}
                                        {record.gender_preference === "male"
                                            ? "Male"
                                            : "Female"}{" "}
                                        HospiPal
                                        {record.gender_preference_fee > 0 && (
                                            <span style={{ color: "#1890ff" }}>
                                                {" "}
                                                (+₹
                                                {record.gender_preference_fee})
                                            </span>
                                        )}
                                    </Text>
                                </div>
                            )}
                    </div>
                </Space>
            ),
        },
        {
            title: "Appointment",
            key: "appointment",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <CalendarOutlined />
                        <Text>{formatDate(record.appointment_time)}</Text>
                    </Space>
                    <Space>
                        <ClockCircleOutlined />
                        <Text>{formatTime(record.appointment_time)}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Duration: {formatDuration(record.duration)}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Extras",
            key: "extras",
            render: (_, record) => (
                <div>
                    {record.extras && record.extras.length > 0 ? (
                        record.extras.map((extra) => {
                            const quantity = extra.pivot?.quantity || 1;
                            const totalPrice =
                                parseFloat(extra.pivot?.price || extra.price) *
                                quantity;
                            return (
                                <Tag
                                    key={extra.id}
                                    color="blue"
                                    style={{ marginBottom: 4 }}
                                >
                                    {extra.name}
                                    {quantity > 1 && ` × ${quantity}`}
                                    {` (₹${totalPrice.toFixed(2)})`}
                                </Tag>
                            );
                        })
                    ) : (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            No extras
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Total & Status",
            key: "total",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <Text strong style={{ color: "#1890ff" }}>
                            ₹
                        </Text>
                        <Text strong>₹{record.total_amount}</Text>
                    </Space>
                    {record.distance_charges > 0 && (
                        <Text
                            type="secondary"
                            style={{ fontSize: "11px", color: "#1890ff" }}
                        >
                            Includes ₹
                            {parseFloat(record.distance_charges).toFixed(2)}{" "}
                            distance charges
                        </Text>
                    )}
                    <Space>
                        <Badge
                            status={getStatusColor(record.status)}
                            text={record.status_text || record.status}
                        />
                    </Space>
                    <Space>
                        <Badge
                            status={getPaymentStatusColor(
                                record.payment_status
                            )}
                            text={
                                record.payment_status_text ||
                                record.payment_status
                            }
                        />
                    </Space>
                    {record.status === "cancelled" &&
                        record.refund_amount > 0 && (
                            <Space>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Refund: ₹{record.refund_amount}
                                </Text>
                            </Space>
                        )}
                    {record.status === "cancelled" && record.refund_status && (
                        <Space>
                            <Badge
                                status={getRefundStatusColor(
                                    record.refund_status
                                )}
                                text={
                                    record.refund_status_text ||
                                    record.refund_status
                                }
                            />
                        </Space>
                    )}
                    {record.reschedule_attempts > 0 && (
                        <Space>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Rescheduled: {record.reschedule_attempts}{" "}
                                time(s)
                            </Text>
                        </Space>
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
                        onClick={() => handleViewBooking(record)}
                        style={{ width: "100%" }}
                    >
                        View Details
                    </Button>
                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => handleDownloadPdf(record.id)}
                        style={{ width: "100%" }}
                    >
                        Download PDF
                    </Button>
                    {(record.status === "pending" ||
                        record.status === "confirmed") && (
                        <Button
                            type="default"
                            danger
                            icon={<CloseCircleOutlined />}
                            size="small"
                            onClick={() => handleCancelBooking(record)}
                            style={{ width: "100%" }}
                        >
                            Cancel
                        </Button>
                    )}
                    {record.status === "cancelled" &&
                        record.refund_status === "pending" &&
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
            <Head title="Appointments" />

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
                            Appointments
                        </Title>
                        <Space>
                            <Button
                                type="primary"
                                icon={<FileExcelOutlined />}
                                onClick={handleExportExcel}
                                style={{ marginRight: 8 }}
                            >
                                Export to Excel
                            </Button>
                            <Text type="secondary">
                                Total: {filteredBookings.length} bookings
                            </Text>
                        </Space>
                    </div>

                    {/* Filters */}
                    <div style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Search
                                    placeholder="Search by customer, service, or employee"
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
                                    <Option value="confirmed">Confirmed</Option>
                                    <Option value="completed">Completed</Option>
                                    <Option value="cancelled">Cancelled</Option>
                                    <Option value="no_show">No Show</Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <DatePicker
                                    placeholder="Filter by date"
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                    style={{ width: "100%" }}
                                    allowClear
                                />
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={appointmentColumns}
                        dataSource={filteredBookings}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} appointments`,
                        }}
                    />
                </Card>

                {/* Booking Details Modal */}
                <Modal
                    title="Booking Details"
                    open={isModalVisible}
                    onCancel={handleModalCancel}
                    footer={[
                        <Button
                            key="print"
                            icon={<PrinterOutlined />}
                            onClick={() =>
                                handleDownloadPdf(selectedBooking.id)
                            }
                        >
                            Print PDF
                        </Button>,
                        <Button key="close" onClick={handleModalCancel}>
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

                            {/* Booking Information */}
                            <Descriptions
                                title="Booking Information"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Service">
                                    <div>
                                        <Text>
                                            {selectedBooking.service.name}
                                        </Text>
                                        {selectedBooking.pricingTier && (
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {
                                                    selectedBooking.pricingTier
                                                        .name
                                                }
                                            </Tag>
                                        )}
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Employee">
                                    {selectedBooking.employee.name}
                                    <Badge
                                        status={
                                            selectedBooking.employee.is_active
                                                ? "success"
                                                : "error"
                                        }
                                        text={
                                            selectedBooking.employee.is_active
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        style={{ marginLeft: 8 }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Date & Time">
                                    {formatDateTime(
                                        selectedBooking.appointment_time
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Duration">
                                    {formatDuration(selectedBooking.duration)}
                                </Descriptions.Item>
                                {selectedBooking.gender_preference &&
                                    selectedBooking.gender_preference !==
                                        "no_preference" && (
                                        <Descriptions.Item label="HospiPal Preference">
                                            <Space>
                                                <Text>
                                                    {selectedBooking.gender_preference ===
                                                    "male"
                                                        ? "Male"
                                                        : "Female"}{" "}
                                                    HospiPal
                                                </Text>
                                                {selectedBooking.gender_preference_fee >
                                                    0 && (
                                                    <Tag color="blue">
                                                        +₹
                                                        {
                                                            selectedBooking.gender_preference_fee
                                                        }
                                                    </Tag>
                                                )}
                                            </Space>
                                        </Descriptions.Item>
                                    )}
                                <Descriptions.Item label="Status">
                                    <Badge
                                        status={getStatusColor(
                                            selectedBooking.status
                                        )}
                                        text={
                                            selectedBooking.status_text ||
                                            selectedBooking.status
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Status">
                                    <Badge
                                        status={getPaymentStatusColor(
                                            selectedBooking.payment_status
                                        )}
                                        text={
                                            selectedBooking.payment_status_text ||
                                            selectedBooking.payment_status
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Total Amount"
                                    span={2}
                                >
                                    <Text strong style={{ fontSize: "16px" }}>
                                        ₹{selectedBooking.total_amount}
                                    </Text>
                                </Descriptions.Item>
                                {selectedBooking.reschedule_attempts > 0 && (
                                    <Descriptions.Item label="Reschedule Attempts">
                                        {selectedBooking.reschedule_attempts}{" "}
                                        time(s)
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.rescheduled_at && (
                                    <Descriptions.Item label="Last Rescheduled">
                                        {formatDateTime(
                                            selectedBooking.rescheduled_at
                                        )}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            <Divider />

                            {/* Payment Details */}
                            <Descriptions
                                title="Payment Details"
                                bordered
                                size="small"
                            >
                                <Descriptions.Item label="Service">
                                    <div>
                                        <Text>
                                            ₹
                                            {parseFloat(
                                                selectedBooking.pricingTier
                                                    ?.price ||
                                                    selectedBooking.service
                                                        ?.price ||
                                                    0
                                            ).toFixed(2)}
                                        </Text>
                                        {selectedBooking.pricingTier && (
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {
                                                    selectedBooking.pricingTier
                                                        .name
                                                }
                                            </Tag>
                                        )}
                                    </div>
                                </Descriptions.Item>
                                {selectedBooking.extras &&
                                    selectedBooking.extras.length > 0 && (
                                        <Descriptions.Item label="Extras">
                                            <Text>
                                                ₹
                                                {selectedBooking.extras
                                                    .reduce((sum, extra) => {
                                                        const quantity =
                                                            extra.pivot
                                                                ?.quantity || 1;
                                                        const price =
                                                            parseFloat(
                                                                extra.pivot
                                                                    ?.price ||
                                                                    extra.price ||
                                                                    0
                                                            );
                                                        return (
                                                            sum +
                                                            price * quantity
                                                        );
                                                    }, 0)
                                                    .toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                    )}
                                {selectedBooking.distance_charges > 0 && (
                                    <Descriptions.Item label="Extra Distance Charges">
                                        <div>
                                            <Text style={{ color: "#1890ff" }}>
                                                ₹
                                                {parseFloat(
                                                    selectedBooking.distance_charges
                                                ).toFixed(2)}
                                            </Text>
                                            <Tag
                                                color="blue"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 10,
                                                }}
                                            >
                                                Travel Buddy
                                            </Tag>
                                        </div>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.gender_preference_fee > 0 && (
                                    <Descriptions.Item label="Gender Preference Fee">
                                        <Text style={{ color: "#722ed1" }}>
                                            ₹
                                            {parseFloat(
                                                selectedBooking.gender_preference_fee
                                            ).toFixed(2)}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.discount_amount > 0 && (
                                    <Descriptions.Item label="Discount">
                                        <Text style={{ color: "#52c41a" }}>
                                            -₹
                                            {parseFloat(
                                                selectedBooking.discount_amount
                                            ).toFixed(2)}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item
                                    label="Total Amount"
                                    span={2}
                                >
                                    <Text strong style={{ fontSize: "16px" }}>
                                        ₹
                                        {parseFloat(
                                            selectedBooking.total_amount
                                        ).toFixed(2)}
                                    </Text>
                                </Descriptions.Item>
                                {selectedBooking.payment_method && (
                                    <Descriptions.Item label="Payment Method">
                                        <Text>
                                            {selectedBooking.payment_method}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {selectedBooking.transaction_id && (
                                    <Descriptions.Item label="Transaction ID">
                                        <Text copyable>
                                            {selectedBooking.transaction_id}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            <Divider />

                            {/* Extras */}
                            {selectedBooking.extras &&
                                selectedBooking.extras.length > 0 && (
                                    <>
                                        <Descriptions
                                            title="Selected Extras"
                                            bordered
                                            size="small"
                                        >
                                            {selectedBooking.extras.map(
                                                (extra) => {
                                                    const quantity =
                                                        extra.pivot?.quantity ||
                                                        1;
                                                    const totalPrice =
                                                        parseFloat(
                                                            extra.pivot
                                                                ?.price ||
                                                                extra.price
                                                        ) * quantity;
                                                    const totalDuration =
                                                        extra.duration_relation
                                                            ? (extra
                                                                  .duration_relation
                                                                  .hours *
                                                                  60 +
                                                                  extra
                                                                      .duration_relation
                                                                      .minutes) *
                                                              quantity
                                                            : (extra.total_duration ||
                                                                  0) * quantity;

                                                    return (
                                                        <Descriptions.Item
                                                            key={extra.id}
                                                            label={
                                                                <div>
                                                                    {extra.name}
                                                                    {quantity >
                                                                        1 && (
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                marginLeft: 8,
                                                                            }}
                                                                        >
                                                                            ×{" "}
                                                                            {
                                                                                quantity
                                                                            }
                                                                        </Text>
                                                                    )}
                                                                </div>
                                                            }
                                                        >
                                                            <div>
                                                                <div>
                                                                    ₹
                                                                    {totalPrice.toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            "12px",
                                                                        color: "#666",
                                                                    }}
                                                                >
                                                                    {extra.duration_relation
                                                                        ? extra
                                                                              .duration_relation
                                                                              .label
                                                                        : "No additional time"}
                                                                    {quantity >
                                                                        1 && (
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            ×{" "}
                                                                            {
                                                                                quantity
                                                                            }
                                                                        </Text>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Descriptions.Item>
                                                    );
                                                }
                                            )}
                                        </Descriptions>
                                        <Divider />
                                    </>
                                )}

                            {/* Refund Information */}
                            {selectedBooking.status === "cancelled" && (
                                <>
                                    <Divider />
                                    <Descriptions
                                        title="Refund Information"
                                        bordered
                                        size="small"
                                    >
                                        <Descriptions.Item label="Refund Status">
                                            <Badge
                                                status={getRefundStatusColor(
                                                    selectedBooking.refund_status
                                                )}
                                                text={
                                                    selectedBooking.refund_status_text ||
                                                    selectedBooking.refund_status
                                                }
                                            />
                                        </Descriptions.Item>
                                        {selectedBooking.refund_amount > 0 && (
                                            <Descriptions.Item label="Refund Amount">
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#52c41a",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    ₹
                                                    {
                                                        selectedBooking.refund_amount
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.cancellation_fee_charged >
                                            0 && (
                                            <Descriptions.Item label="Cancellation Fee">
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#ff4d4f",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    ₹
                                                    {
                                                        selectedBooking.cancellation_fee_charged
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.refund_transaction_id && (
                                            <Descriptions.Item label="Refund Transaction ID">
                                                <Text copyable>
                                                    {
                                                        selectedBooking.refund_transaction_id
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.refund_processed_at && (
                                            <Descriptions.Item label="Refund Processed At">
                                                {formatDateTime(
                                                    selectedBooking.refund_processed_at
                                                )}
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.refund_method && (
                                            <Descriptions.Item label="Refund Method">
                                                {selectedBooking.refund_method}
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.refund_notes && (
                                            <Descriptions.Item
                                                label="Refund Notes"
                                                span={2}
                                            >
                                                <Text>
                                                    {
                                                        selectedBooking.refund_notes
                                                    }
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
                                        {selectedBooking.cancelled_at && (
                                            <Descriptions.Item label="Cancelled At">
                                                {formatDateTime(
                                                    selectedBooking.cancelled_at
                                                )}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </>
                            )}

                            {/* Custom Field Responses */}
                            {(() => {
                                // Use form_responses (snake_case) instead of formResponses (camelCase)
                                const formResponses =
                                    selectedBooking.form_responses;

                                if (formResponses && formResponses.length > 0) {
                                    // Filter to show only custom fields (non-primary)
                                    const customFieldResponses =
                                        formResponses.filter(
                                            (response) =>
                                                response.form_field &&
                                                !response.form_field.is_primary
                                        );

                                    if (customFieldResponses.length > 0) {
                                        return (
                                            <div>
                                                <Title level={4}>
                                                    Custom Field Responses
                                                </Title>
                                                <Card size="small">
                                                    {customFieldResponses.map(
                                                        renderCustomField
                                                    )}
                                                </Card>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <Title level={4}>
                                                    Custom Field Responses
                                                </Title>
                                                <Card size="small">
                                                    <Text type="secondary">
                                                        No custom field
                                                        responses found.
                                                    </Text>
                                                </Card>
                                            </div>
                                        );
                                    }
                                } else {
                                    return (
                                        <div>
                                            <Title level={4}>
                                                Custom Field Responses
                                            </Title>
                                            <Card size="small">
                                                <Text type="secondary">
                                                    No form responses found.
                                                </Text>
                                            </Card>
                                        </div>
                                    );
                                }
                            })()}

                            {/* Consent Information */}
                            {selectedBooking.consent_given && (
                                <>
                                    <Divider />
                                    <Descriptions
                                        title="Consent Information"
                                        bordered
                                        size="small"
                                    >
                                        <Descriptions.Item label="Consent Given">
                                            <CheckCircleOutlined
                                                style={{ color: "green" }}
                                            />{" "}
                                            Yes
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Consent Date">
                                            {selectedBooking.consent_given_at
                                                ? formatDateTime(
                                                      selectedBooking.consent_given_at
                                                  )
                                                : "Not recorded"}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </>
                            )}

                            {/* Reschedule Information */}
                            {(selectedBooking.reschedule_attempts > 0 ||
                                selectedBooking.reschedule_payment_amount >
                                    0) && (
                                <>
                                    <Divider />
                                    <Descriptions
                                        title="Reschedule Information"
                                        bordered
                                        size="small"
                                    >
                                        {selectedBooking.reschedule_attempts >
                                            0 && (
                                            <Descriptions.Item label="Reschedule Attempts">
                                                {
                                                    selectedBooking.reschedule_attempts
                                                }{" "}
                                                time(s)
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.rescheduled_at && (
                                            <Descriptions.Item label="Last Rescheduled">
                                                {formatDateTime(
                                                    selectedBooking.rescheduled_at
                                                )}
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.reschedule_payment_amount >
                                            0 && (
                                            <Descriptions.Item label="Reschedule Fee Paid">
                                                <Text
                                                    strong
                                                    style={{ color: "#52c41a" }}
                                                >
                                                    ₹
                                                    {
                                                        selectedBooking.reschedule_payment_amount
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.reschedule_payment_id && (
                                            <Descriptions.Item label="Payment ID">
                                                <Text code>
                                                    {
                                                        selectedBooking.reschedule_payment_id
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.reschedule_payment_date && (
                                            <Descriptions.Item label="Payment Date">
                                                {formatDateTime(
                                                    selectedBooking.reschedule_payment_date
                                                )}
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.reschedule_payment_status && (
                                            <Descriptions.Item label="Payment Status">
                                                <Badge
                                                    status={
                                                        selectedBooking.reschedule_payment_status ===
                                                        "paid"
                                                            ? "success"
                                                            : selectedBooking.reschedule_payment_status ===
                                                              "pending"
                                                            ? "warning"
                                                            : selectedBooking.reschedule_payment_status ===
                                                              "failed"
                                                            ? "error"
                                                            : "default"
                                                    }
                                                    text={
                                                        selectedBooking.reschedule_payment_status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        selectedBooking.reschedule_payment_status
                                                            .slice(1)
                                                            .replace("_", " ")
                                                    }
                                                />
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Cancel Modal */}
                <CancelModal
                    visible={cancelModalVisible}
                    onCancel={handleCancelModalCancel}
                    onSuccess={handleCancelSuccess}
                    booking={bookingToCancel}
                    isAdmin={true}
                />

                {/* Refund Modal */}
                <RefundModal
                    visible={refundModalVisible}
                    onCancel={handleRefundModalCancel}
                    onSuccess={handleRefundSuccess}
                    booking={bookingToRefund}
                />
            </div>
        </AdminLayout>
    );
}
