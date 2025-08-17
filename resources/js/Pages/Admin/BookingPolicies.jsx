import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Space,
    Tag,
    Popconfirm,
    message,
    Typography,
    Divider,
    Row,
    Col,
    Collapse,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    BellOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function BookingPolicies({ auth, policies }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [form] = Form.useForm();

    // Cancellation policy options
    const cancellationPolicyOptions = [
        { label: "Full Refund", value: "full_refund" },
        { label: "Partial Refund", value: "partial_refund" },
        { label: "No Refund", value: "no_refund" },
        { label: "Credit Only", value: "credit_only" },
    ];

    // Handle modal
    const handleAdd = () => {
        setEditingPolicy(null);
        form.resetFields();
        form.setFieldsValue({
            cancellation_window_hours: 24,
            cancellation_policy: "full_refund",
            late_cancellation_fee: 0,
            late_cancellation_window_hours: 2,
            require_cancellation_reason: false,
            auto_cancel_no_show: true,
            no_show_minutes: 15,
            reschedule_window_hours: 24,
            max_reschedule_attempts: 2,
            reschedule_fee: 0,
            reschedule_advance_notice_hours: 2,
            allow_same_day_reschedule: false,
            allow_next_day_reschedule: true,
            send_reminder_24h: true,
            send_reminder_2h: true,
            send_reminder_1h: false,
            notify_admin_on_cancellation: true,
            notify_admin_on_reschedule: true,
            notify_employee_on_cancellation: true,
            notify_employee_on_reschedule: true,
            is_active: true,
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPolicy(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            cancellation_window_hours: record.cancellation_window_hours,
            cancellation_policy: record.cancellation_policy,
            late_cancellation_fee: record.late_cancellation_fee,
            late_cancellation_window_hours:
                record.late_cancellation_window_hours,
            require_cancellation_reason: record.require_cancellation_reason,
            auto_cancel_no_show: record.auto_cancel_no_show,
            no_show_minutes: record.no_show_minutes,
            reschedule_window_hours: record.reschedule_window_hours,
            max_reschedule_attempts: record.max_reschedule_attempts,
            reschedule_fee: record.reschedule_fee,
            reschedule_advance_notice_hours:
                record.reschedule_advance_notice_hours,
            allow_same_day_reschedule: record.allow_same_day_reschedule,
            allow_next_day_reschedule: record.allow_next_day_reschedule,
            send_reminder_24h: record.send_reminder_24h,
            send_reminder_2h: record.send_reminder_2h,
            send_reminder_1h: record.send_reminder_1h,
            notify_admin_on_cancellation: record.notify_admin_on_cancellation,
            notify_admin_on_reschedule: record.notify_admin_on_reschedule,
            notify_employee_on_cancellation:
                record.notify_employee_on_cancellation,
            notify_employee_on_reschedule: record.notify_employee_on_reschedule,
            is_active: record.is_active,
            sort_order: record.sort_order,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const data = {
                name: values.name,
                description: values.description || "",
                cancellation_window_hours: values.cancellation_window_hours,
                cancellation_policy: values.cancellation_policy,
                late_cancellation_fee: values.late_cancellation_fee,
                late_cancellation_window_hours:
                    values.late_cancellation_window_hours,
                require_cancellation_reason:
                    values.require_cancellation_reason || false,
                auto_cancel_no_show: values.auto_cancel_no_show || false,
                no_show_minutes: values.no_show_minutes,
                reschedule_window_hours: values.reschedule_window_hours,
                max_reschedule_attempts: values.max_reschedule_attempts,
                reschedule_fee: values.reschedule_fee,
                reschedule_advance_notice_hours:
                    values.reschedule_advance_notice_hours,
                allow_same_day_reschedule:
                    values.allow_same_day_reschedule || false,
                allow_next_day_reschedule:
                    values.allow_next_day_reschedule || false,
                send_reminder_24h: values.send_reminder_24h || false,
                send_reminder_2h: values.send_reminder_2h || false,
                send_reminder_1h: values.send_reminder_1h || false,
                notify_admin_on_cancellation:
                    values.notify_admin_on_cancellation || false,
                notify_admin_on_reschedule:
                    values.notify_admin_on_reschedule || false,
                notify_employee_on_cancellation:
                    values.notify_employee_on_cancellation || false,
                notify_employee_on_reschedule:
                    values.notify_employee_on_reschedule || false,
                is_active: values.is_active || false,
                sort_order: values.sort_order || 0,
            };

            if (editingPolicy) {
                router.put(
                    route("admin.booking-policies.update", editingPolicy.id),
                    data
                );
            } else {
                router.post(route("admin.booking-policies.store"), data);
            }

            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingPolicy(null);
        form.resetFields();
    };

    const handleDelete = (id) => {
        router.post(route("admin.booking-policies.delete", id));
    };

    // Table columns
    const columns = [
        {
            title: "Policy Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    {record.description && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.description}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Cancellation",
            key: "cancellation",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color="red">
                            {record.cancellation_window_hours}h window
                        </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.cancellation_policy_text}
                    </Text>
                    {record.late_cancellation_fee > 0 && (
                        <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "block" }}
                        >
                            Late fee: ₹{record.late_cancellation_fee}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Reschedule",
            key: "reschedule",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color="blue">
                            {record.reschedule_window_hours}h window
                        </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Max {record.max_reschedule_attempts} attempts
                    </Text>
                    {record.reschedule_fee > 0 && (
                        <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "block" }}
                        >
                            Fee: ₹{record.reschedule_fee}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Notifications",
            key: "notifications",
            render: (_, record) => (
                <div>
                    <div>
                        <BellOutlined /> Reminders
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {[
                            record.send_reminder_24h && "24h",
                            record.send_reminder_2h && "2h",
                            record.send_reminder_1h && "1h",
                        ]
                            .filter(Boolean)
                            .join(", ")}
                    </Text>
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
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this policy?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Booking Policies" />

            <div style={{ padding: "24px" }}>
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
                            Booking Policies
                        </Title>
                        <Text type="secondary">
                            Manage reschedule and cancellation settings
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        size="large"
                    >
                        Add Policy
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={policies}
                        rowKey="id"
                        pagination={false}
                    />
                </Card>

                {/* Modal for adding/editing policies */}
                <Modal
                    title={
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <SettingOutlined />
                            {editingPolicy ? "Edit Policy" : "Add New Policy"}
                        </div>
                    }
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={800}
                    okText={editingPolicy ? "Update" : "Create"}
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
                                    label="Policy Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter policy name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Standard Policy" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="is_active"
                                    label="Status"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Active"
                                        unCheckedChildren="Inactive"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={2}
                                placeholder="Brief description of this policy..."
                            />
                        </Form.Item>

                        <Divider orientation="left">
                            <ClockCircleOutlined /> Cancellation Settings
                        </Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="cancellation_window_hours"
                                    label="Cancellation Window (hours)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="24"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="cancellation_policy"
                                    label="Cancellation Policy"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <Select
                                        options={cancellationPolicyOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="late_cancellation_fee"
                                    label="Late Cancellation Fee (₹)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        style={{ width: "100%" }}
                                        placeholder="0"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="late_cancellation_window_hours"
                                    label="Late Fee Window (hours)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="2"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="no_show_minutes"
                                    label="No-Show Auto-Cancel (min)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="15"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="require_cancellation_reason"
                                    label="Require Reason"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="auto_cancel_no_show"
                            label="Auto-Cancel No-Shows"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Divider orientation="left">
                            <ClockCircleOutlined /> Reschedule Settings
                        </Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="reschedule_window_hours"
                                    label="Reschedule Window (hours)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="24"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="max_reschedule_attempts"
                                    label="Max Reschedule Attempts"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="2"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="reschedule_fee"
                                    label="Reschedule Fee (₹)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        style={{ width: "100%" }}
                                        placeholder="0"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="reschedule_advance_notice_hours"
                                    label="Advance Notice (hours)"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="2"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="allow_same_day_reschedule"
                                    label="Allow Same Day"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="allow_next_day_reschedule"
                                    label="Allow Next Day"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">
                            <BellOutlined /> Notification Settings
                        </Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="send_reminder_24h"
                                    label="24h Reminder"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="send_reminder_2h"
                                    label="2h Reminder"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="send_reminder_1h"
                                    label="1h Reminder"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="notify_admin_on_cancellation"
                                    label="Notify Admin on Cancellation"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="notify_admin_on_reschedule"
                                    label="Notify Admin on Reschedule"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="notify_employee_on_cancellation"
                                    label="Notify Employee on Cancellation"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="notify_employee_on_reschedule"
                                    label="Notify Employee on Reschedule"
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
