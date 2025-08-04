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
    Upload,
    Select,
    Row,
    Col,
    Image,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Services({
    auth,
    services,
    categories,
    durations,
    errors,
    editService,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deletingServiceId, setDeletingServiceId] = useState(null);

    // Use backend data
    const servicesData = services || [];
    const categoriesData = categories || [];
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
            if (editingService) {
                // Set form values when modal is visible and we're editing
                const formValues = {
                    name: editingService.name,
                    description: editingService.description || "",
                    price: parseFloat(editingService.price) || 0,
                    duration: parseInt(editingService.duration) || 60,
                    category: editingService.category || "Default",
                    color: editingService.color || "#1890ff",
                    is_active:
                        editingService.is_active !== undefined
                            ? editingService.is_active
                            : true,
                };

                setTimeout(() => {
                    form.setFieldsValue(formValues);
                    console.log(
                        "Form values set via useEffect for editing:",
                        formValues
                    );
                }, 100);
            } else {
                // Set default values when adding new service
                setTimeout(() => {
                    form.setFieldsValue({
                        is_active: true,
                        color: "#1890ff",
                        category: "Default",
                        duration: 60,
                        description: "",
                    });
                    console.log(
                        "Default form values set via useEffect for adding"
                    );
                }, 100);
            }
        }
    }, [isModalVisible, editingService, form]);

    // Handle editService parameter from URL
    useEffect(() => {
        if (editService) {
            const serviceToEdit = servicesData.find((s) => s.id == editService);
            if (serviceToEdit) {
                handleEdit(serviceToEdit);
            }
        }
    }, [editService, servicesData]);

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Image
                        width={40}
                        height={40}
                        src={
                            image ||
                            `https://placehold.co/40x40/${
                                record.color?.replace("#", "") || "1890ff"
                            }/ffffff?text=${
                                record.name?.charAt(0)?.toUpperCase() || "S"
                            }`
                        }
                        alt={record.name}
                        style={{ borderRadius: 4 }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div>
                        <div style={{ fontWeight: "bold" }}>{record.name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                            {record.category}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `₹${price}`,
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration) => {
                const durationObj = durationsData.find(
                    (d) => d.value === duration
                );
                return durationObj ? durationObj.label : `${duration} min`;
            },
        },
        {
            title: "Employees",
            dataIndex: "employees",
            key: "employees",
            render: () => (
                <div style={{ opacity: 0.5 }}>
                    <Tag color="orange" size="small">
                        Coming Soon
                    </Tag>
                </div>
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
                        loading={deletingServiceId === record.id}
                        disabled={deletingServiceId === record.id}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingService(null);
        form.resetFields();
        // Clear any previous validation errors
        form.setFields([]);
        setIsModalVisible(true);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        // Clear any previous validation errors
        form.setFields([]);
        form.resetFields();

        console.log("Service data for editing:", service);

        // Set the modal visible - form values will be set by useEffect
        setIsModalVisible(true);
    };

    const handleView = (service) => {
        // Navigate to a detailed view page for the service
        router.visit(route("admin.services.show", service.id));
    };

    const handleDelete = (service) => {
        Modal.confirm({
            title: "Delete Service",
            content: (
                <div>
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>"{service.name}"</strong>?
                    </p>
                    <p
                        style={{
                            color: "#ff4d4f",
                            fontSize: "14px",
                            marginTop: 8,
                        }}
                    >
                        <strong>Warning:</strong> This action cannot be undone
                        and will permanently remove:
                    </p>
                    <ul
                        style={{
                            color: "#666",
                            fontSize: "14px",
                            marginTop: 4,
                        }}
                    >
                        <li>The service and all its data</li>
                        <li>Any associated bookings (if they exist)</li>
                        <li>Service images and files</li>
                    </ul>
                </div>
            ),
            okText: "Delete Service",
            okType: "danger",
            cancelText: "Cancel",
            width: 500,
            onOk() {
                // Set loading state
                setDeletingServiceId(service.id);

                // Show loading state
                message.loading({
                    content: "Deleting service...",
                    key: "deleteService",
                });

                console.log("Attempting to delete service:", service.id);
                console.log(
                    "Delete route:",
                    route("admin.services.delete", service.id)
                );

                router.post(route("admin.services.delete", service.id), {
                    onSuccess: () => {
                        console.log("Service deleted successfully");
                        message.success({
                            content: `Service "${service.name}" deleted successfully`,
                            key: "deleteService",
                            duration: 3,
                        });
                        setDeletingServiceId(null);
                        // Use Inertia.js navigation instead of page reload
                        router.visit(route("admin.services"), {
                            replace: true,
                            preserveScroll: false,
                        });
                    },
                    onError: (errors) => {
                        console.error("Delete service errors:", errors);
                        message.error({
                            content:
                                "Failed to delete service. Please try again.",
                            key: "deleteService",
                            duration: 5,
                        });
                        setDeletingServiceId(null);
                    },
                    onFinish: () => {
                        console.log("Delete request finished");
                    },
                });
            },
        });
    };

    const handleModalOk = () => {
        // First, let's check what the form currently has
        const currentValues = form.getFieldsValue();
        console.log("Current form values before validation:", currentValues);

        // Also check the description field specifically
        const descriptionValue = form.getFieldValue("description");
        console.log("Description field value:", descriptionValue);

        form.validateFields()
            .then((values) => {
                setLoading(true);

                console.log("Form validation passed, values:", values);

                const formData = new FormData();
                console.log("Form values:", values);

                Object.keys(values).forEach((key) => {
                    console.log(`Processing field ${key}:`, values[key]);

                    // Handle special cases first
                    if (key === "employees") {
                        // Skip employees field as it's not implemented yet
                        return;
                    }

                    if (
                        key === "image" &&
                        values[key]?.fileList?.[0]?.originFileObj
                    ) {
                        formData.append(
                            "image",
                            values[key].fileList[0].originFileObj
                        );
                    } else if (key === "color") {
                        formData.append("color", values[key] || "#1890ff");
                    } else if (key === "price") {
                        // Ensure price is sent as a number without formatting
                        const priceValue = parseFloat(values[key]) || 0;
                        formData.append(key, priceValue);
                        console.log("Price value:", priceValue);
                    } else if (key === "duration") {
                        // Ensure duration is sent as a number
                        const durationValue = parseInt(values[key]) || 0;
                        formData.append(key, durationValue);
                        console.log("Duration value:", durationValue);
                    } else if (key === "is_active") {
                        // Ensure is_active is sent as a string representation
                        formData.append(key, values[key] ? "1" : "0");
                        console.log(
                            "is_active value:",
                            values[key] ? "1" : "0"
                        );
                    } else if (key === "description") {
                        // Always include description, even if empty
                        formData.append(key, values[key] || "");
                        console.log("Description value:", values[key] || "");
                    } else {
                        // For other fields (name, category), always include them
                        // Required fields should always be sent, even if empty
                        formData.append(key, values[key] || "");
                        console.log(`${key} value:`, values[key] || "");
                    }
                });

                // Log the FormData contents
                console.log("=== FormData being sent to backend ===");
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                console.log("=== End FormData ===");

                if (editingService) {
                    // Update service - use POST with _method field for better compatibility
                    formData.append("_method", "PUT");
                    router.post(
                        route("admin.services.update", editingService.id),
                        formData,
                        {
                            onSuccess: () => {
                                message.success("Service updated successfully");
                                setIsModalVisible(false);
                                form.resetFields();
                            },
                            onError: (errors) => {
                                console.error("Update service errors:", errors);
                                // Set form errors
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
                                message.error("Failed to update service");
                            },
                            onFinish: () => {
                                setLoading(false);
                            },
                        }
                    );
                } else {
                    // Create service
                    router.post(route("admin.services.store"), formData, {
                        onSuccess: () => {
                            message.success("Service created successfully");
                            setIsModalVisible(false);
                            form.resetFields();
                        },
                        onError: (errors) => {
                            console.error("Create service errors:", errors);
                            // Set form errors
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
                            message.error("Failed to create service");
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
        form.resetFields();
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Services Management" />
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
                        <Title level={2} style={{ marginBottom: 8 }}>
                            Services
                        </Title>
                        <Text type="secondary">
                            Create and manage your services for customer
                            bookings
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={handleAdd}
                    >
                        Create Service
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={servicesData}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} services`,
                        }}
                    />
                </Card>

                <Modal
                    title={editingService ? "Edit Service" : "Create Service"}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={800}
                    okText={editingService ? "Update" : "Add Service"}
                    confirmLoading={loading}
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Service name*"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter service name",
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="color" label="Color">
                                    <Input
                                        type="color"
                                        style={{
                                            width: "100%",
                                            height: "40px",
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="category"
                                    label="Category*"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select category",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select category">
                                        {categoriesData.map(
                                            (category, index) => (
                                                <Option
                                                    key={index}
                                                    value={category}
                                                >
                                                    {category}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Employees">
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            border: "1px solid #d9d9d9",
                                            borderRadius: "6px",
                                            backgroundColor: "#f5f5f5",
                                            color: "#999",
                                            cursor: "not-allowed",
                                        }}
                                    >
                                        <Text type="secondary">
                                            <Tag color="orange">
                                                Coming Soon
                                            </Tag>{" "}
                                            Employee assignment will be
                                            available soon
                                        </Text>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={4}
                                placeholder="Insert text here ..."
                                style={{ minHeight: 100 }}
                            />
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                marginTop: 4,
                                marginBottom: 16,
                            }}
                        >
                            Descriptions appear on your booking page.
                        </Text>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="duration"
                                    label="Duration*"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select duration",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select duration">
                                        {durationsData.map((duration) => (
                                            <Option
                                                key={duration.value}
                                                value={duration.value}
                                            >
                                                {duration.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: "12px",
                                        marginTop: 4,
                                    }}
                                >
                                    If you need a different duration that isn't
                                    among the displayed ones, please visit our{" "}
                                    <a href="#" style={{ color: "#1890ff" }}>
                                        General Settings
                                    </a>{" "}
                                    and change Default Time Slot Step.
                                </Text>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="price"
                                    label="Price*"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter price",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            message:
                                                "Price must be a positive number",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="0.00"
                                        min={0}
                                        step={0.01}
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

                        <Form.Item name="image" label="Service image">
                            <Upload.Dragger
                                name="file"
                                multiple={false}
                                beforeUpload={() => false}
                                showUploadList={true}
                                accept="image/*"
                                maxCount={1}
                                fileList={[]}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Drag and drop or choose from files
                                </p>
                            </Upload.Dragger>
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
