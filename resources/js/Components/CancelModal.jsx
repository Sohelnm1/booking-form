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
} from "antd";
import {
    ExclamationCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text, Title } = Typography;
const { TextArea } = Input;

const CancelModal = ({
    visible,
    onCancel,
    onSuccess,
    booking,
    isAdmin = false,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [policyLoading, setPolicyLoading] = useState(false);
    const [policy, setPolicy] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && booking) {
            fetchBookingPolicy();
        }
    }, [visible, booking]);

    const fetchBookingPolicy = async () => {
        if (!booking) return;

        setPolicyLoading(true);
        setError(null);

        try {
            const endpoint = isAdmin
                ? `/admin/appointments/${booking.id}/policy`
                : `/customer/bookings/${booking.id}/policy`;
            const response = await axios.get(endpoint);
            if (response.data.success) {
                setPolicy(response.data.data.policy);
            } else {
                setError("Failed to load booking policy");
            }
        } catch (error) {
            console.error("Error fetching booking policy:", error);
            setError("Failed to load booking policy");
        } finally {
            setPolicyLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);

        try {
            const endpoint = isAdmin
                ? `/admin/appointments/${booking.id}/cancel`
                : `/customer/bookings/${booking.id}/cancel`;
            const response = await axios.post(endpoint, {
                reason: values.reason || null,
            });

            if (response.data.success) {
                onSuccess(response.data);
            } else {
                setError(response.data.message || "Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to cancel booking";
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

    const renderPolicyInfo = () => {
        if (policyLoading) {
            return <Spin size="small" />;
        }

        if (!policy) {
            return (
                <Text type="secondary">No policy information available</Text>
            );
        }

        const { cancellation } = policy;

        return (
            <div>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                        <Text strong>Policy: </Text>
                        <Text>{policy.name}</Text>
                    </div>

                    <div>
                        <Text strong>Cancellation Window: </Text>
                        <Text>
                            {cancellation.window_hours} hours before appointment
                        </Text>
                    </div>

                    <div>
                        <Text strong>Refund Policy: </Text>
                        <Text>{cancellation.policy}</Text>
                    </div>

                    {cancellation.late_fee > 0 && (
                        <div>
                            <Text strong>Late Cancellation Fee: </Text>
                            <Text type="danger">₹{cancellation.late_fee}</Text>
                            <Text type="secondary">
                                {" "}
                                (if cancelled within{" "}
                                {cancellation.late_fee_window} hours)
                            </Text>
                        </div>
                    )}

                    <div>
                        <Text strong>Time Until Appointment: </Text>
                        <Text
                            type={
                                cancellation.hours_until_appointment < 0
                                    ? "danger"
                                    : "secondary"
                            }
                        >
                            {cancellation.hours_until_appointment < 0
                                ? "Appointment has passed"
                                : `${cancellation.hours_until_appointment} hours`}
                        </Text>
                    </div>
                </Space>
            </div>
        );
    };

    const canCancel = policy && policy.cancellation?.allowed;

    return (
        <Modal
            title={
                <Space>
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                    <span>
                        {isAdmin ? "Admin Cancel Booking" : "Cancel Booking"}
                    </span>
                </Space>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnHidden
        >
            <div style={{ marginBottom: 16 }}>
                <Alert
                    message={
                        isAdmin
                            ? "Admin Cancellation Warning"
                            : "Cancellation Warning"
                    }
                    description={
                        isAdmin
                            ? "Are you sure you want to cancel this booking as an admin? This action cannot be undone and will override any customer cancellation policies."
                            : "Are you sure you want to cancel this booking? This action cannot be undone."
                    }
                    type="warning"
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

            <div style={{ marginBottom: 16 }}>
                <Title level={5}>Booking Details</Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                        <Text strong>Service: </Text>
                        <Text>{booking?.service?.name}</Text>
                    </div>
                    <div>
                        <Text strong>Date & Time: </Text>
                        <Text>
                            {booking?.appointment_time
                                ? new Date(
                                      booking.appointment_time
                                  ).toLocaleString()
                                : "N/A"}
                        </Text>
                    </div>
                    <div>
                        <Text strong>Amount: </Text>
                        <Text>₹{booking?.total_amount}</Text>
                    </div>
                </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
                <Title level={5}>Cancellation Policy</Title>
                {renderPolicyInfo()}
            </div>

            {!canCancel && policy && (
                <Alert
                    message="Cancellation Not Allowed"
                    description={`This booking cannot be cancelled. The cancellation window is ${policy.cancellation?.window_hours} hours before the appointment.`}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {canCancel && (
                <>
                    <Divider />

                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        {policy?.cancellation?.require_reason && (
                            <Form.Item
                                label="Cancellation Reason"
                                name="reason"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please provide a reason for cancellation",
                                    },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Please explain why you need to cancel this booking..."
                                />
                            </Form.Item>
                        )}

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Space
                                style={{
                                    width: "100%",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Keep Booking
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<ExclamationCircleOutlined />}
                                >
                                    Cancel Booking
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default CancelModal;
