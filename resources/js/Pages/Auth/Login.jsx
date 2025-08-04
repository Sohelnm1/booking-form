import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Form, Input, Button, Card, Typography, Space, Alert } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import AppLayout from "../../Layouts/AppLayout";

const { Title, Text } = Typography;

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        phone_number: "",
        password: "",
    });

    const handleSubmit = (values) => {
        post(route("login"));
    };

    return (
        <AppLayout>
            <Head title="Login" />
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
                        maxWidth: 400,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                    }}
                    styles={{ body: { padding: "40px" } }}
                >
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <Title
                            level={2}
                            style={{ marginBottom: 8, color: "#1f1f1f" }}
                        >
                            Welcome Back
                        </Title>
                        <Text type="secondary">
                            Sign in to your account to continue
                        </Text>
                    </div>

                    {errors.phone_number && (
                        <Alert
                            message={errors.phone_number}
                            type="error"
                            style={{ marginBottom: 16 }}
                            showIcon
                        />
                    )}

                    <Form
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        size="large"
                    >
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
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password!",
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
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: "center", marginTop: 24 }}>
                        <Text type="secondary">
                            Don't have an account?{" "}
                            <a
                                onClick={() => router.visit(route("register"))}
                                style={{
                                    color: "#1890ff",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Sign up here
                            </a>
                        </Text>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
