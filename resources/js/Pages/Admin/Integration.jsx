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
    Divider,
    Alert,
    Tag,
    Input,
    Form,
    Modal,
    message,
} from "antd";
import {
    ApiOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function Integration({ auth }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIntegration, setEditingIntegration] = useState(null);
    const [form] = Form.useForm();

    // Sample integration data
    const integrations = [
        {
            id: 1,
            name: "Razorpay Payment Gateway",
            description: "Payment processing integration for online payments",
            status: "active",
            api_key: "rzp_test_****",
            webhook_url: "https://your-domain.com/webhook/razorpay",
            is_enabled: true,
            last_sync: "2024-01-15 10:30:00",
        },
        {
            id: 2,
            name: "SMS Gateway (Twilio)",
            description: "SMS notifications for OTP and booking confirmations",
            status: "active",
            api_key: "tw_****",
            webhook_url: "https://your-domain.com/webhook/twilio",
            is_enabled: true,
            last_sync: "2024-01-15 09:15:00",
        },
        {
            id: 3,
            name: "Email Service (SendGrid)",
            description: "Email notifications and marketing emails",
            status: "inactive",
            api_key: "SG.****",
            webhook_url: "https://your-domain.com/webhook/sendgrid",
            is_enabled: false,
            last_sync: "2024-01-10 14:20:00",
        },
        {
            id: 4,
            name: "Google Calendar",
            description: "Sync bookings with Google Calendar",
            status: "pending",
            api_key: "google_****",
            webhook_url: "https://your-domain.com/webhook/google",
            is_enabled: false,
            last_sync: null,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "green";
            case "inactive":
                return "red";
            case "pending":
                return "orange";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
            case "inactive":
                return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
            case "pending":
                return <ApiOutlined style={{ color: "#faad14" }} />;
            default:
                return <ApiOutlined />;
        }
    };

    const handleEdit = (integration) => {
        setEditingIntegration(integration);
        form.setFieldsValue({
            name: integration.name,
            description: integration.description,
            api_key: integration.api_key,
            webhook_url: integration.webhook_url,
            is_enabled: integration.is_enabled,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            // Implement save functionality
            message.success("Integration updated successfully");
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleToggleStatus = (integration) => {
        // Implement toggle functionality
        message.success(
            `${integration.name} ${
                integration.is_enabled ? "disabled" : "enabled"
            } successfully`
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Integration Management" />
            <div>
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Integration Management
                    </Title>
                    <Text type="secondary">
                        Manage third-party integrations and API connections
                    </Text>
                </div>

                <Alert
                    message="Integration Status"
                    description="All integrations are working properly. Last health check: 2 minutes ago"
                    type="success"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Row gutter={[24, 24]}>
                    {integrations.map((integration) => (
                        <Col xs={24} md={12} lg={8} key={integration.id}>
                            <Card
                                title={
                                    <Space>
                                        {getStatusIcon(integration.status)}
                                        {integration.name}
                                    </Space>
                                }
                                extra={
                                    <Switch
                                        checked={integration.is_enabled}
                                        onChange={() =>
                                            handleToggleStatus(integration)
                                        }
                                        size="small"
                                    />
                                }
                                actions={[
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(integration)}
                                    >
                                        Configure
                                    </Button>,
                                ]}
                            >
                                <div style={{ marginBottom: 16 }}>
                                    <Paragraph type="secondary">
                                        {integration.description}
                                    </Paragraph>
                                </div>

                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <div>
                                        <Text strong>Status: </Text>
                                        <Tag
                                            color={getStatusColor(
                                                integration.status
                                            )}
                                        >
                                            {integration.status.toUpperCase()}
                                        </Tag>
                                    </div>

                                    <div>
                                        <Text strong>API Key: </Text>
                                        <Text code>{integration.api_key}</Text>
                                    </div>

                                    <div>
                                        <Text strong>Webhook URL: </Text>
                                        <Text code style={{ fontSize: "12px" }}>
                                            {integration.webhook_url}
                                        </Text>
                                    </div>

                                    {integration.last_sync && (
                                        <div>
                                            <Text strong>Last Sync: </Text>
                                            <Text type="secondary">
                                                {integration.last_sync}
                                            </Text>
                                        </div>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title="Configure Integration"
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={600}
                    okText="Save Changes"
                    okIcon={<SaveOutlined />}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Integration Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter integration name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter integration name" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter description",
                                },
                            ]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Enter integration description"
                            />
                        </Form.Item>

                        <Form.Item
                            name="api_key"
                            label="API Key"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter API key",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter API key" />
                        </Form.Item>

                        <Form.Item
                            name="webhook_url"
                            label="Webhook URL"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter webhook URL",
                                },
                            ]}
                        >
                            <Input placeholder="https://your-domain.com/webhook/..." />
                        </Form.Item>

                        <Form.Item
                            name="is_enabled"
                            label="Enable Integration"
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
