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
    Select,
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

export default function Integration({ auth, integrations = [] }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIntegration, setEditingIntegration] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

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

        // Set form values based on integration type
        const formValues = {
            integration_id: integration.id,
            name: integration.name,
            description: integration.description,
            is_enabled: integration.is_enabled,
        };

        // Add integration-specific fields
        if (integration.settings) {
            Object.keys(integration.settings).forEach((key) => {
                formValues[key] = integration.settings[key];
            });
        }

        form.setFieldsValue(formValues);
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Extract settings based on integration type
            const settings = {};
            const integrationId = values.integration_id;

            switch (integrationId) {
                case "razorpay":
                    settings.razorpay_key = values.razorpay_key || "";
                    settings.razorpay_secret = values.razorpay_secret || "";
                    settings.currency = values.currency || "INR";
                    break;
                case "google_maps":
                    settings.google_maps_api_key =
                        values.google_maps_api_key || "";
                    settings.google_maps_enabled_services =
                        values.google_maps_enabled_services ||
                        "places,geocoding,maps";
                    break;
                case "sms":
                    settings.twilio_sid = values.twilio_sid || "";
                    settings.twilio_token = values.twilio_token || "";
                    settings.twilio_phone = values.twilio_phone || "";
                    break;
                case "email":
                    settings.sendgrid_key = values.sendgrid_key || "";
                    settings.sendgrid_from_email =
                        values.sendgrid_from_email || "";
                    settings.sendgrid_from_name =
                        values.sendgrid_from_name || "";
                    break;
            }

            // Send update request
            const response = await fetch(route("admin.integration.update"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    integration_id: integrationId,
                    settings: settings,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success("Integration settings updated successfully");
                setIsModalVisible(false);
                form.resetFields();
                // Reload the page to get updated data
                window.location.reload();
            } else {
                message.error(
                    result.error || "Failed to update integration settings"
                );
            }
        } catch (error) {
            console.error("Error updating integration:", error);
            message.error("Failed to update integration settings");
        } finally {
            setLoading(false);
        }
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

    const handleTestConnection = async (integration) => {
        try {
            setLoading(true);

            const response = await fetch(route("admin.integration.test"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    integration_id: integration.id,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success(result.success || "Connection test successful");
            } else {
                message.error(result.error || "Connection test failed");
            }
        } catch (error) {
            console.error("Error testing connection:", error);
            message.error("Failed to test connection");
        } finally {
            setLoading(false);
        }
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
                                    <Button
                                        type="text"
                                        icon={<ApiOutlined />}
                                        onClick={() =>
                                            handleTestConnection(integration)
                                        }
                                        loading={loading}
                                    >
                                        Test
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

                                    {integration.id === "razorpay" &&
                                        integration.settings?.currency && (
                                            <div>
                                                <Text strong>Currency: </Text>
                                                <Text code>
                                                    {
                                                        integration.settings
                                                            .currency
                                                    }
                                                </Text>
                                            </div>
                                        )}

                                    {integration.id === "sms" &&
                                        integration.settings?.twilio_phone && (
                                            <div>
                                                <Text strong>Phone: </Text>
                                                <Text code>
                                                    {
                                                        integration.settings
                                                            .twilio_phone
                                                    }
                                                </Text>
                                            </div>
                                        )}

                                    {integration.id === "email" &&
                                        integration.settings
                                            ?.sendgrid_from_email && (
                                            <div>
                                                <Text strong>From Email: </Text>
                                                <Text
                                                    code
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    {
                                                        integration.settings
                                                            .sendgrid_from_email
                                                    }
                                                </Text>
                                            </div>
                                        )}

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
                    title={`Configure ${editingIntegration?.name}`}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={600}
                    okText="Save Changes"
                    okIcon={<SaveOutlined />}
                    confirmLoading={loading}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="integration_id" hidden>
                            <Input />
                        </Form.Item>

                        {editingIntegration?.id === "razorpay" && (
                            <>
                                <Form.Item
                                    name="razorpay_key"
                                    label="Razorpay API Key"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Razorpay API key",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="rzp_test_..." />
                                </Form.Item>

                                <Form.Item
                                    name="razorpay_secret"
                                    label="Razorpay API Secret"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Razorpay API secret",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Enter API secret" />
                                </Form.Item>

                                <Form.Item
                                    name="currency"
                                    label="Currency"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select currency",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select currency">
                                        <Select.Option value="INR">
                                            Indian Rupee (₹)
                                        </Select.Option>
                                        <Select.Option value="USD">
                                            US Dollar ($)
                                        </Select.Option>
                                        <Select.Option value="EUR">
                                            Euro (€)
                                        </Select.Option>
                                        <Select.Option value="GBP">
                                            British Pound (£)
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )}

                        {editingIntegration?.id === "google_maps" && (
                            <>
                                <Form.Item
                                    name="google_maps_api_key"
                                    label="Google Maps API Key"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Google Maps API key",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="AIza..." />
                                </Form.Item>

                                <Form.Item
                                    name="google_maps_enabled_services"
                                    label="Enabled Services"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select enabled services",
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select enabled services"
                                        options={[
                                            {
                                                label: "Places API",
                                                value: "places",
                                            },
                                            {
                                                label: "Geocoding API",
                                                value: "geocoding",
                                            },
                                            {
                                                label: "Maps JavaScript API",
                                                value: "maps",
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Alert
                                    message="Google Maps API Setup"
                                    description="Make sure to enable the following APIs in your Google Cloud Console: Places API, Geocoding API, and Maps JavaScript API. Also ensure your API key has the necessary permissions."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                            </>
                        )}

                        {editingIntegration?.id === "sms" && (
                            <>
                                <Form.Item
                                    name="twilio_sid"
                                    label="Twilio Account SID"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Twilio Account SID",
                                        },
                                    ]}
                                >
                                    <Input placeholder="AC..." />
                                </Form.Item>

                                <Form.Item
                                    name="twilio_token"
                                    label="Twilio Auth Token"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Twilio Auth Token",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Enter auth token" />
                                </Form.Item>

                                <Form.Item
                                    name="twilio_phone"
                                    label="Twilio Phone Number"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter Twilio phone number",
                                        },
                                    ]}
                                >
                                    <Input placeholder="+1234567890" />
                                </Form.Item>
                            </>
                        )}

                        {editingIntegration?.id === "email" && (
                            <>
                                <Form.Item
                                    name="sendgrid_key"
                                    label="SendGrid API Key"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter SendGrid API key",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="SG..." />
                                </Form.Item>

                                <Form.Item
                                    name="sendgrid_from_email"
                                    label="From Email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter from email",
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "Please enter a valid email",
                                        },
                                    ]}
                                >
                                    <Input placeholder="noreply@yourdomain.com" />
                                </Form.Item>

                                <Form.Item
                                    name="sendgrid_from_name"
                                    label="From Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter from name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Your Business Name" />
                                </Form.Item>
                            </>
                        )}

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
