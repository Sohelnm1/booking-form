import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Divider,
    Progress,
    Form,
    Input,
    InputNumber,
    Select,
    Alert,
    Steps,
    Descriptions,
    Result,
    Radio,
    Checkbox,
    DatePicker,
    TimePicker,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AppLayout from "../../Layouts/AppLayout";
import Logo from "../../Components/Logo";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Confirm({
    service,
    selectedExtras,
    date,
    time,
    consentSettings,
    form,
    formFields,
    paymentSettings,
    totalPrice,
}) {
    const [formInstance] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleBack = () => {
        const extraIds = selectedExtras.map((extra) => extra.id);
        const consentIds = consentSettings.map((consent) => consent.id);
        router.visit(route("booking.consent"), {
            data: {
                service_id: service.id,
                extras: extraIds,
                date: date,
                time: time,
                consents: consentIds,
            },
        });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const extraIds = selectedExtras.map((extra) => extra.id);
            const consentIds = consentSettings.map((consent) => consent.id);

            const formData = {
                service_id: service.id,
                extras: extraIds,
                date: date,
                time: time,
                consents: consentIds,
                customer_name: values.customer_name,
                customer_email: values.customer_email,
                customer_phone: values.customer_phone,
                payment_method: values.payment_method,
                special_requests: values.special_requests || "",
            };

            await router.post(route("booking.process"), formData);
        } catch (error) {
            console.error("Booking error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    };

    const formatTime = (time) => {
        return dayjs(time, "HH:mm").format("h:mm A");
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, MMMM D, YYYY");
    };

    const totalDuration =
        service.duration +
        selectedExtras.reduce((sum, extra) => sum + (extra.duration || 0), 0);

    // Helper function to get validation rules for form fields
    const getFieldValidationRules = (field) => {
        const rules = [];

        if (field.is_required) {
            rules.push({
                required: true,
                message: `Please enter your ${field.label.toLowerCase()}`,
            });
        } else {
            rules.push({ required: false });
        }

        // Add type-specific rules
        switch (field.type) {
            case "email":
                rules.push({
                    type: "email",
                    message: "Please enter a valid email address",
                });
                break;
            case "phone":
                rules.push({
                    pattern: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number",
                });
                break;
            case "number":
                rules.push({
                    type: "number",
                    message: "Please enter a valid number",
                });
                break;
            case "url":
                rules.push({
                    type: "url",
                    message: "Please enter a valid URL",
                });
                break;
        }

        return rules;
    };

    // Helper function to render form fields based on type
    const renderFormField = (field) => {
        const commonProps = {
            placeholder: field.placeholder,
            size: "large",
        };

        switch (field.type) {
            case "text":
                return <Input {...commonProps} />;
            case "email":
                return <Input {...commonProps} prefix={<MailOutlined />} />;
            case "phone":
                return <Input {...commonProps} prefix={<PhoneOutlined />} />;
            case "number":
                return (
                    <InputNumber {...commonProps} style={{ width: "100%" }} />
                );
            case "textarea":
                return <Input.TextArea {...commonProps} rows={3} />;
            case "select":
                return (
                    <Select {...commonProps}>
                        {field.options?.map((option, index) => (
                            <Option key={index} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                );
            case "radio":
                return (
                    <Radio.Group>
                        {field.options?.map((option, index) => (
                            <Radio key={index} value={option}>
                                {option}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case "checkbox":
                return (
                    <Checkbox.Group>
                        {field.options?.map((option, index) => (
                            <Checkbox key={index} value={option}>
                                {option}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
            case "date":
                return (
                    <DatePicker {...commonProps} style={{ width: "100%" }} />
                );
            case "time":
                return (
                    <TimePicker {...commonProps} style={{ width: "100%" }} />
                );
            case "datetime":
                return (
                    <DatePicker
                        {...commonProps}
                        showTime
                        style={{ width: "100%" }}
                    />
                );
            case "url":
                return <Input {...commonProps} />;
            case "password":
                return <Input.Password {...commonProps} />;
            default:
                return <Input {...commonProps} />;
        }
    };

    return (
        <AppLayout>
            <Head title="Confirm & Pay - Book Appointment" />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="large"
                    />
                    <Title level={2} style={{ marginTop: 24, marginBottom: 8 }}>
                        Confirm & Pay
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Review your booking and complete payment
                    </Text>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 32 }}>
                    <Progress
                        percent={100}
                        showInfo={false}
                        strokeColor="#1890ff"
                        trailColor="#f0f0f0"
                    />
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Text type="secondary">Step 5 of 5</Text>
                    </div>
                </div>

                <Row gutter={[32, 32]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        {/* Booking Summary */}
                        <Card style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <CheckCircleOutlined
                                    style={{ marginRight: 8, color: "#52c41a" }}
                                />
                                Booking Summary
                            </Title>

                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label="Service">
                                    <div>
                                        <Text strong>{service.name}</Text>
                                        <br />
                                        <Text type="secondary">
                                            {formatDuration(service.duration)}
                                        </Text>
                                    </div>
                                </Descriptions.Item>

                                {selectedExtras.length > 0 && (
                                    <Descriptions.Item label="Extras">
                                        {selectedExtras.map((extra) => (
                                            <div
                                                key={extra.id}
                                                style={{ marginBottom: 8 }}
                                            >
                                                <Text>+ {extra.name}</Text>
                                                <br />
                                                <Text type="secondary">
                                                    {formatPrice(extra.price)}
                                                </Text>
                                            </div>
                                        ))}
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Appointment Date">
                                    <CalendarOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    {formatDate(date)}
                                </Descriptions.Item>

                                <Descriptions.Item label="Appointment Time">
                                    <ClockCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    {formatTime(time)}
                                </Descriptions.Item>

                                <Descriptions.Item label="Total Duration">
                                    {formatDuration(totalDuration)}
                                </Descriptions.Item>

                                <Descriptions.Item label="Total Price">
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 18,
                                            color: "#52c41a",
                                        }}
                                    >
                                        <DollarOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        {formatPrice(totalPrice)}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Customer Information Form */}
                        <Card>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                Customer Information
                            </Title>

                            <Form
                                form={formInstance}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{
                                    payment_method: "card",
                                }}
                            >
                                {formFields && formFields.length > 0 ? (
                                    <>
                                        {/* Primary Fields */}
                                        {formFields
                                            .filter((field) => field.is_primary)
                                            .map((field) => (
                                                <Form.Item
                                                    key={field.id}
                                                    name={field.name}
                                                    label={field.label}
                                                    rules={getFieldValidationRules(
                                                        field
                                                    )}
                                                    help={field.help_text}
                                                >
                                                    {renderFormField(field)}
                                                </Form.Item>
                                            ))}

                                        {/* Custom Fields */}
                                        {formFields
                                            .filter(
                                                (field) => !field.is_primary
                                            )
                                            .map((field) => (
                                                <Form.Item
                                                    key={field.id}
                                                    name={field.name}
                                                    label={field.label}
                                                    rules={getFieldValidationRules(
                                                        field
                                                    )}
                                                    help={field.help_text}
                                                >
                                                    {renderFormField(field)}
                                                </Form.Item>
                                            ))}

                                        {/* Payment Method */}
                                        <Form.Item
                                            name="payment_method"
                                            label="Payment Method"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select a payment method",
                                                },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select payment method"
                                            >
                                                <Option value="card">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Credit/Debit Card
                                                </Option>
                                                <Option value="upi">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    UPI Payment
                                                </Option>
                                                <Option value="netbanking">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Net Banking
                                                </Option>
                                                <Option value="wallet">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Digital Wallet
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </>
                                ) : (
                                    // Fallback to basic fields if no form is configured
                                    <>
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="customer_name"
                                                    label="Full Name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter your full name",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={
                                                            <UserOutlined />
                                                        }
                                                        placeholder="Enter your full name"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="customer_phone"
                                                    label="Phone Number"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter your phone number",
                                                        },
                                                        {
                                                            pattern:
                                                                /^[0-9+\-\s()]+$/,
                                                            message:
                                                                "Please enter a valid phone number",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={
                                                            <PhoneOutlined />
                                                        }
                                                        placeholder="Enter your phone number"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="customer_email"
                                            label="Email Address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your email address",
                                                },
                                                {
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email address",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined />}
                                                placeholder="Enter your email address"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="payment_method"
                                            label="Payment Method"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select a payment method",
                                                },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select payment method"
                                            >
                                                <Option value="card">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Credit/Debit Card
                                                </Option>
                                                <Option value="upi">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    UPI Payment
                                                </Option>
                                                <Option value="netbanking">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Net Banking
                                                </Option>
                                                <Option value="wallet">
                                                    <CreditCardOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    Digital Wallet
                                                </Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="special_requests"
                                            label="Special Requests (Optional)"
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="Any special requests or notes for your appointment..."
                                            />
                                        </Form.Item>
                                    </>
                                )}

                                {/* Terms Confirmation */}
                                <Alert
                                    message="Booking Confirmation"
                                    description="By clicking 'Confirm & Pay', you agree to our terms and conditions and confirm your appointment booking."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />

                                {/* Action Buttons */}
                                <div style={{ display: "flex", gap: 16 }}>
                                    <Button
                                        size="large"
                                        icon={<ArrowLeftOutlined />}
                                        onClick={handleBack}
                                        style={{ flex: 1 }}
                                    >
                                        Back to Terms
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<CheckCircleOutlined />}
                                        style={{ flex: 2 }}
                                    >
                                        Confirm & Pay {formatPrice(totalPrice)}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>

                    {/* Sidebar - Summary */}
                    <Col xs={24} lg={8}>
                        <Card style={{ position: "sticky", top: 24 }}>
                            <Title level={4} style={{ marginBottom: 16 }}>
                                Final Summary
                            </Title>

                            {/* Service */}
                            <div style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text strong>{service.name}</Text>
                                    <Text>{formatPrice(service.price)}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDuration(service.duration)}
                                </Text>
                            </div>

                            {/* Selected Extras */}
                            {selectedExtras.length > 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    {selectedExtras.map((extra) => (
                                        <div
                                            key={extra.id}
                                            style={{ marginBottom: 8 }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Text>+ {extra.name}</Text>
                                                <Text>
                                                    {formatPrice(extra.price)}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Appointment Details */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">Appointment Date</Text>
                                <div>
                                    <Text strong>{formatDate(date)}</Text>
                                </div>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">Appointment Time</Text>
                                <div>
                                    <Text strong>{formatTime(time)}</Text>
                                </div>
                            </div>

                            {/* Total */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text strong>Total Price</Text>
                                <Text
                                    strong
                                    style={{ fontSize: 18, color: "#52c41a" }}
                                >
                                    {formatPrice(totalPrice)}
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text type="secondary">Total Duration</Text>
                                <Text type="secondary">
                                    {formatDuration(totalDuration)}
                                </Text>
                            </div>

                            {/* Accepted Agreements */}
                            <Divider style={{ margin: "16px 0" }} />
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary">
                                    Accepted Agreements
                                </Text>
                                <div>
                                    {consentSettings.map((consent) => (
                                        <Tag
                                            key={consent.id}
                                            color="green"
                                            style={{ marginTop: 4 }}
                                        >
                                            {consent.title}
                                        </Tag>
                                    ))}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <Alert
                                message="Secure Payment"
                                description={`Your payment information is encrypted and secure. ${
                                    paymentSettings?.razorpay_key
                                        ? "Powered by Razorpay."
                                        : ""
                                }`}
                                type="success"
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                            {paymentSettings?.currency && (
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12,
                                        display: "block",
                                        marginTop: 8,
                                    }}
                                >
                                    Currency: {paymentSettings.currency}
                                </Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    );
}
