import React, { useState, useEffect } from "react";
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
    Table,
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    Upload,
    message,
    Popconfirm,
    Tooltip,
    Select,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Extras({ auth, extras, services, durations, errors }) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Debug logging
    console.log("Admin Extras component - Extras data:", extras);

    // Debug individual extras
    extras.forEach((extra, index) => {
        console.log(`Admin Extra ${index + 1}:`, {
            id: extra.id,
            name: extra.name,
            duration_id: extra.duration_id,
            durationRelation: extra.durationRelation,
            hasDurationRelation: !!extra.durationRelation,
            durationLabel: extra.durationRelation?.label,
        });
    });
    const [editingExtra, setEditingExtra] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Set form values when editing
    useEffect(() => {
        if (isModalVisible) {
            if (editingExtra) {
                const formValues = {
                    name: editingExtra.name || "",
                    description: editingExtra.description || "",
                    price: parseFloat(editingExtra.price) || 0,
                    duration_id: editingExtra.duration_id || null,
                    max_quantity: editingExtra.max_quantity || 5,
                    sort_order: editingExtra.sort_order || 0,
                    is_active:
                        editingExtra.is_active !== undefined
                            ? editingExtra.is_active
                            : true,
                    services:
                        editingExtra.services?.map((service) => service.id) ||
                        [],
                };

                setTimeout(() => {
                    form.setFieldsValue(formValues);
                }, 100);
            } else {
                // Set default values when adding new extra
                setTimeout(() => {
                    form.setFieldsValue({
                        is_active: true,
                        duration_id: null,
                        max_quantity: 5,
                        sort_order: 0,
                        description: "",
                        services: [],
                    });
                }, 100);
            }
        }
    }, [isModalVisible, editingExtra, form]);

    const handleAdd = () => {
        setEditingExtra(null);
        setIsViewMode(false);
        setIsModalVisible(true);
    };

    const handleEdit = (extra) => {
        setEditingExtra(extra);
        setIsViewMode(false);
        setIsModalVisible(true);
    };

    const handleView = (extra) => {
        setEditingExtra(extra);
        setIsViewMode(true);
        setIsModalVisible(true);
    };

    const handleSortOrderChange = (extraId, newSortOrder) => {
        if (newSortOrder === null || newSortOrder < 0) {
            message.error("Sort order must be a positive number");
            return;
        }

        router.put(
            route("admin.extras.update-sort-order", extraId),
            { sort_order: newSortOrder },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    message.success("Sort order updated successfully");
                },
                onError: (errors) => {
                    message.error(
                        errors.error || "Failed to update sort order"
                    );
                },
            }
        );
    };

    const handleDelete = (extra) => {
        Modal.confirm({
            title: "Delete Extra",
            content: `Are you sure you want to delete "${extra.name}"? This action cannot be undone.`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                message.loading({
                    content: "Deleting extra...",
                    key: "deleteExtra",
                });

                router.post(route("admin.extras.delete", extra.id), {
                    onSuccess: () => {
                        message.success({
                            content: "Extra deleted successfully",
                            key: "deleteExtra",
                            duration: 3,
                        });
                    },
                    onError: () => {
                        message.error({
                            content: "Failed to delete extra",
                            key: "deleteExtra",
                            duration: 5,
                        });
                    },
                });
            },
        });
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                setLoading(true);

                const formData = new FormData();

                Object.keys(values).forEach((key) => {
                    if (
                        key === "image" &&
                        values[key]?.fileList?.[0]?.originFileObj
                    ) {
                        formData.append(
                            "image",
                            values[key].fileList[0].originFileObj
                        );
                    } else if (key === "price") {
                        const priceValue = parseFloat(values[key]) || 0;
                        formData.append(key, priceValue);
                    } else if (key === "duration_id") {
                        const durationId = values[key] || null;
                        formData.append(key, durationId);
                    } else if (key === "is_active") {
                        formData.append(key, values[key] ? "1" : "0");
                    } else if (key === "services") {
                        // Handle services array
                        if (values[key] && values[key].length > 0) {
                            values[key].forEach((serviceId) => {
                                formData.append("services[]", serviceId);
                            });
                        }
                    } else if (key === "sort_order") {
                        // Handle sort_order specifically to prevent null values
                        const sortOrder =
                            values[key] !== null && values[key] !== undefined
                                ? values[key]
                                : 0;
                        formData.append(key, sortOrder);
                    } else {
                        formData.append(key, values[key] || "");
                    }
                });

                if (editingExtra) {
                    // Update extra
                    formData.append("_method", "PUT");
                    router.post(
                        route("admin.extras.update", editingExtra.id),
                        formData,
                        {
                            onSuccess: () => {
                                message.success("Extra updated successfully");
                                setIsModalVisible(false);
                                form.resetFields();
                            },
                            onError: (errors) => {
                                if (errors) {
                                    Object.keys(errors).forEach((key) => {
                                        form.setFields([
                                            {
                                                name: key,
                                                errors: [errors[key]],
                                            },
                                        ]);
                                    });
                                }
                                message.error("Failed to update extra");
                            },
                            onFinish: () => {
                                setLoading(false);
                            },
                        }
                    );
                } else {
                    // Create extra
                    router.post(route("admin.extras.store"), formData, {
                        onSuccess: () => {
                            message.success("Extra created successfully");
                            setIsModalVisible(false);
                            form.resetFields();
                        },
                        onError: (errors) => {
                            if (errors) {
                                Object.keys(errors).forEach((key) => {
                                    form.setFields([
                                        {
                                            name: key,
                                            errors: [errors[key]],
                                        },
                                    ]);
                                });
                            }
                            message.error("Failed to create extra");
                        },
                        onFinish: () => {
                            setLoading(false);
                        },
                    });
                }
            })
            .catch((errorInfo) => {
                console.error("Form validation failed:", errorInfo);
                message.error("Please check the form and try again");
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setIsViewMode(false);
        form.resetFields();
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image, record) => (
                <Image
                    width={40}
                    height={40}
                    src={
                        image ||
                        `https://placehold.co/40x40/1890ff/ffffff?text=${
                            record.name?.charAt(0)?.toUpperCase() || "E"
                        }`
                    }
                    alt={record.name}
                    style={{ borderRadius: 4 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text strong>{name}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                    {description || "No description"}
                </Text>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => (
                <Text strong style={{ color: "#52c41a" }}>
                    ₹{price}
                </Text>
            ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <ClockCircleOutlined style={{ color: "#1890ff" }} />
                    <Text>
                        {record.durationRelation
                            ? record.durationRelation.label
                            : "No additional time"}
                    </Text>
                </div>
            ),
        },
        {
            title: "Available For",
            dataIndex: "services",
            key: "services",
            render: (services) => (
                <div>
                    {services && services.length > 0 ? (
                        services.slice(0, 2).map((service) => (
                            <Tag
                                key={service.id}
                                color="blue"
                                style={{ marginBottom: 4 }}
                            >
                                {service.name}
                            </Tag>
                        ))
                    ) : (
                        <Tag color="orange">All Services</Tag>
                    )}
                    {services && services.length > 2 && (
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                            +{services.length - 2} more
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Sort Order",
            dataIndex: "sort_order",
            key: "sort_order",
            render: (sortOrder, record) => (
                <InputNumber
                    min={0}
                    max={999}
                    value={sortOrder}
                    onChange={(value) =>
                        handleSortOrderChange(record.id, value)
                    }
                    style={{ width: 80 }}
                    size="small"
                />
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (is_active) => (
                <Tag color={is_active ? "green" : "red"}>
                    {is_active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Extra">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Extra">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Extra">
                        <Popconfirm
                            title="Delete this extra?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Extras Management" />
            <div>
                <div
                    style={{
                        marginBottom: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Title level={2} style={{ marginBottom: 4 }}>
                            Extras Management
                        </Title>
                        <Text type="secondary">
                            Manage additional services and add-ons
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Extra
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={extras}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} extras`,
                        }}
                    />
                </Card>

                {/* Add/Edit/View Modal */}
                <Modal
                    title={
                        isViewMode
                            ? `View Extra: ${editingExtra?.name}`
                            : editingExtra
                            ? "Edit Extra"
                            : "Add Extra"
                    }
                    open={isModalVisible}
                    onOk={isViewMode ? handleModalCancel : handleModalOk}
                    onCancel={handleModalCancel}
                    confirmLoading={loading}
                    width={600}
                    okText={isViewMode ? "Close" : "Save"}
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Extra name*"
                                    rules={
                                        isViewMode
                                            ? []
                                            : [
                                                  {
                                                      required: true,
                                                      message:
                                                          "Please enter extra name",
                                                      whitespace: true,
                                                  },
                                              ]
                                    }
                                >
                                    <Input
                                        placeholder="Enter name"
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="price"
                                    label="Price*"
                                    rules={
                                        isViewMode
                                            ? []
                                            : [
                                                  {
                                                      required: true,
                                                      message:
                                                          "Please enter price",
                                                  },
                                                  {
                                                      type: "number",
                                                      min: 0,
                                                      message:
                                                          "Price must be a positive number",
                                                  },
                                              ]
                                    }
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="0.00"
                                        min={0}
                                        step={0.01}
                                        disabled={isViewMode}
                                        formatter={(value) =>
                                            `₹ ${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                            )
                                        }
                                        parser={(value) =>
                                            value.replace(/₹\s?|(,*)/g, "")
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={3}
                                placeholder="Describe this extra service..."
                                disabled={isViewMode}
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="duration_id"
                                    label="Additional Duration"
                                >
                                    <Select
                                        placeholder="Select duration (optional)"
                                        allowClear
                                        style={{ width: "100%" }}
                                        disabled={isViewMode}
                                    >
                                        {durations?.map((duration) => (
                                            <Option
                                                key={duration.id}
                                                value={duration.id}
                                            >
                                                {duration.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="max_quantity"
                                    label="Max Quantity"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter maximum quantity",
                                        },
                                        {
                                            type: "number",
                                            min: 1,
                                            max: 20,
                                            message:
                                                "Value must be between 1 and 20",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={20}
                                        style={{ width: "100%" }}
                                        placeholder="Enter max quantity"
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="sort_order"
                                    label="Sort Order"
                                    rules={[
                                        {
                                            type: "number",
                                            min: 0,
                                            message:
                                                "Sort order must be a positive number",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={999}
                                        style={{ width: "100%" }}
                                        placeholder="0"
                                        disabled={isViewMode}
                                        onChange={(value) => {
                                            // Ensure the value is always a number, default to 0 if null/undefined
                                            const numValue =
                                                value !== null &&
                                                value !== undefined
                                                    ? value
                                                    : 0;
                                            form.setFieldsValue({
                                                sort_order: numValue,
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="is_active"
                                    label="Active"
                                    valuePropName="checked"
                                >
                                    <Switch disabled={isViewMode} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="services"
                            label="Available for Services"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select services (leave empty for all services)"
                                allowClear
                                style={{ width: "100%" }}
                                disabled={isViewMode}
                            >
                                {services.map((service) => (
                                    <Option key={service.id} value={service.id}>
                                        {service.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                marginTop: 4,
                                marginBottom: 16,
                            }}
                        >
                            Select specific services where this extra will be
                            available. Leave empty to make it available for all
                            services.
                        </Text>

                        <Form.Item name="image" label="Extra image">
                            <Upload.Dragger
                                name="file"
                                multiple={false}
                                beforeUpload={() => false}
                                showUploadList={true}
                                accept="image/*"
                                maxCount={1}
                                fileList={[]}
                                disabled={isViewMode}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    {isViewMode
                                        ? "Image preview"
                                        : "Drag and drop or choose from files"}
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
