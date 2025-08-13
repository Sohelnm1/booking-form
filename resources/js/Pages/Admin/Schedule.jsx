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
    TimePicker,
    Checkbox,
    Divider,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Schedule({ auth, scheduleSettings, services }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const [form] = Form.useForm();

    // Working days options
    const workingDaysOptions = [
        { label: "Monday", value: 1 },
        { label: "Tuesday", value: 2 },
        { label: "Wednesday", value: 3 },
        { label: "Thursday", value: 4 },
        { label: "Friday", value: 5 },
        { label: "Saturday", value: 6 },
        { label: "Sunday", value: 7 },
    ];

    // Handle modal
    const handleAdd = () => {
        setEditingSetting(null);
        form.resetFields();
        form.setFieldsValue({
            working_days: [1, 2, 3, 4, 5], // Default Mon-Fri
            break_times: [],
            is_active: true,
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingSetting(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            booking_window_days: record.booking_window_days,
            min_advance_hours: record.min_advance_hours,
            max_advance_days: record.max_advance_days,

            buffer_time_minutes: record.buffer_time_minutes,
            start_time: record.start_time
                ? dayjs(record.start_time, "HH:mm")
                : null,
            end_time: record.end_time ? dayjs(record.end_time, "HH:mm") : null,
            working_days: record.working_days || [1, 2, 3, 4, 5],
            break_times: record.break_times || [],
            is_active: record.is_active,
            sort_order: record.sort_order,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            // Prepare data object instead of FormData for better handling
            const data = {
                name: values.name,
                description: values.description || "",
                booking_window_days: values.booking_window_days,
                min_advance_hours: values.min_advance_hours,
                max_advance_days: values.max_advance_days,
                buffer_time_minutes: values.buffer_time_minutes,
                start_time: values.start_time
                    ? values.start_time.format("HH:mm:ss")
                    : null,
                end_time: values.end_time
                    ? values.end_time.format("HH:mm:ss")
                    : null,
                working_days: values.working_days || [],
                break_times: values.break_times || [],
                is_active: values.is_active || false,
                sort_order: values.sort_order || 0,
            };

            if (editingSetting) {
                router.put(
                    route("admin.schedule.update", editingSetting.id),
                    data
                );
            } else {
                router.post(route("admin.schedule.store"), data);
            }

            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingSetting(null);
        form.resetFields();
    };

    const handleDelete = (id) => {
        router.post(route("admin.schedule.delete", id));
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
                    {record.description && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.description}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Booking Window",
            key: "booking_window",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color="blue">
                            {record.booking_window_days} days ahead
                        </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Min: {record.min_advance_hours}h advance
                    </Text>
                </div>
            ),
        },
        {
            title: "Working Hours",
            key: "working_hours",
            render: (_, record) => (
                <div>
                    <div>
                        <ClockCircleOutlined /> {record.start_time} -{" "}
                        {record.end_time}
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.working_days_text}
                    </Text>
                </div>
            ),
        },
        {
            title: "Buffer Time",
            key: "buffer_time",
            render: (_, record) => (
                <div>
                    <div>
                        <Tag color="green">
                            {record.buffer_time_minutes} min buffer
                        </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Between appointments
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
                        title="Edit Schedule"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this schedule?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Schedule"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Schedule Settings" />
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
                                Schedule Settings
                            </Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Add Schedule
                            </Button>
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={scheduleSettings}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                {/* Schedule Modal */}
                <Modal
                    title={editingSetting ? "Edit Schedule" : "Add Schedule"}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={800}
                    okText={editingSetting ? "Update" : "Create"}
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Schedule Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter schedule name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="e.g., Default Schedule" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="sort_order" label="Sort Order">
                                    <InputNumber
                                        min={0}
                                        placeholder="Enter sort order"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={2}
                                placeholder="Enter schedule description"
                            />
                        </Form.Item>

                        <Divider>Booking Window Settings</Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="booking_window_days"
                                    label="Booking Window (Days)"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter booking window",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={365}
                                        placeholder="30"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="min_advance_hours"
                                    label="Min Advance (Hours)"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter minimum advance",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={168}
                                        placeholder="2"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="max_advance_days"
                                    label="Max Advance (Days)"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter maximum advance",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={365}
                                        placeholder="90"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider>Buffer Time Settings</Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="buffer_time_minutes"
                                    label="Buffer Time (Minutes)"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter buffer time",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={60}
                                        step={5}
                                        placeholder="15"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider>Working Hours</Divider>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="start_time"
                                    label="Start Time"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select start time",
                                        },
                                    ]}
                                >
                                    <TimePicker
                                        format="HH:mm"
                                        placeholder="09:00"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="end_time"
                                    label="End Time"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select end time",
                                        },
                                    ]}
                                >
                                    <TimePicker
                                        format="HH:mm"
                                        placeholder="18:00"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="working_days"
                                    label="Working Days"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select working days",
                                        },
                                    ]}
                                >
                                    <Checkbox.Group
                                        options={workingDaysOptions}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

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
