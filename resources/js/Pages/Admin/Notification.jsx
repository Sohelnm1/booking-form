<<<<<<< HEAD
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Typography,
    Row,
    Col,
    Switch,
    Button,
    Space,
    Table,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    message,
    Badge,
    List,
    Avatar,
    Divider,
} from "antd";
import {
    NotificationOutlined,
    BellOutlined,
    MailOutlined,
    MessageOutlined,
    SettingOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Notification({ auth }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [form] = Form.useForm();

    // Sample notification templates
    const notificationTemplates = [
        {
            id: 1,
            name: "Booking Confirmation",
            type: "email",
            subject: "Your booking has been confirmed",
            content:
                "Dear {customer_name}, your booking for {service_name} on {date} at {time} has been confirmed.",
            is_active: true,
            triggers: ["booking_confirmed"],
        },
        {
            id: 2,
            name: "Booking Reminder",
            type: "sms",
            subject: "Booking Reminder",
            content:
                "Reminder: You have a booking for {service_name} tomorrow at {time}. Please arrive 10 minutes early.",
            is_active: true,
            triggers: ["24_hours_before"],
        },
        {
            id: 3,
            name: "Payment Success",
            type: "email",
            subject: "Payment Successful",
            content:
                "Thank you for your payment of ₹{amount} for {service_name}. Your booking is confirmed.",
            is_active: true,
            triggers: ["payment_success"],
        },
        {
            id: 4,
            name: "Booking Cancellation",
            type: "sms",
            subject: "Booking Cancelled",
            content:
                "Your booking for {service_name} on {date} has been cancelled. Contact us for rescheduling.",
            is_active: false,
            triggers: ["booking_cancelled"],
        },
    ];

    // Sample notification history
    const notificationHistory = [
        {
            id: 1,
            recipient: "John Doe",
            type: "email",
            subject: "Your booking has been confirmed",
            status: "sent",
            sent_at: "2024-01-15 10:30:00",
            delivery_time: "2 seconds",
        },
        {
            id: 2,
            recipient: "Jane Smith",
            type: "sms",
            subject: "Booking Reminder",
            status: "delivered",
            sent_at: "2024-01-15 09:15:00",
            delivery_time: "5 seconds",
        },
        {
            id: 3,
            recipient: "Mike Johnson",
            type: "email",
            subject: "Payment Successful",
            status: "failed",
            sent_at: "2024-01-15 08:45:00",
            delivery_time: "N/A",
        },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case "email":
                return <MailOutlined style={{ color: "#1890ff" }} />;
            case "sms":
                return <MessageOutlined style={{ color: "#52c41a" }} />;
            default:
                return <BellOutlined />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "sent":
                return "blue";
            case "delivered":
                return "green";
            case "failed":
                return "red";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "sent":
                return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
            case "delivered":
                return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
            case "failed":
                return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    const columns = [
        {
            title: "Template Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Space>
                    {getTypeIcon(type)}
                    <Tag color={type === "email" ? "blue" : "green"}>
                        {type.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ellipsis: true,
        },
        {
            title: "Triggers",
            dataIndex: "triggers",
            key: "triggers",
            render: (triggers) => (
                <Space>
                    {triggers.map((trigger) => (
                        <Tag key={trigger} size="small">
                            {trigger.replace(/_/g, " ")}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Switch
                        checked={record.is_active}
                        size="small"
                        onChange={() => handleToggleStatus(record)}
                    />
                </Space>
            ),
        },
    ];

    const historyColumns = [
        {
            title: "Recipient",
            dataIndex: "recipient",
            key: "recipient",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Space>
                    {getTypeIcon(type)}
                    <Tag color={type === "email" ? "blue" : "green"}>
                        {type.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Space>
                    {getStatusIcon(status)}
                    <Tag color={getStatusColor(status)}>
                        {status.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Sent At",
            dataIndex: "sent_at",
            key: "sent_at",
        },
        {
            title: "Delivery Time",
            dataIndex: "delivery_time",
            key: "delivery_time",
        },
    ];

    const handleEdit = (template) => {
        setEditingNotification(template);
        form.setFieldsValue({
            name: template.name,
            type: template.type,
            subject: template.subject,
            content: template.content,
            triggers: template.triggers,
            is_active: template.is_active,
        });
        setIsModalVisible(true);
    };

    const handleToggleStatus = (template) => {
        // Implement toggle functionality
        message.success(
            `${template.name} ${
                template.is_active ? "disabled" : "enabled"
            } successfully`
        );
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            // Implement save functionality
            message.success("Notification template updated successfully");
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Notification Management" />
            <div>
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Notification Management
                    </Title>
                    <Text type="secondary">
                        Manage notification templates and view delivery history
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Notification Templates"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Template
                                </Button>
                            }
                        >
                            <Table
                                columns={columns}
                                dataSource={notificationTemplates}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Quick Stats">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={156} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<BellOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>Total Sent Today</Text>
                                    </div>
                                </div>

                                <Divider />

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={98} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<CheckCircleOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>
                                            Successfully Delivered
                                        </Text>
                                    </div>
                                </div>

                                <Divider />

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={58} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<ClockCircleOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>Pending Delivery</Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Card title="Recent Notifications" style={{ marginTop: 24 }}>
                    <Table
                        columns={historyColumns}
                        dataSource={notificationHistory}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                <Modal
                    title="Edit Notification Template"
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={700}
                    okText="Save Changes"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Template Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter template name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter template name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="type"
                                    label="Notification Type"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select type",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select notification type">
                                        <Option value="email">Email</Option>
                                        <Option value="sms">SMS</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter subject",
                                },
                            ]}
                        >
                            <Input placeholder="Enter notification subject" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter content",
                                },
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter notification content. Use {variable_name} for dynamic content."
                            />
                        </Form.Item>

                        <Form.Item
                            name="triggers"
                            label="Triggers"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select triggers",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select when this notification should be sent"
                            >
                                <Option value="booking_confirmed">
                                    Booking Confirmed
                                </Option>
                                <Option value="booking_cancelled">
                                    Booking Cancelled
                                </Option>
                                <Option value="payment_success">
                                    Payment Success
                                </Option>
                                <Option value="24_hours_before">
                                    24 Hours Before
                                </Option>
                                <Option value="1_hour_before">
                                    1 Hour Before
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="is_active"
                            label="Active"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
=======
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Typography,
    Row,
    Col,
    Switch,
    Button,
    Space,
    Table,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    message,
    Badge,
    List,
    Avatar,
    Divider,
} from "antd";
import {
    NotificationOutlined,
    BellOutlined,
    MailOutlined,
    MessageOutlined,
    SettingOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Notification({ auth }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [form] = Form.useForm();

    // Sample notification templates
    const notificationTemplates = [
        {
            id: 1,
            name: "Booking Confirmation",
            type: "email",
            subject: "Your booking has been confirmed",
            content:
                "Dear {customer_name}, your booking for {service_name} on {date} at {time} has been confirmed.",
            is_active: true,
            triggers: ["booking_confirmed"],
        },
        {
            id: 2,
            name: "Booking Reminder",
            type: "sms",
            subject: "Booking Reminder",
            content:
                "Reminder: You have a booking for {service_name} tomorrow at {time}. Please arrive 10 minutes early.",
            is_active: true,
            triggers: ["24_hours_before"],
        },
        {
            id: 3,
            name: "Payment Success",
            type: "email",
            subject: "Payment Successful",
            content:
                "Thank you for your payment of ₹{amount} for {service_name}. Your booking is confirmed.",
            is_active: true,
            triggers: ["payment_success"],
        },
        {
            id: 4,
            name: "Booking Cancellation",
            type: "sms",
            subject: "Booking Cancelled",
            content:
                "Your booking for {service_name} on {date} has been cancelled. Contact us for rescheduling.",
            is_active: false,
            triggers: ["booking_cancelled"],
        },
    ];

    // Sample notification history
    const notificationHistory = [
        {
            id: 1,
            recipient: "John Doe",
            type: "email",
            subject: "Your booking has been confirmed",
            status: "sent",
            sent_at: "2024-01-15 10:30:00",
            delivery_time: "2 seconds",
        },
        {
            id: 2,
            recipient: "Jane Smith",
            type: "sms",
            subject: "Booking Reminder",
            status: "delivered",
            sent_at: "2024-01-15 09:15:00",
            delivery_time: "5 seconds",
        },
        {
            id: 3,
            recipient: "Mike Johnson",
            type: "email",
            subject: "Payment Successful",
            status: "failed",
            sent_at: "2024-01-15 08:45:00",
            delivery_time: "N/A",
        },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case "email":
                return <MailOutlined style={{ color: "#1890ff" }} />;
            case "sms":
                return <MessageOutlined style={{ color: "#52c41a" }} />;
            default:
                return <BellOutlined />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "sent":
                return "blue";
            case "delivered":
                return "green";
            case "failed":
                return "red";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "sent":
                return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
            case "delivered":
                return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
            case "failed":
                return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    const columns = [
        {
            title: "Template Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Space>
                    {getTypeIcon(type)}
                    <Tag color={type === "email" ? "blue" : "green"}>
                        {type.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ellipsis: true,
        },
        {
            title: "Triggers",
            dataIndex: "triggers",
            key: "triggers",
            render: (triggers) => (
                <Space>
                    {triggers.map((trigger) => (
                        <Tag key={trigger} size="small">
                            {trigger.replace(/_/g, " ")}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Switch
                        checked={record.is_active}
                        size="small"
                        onChange={() => handleToggleStatus(record)}
                    />
                </Space>
            ),
        },
    ];

    const historyColumns = [
        {
            title: "Recipient",
            dataIndex: "recipient",
            key: "recipient",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Space>
                    {getTypeIcon(type)}
                    <Tag color={type === "email" ? "blue" : "green"}>
                        {type.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Space>
                    {getStatusIcon(status)}
                    <Tag color={getStatusColor(status)}>
                        {status.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Sent At",
            dataIndex: "sent_at",
            key: "sent_at",
        },
        {
            title: "Delivery Time",
            dataIndex: "delivery_time",
            key: "delivery_time",
        },
    ];

    const handleEdit = (template) => {
        setEditingNotification(template);
        form.setFieldsValue({
            name: template.name,
            type: template.type,
            subject: template.subject,
            content: template.content,
            triggers: template.triggers,
            is_active: template.is_active,
        });
        setIsModalVisible(true);
    };

    const handleToggleStatus = (template) => {
        // Implement toggle functionality
        message.success(
            `${template.name} ${
                template.is_active ? "disabled" : "enabled"
            } successfully`
        );
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            // Implement save functionality
            message.success("Notification template updated successfully");
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Notification Management" />
            <div>
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Notification Management
                    </Title>
                    <Text type="secondary">
                        Manage notification templates and view delivery history
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card
                            title="Notification Templates"
                            extra={
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Template
                                </Button>
                            }
                        >
                            <Table
                                columns={columns}
                                dataSource={notificationTemplates}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Quick Stats">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={156} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<BellOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>Total Sent Today</Text>
                                    </div>
                                </div>

                                <Divider />

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={98} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<CheckCircleOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>
                                            Successfully Delivered
                                        </Text>
                                    </div>
                                </div>

                                <Divider />

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Badge count={58} showZero>
                                        <Avatar
                                            size={64}
                                            icon={<ClockCircleOutlined />}
                                        />
                                    </Badge>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong>Pending Delivery</Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Card title="Recent Notifications" style={{ marginTop: 24 }}>
                    <Table
                        columns={historyColumns}
                        dataSource={notificationHistory}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                <Modal
                    title="Edit Notification Template"
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={700}
                    okText="Save Changes"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Template Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter template name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter template name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="type"
                                    label="Notification Type"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select type",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select notification type">
                                        <Option value="email">Email</Option>
                                        <Option value="sms">SMS</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter subject",
                                },
                            ]}
                        >
                            <Input placeholder="Enter notification subject" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter content",
                                },
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter notification content. Use {variable_name} for dynamic content."
                            />
                        </Form.Item>

                        <Form.Item
                            name="triggers"
                            label="Triggers"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select triggers",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select when this notification should be sent"
                            >
                                <Option value="booking_confirmed">
                                    Booking Confirmed
                                </Option>
                                <Option value="booking_cancelled">
                                    Booking Cancelled
                                </Option>
                                <Option value="payment_success">
                                    Payment Success
                                </Option>
                                <Option value="24_hours_before">
                                    24 Hours Before
                                </Option>
                                <Option value="1_hour_before">
                                    1 Hour Before
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="is_active"
                            label="Active"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
