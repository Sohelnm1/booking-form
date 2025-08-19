import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Button,
    Space,
    Typography,
    Tag,
    Row,
    Col,
    Image,
    Descriptions,
    Divider,
    Statistic,
    Progress,
    Timeline,
    Modal,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text, Paragraph } = Typography;

export default function ServiceDetail({ auth, service, durations, errors }) {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Handle case when service is not found
    if (!service) {
        return (
            <AdminLayout auth={auth}>
                <Head title="Service Not Found" />
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                    <Title
                        level={2}
                        style={{ color: "#ff4d4f", marginBottom: 16 }}
                    >
                        Service Not Found
                    </Title>
                    <Text
                        type="secondary"
                        style={{ fontSize: "16px", marginBottom: 24 }}
                    >
                        The service you're looking for doesn't exist or has been
                        deleted.
                    </Text>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.visit(route("admin.services"))}
                    >
                        Back to Services
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    // Find the duration label for display
    const durationObj = durations.find((d) => d.value === service.duration);
    const durationLabel = durationObj
        ? durationObj.label
        : `${service.duration} minutes`;

    // Mock data for statistics (in a real app, this would come from the backend)
    const stats = {
        totalBookings: 45,
        totalRevenue: service.price * 45,
        averageRating: 4.8,
        completionRate: 92,
        recentBookings: [
            {
                id: 1,
                customer: "John Doe",
                date: "2024-01-15",
                status: "completed",
            },
            {
                id: 2,
                customer: "Jane Smith",
                date: "2024-01-14",
                status: "completed",
            },
            {
                id: 3,
                customer: "Mike Johnson",
                date: "2024-01-13",
                status: "cancelled",
            },
        ],
    };

    const handleEdit = () => {
        // Navigate back to services page with edit mode
        router.visit(route("admin.services"), {
            data: { editService: service.id },
        });
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        // Show loading state
        message.loading({
            content: "Deleting service...",
            key: "deleteService",
        });

        router.post(route("admin.services.delete", service.id), {
            onSuccess: () => {
                message.success({
                    content: "Service deleted successfully",
                    key: "deleteService",
                    duration: 3,
                });
                // The backend will handle the redirect to services page
            },
            onError: (errors) => {
                console.error("Delete service errors:", errors);
                message.error({
                    content: "Failed to delete service. Please try again.",
                    key: "deleteService",
                    duration: 5,
                });
            },
        });
        setDeleteModalVisible(false);
    };

    const handleBack = () => {
        router.visit(route("admin.services"));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Service: ${service.name}`} />
            <div>
                {/* Header */}
                <div
                    style={{
                        marginBottom: 24,
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
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                            style={{ marginRight: 8 }}
                        >
                            Back to Services
                        </Button>
                        <div>
                            <Title level={2} style={{ marginBottom: 4 }}>
                                {service.name}
                            </Title>
                            <Text type="secondary">
                                Service Details & Analytics
                            </Text>
                        </div>
                    </div>
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        >
                            Edit Service
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                        >
                            Delete Service
                        </Button>
                    </Space>
                </div>

                <Row gutter={24}>
                    {/* Service Information */}
                    <Col span={16}>
                        <Card
                            title="Service Information"
                            style={{ marginBottom: 24 }}
                        >
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Image
                                        width={200}
                                        height={200}
                                        src={
                                            service.image ||
                                            `https://placehold.co/200x200/${
                                                service.color?.replace(
                                                    "#",
                                                    ""
                                                ) || "1890ff"
                                            }/ffffff?text=${
                                                service.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "S"
                                            }`
                                        }
                                        alt={service.name}
                                        style={{ borderRadius: 8 }}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                    />
                                </Col>
                                <Col span={16}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Name">
                                            <Text strong>{service.name}</Text>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Price">
                                            <Text
                                                strong
                                                style={{
                                                    color: "#52c41a",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                ₹{service.price}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Duration">
                                            <Text>
                                                <ClockCircleOutlined
                                                    style={{ marginRight: 8 }}
                                                />
                                                {durationLabel}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Status">
                                            <Tag
                                                color={
                                                    service.is_active
                                                        ? "green"
                                                        : "red"
                                                }
                                            >
                                                {service.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Color">
                                            <div
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor:
                                                        service.color ||
                                                        "#1890ff",
                                                    borderRadius: 4,
                                                    border: "1px solid #d9d9d9",
                                                }}
                                            />
                                        </Descriptions.Item>
                                    </Descriptions>

                                    {service.description && (
                                        <div style={{ marginTop: 16 }}>
                                            <Text strong>Description:</Text>
                                            <Paragraph style={{ marginTop: 8 }}>
                                                {service.description}
                                            </Paragraph>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card>

                        {/* Analytics */}
                        <Card title="Analytics & Performance">
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Bookings"
                                        value={stats.totalBookings}
                                        prefix={<CalendarOutlined />}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Revenue"
                                        value={stats.totalRevenue}
                                        prefix={<DollarOutlined />}
                                        formatter={(value) => `₹${value}`}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Average Rating"
                                        value={stats.averageRating}
                                        suffix="/ 5"
                                        precision={1}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Completion Rate"
                                        value={stats.completionRate}
                                        suffix="%"
                                    />
                                </Col>
                            </Row>

                            <Divider />

                            <div style={{ marginTop: 16 }}>
                                <Text strong>Completion Rate Trend</Text>
                                <Progress
                                    percent={stats.completionRate}
                                    status="active"
                                    style={{ marginTop: 8 }}
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* Recent Activity */}
                    <Col span={8}>
                        <Card
                            title="Recent Bookings"
                            style={{ marginBottom: 24 }}
                        >
                            <Timeline
                                items={stats.recentBookings.map((booking) => ({
                                    key: booking.id,
                                    color:
                                        booking.status === "completed"
                                            ? "green"
                                            : "red",
                                    children: (
                                        <div>
                                            <Text strong>
                                                {booking.customer}
                                            </Text>
                                            <br />
                                            <Text type="secondary">
                                                {booking.date}
                                            </Text>
                                            <br />
                                            <Tag
                                                color={
                                                    booking.status ===
                                                    "completed"
                                                        ? "green"
                                                        : "red"
                                                }
                                                size="small"
                                            >
                                                {booking.status}
                                            </Tag>
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>

                        {/* Quick Actions */}
                        <Card title="Quick Actions">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Button
                                    type="primary"
                                    icon={<CalendarOutlined />}
                                    block
                                    onClick={() =>
                                        router.visit(
                                            route("admin.appointments")
                                        )
                                    }
                                >
                                    View All Bookings
                                </Button>
                                <Button
                                    icon={<UserOutlined />}
                                    block
                                    onClick={() =>
                                        router.visit(route("admin.customers"))
                                    }
                                >
                                    Manage Customers
                                </Button>
                                <Button
                                    icon={<EyeOutlined />}
                                    block
                                    onClick={() =>
                                        window.open(
                                            `/booking?service=${service.id}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    Preview Booking Page
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Delete Service"
                    open={deleteModalVisible}
                    onOk={confirmDelete}
                    onCancel={() => setDeleteModalVisible(false)}
                    okText="Delete"
                    cancelText="Cancel"
                    okType="danger"
                >
                    <p>
                        Are you sure you want to delete "{service.name}"? This
                        action cannot be undone.
                    </p>
                    <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
                        <strong>Warning:</strong> This will also delete all
                        associated bookings and data.
                    </p>
                </Modal>
            </div>
        </AdminLayout>
    );
}
