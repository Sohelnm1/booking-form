import React, { useState, useEffect } from "react";
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
    Select,
    Space,
    Tag,
    Popconfirm,
    message,
    Tabs,
    Divider,
    Typography,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Forms({ auth, forms, services, fieldTypes }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFieldModalVisible, setIsFieldModalVisible] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingForm, setEditingForm] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [form] = Form.useForm();
    const [fieldForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState("1");

    // Handle form modal
    const handleAdd = () => {
        setEditingForm(null);
        setIsViewMode(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingForm(record);
        setIsViewMode(false);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            is_active: record.is_active,
            sort_order: record.sort_order,
            services: record.services?.map((s) => s.id) || [],
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setEditingForm(record);
        setIsViewMode(true);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            is_active: record.is_active,
            sort_order: record.sort_order,
            services: record.services?.map((s) => s.id) || [],
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "services") {
                    if (values[key] && values[key].length > 0) {
                        values[key].forEach((serviceId) => {
                            formData.append("services[]", serviceId);
                        });
                    }
                } else {
                    formData.append(key, values[key] || "");
                }
            });

            if (editingForm) {
                router.put(
                    route("admin.forms.update", editingForm.id),
                    formData
                );
            } else {
                router.post(route("admin.forms.store"), formData);
            }

            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingForm(null);
        setIsViewMode(false);
        form.resetFields();
    };

    // Handle field modal
    const handleAddField = () => {
        setEditingField(null);
        fieldForm.resetFields();
        fieldForm.setFieldsValue({
            form_id: editingForm?.id,
            type: "text",
            is_required: false,
            is_primary: false,
            sort_order: 0,
        });
        setIsFieldModalVisible(true);
    };

    const handleEditField = (field) => {
        setEditingField(field);
        fieldForm.setFieldsValue({
            form_id: field.form_id,
            label: field.label,
            name: field.name,
            type: field.type,
            placeholder: field.placeholder,
            help_text: field.help_text,
            is_required: field.is_required,
            is_primary: field.is_primary,
            sort_order: field.sort_order,
            options: field.options || [],
            validation_rules: field.validation_rules || [],
        });
        setIsFieldModalVisible(true);
    };

    const handleFieldModalOk = () => {
        fieldForm.validateFields().then((values) => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "options" || key === "validation_rules") {
                    if (values[key] && values[key].length > 0) {
                        values[key].forEach((item) => {
                            formData.append(`${key}[]`, item);
                        });
                    }
                } else {
                    formData.append(key, values[key] || "");
                }
            });

            if (editingField) {
                router.put(
                    route("admin.form-fields.update", editingField.id),
                    formData
                );
            } else {
                router.post(route("admin.form-fields.store"), formData);
            }

            setIsFieldModalVisible(false);
        });
    };

    const handleFieldModalCancel = () => {
        setIsFieldModalVisible(false);
        setEditingField(null);
        fieldForm.resetFields();
    };

    const handleDelete = (id) => {
        router.post(route("admin.forms.delete", id));
    };

    const handleDeleteField = (id) => {
        router.post(route("admin.form-fields.delete", id));
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
            title: "Fields",
            dataIndex: "fields",
            key: "fields",
            render: (fields) => (
                <div>
                    <div>
                        <Tag color="blue">{fields?.length || 0} fields</Tag>
                    </div>
                    {fields && fields.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                            {fields.slice(0, 3).map((field, index) => (
                                <Tag
                                    key={index}
                                    size="small"
                                    color={
                                        field.is_primary ? "green" : "default"
                                    }
                                >
                                    {field.label}
                                </Tag>
                            ))}
                            {fields.length > 3 && (
                                <Tag size="small">
                                    +{fields.length - 3} more
                                </Tag>
                            )}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Services",
            dataIndex: "services",
            key: "services",
            render: (services) => (
                <div>
                    {services && services.length > 0 ? (
                        services.map((service, index) => (
                            <Tag key={index} color="purple">
                                {service.name}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary">No services</Text>
                    )}
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
                        onClick={() => handleView(record)}
                        title="View Form"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Edit Form"
                    />
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => {
                            setEditingForm(record);
                            setActiveTab("2");
                        }}
                        title="Manage Fields"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this form?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Form"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Field table columns
    const fieldColumns = [
        {
            title: "Label",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color="blue">{fieldTypes[type] || type}</Tag>
            ),
        },
        {
            title: "Required",
            dataIndex: "is_required",
            key: "is_required",
            render: (isRequired) => (
                <Tag color={isRequired ? "red" : "default"}>
                    {isRequired ? "Required" : "Optional"}
                </Tag>
            ),
        },
        {
            title: "Primary",
            dataIndex: "is_primary",
            key: "is_primary",
            render: (isPrimary) => (
                <Tag color={isPrimary ? "green" : "default"}>
                    {isPrimary ? "Primary" : "Custom"}
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
                        onClick={() => handleEditField(record)}
                        title="Edit Field"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this field?"
                        onConfirm={() => handleDeleteField(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Field"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Forms" />
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
                                Forms Management
                            </Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Add Form
                            </Button>
                        </div>
                    }
                >
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: "1",
                                label: "Forms",
                                children: (
                                    <Table
                                        columns={columns}
                                        dataSource={forms}
                                        rowKey="id"
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                        }}
                                    />
                                ),
                            },
                            ...(editingForm
                                ? [
                                      {
                                          key: "2",
                                          label: "Form Fields",
                                          children: (
                                              <div>
                                                  <div
                                                      style={{
                                                          marginBottom: 16,
                                                      }}
                                                  >
                                                      <Title level={4}>
                                                          Fields for:{" "}
                                                          {editingForm.name}
                                                      </Title>
                                                      <Button
                                                          type="primary"
                                                          icon={
                                                              <PlusOutlined />
                                                          }
                                                          onClick={
                                                              handleAddField
                                                          }
                                                      >
                                                          Add Field
                                                      </Button>
                                                  </div>
                                                  <Table
                                                      columns={fieldColumns}
                                                      dataSource={
                                                          editingForm.fields ||
                                                          []
                                                      }
                                                      rowKey="id"
                                                      pagination={{
                                                          pageSize: 10,
                                                          showSizeChanger: true,
                                                          showQuickJumper: true,
                                                      }}
                                                  />
                                              </div>
                                          ),
                                      },
                                  ]
                                : []),
                        ]}
                    />
                </Card>

                {/* Form Modal */}
                <Modal
                    title={
                        isViewMode
                            ? "View Form"
                            : editingForm
                            ? "Edit Form"
                            : "Add Form"
                    }
                    open={isModalVisible}
                    onOk={isViewMode ? handleModalCancel : handleModalOk}
                    onCancel={handleModalCancel}
                    width={600}
                    okText={
                        isViewMode ? "Close" : editingForm ? "Update" : "Create"
                    }
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical" disabled={isViewMode}>
                        <Form.Item
                            name="name"
                            label="Form Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter form name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter form name" />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={3}
                                placeholder="Enter form description"
                            />
                        </Form.Item>

                        <Form.Item name="services" label="Associated Services">
                            <Select
                                mode="multiple"
                                placeholder="Select services"
                                options={services.map((service) => ({
                                    label: service.name,
                                    value: service.id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item name="sort_order" label="Sort Order">
                            <InputNumber
                                min={0}
                                placeholder="Enter sort order"
                                style={{ width: "100%" }}
                            />
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

                {/* Field Modal */}
                <Modal
                    title={editingField ? "Edit Field" : "Add Field"}
                    open={isFieldModalVisible}
                    onOk={handleFieldModalOk}
                    onCancel={handleFieldModalCancel}
                    width={600}
                    okText={editingField ? "Update" : "Create"}
                    cancelText="Cancel"
                >
                    <Form form={fieldForm} layout="vertical">
                        <Form.Item name="form_id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="label"
                            label="Field Label"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter field label",
                                },
                            ]}
                        >
                            <Input placeholder="Enter field label" />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Field Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter field name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter field name (e.g., phone_number)" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="Field Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select field type",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select field type"
                                options={Object.entries(fieldTypes).map(
                                    ([key, value]) => ({
                                        label: value,
                                        value: key,
                                    })
                                )}
                            />
                        </Form.Item>

                        <Form.Item name="placeholder" label="Placeholder">
                            <Input placeholder="Enter placeholder text" />
                        </Form.Item>

                        <Form.Item name="help_text" label="Help Text">
                            <TextArea rows={2} placeholder="Enter help text" />
                        </Form.Item>

                        <Form.Item
                            name="is_required"
                            label="Required"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="is_primary"
                            label="Primary Field (Phone, Name, Email)"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item name="sort_order" label="Sort Order">
                            <InputNumber
                                min={0}
                                placeholder="Enter sort order"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
