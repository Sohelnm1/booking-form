import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Switch,
    Button,
    Space,
    Typography,
    message,
    Row,
    Col,
    Divider,
    Alert,
} from "antd";
import { SaveOutlined, SettingOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layouts/AdminLayout";

const { Title, Text } = Typography;

export default function BookingSettings({ auth, settings, errors }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                max_extras_per_booking: settings.max_extras_per_booking || 10,
                enable_extra_quantities:
                    settings.enable_extra_quantities !== false,
                enable_gender_preference:
                    settings.enable_gender_preference !== false,
                male_preference_fee: settings.male_preference_fee || 100,
                female_preference_fee: settings.female_preference_fee || 100,
                gender_preference_label:
                    settings.gender_preference_label || "Preferred HospiPal",
                gender_preference_description:
                    settings.gender_preference_description ||
                    "Select your preferred HospiPal gender. Choosing a specific gender may incur an additional fee.",
            });
        }
    }, [settings, form]);

    const handleSubmit = (values) => {
        setLoading(true);

        router.post(route("admin.booking-settings.update"), values, {
            onSuccess: () => {
                message.success("Booking settings updated successfully");
            },
            onError: (errors) => {
                message.error(
                    "Failed to update settings. Please check the form."
                );
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Booking Settings" />
            <div>
                <div style={{ marginBottom: 24 }}>
                    <Title level={2}>
                        <SettingOutlined style={{ marginRight: 8 }} />
                        Booking Settings
                    </Title>
                    <Text type="secondary">
                        Configure booking behavior and limits
                    </Text>
                </div>

                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            max_extras_per_booking: 10,
                            enable_extra_quantities: true,
                            enable_gender_preference: true,
                            male_preference_fee: 100,
                            female_preference_fee: 100,
                            gender_preference_label: "Preferred HospiPal",
                            gender_preference_description:
                                "Select your preferred HospiPal gender. Choosing a specific gender may incur an additional fee.",
                        }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="max_extras_per_booking"
                                    label="Maximum Extras per Booking"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter maximum extras per booking",
                                        },
                                        {
                                            type: "number",
                                            min: 1,
                                            max: 50,
                                            message:
                                                "Value must be between 1 and 50",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={50}
                                        style={{ width: "100%" }}
                                        placeholder="Enter maximum extras"
                                    />
                                </Form.Item>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Maximum number of different extras that can
                                    be added to a booking
                                </Text>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item
                            name="enable_extra_quantities"
                            label="Enable Extra Quantities"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                                marginBottom: 24,
                                display: "block",
                            }}
                        >
                            Allow customers to select multiple quantities of the
                            same extra
                        </Text>

                        <Divider />

                        <Title level={4}>Gender Preference Settings</Title>

                        <Form.Item
                            name="enable_gender_preference"
                            label="Enable Gender Preference"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                                marginBottom: 24,
                                display: "block",
                            }}
                        >
                            Allow customers to select their preferred HospiPal
                            gender during booking
                        </Text>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="male_preference_fee"
                                    label="Male Preference Fee (₹)"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter male preference fee",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            max: 1000,
                                            message:
                                                "Value must be between 0 and 1000",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={1000}
                                        style={{ width: "100%" }}
                                        placeholder="Enter fee amount"
                                    />
                                </Form.Item>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Additional fee when customer selects male
                                    HospiPal preference
                                </Text>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="female_preference_fee"
                                    label="Female Preference Fee (₹)"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter female preference fee",
                                        },
                                        {
                                            type: "number",
                                            min: 0,
                                            max: 1000,
                                            message:
                                                "Value must be between 0 and 1000",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={1000}
                                        style={{ width: "100%" }}
                                        placeholder="Enter fee amount"
                                    />
                                </Form.Item>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Additional fee when customer selects female
                                    HospiPal preference
                                </Text>
                            </Col>
                        </Row>

                        <Form.Item
                            name="gender_preference_label"
                            label="Gender Preference Field Label"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter field label",
                                },
                            ]}
                        >
                            <Input placeholder="e.g., Preferred HospiPal" />
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{ fontSize: 12, marginBottom: 16 }}
                        >
                            Label displayed for the gender preference field
                        </Text>

                        <Form.Item
                            name="gender_preference_description"
                            label="Gender Preference Description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter description",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Description text shown to customers about gender preference"
                            />
                        </Form.Item>
                        <Text
                            type="secondary"
                            style={{ fontSize: 12, marginBottom: 24 }}
                        >
                            Help text displayed below the gender preference
                            field
                        </Text>

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    size="large"
                                >
                                    Save Settings
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                <Card style={{ marginTop: 24 }}>
                    <Title level={4}>How it works</Title>
                    <Space direction="vertical" size="middle">
                        <div>
                            <Text strong>Maximum Extras per Booking:</Text>
                            <br />
                            <Text type="secondary">
                                This setting limits how many different types of
                                extras a customer can add to their booking. For
                                example, if set to 5, customers can select up to
                                5 different extras.
                            </Text>
                        </div>

                        <div>
                            <Text strong>Enable Extra Quantities:</Text>
                            <br />
                            <Text type="secondary">
                                When enabled, customers will see + and - buttons
                                to adjust quantities for each extra. When
                                disabled, customers can only add one of each
                                extra.
                            </Text>
                        </div>

                        <div>
                            <Text strong>Gender Preference:</Text>
                            <br />
                            <Text type="secondary">
                                When enabled, customers can select their
                                preferred HospiPal gender (Male, Female, or No
                                Preference). Selecting a specific gender may
                                incur an additional fee. If "No Preference" is
                                selected, the system will auto-assign based on
                                availability.
                            </Text>
                        </div>

                        <div>
                            <Text strong>Gender Preference Fees:</Text>
                            <br />
                            <Text type="secondary">
                                Set the additional fee charged when customers
                                select a specific gender preference. This helps
                                manage demand and ensures efficient scheduling
                                while giving customers control over their
                                preference.
                            </Text>
                        </div>
                    </Space>
                </Card>
            </div>
        </AdminLayout>
    );
}
