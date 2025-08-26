import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    message,
    Alert,
    Divider,
    Table,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    DatePicker,
    InputNumber,
    Tag,
    Popconfirm,
    Tooltip,
    Badge,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MobileOutlined,
    DesktopOutlined,
    CalendarOutlined,
    StarOutlined,
    SortAscendingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function DynamicSlots({ auth, dynamicSlots = [] }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [previewSlot, setPreviewSlot] = useState(null);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: "",
        content: "",
        type: "announcement",
        icon: null,
        background_color: "",
        text_color: "",
        action_url: "",
        action_text: "",
        is_active: true,
        sort_order: 0,
        start_date: null,
        end_date: null,
        show_on_mobile: true,
        show_on_desktop: true,
        display_duration: null,
        priority: 1,
    });

    const typeOptions = [
        { value: "offer", label: "Offer", color: "#52c41a" },
        { value: "promotion", label: "Promotion", color: "#1890ff" },
        { value: "announcement", label: "Announcement", color: "#faad14" },
        { value: "festival", label: "Festival", color: "#722ed1" },
        { value: "news", label: "News", color: "#13c2c2" },
    ];

    const iconOptions = [
        "🎉",
        "🙏",
        "🌍",
        "💝",
        "🎊",
        "🎈",
        "🎁",
        "⭐",
        "🔥",
        "💯",
        "🏆",
        "🎯",
        "💎",
        "🌟",
        "✨",
        "🎪",
        "🎭",
        "🎨",
        "🎵",
        "🎶",
        "🎸",
        "🎹",
        "🎺",
        "🎻",
        "🎤",
        "🎧",
        "🎬",
        "🎭",
        "🎪",
        "🎨",
        "🎯",
        "🎲",
        "🎮",
        "🎰",
        "🎳",
        "🎯",
    ];

    const handleCreate = () => {
        setEditingSlot(null);
        reset();
        setIsModalVisible(true);
    };

    const handleEdit = (slot) => {
        setEditingSlot(slot);
        setData({
            title: slot.title,
            content: slot.content,
            type: slot.type,
            icon: slot.icon || null,
            background_color: slot.background_color || "",
            text_color: slot.text_color || "",
            action_url: slot.action_url || "",
            action_text: slot.action_text || "",
            is_active: slot.is_active,
            sort_order: slot.sort_order,
            start_date: slot.start_date ? dayjs(slot.start_date) : null,
            end_date: slot.end_date ? dayjs(slot.end_date) : null,
            show_on_mobile: slot.show_on_mobile,
            show_on_desktop: slot.show_on_desktop,
            display_duration: slot.display_duration,
            priority: slot.priority,
        });
        setIsModalVisible(true);
    };

    const handlePreview = (slot) => {
        setPreviewSlot(slot);
        setIsPreviewModalVisible(true);
    };

    const handleSubmit = () => {
        // Debug logging
        console.log("Submitting data:", data);
        console.log("Icon value:", data.icon);

        if (editingSlot) {
            put(route("admin.dynamic-slots.update", editingSlot.id), {
                onSuccess: () => {
                    setIsModalVisible(false);
                    message.success("Dynamic slot updated successfully");
                },
            });
        } else {
            post(route("admin.dynamic-slots.store"), {
                onSuccess: () => {
                    setIsModalVisible(false);
                    message.success("Dynamic slot created successfully");
                },
            });
        }
    };

    const handleDelete = (id) => {
        router.post(
            route("admin.dynamic-slots.delete", id),
            {},
            {
                onSuccess: () => {
                    message.success("Dynamic slot deleted successfully");
                },
            }
        );
    };

    const handleToggleActive = (slot) => {
        put(
            route("admin.dynamic-slots.update", slot.id),
            {
                is_active: !slot.is_active,
            },
            {
                onSuccess: () => {
                    message.success(
                        `Dynamic slot ${
                            slot.is_active ? "deactivated" : "activated"
                        } successfully`
                    );
                },
            }
        );
    };

    const columns = [
        {
            title: "Status",
            key: "status",
            width: 80,
            render: (_, record) => (
                <Badge
                    status={record.is_active ? "success" : "default"}
                    text={record.is_active ? "Active" : "Inactive"}
                />
            ),
        },
        {
            title: "Type",
            key: "type",
            width: 120,
            render: (_, record) => {
                const typeOption = typeOptions.find(
                    (opt) => opt.value === record.type
                );
                return (
                    <Tag color={typeOption?.color}>
                        {typeOption?.label || record.type}
                    </Tag>
                );
            },
        },
        {
            title: "Icon",
            key: "icon",
            width: 80,
            render: (_, record) => (
                <span style={{ fontSize: "20px" }}>{record.icon || "📢"}</span>
            ),
        },
        {
            title: "Title",
            key: "title",
            render: (_, record) => (
                <div>
                    <Text strong>{record.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.content.length > 50
                            ? `${record.content.substring(0, 50)}...`
                            : record.content}
                    </Text>
                </div>
            ),
        },
        {
            title: "Priority",
            key: "priority",
            width: 100,
            render: (_, record) => (
                <Tag color="blue">
                    <StarOutlined /> {record.priority}
                </Tag>
            ),
        },
        {
            title: "Display",
            key: "display",
            width: 120,
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.show_on_mobile && (
                        <Tag icon={<MobileOutlined />} color="green">
                            Mobile
                        </Tag>
                    )}
                    {record.show_on_desktop && (
                        <Tag icon={<DesktopOutlined />} color="blue">
                            Desktop
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: "Schedule",
            key: "schedule",
            width: 150,
            render: (_, record) => (
                <div style={{ fontSize: "12px" }}>
                    {record.start_date && (
                        <div>
                            <CalendarOutlined /> Start:{" "}
                            {dayjs(record.start_date).format("MMM DD")}
                        </div>
                    )}
                    {record.end_date && (
                        <div>
                            <CalendarOutlined /> End:{" "}
                            {dayjs(record.end_date).format("MMM DD")}
                        </div>
                    )}
                    {!record.start_date && !record.end_date && (
                        <Text type="secondary">Always active</Text>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Preview">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip
                        title={record.is_active ? "Deactivate" : "Activate"}
                    >
                        <Button
                            type="text"
                            icon={
                                record.is_active ? (
                                    <EyeInvisibleOutlined />
                                ) : (
                                    <EyeOutlined />
                                )
                            }
                            onClick={() => handleToggleActive(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this dynamic slot?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Dynamic Slots - Admin" />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <Title level={2}>Dynamic Slots</Title>
                    <Paragraph>
                        Manage promotional content, offers, and announcements
                        that appear on the customer dashboard.
                    </Paragraph>
                </div>

                {/* Stats Cards */}
                <Row gutter={16} style={{ marginBottom: 32 }}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Slots"
                                value={dynamicSlots.length}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Active Slots"
                                value={
                                    dynamicSlots.filter(
                                        (slot) => slot.is_active
                                    ).length
                                }
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Offers"
                                value={
                                    dynamicSlots.filter(
                                        (slot) => slot.type === "offer"
                                    ).length
                                }
                                prefix={<GiftOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Promotions"
                                value={
                                    dynamicSlots.filter(
                                        (slot) => slot.type === "promotion"
                                    ).length
                                }
                                prefix={<FireOutlined />}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Create Button */}
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        size="large"
                    >
                        Create Dynamic Slot
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={dynamicSlots}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                        }}
                    />
                </Card>

                {/* Create/Edit Modal */}
                <Modal
                    title={
                        editingSlot
                            ? "Edit Dynamic Slot"
                            : "Create Dynamic Slot"
                    }
                    open={isModalVisible}
                    onOk={handleSubmit}
                    onCancel={() => setIsModalVisible(false)}
                    width={800}
                    confirmLoading={processing}
                >
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Title"
                                    validateStatus={errors.title ? "error" : ""}
                                    help={errors.title}
                                >
                                    <Input
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="Enter title"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Type"
                                    validateStatus={errors.type ? "error" : ""}
                                    help={errors.type}
                                >
                                    <Select
                                        value={data.type}
                                        onChange={(value) =>
                                            setData("type", value)
                                        }
                                        placeholder="Select type"
                                    >
                                        {typeOptions.map((option) => (
                                            <Option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                <Tag color={option.color}>
                                                    {option.label}
                                                </Tag>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Content"
                            validateStatus={errors.content ? "error" : ""}
                            help={errors.content}
                        >
                            <TextArea
                                value={data.content}
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                placeholder="Enter content"
                                rows={3}
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Icon">
                                    <Select
                                        value={data.icon}
                                        onChange={(value) =>
                                            setData("icon", value || null)
                                        }
                                        placeholder="Select icon (optional)"
                                        showSearch
                                        allowClear
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        <Option value={null}>
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#999",
                                                }}
                                            >
                                                No Icon
                                            </span>
                                        </Option>
                                        {iconOptions.map((icon) => (
                                            <Option key={icon} value={icon}>
                                                <span
                                                    style={{ fontSize: "16px" }}
                                                >
                                                    {icon}
                                                </span>
                                            </Option>
                                        ))}
                                    </Select>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Leave empty to hide the icon and show
                                        content only
                                    </Text>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Priority">
                                    <InputNumber
                                        value={data.priority}
                                        onChange={(value) =>
                                            setData("priority", value)
                                        }
                                        min={1}
                                        max={10}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Background Color">
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >
                                        <input
                                            type="color"
                                            value={
                                                data.background_color ||
                                                "#1890ff"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "background_color",
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: 50,
                                                height: 40,
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <Input
                                            value={data.background_color}
                                            onChange={(e) =>
                                                setData(
                                                    "background_color",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="#1890ff"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Choose a professional color that matches
                                        your brand
                                    </Text>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Text Color">
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >
                                        <input
                                            type="color"
                                            value={data.text_color || "#ffffff"}
                                            onChange={(e) =>
                                                setData(
                                                    "text_color",
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: 50,
                                                height: 40,
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <Input
                                            value={data.text_color}
                                            onChange={(e) =>
                                                setData(
                                                    "text_color",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="#ffffff"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Ensure good contrast with background for
                                        readability
                                    </Text>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Action URL">
                                    <Input
                                        value={data.action_url}
                                        onChange={(e) =>
                                            setData(
                                                "action_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://example.com"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Action Text">
                                    <Input
                                        value={data.action_text}
                                        onChange={(e) =>
                                            setData(
                                                "action_text",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Learn More"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Start Date">
                                    <DatePicker
                                        value={data.start_date}
                                        onChange={(date) =>
                                            setData("start_date", date)
                                        }
                                        showTime
                                        style={{ width: "100%" }}
                                        placeholder="Select start date"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="End Date">
                                    <DatePicker
                                        value={data.end_date}
                                        onChange={(date) =>
                                            setData("end_date", date)
                                        }
                                        showTime
                                        style={{ width: "100%" }}
                                        placeholder="Select end date"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Display Duration (seconds)">
                                    <InputNumber
                                        value={data.display_duration}
                                        onChange={(value) =>
                                            setData("display_duration", value)
                                        }
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="Leave empty for permanent"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Sort Order">
                                    <InputNumber
                                        value={data.sort_order}
                                        onChange={(value) =>
                                            setData("sort_order", value)
                                        }
                                        min={0}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Active">
                                    <Switch
                                        checked={data.is_active}
                                        onChange={(checked) =>
                                            setData("is_active", checked)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Show on Mobile">
                                    <Switch
                                        checked={data.show_on_mobile}
                                        onChange={(checked) =>
                                            setData("show_on_mobile", checked)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Show on Desktop">
                                    <Switch
                                        checked={data.show_on_desktop}
                                        onChange={(checked) =>
                                            setData("show_on_desktop", checked)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                {/* Preview Modal */}
                <Modal
                    title="Preview Dynamic Slot"
                    open={isPreviewModalVisible}
                    onCancel={() => setIsPreviewModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    {previewSlot && (
                        <div
                            style={{
                                background:
                                    previewSlot.background_color || "#1890ff",
                                color: previewSlot.text_color || "#ffffff",
                                padding: "24px",
                                borderRadius: "12px",
                                textAlign: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "32px",
                                    marginBottom: "12px",
                                }}
                            >
                                {previewSlot.icon || "📢"}
                            </div>
                            <Title
                                level={3}
                                style={{
                                    color: previewSlot.text_color || "#ffffff",
                                    marginBottom: "12px",
                                }}
                            >
                                {previewSlot.title}
                            </Title>
                            <Paragraph
                                style={{
                                    color: previewSlot.text_color || "#ffffff",
                                    fontSize: "16px",
                                    marginBottom: "16px",
                                }}
                            >
                                {previewSlot.content}
                            </Paragraph>
                            {previewSlot.action_text && (
                                <Button
                                    type="primary"
                                    style={{
                                        background:
                                            previewSlot.text_color || "#ffffff",
                                        color:
                                            previewSlot.background_color ||
                                            "#1890ff",
                                        border: "none",
                                    }}
                                >
                                    {previewSlot.action_text}
                                </Button>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}

// Import missing components
import { Statistic } from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    GiftOutlined,
    FireOutlined,
} from "@ant-design/icons";
