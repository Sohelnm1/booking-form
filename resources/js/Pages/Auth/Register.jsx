import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import {
    UserOutlined,
    LockOutlined,
    PhoneOutlined,
    MailOutlined,
} from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";
import Logo from "../../Components/Logo";

const { Title, Text } = Typography;

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (values) => {
        post(route("register"));
    };

    return (
        <AppLayout>
            <Head title="Register" />
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                    padding: "20px",
                }}
            >
                <Card
                    style={{
                        width: "100%",
                        maxWidth: 450,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                    }}
                    styles={{ body: { padding: "40px" } }}
                >
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ marginBottom: 24 }}>
                            <Logo
                                variant="tertiary"
                                color="gradient"
                                background="white"
                                size="medium"
                            />
                        </div>
                        <Title
                            level={2}
                            style={{ marginBottom: 8, color: "#1f1f1f" }}
                        >
                            Create Account
                        </Title>
                        <Text type="secondary">
                            Join HospiPal to start booking your appointments
                        </Text>
                    </div>

                    {(errors.name ||
                        errors.phone_number ||
                        errors.email ||
                        errors.password) && (
                        <Alert
                            message="Please fix the errors below"
                            type="error"
                            style={{ marginBottom: 16 }}
                            showIcon
                        />
                    )}

                    <Form
                        name="register"
                        onFinish={handleSubmit}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your full name!",
                                },
                            ]}
                            validateStatus={errors.name ? "error" : ""}
                            help={errors.name}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your full name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your phone number!",
                                },
                            ]}
                            validateStatus={errors.phone_number ? "error" : ""}
                            help={errors.phone_number}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter your phone number"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email (Optional)"
                            rules={[
                                {
                                    type: "email",
                                    message: "Please enter a valid email!",
                                },
                            ]}
                            validateStatus={errors.email ? "error" : ""}
                            help={errors.email}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter your email (optional)"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password!",
                                },
                                {
                                    min: 8,
                                    message:
                                        "Password must be at least 8 characters!",
                                },
                            ]}
                            validateStatus={errors.password ? "error" : ""}
                            help={errors.password}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="password_confirmation"
                            label="Confirm Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Passwords do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm your password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                style={{
                                    width: "100%",
                                    height: "48px",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                }}
                            >
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: "center", marginTop: 24 }}>
                        <Text type="secondary">
                            Already have an account?{" "}
                            <a
                                onClick={() => router.visit(route("login"))}
                                style={{
                                    color: "#1890ff",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Sign in here
                            </a>
                        </Text>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
