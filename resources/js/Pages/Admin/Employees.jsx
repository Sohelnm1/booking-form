import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Space,
    Typography,
    Tag,
    Popconfirm,
    message,
    Row,
    Col,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Employees({
    auth,
    employees,
    services,
    scheduleSettings,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [form] = Form.useForm();

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        form.resetFields();
        form.setFieldsValue({
            is_active: true,
        });
        setIsModalVisible(true);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        form.setFieldsValue({
            name: employee.name,
            email: employee.email,
            phone_number: employee.phone_number,
            is_active: employee.is_active,
            services: employee.services?.map((s) => s.id) || [],
            schedule_settings:
                employee.schedule_settings?.map((s) => s.id) || [],
        });
        setIsModalVisible(true);
    };

    const handleDeleteEmployee = (employee) => {
        router.post(
            route("admin.employees.delete", employee.id),
            {},
            {
                onSuccess: () => {
                    message.success("Employee deleted successfully!");
                },
                onError: (errors) => {
                    message.error(errors.error || "Failed to delete employee");
                },
            }
        );
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const formData = {
                name: values.name,
                email: values.email,
                phone_number: values.phone_number,
                is_active: values.is_active,
                services: values.services || [],
                schedule_settings: values.schedule_settings || [],
            };

            if (editingEmployee) {
                router.put(
                    route("admin.employees.update", editingEmployee.id),
                    formData,
                    {
                        onSuccess: () => {
                            message.success("Employee updated successfully!");
                            setIsModalVisible(false);
                        },
                        onError: (errors) => {
                            message.error("Failed to update employee");
                        },
                    }
                );
            } else {
                router.post(route("admin.employees.store"), formData, {
                    onSuccess: () => {
                        message.success("Employee created successfully!");
                        setIsModalVisible(false);
                    },
                    onError: (errors) => {
                        message.error("Failed to create employee");
                    },
                });
            }
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingEmployee(null);
        form.resetFields();
    };

    const employeeColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                            {record.email}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <MailOutlined />
                        <Text copyable>{record.email}</Text>
                    </Space>
                    <Space>
                        <PhoneOutlined />
                        <Text copyable>{record.phone_number}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: "Services",
            key: "services",
            render: (_, record) => (
                <div>
                    {record.services && record.services.length > 0 ? (
                        record.services.map((service) => (
                            <Tag
                                key={service.id}
                                color="blue"
                                style={{ marginBottom: 4 }}
                            >
                                {service.name}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary">No services assigned</Text>
                    )}
                </div>
            ),
        },
        {
            title: "Schedules",
            key: "schedules",
            render: (_, record) => (
                <div>
                    {record.schedule_settings &&
                    record.schedule_settings.length > 0 ? (
                        record.schedule_settings.map((schedule) => (
                            <Tag
                                key={schedule.id}
                                color="green"
                                style={{ marginBottom: 4 }}
                            >
                                {schedule.name}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary">No schedules assigned</Text>
                    )}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <Tag
                    icon={
                        isActive ? (
                            <CheckCircleOutlined />
                        ) : (
                            <CloseCircleOutlined />
                        )
                    }
                    color={isActive ? "success" : "error"}
                >
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
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditEmployee(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Employee"
                        description="Are you sure you want to delete this employee? This action cannot be undone."
                        onConfirm={() => handleDeleteEmployee(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
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
            <Head title="Employee Management" />

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
                            Employee Management
                        </Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddEmployee}
                        >
                            Add Employee
                        </Button>
                    </div>

                    <Table
                        columns={employeeColumns}
                        dataSource={employees}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} employees`,
                        }}
                    />
                </Card>

                {/* Employee Modal */}
                <Modal
                    title={editingEmployee ? "Edit Employee" : "Add Employee"}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={600}
                    okText={editingEmployee ? "Update" : "Create"}
                    cancelText="Cancel"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            is_active: true,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Full Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter employee name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter full name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email Address"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter email address",
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "Please enter a valid email address",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter email address" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter phone number",
                                },
                            ]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>

                        <Form.Item
                            name="services"
                            label="Assigned Services"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select at least one service",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select services this employee can provide"
                                optionFilterProp="children"
                            >
                                {services.map((service) => (
                                    <Option key={service.id} value={service.id}>
                                        {service.name} ({service.duration} min)
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="schedule_settings"
                            label="Assigned Schedules (Coming Soon)"
                            disabled="true"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select schedules this employee follows (optional)"
                                optionFilterProp="children"
                                disabled={true}
                            >
                                {scheduleSettings.map((schedule) => (
                                    <Option
                                        key={schedule.id}
                                        value={schedule.id}
                                    >
                                        {schedule.name} (
                                        {schedule.working_days_text})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

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
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
