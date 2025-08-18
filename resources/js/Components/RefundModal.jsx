import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Alert,
    Spin,
    Space,
    Typography,
    Divider,
    Descriptions,
    Badge,
} from "antd";
import {
    DollarOutlined,
    UserOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text, Title } = Typography;
const { TextArea } = Input;

const RefundModal = ({ visible, onCancel, onSuccess, booking }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [refundDetails, setRefundDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && booking) {
            fetchRefundDetails();
        }
    }, [visible, booking]);

    const fetchRefundDetails = async () => {
        if (!booking) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `/admin/appointments/${booking.id}/refund-details`
            );
            if (response.data.success) {
                setRefundDetails(response.data.data);
            } else {
                setError("Failed to load refund details");
            }
        } catch (error) {
            console.error("Error fetching refund details:", error);
            setError("Failed to load refund details");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);

        try {
            console.log("Processing refund for booking:", booking.id);
            console.log("Refund values:", values);

            // Get CSRF token
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            console.log("CSRF Token:", token);

            const response = await axios.post(
                `/admin/appointments/${booking.id}/refund`,
                {
                    refund_method:
                        values.refund_method || "original_payment_method",
                    refund_notes: values.refund_notes || null,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": token,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Refund response:", response.data);

            if (response.data.success) {
                onSuccess(response.data);
            } else {
                setError(response.data.message || "Failed to process refund");
            }
        } catch (error) {
            console.error("Error processing refund:", error);
            console.error("Error response:", error.response?.data);
            const errorMessage =
                error.response?.data?.message || "Failed to process refund";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setError(null);
        onCancel();
    };

    const renderRefundDetails = () => {
        if (loading) {
            return <Spin size="large" />;
        }

        if (!refundDetails) {
            return <Text type="secondary">No refund details available</Text>;
        }

        const { booking, customer, service, policy, cancelled_by } =
            refundDetails;

        return (
            <div>
                <Descriptions
                    title="Refund Information"
                    bordered
                    size="small"
                    column={1}
                >
                    <Descriptions.Item label="Customer">
                        <Space>
                            <UserOutlined />
                            <Text>{customer.name}</Text>
                        </Space>
                        <br />
                        <Text type="secondary">{customer.email}</Text>
                        <br />
                        <Text type="secondary">{customer.phone}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Service">
                        <Text strong>{service.name}</Text>
                        <br />
                        <Text type="secondary">₹{service.price}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Original Amount">
                        <Text strong style={{ color: "#1890ff" }}>
                            ₹{booking.total_amount}
                        </Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Refund Amount">
                        <Text strong style={{ color: "#52c41a" }}>
                            ₹{booking.refund_amount}
                        </Text>
                    </Descriptions.Item>

                    {booking.cancellation_fee_charged > 0 && (
                        <Descriptions.Item label="Cancellation Fee">
                            <Text strong style={{ color: "#ff4d4f" }}>
                                ₹{booking.cancellation_fee_charged}
                            </Text>
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="Cancellation Policy">
                        <Text>{policy?.name || "Default Policy"}</Text>
                        <br />
                        <Text type="secondary">
                            {policy?.cancellation_policy || "Full Refund"}
                        </Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Cancelled By">
                        <Text>{cancelled_by?.name || "Customer"}</Text>
                        <br />
                        <Text type="secondary">{booking.cancelled_at}</Text>
                    </Descriptions.Item>

                    {booking.cancellation_reason && (
                        <Descriptions.Item label="Cancellation Reason">
                            <Text>{booking.cancellation_reason}</Text>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </div>
        );
    };

    return (
        <Modal
            title={
                <Space>
                    <DollarOutlined style={{ color: "#52c41a" }} />
                    <span>Process Refund</span>
                </Space>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            destroyOnClose
        >
            <div style={{ marginBottom: 16 }}>
                <Alert
                    message="Refund Processing"
                    description="This will process the refund for the cancelled booking. The refund will be processed according to the original payment method."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            </div>

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {renderRefundDetails()}

            <Divider />

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Refund Method"
                    name="refund_method"
                    initialValue="original_payment_method"
                >
                    <Input
                        placeholder="Refund method"
                        disabled
                        value="Original Payment Method"
                    />
                </Form.Item>

                <Form.Item label="Refund Notes" name="refund_notes">
                    <TextArea
                        rows={3}
                        placeholder="Add any notes about this refund..."
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Space
                        style={{ width: "100%", justifyContent: "flex-end" }}
                    >
                        <Button onClick={handleCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<DollarOutlined />}
                            style={{
                                backgroundColor: "#52c41a",
                                borderColor: "#52c41a",
                            }}
                        >
                            Process Refund
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RefundModal;
