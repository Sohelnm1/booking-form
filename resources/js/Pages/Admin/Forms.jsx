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
    const [isFieldModalVisible, setIsFieldModalVisible] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [fieldForm] = Form.useForm();

    // Get the default booking form
    const defaultForm =
        forms.find((f) => f.name === "Default Booking Form") || forms[0];

    // Handle field modal

    const handleAddField = () => {
        setEditingField(null);
        fieldForm.resetFields();
        fieldForm.setFieldsValue({
            form_id: defaultForm?.id,
            type: "text",
            is_required: false,
            is_primary: false,
            sort_order: 0,
        });
        setIsFieldModalVisible(true);
    };

    // Auto-generate field name from label
    const handleLabelChange = (e) => {
        const label = e.target.value;
        const fieldName = label
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "") // Remove special characters except spaces
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/_+/g, "_") // Replace multiple underscores with single
            .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

        fieldForm.setFieldsValue({ name: fieldName });
    };

    const handleEditField = (field) => {
        // Don't allow editing of primary fields
        if (field.is_primary) {
            message.error(
                "Primary fields (Name, Phone, Email) cannot be edited as they are required for all bookings."
            );
            return;
        }

        setEditingField(field);

        // Format options for Form.List if they exist
        let formattedOptions = [];
        if (field.options && Array.isArray(field.options)) {
            formattedOptions = field.options.map((option, index) => ({
                key: index,
                label: option.label || option,
                value: option.value || option,
            }));
        }

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
            options: formattedOptions,
            validation_rules: field.validation_rules || [],
            services: field.services?.map((s) => s.id) || [],
        });
        setIsFieldModalVisible(true);
    };

    // Handle label change for editing (auto-generate name when label changes)
    const handleLabelChangeEdit = (e) => {
        // Always auto-generate field name when label changes (both new and editing)
        handleLabelChange(e);
    };

    const handleFieldModalOk = () => {
        fieldForm.validateFields().then((values) => {
            // Format options data properly
            let formattedOptions = [];
            if (values.options && Array.isArray(values.options)) {
                formattedOptions = values.options.map((option) => ({
                    label: option.label,
                    value: option.value,
                }));
            }

            // Prepare the data object
            const data = {
                form_id: values.form_id,
                label: values.label,
                name: values.name,
                type: values.type,
                placeholder: values.placeholder || "",
                help_text: values.help_text || "",
                is_required: values.is_required || false,
                is_primary: values.is_primary || false,
                sort_order: values.sort_order || 0,
                options: formattedOptions,
                validation_rules: values.validation_rules || [],
                services: values.services || [],
            };

            if (editingField) {
                router.put(
                    route("admin.form-fields.update", editingField.id),
                    data
                );
            } else {
                router.post(route("admin.form-fields.store"), data);
            }

            setIsFieldModalVisible(false);
        });
    };

    const handleFieldModalCancel = () => {
        setIsFieldModalVisible(false);
        setEditingField(null);
        fieldForm.resetFields();
    };

    const handleDeleteField = (id) => {
        // Find the field to check if it's primary
        const field = defaultForm?.fields?.find((f) => f.id === id);
        if (field?.is_primary) {
            message.error(
                "Primary fields (Name, Phone, Email) cannot be deleted as they are required for all bookings."
            );
            return;
        }

        router.post(route("admin.form-fields.delete", id));
    };

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
            title: "Services",
            dataIndex: "services",
            key: "services",
            render: (services) => {
                if (!services || services.length === 0) {
                    return (
                        <Tag color="green" size="small">
                            All services
                        </Tag>
                    );
                }
                return (
                    <div>
                        {services.slice(0, 2).map((service, index) => (
                            <Tag key={index} color="purple" size="small">
                                {service.name}
                            </Tag>
                        ))}
                        {services.length > 2 && (
                            <Tag size="small">+{services.length - 2} more</Tag>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                // Don't allow editing/deleting primary fields
                if (record.is_primary) {
                    return (
                        <Space>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                disabled
                                title="Primary fields cannot be edited"
                            />
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                disabled
                                title="Primary fields cannot be deleted"
                            />
                        </Space>
                    );
                }

                return (
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
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <Head title="Booking Form Fields" />
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
                                Booking Form Fields
                            </Title>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddField}
                            >
                                Add Field
                            </Button>
                        </div>
                    }
                >
                    <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">
                            Manage the fields for the booking form. Primary
                            fields (Name, Phone, Email) are shown for all
                            services. Custom fields can be assigned to specific
                            services.
                        </Text>
                    </div>

                    <Table
                        columns={fieldColumns}
                        dataSource={defaultForm?.fields || []}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

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
                            <Input
                                placeholder="Enter field label"
                                onChange={handleLabelChangeEdit}
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label={
                                editingField
                                    ? "Field Name"
                                    : "Field Name (Auto-generated)"
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter field name",
                                },
                            ]}
                        >
                            <Input
                                placeholder={
                                    editingField
                                        ? "Field name"
                                        : "Field name will be auto-generated"
                                }
                                disabled={!editingField}
                            />
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

                        {/* Options field - only show for select/radio/checkbox */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.type !== currentValues.type
                            }
                        >
                            {({ getFieldValue }) => {
                                const fieldType = getFieldValue("type");
                                const showOptions = [
                                    "select",
                                    "radio",
                                    "checkbox",
                                ].includes(fieldType);

                                return showOptions ? (
                                    <Form.Item
                                        name="options"
                                        label="Field Options"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please add at least one option",
                                            },
                                        ]}
                                    >
                                        <Form.List name="options">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(
                                                        ({
                                                            key,
                                                            name,
                                                            ...restField
                                                        }) => (
                                                            <Space
                                                                key={key}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    marginBottom: 8,
                                                                }}
                                                                align="baseline"
                                                            >
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "label",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message:
                                                                                "Please enter option label",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder="Option label"
                                                                        style={{
                                                                            width: 200,
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "value",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message:
                                                                                "Please enter option value",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder="Option value"
                                                                        style={{
                                                                            width: 150,
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    onClick={() =>
                                                                        remove(
                                                                            name
                                                                        )
                                                                    }
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                />
                                                            </Space>
                                                        )
                                                    )}
                                                    <Form.Item>
                                                        <Button
                                                            type="dashed"
                                                            onClick={() =>
                                                                add()
                                                            }
                                                            block
                                                            icon={
                                                                <PlusOutlined />
                                                            }
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                ) : null;
                            }}
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

                        {/* Services field - only show for custom fields */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.is_primary !==
                                currentValues.is_primary
                            }
                        >
                            {({ getFieldValue }) => {
                                const isPrimary = getFieldValue("is_primary");
                                return !isPrimary ? (
                                    <Form.Item
                                        name="services"
                                        label="Available for Services"
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Select specific services (leave empty to show for ALL services)"
                                            allowClear
                                            style={{ width: "100%" }}
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
                                ) : null;
                            }}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
