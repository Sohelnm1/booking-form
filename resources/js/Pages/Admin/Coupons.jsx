import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Table,
    Tag,
    Space,
    Typography,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Switch,
    Row,
    Col,
    Badge,
    Tooltip,
    message,
    Popconfirm,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    GiftOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

export default function Coupons({ auth, coupons, services }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [discountType, setDiscountType] = useState("percentage");

    const handleCreateCoupon = () => {
        setEditingCoupon(null);
        setDiscountType("percentage");
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon);
        setDiscountType(coupon.discount_type);

        // Ensure numeric values are properly set
        const formValues = {
            ...coupon,
            discount_value: parseFloat(coupon.discount_value) || null,
            minimum_amount: parseFloat(coupon.minimum_amount) || null,
            maximum_discount: coupon.maximum_discount
                ? parseFloat(coupon.maximum_discount)
                : null,
            valid_from: coupon.valid_from ? dayjs(coupon.valid_from) : null,
            valid_until: coupon.valid_until ? dayjs(coupon.valid_until) : null,
        };

        form.setFieldsValue(formValues);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingCoupon(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            console.log("Form values:", values);

            const formData = {
                code: values.code,
                name: values.name,
                description: values.description || "",
                discount_type: values.discount_type,
                discount_value: values.discount_value,
                minimum_amount: values.minimum_amount,
                maximum_discount: values.maximum_discount || null,
                max_uses: values.max_uses || null,
                max_uses_per_user: values.max_uses_per_user,
                valid_from: values.valid_from
                    ? values.valid_from.format("YYYY-MM-DD HH:mm:ss")
                    : null,
                valid_until: values.valid_until
                    ? values.valid_until.format("YYYY-MM-DD HH:mm:ss")
                    : null,
                is_active: values.is_active ?? true,
                is_first_time_only: values.is_first_time_only ?? false,
                applicable_services: values.applicable_services || [],
                excluded_services: values.excluded_services || [],
            };

            console.log("Form data to submit:", formData);

            if (editingCoupon) {
                await router.put(
                    `/admin/coupons/${editingCoupon.id}`,
                    formData
                );
            } else {
                await router.post("/admin/coupons", formData);
            }

            message.success(
                `Coupon ${editingCoupon ? "updated" : "created"} successfully!`
            );
            handleModalCancel();
        } catch (error) {
            console.error("Coupon submission error:", error);
            console.error("Error details:", error.response?.data);

            // Handle validation errors
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((field) => {
                    form.setFields([
                        {
                            name: field,
                            errors: errors[field],
                        },
                    ]);
                });
                message.error("Please fix the validation errors above.");
            } else {
                message.error("An error occurred. Please try again.");
            }
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        try {
            await router.post(`/admin/coupons/${couponId}/delete`);
            message.success("Coupon deleted successfully!");
        } catch (error) {
            message.error("An error occurred. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "success";
            case "Inactive":
                return "error";
            case "Expired":
                return "warning";
            case "Not Started":
                return "processing";
            case "Fully Used":
                return "default";
            default:
                return "default";
        }
    };

    const getDiscountTypeColor = (type) => {
        return type === "percentage" ? "blue" : "green";
    };

    // Filter coupons based on search and filters
    const filteredCoupons = coupons.filter((coupon) => {
        const matchesSearch =
            searchText === "" ||
            coupon.code.toLowerCase().includes(searchText.toLowerCase()) ||
            coupon.name.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || coupon.validity_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const couponColumns = [
        {
            title: "Code",
            key: "code",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text
                        strong
                        style={{ fontSize: "16px", fontFamily: "monospace" }}
                    >
                        {record.code}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.name}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Discount",
            key: "discount",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Tag color={getDiscountTypeColor(record.discount_type)}>
                        {record.discount_text}
                    </Tag>
                    {record.minimum_amount > 0 && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Min: Rs. {record.minimum_amount}
                        </Text>
                    )}
                    {record.maximum_discount && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Max: Rs. {record.maximum_discount}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Usage",
            key: "usage",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text>
                        {record.used_count} / {record.max_uses || "∞"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.max_uses_per_user} per user
                    </Text>
                </Space>
            ),
        },
        {
            title: "Validity",
            key: "validity",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Badge
                        status={getStatusColor(record.validity_status)}
                        text={record.validity_status}
                    />
                    {record.valid_from && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            From:{" "}
                            {dayjs(record.valid_from).format("MMM DD, YYYY")}
                        </Text>
                    )}
                    {record.valid_until && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Until:{" "}
                            {dayjs(record.valid_until).format("MMM DD, YYYY")}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Restrictions",
            key: "restrictions",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.is_first_time_only && (
                        <Tag color="orange">First-time only</Tag>
                    )}
                    {record.applicable_services &&
                        record.applicable_services.length > 0 && (
                            <Tag color="blue">Service specific</Tag>
                        )}
                    {record.excluded_services &&
                        record.excluded_services.length > 0 && (
                            <Tag color="red">Excluded services</Tag>
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
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditCoupon(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this coupon?"
                        onConfirm={() => handleDeleteCoupon(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="default"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            disabled={record.used_count > 0}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Coupons" />

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
                            <GiftOutlined style={{ marginRight: 8 }} />
                            Coupons
                        </Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateCoupon}
                        >
                            Create Coupon
                        </Button>
                    </div>

                    {/* Filters */}
                    <div style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Search
                                    placeholder="Search by code or name"
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
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                    <Option value="Expired">Expired</Option>
                                    <Option value="Not Started">
                                        Not Started
                                    </Option>
                                    <Option value="Fully Used">
                                        Fully Used
                                    </Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={couponColumns}
                        dataSource={filteredCoupons}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} coupons`,
                        }}
                    />
                </Card>

                {/* Coupon Form Modal */}
                <Modal
                    title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
                    open={isModalVisible}
                    onCancel={handleModalCancel}
                    footer={null}
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        validateOnMount={false}
                        initialValues={{
                            discount_type: "percentage",
                            max_uses_per_user: 1,
                            is_active: true,
                            is_first_time_only: false,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="code"
                                    label="Coupon Code"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter coupon code",
                                        },
                                        {
                                            min: 3,
                                            message:
                                                "Code must be at least 3 characters",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., WELCOME20" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Coupon Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter coupon name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Welcome Discount" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={3}
                                placeholder="Optional description"
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="discount_type"
                                    label="Discount Type"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select discount type",
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(value) =>
                                            setDiscountType(value)
                                        }
                                    >
                                        <Option value="percentage">
                                            Percentage
                                        </Option>
                                        <Option value="fixed">
                                            Fixed Amount
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="discount_value"
                                    label="Discount Value"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter discount value",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            message: "Value must be positive",
                                        },
                                    ]}
                                    validateTrigger={["onChange", "onBlur"]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="e.g., 20"
                                        min={0}
                                        precision={2}
                                        addonAfter={
                                            discountType === "percentage"
                                                ? "%"
                                                : "Rs."
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="minimum_amount"
                                    label="Minimum Amount"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter minimum amount",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            message: "Amount must be positive",
                                        },
                                    ]}
                                    validateTrigger={["onChange", "onBlur"]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="e.g., 500"
                                        min={0}
                                        precision={2}
                                        addonAfter="Rs."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="maximum_discount"
                                    label="Maximum Discount"
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="e.g., 1000"
                                        min={0}
                                        precision={2}
                                        addonAfter="Rs."
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="max_uses"
                                    label="Max Total Uses"
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="Unlimited"
                                        min={1}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="max_uses_per_user"
                                    label="Max Uses Per User"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter max uses per user",
                                        },
                                        {
                                            type: "number",
                                            min: 1,
                                            message: "Must be at least 1",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="e.g., 1"
                                        min={1}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="valid_from" label="Valid From">
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        showTime
                                        placeholder="Start date & time"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="valid_until"
                                    label="Valid Until"
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        showTime
                                        placeholder="End date & time"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="applicable_services"
                                    label="Applicable Services"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="All services (if none selected)"
                                        allowClear
                                    >
                                        {services.map((service) => (
                                            <Option
                                                key={service.id}
                                                value={service.id}
                                            >
                                                {service.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="excluded_services"
                                    label="Excluded Services"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="No exclusions"
                                        allowClear
                                    >
                                        {services.map((service) => (
                                            <Option
                                                key={service.id}
                                                value={service.id}
                                            >
                                                {service.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

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
                                    name="is_first_time_only"
                                    label="First-time Users Only"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            style={{ marginTop: 24, textAlign: "right" }}
                        >
                            <Space>
                                <Button onClick={handleModalCancel}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingCoupon ? "Update" : "Create"} Coupon
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
