import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Table,
    Button,
    Space,
    Typography,
    Tag,
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    message,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;

export default function Durations({ auth, durations, errors }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDuration, setEditingDuration] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deletingDurationId, setDeletingDurationId] = useState(null);

    // Use backend data
    const durationsData = durations || [];

    // Handle validation errors
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Set form errors if they exist
            Object.keys(errors).forEach((key) => {
                form.setFields([
                    {
                        name: key,
                        errors: [errors[key]],
                    },
                ]);
            });
            // Show modal if there are errors (form was submitted)
            setIsModalVisible(true);
        }
    }, [errors, form]);

    // Handle form value updates when modal becomes visible
    useEffect(() => {
        if (isModalVisible) {
            if (editingDuration) {
                // Set form values when modal is visible and we're editing
                const formValues = {
                    name: editingDuration.name,
                    hours: editingDuration.hours || 0,
                    minutes: editingDuration.minutes || 0,
                    label: editingDuration.label,
                    is_active: editingDuration.is_active,
                    sort_order: editingDuration.sort_order || 0,
                };

                setTimeout(() => {
                    form.setFieldsValue(formValues);
                }, 100);
            } else {
                // Set default values when adding new duration
                setTimeout(() => {
                    form.setFieldsValue({
                        hours: 0,
                        minutes: 0,
                        is_active: true,
                        sort_order: 0,
                    });
                }, 100);
            }
        }
    }, [isModalVisible, editingDuration, form]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <div style={{ fontWeight: "bold" }}>{name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                            {record.label}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Duration",
            dataIndex: "minutes",
            key: "duration",
            render: (minutes, record) => {
                const hours = record.hours || 0;
                const mins = record.minutes || 0;
                let displayText = "";

                if (hours > 0 && mins > 0) {
                    displayText = `${hours}h ${mins}m`;
                } else if (hours > 0) {
                    displayText = `${hours}h`;
                } else {
                    displayText = `${mins}m`;
                }

                return <Tag color="blue">{displayText}</Tag>;
            },
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
            title: "Sort Order",
            dataIndex: "sort_order",
            key: "sort_order",
            render: (sortOrder) => sortOrder || 0,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        loading={deletingDurationId === record.id}
                        disabled={deletingDurationId === record.id}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingDuration(null);
        form.resetFields();
        form.setFields([]);
        setIsModalVisible(true);
    };

    const handleEdit = (duration) => {
        setEditingDuration(duration);
        form.setFields([]);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleView = (duration) => {
        router.visit(route("admin.durations.show", duration.id));
    };

    const handleDelete = (duration) => {
        Modal.confirm({
            title: "Delete Duration",
            content: `Are you sure you want to delete "${duration.name}"?`,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                setDeletingDurationId(duration.id);
                router.post(
                    route("admin.durations.delete", duration.id),
                    {},
                    {
                        onSuccess: () => {
                            setDeletingDurationId(null);
                        },
                        onError: () => {
                            setDeletingDurationId(null);
                        },
                    }
                );
            },
        });
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();

            // Append all form values
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    if (key === "is_active") {
                        formData.append(key, values[key] ? "1" : "0");
                    } else {
                        formData.append(key, values[key]);
                    }
                }
            });

            if (editingDuration) {
                router.put(
                    route("admin.durations.update", editingDuration.id),
                    formData,
                    {
                        onSuccess: () => {
                            setIsModalVisible(false);
                            setLoading(false);
                        },
                        onError: () => {
                            setLoading(false);
                        },
                    }
                );
            } else {
                router.post(route("admin.durations.store"), formData, {
                    onSuccess: () => {
                        setIsModalVisible(false);
                        setLoading(false);
                    },
                    onError: () => {
                        setLoading(false);
                    },
                });
            }
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingDuration(null);
        form.resetFields();
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Durations - Admin Dashboard" />

            <div style={{ padding: "24px" }}>
                <Card>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                Durations
                            </Title>
                            <Text type="secondary">
                                Manage service durations for your booking system
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Add Duration
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={durationsData}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} durations`,
                        }}
                    />
                </Card>

                {/* Add/Edit Duration Modal */}
                <Modal
                    title={editingDuration ? "Edit Duration" : "Add Duration"}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    confirmLoading={loading}
                    width={600}
                    okText={editingDuration ? "Update" : "Add"}
                    cancelText="Cancel"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ marginTop: "16px" }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Name*"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter duration name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., 1 hour" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="hours"
                                    label="Hours"
                                    rules={[
                                        {
                                            type: "number",
                                            min: 0,
                                            message: "Hours must be at least 0",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="1"
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="minutes"
                                    label="Minutes*"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter minutes",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            max: 59,
                                            message:
                                                "Minutes must be between 0 and 59",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="30"
                                        min={0}
                                        max={59}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="sort_order" label="Sort Order">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="0"
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="label"
                            label="Display Label*"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter display label",
                                },
                            ]}
                        >
                            <Input placeholder="e.g., 1 hour" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="is_active"
                                    label="Active"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
