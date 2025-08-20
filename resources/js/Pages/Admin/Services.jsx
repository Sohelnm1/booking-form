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
    MedicineBoxOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    HomeOutlined,
    HeartOutlined,
    CarOutlined,
    PhoneOutlined,
    CalendarOutlined,
    StarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Services({
    auth,
    services,
    durations,
    errors,
    editService,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deletingServiceId, setDeletingServiceId] = useState(null);

    // Pricing tier states
    const [pricingTierModalVisible, setPricingTierModalVisible] =
        useState(false);
    const [editingPricingTier, setEditingPricingTier] = useState(null);
    const [pricingTierForm] = Form.useForm();

    // Use backend data
    const servicesData = services || [];
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
                    color: editingService.color || "#1890ff",
                    sort_order: editingService.sort_order || 0,
                    is_active:
                        editingService.is_active !== undefined
                            ? editingService.is_active
                            : true,
                    is_upcoming: editingService.is_upcoming || false,
                    has_flexible_duration:
                        editingService.has_flexible_duration || false,
                    has_tba_pricing: editingService.has_tba_pricing || false,
                    coming_soon_description:
                        editingService.coming_soon_description || "",
                    disclaimer_title: editingService.disclaimer_title || "",
                    disclaimer_content: editingService.disclaimer_content || "",
                    icon: editingService.icon || "",
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
                        duration: 60,
                        sort_order: 0,
                        description: "",
                        is_upcoming: false,
                        has_flexible_duration: false,
                        has_tba_pricing: false,
                        coming_soon_description: "",
                        disclaimer_title: "",
                        disclaimer_content: "",
                        icon: "",
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
                    </div>
                </div>
            ),
        },

        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price, record) => {
                if (record.has_tba_pricing) {
                    return <Tag color="orange">To be announced</Tag>;
                }
                return `₹${price}`;
            },
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration, record) => {
                if (record.has_flexible_duration) {
                    return <Tag color="blue">Flexible</Tag>;
                }
                const durationObj = durationsData.find(
                    (d) => d.value === duration
                );
                return durationObj ? durationObj.label : `${duration} min`;
            },
        },
        {
            title: "Pricing Tiers",
            dataIndex: "pricing_tiers",
            key: "pricing_tiers",
            render: (pricingTiers, record) => {
                if (!pricingTiers || pricingTiers.length === 0) {
                    return (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Standard pricing
                        </Text>
                    );
                }

                return (
                    <div>
                        <Text strong style={{ fontSize: 12 }}>
                            {pricingTiers.length} tier
                            {pricingTiers.length > 1 ? "s" : ""}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            From ₹
                            {Math.min(...pricingTiers.map((t) => t.price))} - ₹
                            {Math.max(...pricingTiers.map((t) => t.price))}
                        </Text>
                    </div>
                );
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
            render: (isActive, record) => (
                <Space direction="vertical" size={4}>
                    <Tag color={isActive ? "green" : "red"}>
                        {isActive ? "Active" : "Inactive"}
                    </Tag>
                    {record.is_upcoming && (
                        <Tag color="purple">Coming Soon</Tag>
                    )}
                </Space>
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

    const handleSortOrderChange = (serviceId, newSortOrder) => {
        if (newSortOrder === null || newSortOrder < 0) {
            message.error("Sort order must be a positive number");
            return;
        }

        router.put(
            route("admin.services.update-sort-order", serviceId),
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
                    } else if (
                        key === "is_upcoming" ||
                        key === "has_flexible_duration" ||
                        key === "has_tba_pricing"
                    ) {
                        // Ensure boolean fields are sent as string representation
                        formData.append(key, values[key] ? "1" : "0");
                        console.log(`${key} value:`, values[key] ? "1" : "0");
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

    // Pricing Tier Handlers
    const handleEditPricingTier = (tier) => {
        setEditingPricingTier(tier);
        setPricingTierModalVisible(true);

        // Set form values
        setTimeout(() => {
            pricingTierForm.setFieldsValue({
                name: tier.name,
                description: tier.description || "",
                duration_minutes: tier.duration_minutes,
                price: tier.price,
                is_popular: tier.is_popular || false,
                is_active: tier.is_active !== undefined ? tier.is_active : true,
                sort_order: tier.sort_order || 0,
            });
        }, 100);
    };

    const handleDeletePricingTier = (tierId) => {
        Modal.confirm({
            title: "Delete Pricing Tier",
            content: "Are you sure you want to delete this pricing tier?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                router.post(
                    route("admin.pricing-tiers.delete", tierId),
                    {},
                    {
                        onSuccess: () => {
                            message.success(
                                "Pricing tier deleted successfully"
                            );
                            // Refresh the page to update the service data
                            router.reload();
                        },
                        onError: () => {
                            message.error("Failed to delete pricing tier");
                        },
                    }
                );
            },
        });
    };

    const handlePricingTierModalOk = () => {
        pricingTierForm
            .validateFields()
            .then((values) => {
                setLoading(true);

                const formData = new FormData();

                // Add service_id for new tiers
                if (!editingPricingTier && editingService) {
                    formData.append("service_id", editingService.id);
                }

                Object.keys(values).forEach((key) => {
                    if (key === "is_popular" || key === "is_active") {
                        formData.append(key, values[key] ? "1" : "0");
                    } else {
                        formData.append(key, values[key] || "");
                    }
                });

                if (editingPricingTier) {
                    // Update pricing tier
                    formData.append("_method", "PUT");
                    router.post(
                        route(
                            "admin.pricing-tiers.update",
                            editingPricingTier.id
                        ),
                        formData,
                        {
                            onSuccess: () => {
                                message.success(
                                    "Pricing tier updated successfully"
                                );
                                setPricingTierModalVisible(false);
                                pricingTierForm.resetFields();
                                setEditingPricingTier(null);
                                // Refresh the page to update the service data
                                router.reload();
                            },
                            onError: (errors) => {
                                console.error(
                                    "Update pricing tier errors:",
                                    errors
                                );
                                message.error("Failed to update pricing tier");
                            },
                            onFinish: () => {
                                setLoading(false);
                            },
                        }
                    );
                } else {
                    // Create pricing tier
                    router.post(route("admin.pricing-tiers.store"), formData, {
                        onSuccess: () => {
                            message.success(
                                "Pricing tier created successfully"
                            );
                            setPricingTierModalVisible(false);
                            pricingTierForm.resetFields();
                            // Refresh the page to update the service data
                            router.reload();
                        },
                        onError: (errors) => {
                            console.error(
                                "Create pricing tier errors:",
                                errors
                            );
                            message.error("Failed to create pricing tier");
                        },
                        onFinish: () => {
                            setLoading(false);
                        },
                    });
                }
            })
            .catch((errorInfo) => {
                console.error(
                    "Pricing tier form validation failed:",
                    errorInfo
                );
                message.error("Please check the form and try again");
            });
    };

    const handlePricingTierModalCancel = () => {
        setPricingTierModalVisible(false);
        pricingTierForm.resetFields();
        setEditingPricingTier(null);
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

                        {/* Service Icon Selection */}
                        <Form.Item name="icon" label="Service Icon">
                            <Select
                                placeholder="Select an icon (optional - will auto-detect based on service name)"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                            >
                                <Option value="medical">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <MedicineBoxOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#1890ff",
                                            }}
                                        />
                                        Medical/Health Services
                                    </div>
                                </Option>
                                <Option value="elderly">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <UserOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#1890ff",
                                            }}
                                        />
                                        Elderly Care/Companion
                                    </div>
                                </Option>
                                <Option value="emergency">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ExclamationCircleOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#ff4d4f",
                                            }}
                                        />
                                        Emergency/Urgent Care
                                    </div>
                                </Option>
                                <Option value="discharge">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <HomeOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#52c41a",
                                            }}
                                        />
                                        Discharge Support/Home Care
                                    </div>
                                </Option>
                                <Option value="heart">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <HeartOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#eb2f96",
                                            }}
                                        />
                                        Cardiac/Heart Care
                                    </div>
                                </Option>
                                <Option value="transport">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <CarOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#fa8c16",
                                            }}
                                        />
                                        Transport/Ambulance
                                    </div>
                                </Option>
                                <Option value="consultation">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <PhoneOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#1890ff",
                                            }}
                                        />
                                        Phone Consultation
                                    </div>
                                </Option>
                                <Option value="appointment">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <CalendarOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#722ed1",
                                            }}
                                        />
                                        Appointment/Booking
                                    </div>
                                </Option>
                                <Option value="premium">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <StarOutlined
                                            style={{
                                                fontSize: 16,
                                                color: "#faad14",
                                            }}
                                        />
                                        Premium/VIP Services
                                    </div>
                                </Option>
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
                            Choose an icon for this service. If left empty, the
                            system will automatically detect an appropriate icon
                            based on the service name.
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
                                    Manage available durations in the{" "}
                                    <a
                                        href={route("admin.durations")}
                                        style={{ color: "#1890ff" }}
                                    >
                                        Durations
                                    </a>{" "}
                                    section.
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
                                        style={{ width: "100%" }}
                                        placeholder="0"
                                        min={0}
                                        max={999}
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

                        <Row gutter={16}>
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
                                <Form.Item
                                    name="is_upcoming"
                                    label="Upcoming Service"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Upcoming Service Options */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.is_upcoming !==
                                currentValues.is_upcoming
                            }
                        >
                            {({ getFieldValue }) => {
                                const isUpcoming = getFieldValue("is_upcoming");
                                return isUpcoming ? (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="has_flexible_duration"
                                                    label="Flexible Duration"
                                                    valuePropName="checked"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="has_tba_pricing"
                                                    label="TBA Pricing"
                                                    valuePropName="checked"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="coming_soon_description"
                                            label="Coming Soon Description"
                                        >
                                            <TextArea
                                                rows={3}
                                                placeholder="Describe what makes this upcoming service special..."
                                                style={{ minHeight: 80 }}
                                            />
                                        </Form.Item>

                                        <div
                                            style={{
                                                padding: "12px",
                                                backgroundColor: "#f0f8ff",
                                                border: "1px solid #bae7ff",
                                                borderRadius: "6px",
                                                marginBottom: 16,
                                            }}
                                        >
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                <strong>Note:</strong> Upcoming
                                                services will be displayed to
                                                customers but cannot be booked.
                                                They're perfect for announcing
                                                new services that are "Coming
                                                Soon".
                                            </Text>
                                        </div>
                                    </>
                                ) : null;
                            }}
                        </Form.Item>

                        {/* Disclaimer Section */}
                        <div style={{ marginTop: 24, marginBottom: 16 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Service Details Modal
                            </Title>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 14,
                                    marginBottom: 16,
                                    display: "block",
                                }}
                            >
                                Customize the disclaimer section that appears in
                                the service details modal.
                            </Text>
                        </div>

                        <Form.Item
                            name="disclaimer_title"
                            label="Disclaimer Title"
                        >
                            <Input
                                placeholder="e.g., What's Included, Important Notice, etc."
                                maxLength={255}
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
                            This title will appear in the service details modal.
                            Leave empty to use default "What's Included".
                        </Text>

                        <Form.Item
                            name="disclaimer_content"
                            label="Disclaimer Content"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter disclaimer content that will appear in the service details modal..."
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
                            This content will appear in the service details
                            modal. Supports HTML formatting. Leave empty to use
                            default content.
                        </Text>

                        {/* Pricing Tiers Section */}
                        <div style={{ marginTop: 24, marginBottom: 16 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Pricing Tiers (Optional)
                            </Title>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 14,
                                    marginBottom: 16,
                                    display: "block",
                                }}
                            >
                                Add multiple pricing options for this service.
                                If no tiers are added, the service will use the
                                standard price and duration above.
                            </Text>

                            {/* Pricing Tiers List */}
                            <div style={{ marginBottom: 16 }}>
                                {editingService?.pricing_tiers?.length > 0 ? (
                                    <div>
                                        <div style={{ marginBottom: 12 }}>
                                            <Text strong>
                                                Current Pricing Tiers:
                                            </Text>
                                        </div>
                                        {editingService.pricing_tiers.map(
                                            (tier, index) => (
                                                <Card
                                                    key={tier.id || index}
                                                    size="small"
                                                    style={{
                                                        marginBottom: 8,
                                                        border: "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <div>
                                                            <Text strong>
                                                                {tier.name}
                                                            </Text>
                                                            <br />
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {
                                                                    tier.duration_minutes
                                                                }{" "}
                                                                min • ₹
                                                                {tier.price}
                                                                {tier.is_popular && (
                                                                    <Tag
                                                                        color="gold"
                                                                        style={{
                                                                            marginLeft: 8,
                                                                        }}
                                                                    >
                                                                        Popular
                                                                    </Tag>
                                                                )}
                                                            </Text>
                                                        </div>
                                                        <Space>
                                                            <Button
                                                                size="small"
                                                                icon={
                                                                    <EditOutlined />
                                                                }
                                                                onClick={() =>
                                                                    handleEditPricingTier(
                                                                        tier
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                danger
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                                onClick={() =>
                                                                    handleDeletePricingTier(
                                                                        tier.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Space>
                                                    </div>
                                                </Card>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            padding: 16,
                                            border: "1px dashed #d9d9d9",
                                            borderRadius: 8,
                                            backgroundColor: "#fafafa",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Text type="secondary">
                                            No pricing tiers added yet.
                                        </Text>
                                    </div>
                                )}
                            </div>

                            {/* Add New Pricing Tier Button */}
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => setPricingTierModalVisible(true)}
                                style={{ width: "100%" }}
                            >
                                Add Pricing Tier
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Pricing Tier Modal */}
                <Modal
                    title={
                        editingPricingTier
                            ? "Edit Pricing Tier"
                            : "Add Pricing Tier"
                    }
                    open={pricingTierModalVisible}
                    onOk={handlePricingTierModalOk}
                    onCancel={handlePricingTierModalCancel}
                    confirmLoading={loading}
                    width={600}
                >
                    <Form
                        form={pricingTierForm}
                        layout="vertical"
                        onFinish={handlePricingTierModalOk}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Tier Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter tier name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Single Visit, Pack of 5" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="duration_minutes"
                                    label="Duration (minutes)"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter duration",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="e.g., 120 for 2 hours"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="price"
                            label="Price (₹)"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter price",
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                style={{ width: "100%" }}
                                placeholder="e.g., 1000.00"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description (Optional)"
                        >
                            <TextArea
                                rows={3}
                                placeholder="Describe what's included in this tier..."
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="is_popular"
                                    label="Mark as Popular"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
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

                        <Form.Item name="sort_order" label="Sort Order">
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Lower numbers appear first"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
