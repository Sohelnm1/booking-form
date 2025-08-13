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

    const formatTime = (time) => {
        return dayjs(time).tz("Asia/Kolkata").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).tz("Asia/Kolkata").format("MMM DD, YYYY");
    };

    const formatDateTime = (datetime) => {
        return dayjs(datetime).tz("Asia/Kolkata").format("MMM DD, YYYY h:mm A");
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
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.service.duration} min • ₹
                            {record.service.price}
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
                        Duration: {record.duration} min
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
                        record.extras.map((extra) => (
                            <Tag
                                key={extra.id}
                                color="blue"
                                style={{ marginBottom: 4 }}
                            >
                                {extra.name} (₹{extra.pivot.price})
                            </Tag>
                        ))
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
                                    {selectedBooking.service.name}
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
                                    {selectedBooking.duration} minutes
                                </Descriptions.Item>
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
                                                (extra) => (
                                                    <Descriptions.Item
                                                        key={extra.id}
                                                        label={extra.name}
                                                    >
                                                        ₹{extra.pivot.price}
                                                    </Descriptions.Item>
                                                )
                                            )}
                                        </Descriptions>
                                        <Divider />
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
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}
