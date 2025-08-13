<<<<<<< HEAD
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Switch,
    InputNumber,
    Space,
    Tag,
    Popconfirm,
    message,
    Typography,
    Divider,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Consent({ auth, consentSettings }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingConsent, setEditingConsent] = useState(null);
    const [form] = Form.useForm();

    // Handle modal
    const handleAdd = () => {
        setEditingConsent(null);
        setIsViewMode(false);
        form.resetFields();
        form.setFieldsValue({
            is_required: true,
            is_active: true,
            sort_order: 0,
            version: "1.0",
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingConsent(record);
        setIsViewMode(false);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            content: record.content,
            summary: record.summary,
            is_required: record.is_required,
            is_active: record.is_active,
            sort_order: record.sort_order,
            version: record.version,
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setEditingConsent(record);
        setIsViewMode(true);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            content: record.content,
            summary: record.summary,
            is_required: record.is_required,
            is_active: record.is_active,
            sort_order: record.sort_order,
            version: record.version,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                formData.append(key, values[key] || "");
            });

            if (editingConsent) {
                router.put(
                    route("admin.consent.update", editingConsent.id),
                    formData
                );
            } else {
                router.post(route("admin.consent.store"), formData);
            }

            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingConsent(null);
        setIsViewMode(false);
        form.resetFields();
    };

    const handleDelete = (id) => {
        router.post(route("admin.consent.delete", id));
    };

    // Table columns
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.title}
                    </Text>
                </div>
            ),
        },
        {
            title: "Content Preview",
            dataIndex: "content",
            key: "content",
            render: (content, record) => (
                <div>
                    <div style={{ maxWidth: 300 }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.summary ||
                                content.substring(0, 100) + "..."}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color={record.is_active ? "green" : "red"}>
                            {record.is_active ? "Active" : "Inactive"}
                        </Tag>
                    </div>
                    <div style={{ marginTop: 4 }}>
                        <Tag color={record.is_required ? "blue" : "default"}>
                            {record.is_required ? "Required" : "Optional"}
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: "Version",
            dataIndex: "version",
            key: "version",
            render: (version, record) => (
                <div>
                    <Tag color="purple">{version}</Tag>
                    {record.last_updated && (
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                display: "block",
                                marginTop: 4,
                            }}
                        >
                            Updated:{" "}
                            {new Date(record.last_updated).toLocaleDateString()}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        title="View Consent"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Edit Consent"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this consent setting?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Consent"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Consent Settings" />
            <div>
                <Card
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Title level={3} style={{ margin: 0 }}>
                                Consent Settings
                            </Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Add Consent
                            </Button>
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={consentSettings}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                {/* Consent Modal */}
                <Modal
                    title={
                        isViewMode
                            ? "View Consent"
                            : editingConsent
                            ? "Edit Consent"
                            : "Add Consent"
                    }
                    open={isModalVisible}
                    onOk={isViewMode ? handleModalCancel : handleModalOk}
                    onCancel={handleModalCancel}
                    width={800}
                    okText={
                        isViewMode
                            ? "Close"
                            : editingConsent
                            ? "Update"
                            : "Create"
                    }
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical" disabled={isViewMode}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Consent Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter consent name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., terms_conditions" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label="Display Title"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter display title",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Terms and Conditions" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="summary" label="Summary">
                            <TextArea
                                rows={2}
                                placeholder="Short summary for preview (optional)"
                            />
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
                                rows={12}
                                placeholder="Enter the full content of the consent document..."
                            />
                        </Form.Item>

                        <Divider>Settings</Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="is_required"
                                    label="Required"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="is_active"
                                    label="Active"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="sort_order" label="Sort Order">
                                    <InputNumber
                                        min={0}
                                        placeholder="0"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="version" label="Version">
                            <Input placeholder="1.0" />
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
    Button,
    Table,
    Modal,
    Form,
    Input,
    Switch,
    InputNumber,
    Space,
    Tag,
    Popconfirm,
    message,
    Typography,
    Divider,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Consent({ auth, consentSettings }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingConsent, setEditingConsent] = useState(null);
    const [form] = Form.useForm();

    // Handle modal
    const handleAdd = () => {
        setEditingConsent(null);
        setIsViewMode(false);
        form.resetFields();
        form.setFieldsValue({
            is_required: true,
            is_active: true,
            sort_order: 0,
            version: "1.0",
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingConsent(record);
        setIsViewMode(false);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            content: record.content,
            summary: record.summary,
            is_required: record.is_required,
            is_active: record.is_active,
            sort_order: record.sort_order,
            version: record.version,
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setEditingConsent(record);
        setIsViewMode(true);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            content: record.content,
            summary: record.summary,
            is_required: record.is_required,
            is_active: record.is_active,
            sort_order: record.sort_order,
            version: record.version,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                formData.append(key, values[key] || "");
            });

            if (editingConsent) {
                router.put(
                    route("admin.consent.update", editingConsent.id),
                    formData
                );
            } else {
                router.post(route("admin.consent.store"), formData);
            }

            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingConsent(null);
        setIsViewMode(false);
        form.resetFields();
    };

    const handleDelete = (id) => {
        router.post(route("admin.consent.delete", id));
    };

    // Table columns
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.title}
                    </Text>
                </div>
            ),
        },
        {
            title: "Content Preview",
            dataIndex: "content",
            key: "content",
            render: (content, record) => (
                <div>
                    <div style={{ maxWidth: 300 }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.summary ||
                                content.substring(0, 100) + "..."}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color={record.is_active ? "green" : "red"}>
                            {record.is_active ? "Active" : "Inactive"}
                        </Tag>
                    </div>
                    <div style={{ marginTop: 4 }}>
                        <Tag color={record.is_required ? "blue" : "default"}>
                            {record.is_required ? "Required" : "Optional"}
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: "Version",
            dataIndex: "version",
            key: "version",
            render: (version, record) => (
                <div>
                    <Tag color="purple">{version}</Tag>
                    {record.last_updated && (
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                display: "block",
                                marginTop: 4,
                            }}
                        >
                            Updated:{" "}
                            {new Date(record.last_updated).toLocaleDateString()}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        title="View Consent"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Edit Consent"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this consent setting?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Consent"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Consent Settings" />
            <div>
                <Card
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Title level={3} style={{ margin: 0 }}>
                                Consent Settings
                            </Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Add Consent
                            </Button>
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={consentSettings}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                {/* Consent Modal */}
                <Modal
                    title={
                        isViewMode
                            ? "View Consent"
                            : editingConsent
                            ? "Edit Consent"
                            : "Add Consent"
                    }
                    open={isModalVisible}
                    onOk={isViewMode ? handleModalCancel : handleModalOk}
                    onCancel={handleModalCancel}
                    width={800}
                    okText={
                        isViewMode
                            ? "Close"
                            : editingConsent
                            ? "Update"
                            : "Create"
                    }
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical" disabled={isViewMode}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Consent Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter consent name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., terms_conditions" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label="Display Title"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter display title",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Terms and Conditions" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="summary" label="Summary">
                            <TextArea
                                rows={2}
                                placeholder="Short summary for preview (optional)"
                            />
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
                                rows={12}
                                placeholder="Enter the full content of the consent document..."
                            />
                        </Form.Item>

                        <Divider>Settings</Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="is_required"
                                    label="Required"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="is_active"
                                    label="Active"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="sort_order" label="Sort Order">
                                    <InputNumber
                                        min={0}
                                        placeholder="0"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="version" label="Version">
                            <Input placeholder="1.0" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
