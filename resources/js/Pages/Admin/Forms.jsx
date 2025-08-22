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

export default function Forms({ auth, forms, services, extras, fieldTypes }) {
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
            rendering_control: "services",
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
            extras: field.extras?.map((e) => e.id) || [],
            rendering_control: field.rendering_control || "services",
            // Distance calculation fields
            has_distance_calculation: field.has_distance_calculation || false,
            distance_calculation_type: field.distance_calculation_type || null,
            linked_extra_id: field.linked_extra_id || null,
            covered_distance_km: field.covered_distance_km || 10.0,
            price_per_extra_km: field.price_per_extra_km || 10.0,
            // Location field settings
            settings: {
                allowCurrentLocation:
                    field.settings?.allowCurrentLocation || false,
            },
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
                extras: values.extras || [],
                rendering_control: values.rendering_control || "services",
                // Distance calculation fields
                has_distance_calculation:
                    values.has_distance_calculation || false,
                distance_calculation_type:
                    values.distance_calculation_type || null,
                linked_extra_id: values.linked_extra_id || null,
                covered_distance_km: values.covered_distance_km || 10.0,
                price_per_extra_km: values.price_per_extra_km || 10.0,
                // Location field settings
                settings: {
                    allowCurrentLocation:
                        values.settings?.allowCurrentLocation || false,
                },
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
            title: "Rendering Control",
            key: "rendering_control",
            render: (_, record) => {
                const { rendering_control, services, extras, is_primary } =
                    record;

                if (is_primary) {
                    return (
                        <Tag color="green" size="small">
                            All services
                        </Tag>
                    );
                }

                switch (rendering_control) {
                    case "services":
                        if (!services || services.length === 0) {
                            return (
                                <Tag color="green" size="small">
                                    All services
                                </Tag>
                            );
                        }
                        return (
                            <div>
                                <Tag
                                    color="blue"
                                    size="small"
                                    style={{ marginBottom: 4 }}
                                >
                                    Services
                                </Tag>
                                {services.slice(0, 2).map((service, index) => (
                                    <Tag
                                        key={index}
                                        color="purple"
                                        size="small"
                                    >
                                        {service.name}
                                    </Tag>
                                ))}
                                {services.length > 2 && (
                                    <Tag size="small">
                                        +{services.length - 2} more
                                    </Tag>
                                )}
                            </div>
                        );

                    case "extras":
                        if (!extras || extras.length === 0) {
                            return (
                                <Tag color="orange" size="small">
                                    All extras
                                </Tag>
                            );
                        }
                        return (
                            <div>
                                <Tag
                                    color="orange"
                                    size="small"
                                    style={{ marginBottom: 4 }}
                                >
                                    Extras
                                </Tag>
                                {extras.slice(0, 2).map((extra, index) => (
                                    <Tag
                                        key={index}
                                        color="orange"
                                        size="small"
                                    >
                                        {extra.name}
                                    </Tag>
                                ))}
                                {extras.length > 2 && (
                                    <Tag size="small">
                                        +{extras.length - 2} more
                                    </Tag>
                                )}
                            </div>
                        );

                    case "both":
                        const serviceTags = [];
                        const extraTags = [];

                        if (!services || services.length === 0) {
                            serviceTags.push(
                                <Tag
                                    key="all-services"
                                    color="green"
                                    size="small"
                                >
                                    All services
                                </Tag>
                            );
                        } else {
                            serviceTags.push(
                                <Tag
                                    key="services-label"
                                    color="blue"
                                    size="small"
                                >
                                    Services
                                </Tag>
                            );
                            services.slice(0, 1).forEach((service, index) => {
                                serviceTags.push(
                                    <Tag
                                        key={`service-${index}`}
                                        color="purple"
                                        size="small"
                                    >
                                        {service.name}
                                    </Tag>
                                );
                            });
                            if (services.length > 1) {
                                serviceTags.push(
                                    <Tag key="services-more" size="small">
                                        +{services.length - 1} more
                                    </Tag>
                                );
                            }
                        }

                        if (!extras || extras.length === 0) {
                            extraTags.push(
                                <Tag
                                    key="all-extras"
                                    color="orange"
                                    size="small"
                                >
                                    All extras
                                </Tag>
                            );
                        } else {
                            extraTags.push(
                                <Tag
                                    key="extras-label"
                                    color="orange"
                                    size="small"
                                >
                                    Extras
                                </Tag>
                            );
                            extras.slice(0, 1).forEach((extra, index) => {
                                extraTags.push(
                                    <Tag
                                        key={`extra-${index}`}
                                        color="orange"
                                        size="small"
                                    >
                                        {extra.name}
                                    </Tag>
                                );
                            });
                            if (extras.length > 1) {
                                extraTags.push(
                                    <Tag key="extras-more" size="small">
                                        +{extras.length - 1} more
                                    </Tag>
                                );
                            }
                        }

                        return (
                            <div>
                                <div style={{ marginBottom: 4 }}>
                                    {serviceTags}
                                </div>
                                <div>{extraTags}</div>
                            </div>
                        );

                    default:
                        return (
                            <Tag color="default" size="small">
                                All services
                            </Tag>
                        );
                }
            },
        },
        {
            title: "Distance Calculation",
            key: "distance_calculation",
            render: (_, record) => {
                if (record.has_distance_calculation) {
                    return (
                        <div>
                            <Tag color="blue" size="small">
                                {record.distance_calculation_type === "origin"
                                    ? "Origin"
                                    : "Destination"}
                            </Tag>
                            {record.linked_extra && (
                                <Tag color="green" size="small">
                                    {record.linked_extra.name}
                                </Tag>
                            )}
                            {record.distance_calculation_type === "origin" && (
                                <div style={{ marginTop: 4 }}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11 }}
                                    >
                                        {record.covered_distance_km}km covered,
                                        ₹{record.price_per_extra_km}/km
                                    </Text>
                                </div>
                            )}
                        </div>
                    );
                }
                return <Tag size="small">-</Tag>;
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

                        {/* Location field settings - only show for location type */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.type !== currentValues.type
                            }
                        >
                            {({ getFieldValue }) => {
                                const fieldType = getFieldValue("type");
                                const showLocationSettings =
                                    fieldType === "location";

                                return showLocationSettings ? (
                                    <Form.Item
                                        name={[
                                            "settings",
                                            "allowCurrentLocation",
                                        ]}
                                        label="Allow Current Location"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Switch />
                                    </Form.Item>
                                ) : null;
                            }}
                        </Form.Item>

                        {/* Distance Calculation Settings - only show for location type */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.type !== currentValues.type
                            }
                        >
                            {({ getFieldValue }) => {
                                const fieldType = getFieldValue("type");
                                const showDistanceSettings =
                                    fieldType === "location";

                                return showDistanceSettings ? (
                                    <>
                                        <Form.Item
                                            name="has_distance_calculation"
                                            label="Enable Distance Calculation"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>

                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(
                                                prevValues,
                                                currentValues
                                            ) =>
                                                prevValues.has_distance_calculation !==
                                                currentValues.has_distance_calculation
                                            }
                                        >
                                            {({ getFieldValue }) => {
                                                const hasDistanceCalculation =
                                                    getFieldValue(
                                                        "has_distance_calculation"
                                                    );
                                                return hasDistanceCalculation ? (
                                                    <>
                                                        <Form.Item
                                                            name="distance_calculation_type"
                                                            label="Distance Calculation Type"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        "Please select distance calculation type",
                                                                },
                                                            ]}
                                                        >
                                                            <Select placeholder="Select type">
                                                                <Option value="origin">
                                                                    Origin
                                                                    (Hospital
                                                                    Location)
                                                                </Option>
                                                                <Option value="destination">
                                                                    Destination
                                                                    (Customer
                                                                    Location)
                                                                </Option>
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item
                                                            name="linked_extra_id"
                                                            label="Linked Extra (for distance calculation)"
                                                        >
                                                            <Select
                                                                placeholder="Select extra for distance calculation"
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp="children"
                                                            >
                                                                {extras.map(
                                                                    (extra) => (
                                                                        <Option
                                                                            key={
                                                                                extra.id
                                                                            }
                                                                            value={
                                                                                extra.id
                                                                            }
                                                                        >
                                                                            {
                                                                                extra.name
                                                                            }
                                                                        </Option>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </Form.Item>

                                                        {/* Distance settings - only show for origin fields */}
                                                        <Form.Item
                                                            noStyle
                                                            shouldUpdate={(
                                                                prevValues,
                                                                currentValues
                                                            ) =>
                                                                prevValues.distance_calculation_type !==
                                                                currentValues.distance_calculation_type
                                                            }
                                                        >
                                                            {({
                                                                getFieldValue,
                                                            }) => {
                                                                const distanceType =
                                                                    getFieldValue(
                                                                        "distance_calculation_type"
                                                                    );
                                                                return distanceType ===
                                                                    "origin" ? (
                                                                    <>
                                                                        <Form.Item
                                                                            name="covered_distance_km"
                                                                            label="Covered Distance (km)"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message:
                                                                                        "Please enter covered distance",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <InputNumber
                                                                                placeholder="e.g., 10"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                step={
                                                                                    0.1
                                                                                }
                                                                                style={{
                                                                                    width: "100%",
                                                                                }}
                                                                            />
                                                                        </Form.Item>

                                                                        <Form.Item
                                                                            name="price_per_extra_km"
                                                                            label="Price per Extra KM (₹)"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message:
                                                                                        "Please enter price per extra km",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <InputNumber
                                                                                placeholder="e.g., 10"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                step={
                                                                                    0.01
                                                                                }
                                                                                style={{
                                                                                    width: "100%",
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </>
                                                                ) : null;
                                                            }}
                                                        </Form.Item>
                                                    </>
                                                ) : null;
                                            }}
                                        </Form.Item>
                                    </>
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

                        {/* Rendering Control - only show for custom fields */}
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
                                        name="rendering_control"
                                        label="Field Rendering Control"
                                    >
                                        <Select
                                            placeholder="Select rendering control"
                                            style={{ width: "100%" }}
                                        >
                                            <Option value="services">
                                                Show based on Services
                                            </Option>
                                            <Option value="extras">
                                                Show based on Extras
                                            </Option>
                                            <Option value="both">
                                                Show based on Services AND
                                                Extras
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                ) : null;
                            }}
                        </Form.Item>

                        {/* Services field - only show for custom fields */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.is_primary !==
                                    currentValues.is_primary ||
                                prevValues.rendering_control !==
                                    currentValues.rendering_control
                            }
                        >
                            {({ getFieldValue }) => {
                                const isPrimary = getFieldValue("is_primary");
                                const renderingControl =
                                    getFieldValue("rendering_control");
                                return !isPrimary &&
                                    (renderingControl === "services" ||
                                        renderingControl === "both") ? (
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

                        {/* Extras field - only show for custom fields */}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.is_primary !==
                                    currentValues.is_primary ||
                                prevValues.rendering_control !==
                                    currentValues.rendering_control
                            }
                        >
                            {({ getFieldValue }) => {
                                const isPrimary = getFieldValue("is_primary");
                                const renderingControl =
                                    getFieldValue("rendering_control");
                                return !isPrimary &&
                                    (renderingControl === "extras" ||
                                        renderingControl === "both") ? (
                                    <Form.Item
                                        name="extras"
                                        label="Available for Extras"
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Select specific extras (leave empty to show for ALL extras)"
                                            allowClear
                                            style={{ width: "100%" }}
                                        >
                                            {extras.map((extra) => (
                                                <Option
                                                    key={extra.id}
                                                    value={extra.id}
                                                >
                                                    {extra.name}
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
