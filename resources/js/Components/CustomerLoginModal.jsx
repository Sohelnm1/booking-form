import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, message } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";

export default function CustomerLoginModal({ isVisible, onClose, onSuccess }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState(""); // For testing
    const otpInputRef = useRef(null);

    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            message.error("Please enter a valid phone number");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(route("booking.send-otp"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success("OTP sent successfully to your phone number");
                setOtpSent(true);

                // For testing - store the OTP if it's returned by the server
                if (result.otp) {
                    setReceivedOtp(result.otp);
                }
            } else {
                message.error(result.error || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            message.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            message.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(route("customer.login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success("Login successful!");
                setOtpSent(false);
                setOtp("");
                setPhoneNumber("");

                // Call the success callback
                if (onSuccess) {
                    onSuccess(result.user);
                }

                // Close the modal
                onClose();

                // Reload the page to get the authenticated state
                window.location.reload();
            } else {
                message.error(result.error || "Invalid OTP");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            message.error("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOtpSent(false);
        setOtp("");
        setPhoneNumber("");
        setLoading(false);
        onClose();
    };

    // Focus OTP input when OTP is sent
    useEffect(() => {
        if (otpSent && otpInputRef.current) {
            setTimeout(() => {
                otpInputRef.current.focus();
            }, 100);
        }
    }, [otpSent]);

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "8px 0",
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}
                    >
                        🔐
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "#1f1f1f",
                            }}
                        >
                            Customer Login
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2,
                            }}
                        >
                            Secure OTP Verification
                        </div>
                    </div>
                </div>
            }
            open={isVisible}
            onCancel={handleClose}
            footer={null}
            width={520}
            centered
            styles={{
                header: {
                    borderBottom: "1px solid #f0f0f0",
                    padding: "16px 20px 12px 20px",
                },
                body: {
                    padding: "20px",
                },
            }}
        >
            <div style={{ textAlign: "center" }}>
                {/* Header Section */}
                <div style={{ marginBottom: 24 }}>
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px auto",
                            border: "2px solid #bae7ff",
                        }}
                    >
                        {!otpSent ? (
                            <PhoneOutlined
                                style={{ fontSize: 24, color: "#1890ff" }}
                            />
                        ) : (
                            <LockOutlined
                                style={{ fontSize: 24, color: "#1890ff" }}
                            />
                        )}
                    </div>
                    <h3
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#1f1f1f",
                            marginBottom: 6,
                        }}
                    >
                        {!otpSent
                            ? "Enter Your Phone Number"
                            : "Enter Verification Code"}
                    </h3>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#666",
                            lineHeight: 1.4,
                            margin: 0,
                        }}
                    >
                        {!otpSent
                            ? "We'll send you a secure verification code via SMS"
                            : `We've sent a 6-digit code to ${phoneNumber}`}
                    </p>
                </div>

                {!otpSent ? (
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <Input
                                size="large"
                                placeholder="+91 98765 43210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{
                                    height: 44,
                                    fontSize: 15,
                                    borderRadius: 8,
                                    border: "1px solid #d9d9d9",
                                }}
                                maxLength={10}
                                prefix={
                                    <PhoneOutlined
                                        style={{
                                            color: "#1890ff",
                                            fontSize: 16,
                                        }}
                                    />
                                }
                            />
                            <div
                                style={{
                                    marginTop: 6,
                                    fontSize: 11,
                                    color: "#999",
                                    textAlign: "left",
                                }}
                            >
                                We'll send you a verification code via SMS
                            </div>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSendOtp}
                            loading={loading}
                            style={{
                                width: "100%",
                                height: 44,
                                fontSize: 15,
                                fontWeight: 500,
                                borderRadius: 8,
                                background:
                                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                            }}
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 6,
                                    marginBottom: 12,
                                    position: "relative",
                                }}
                            >
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            otpInputRef.current?.focus()
                                        }
                                        style={{
                                            width: 42,
                                            height: 42,
                                            border: "2px solid #d9d9d9",
                                            borderRadius: 8,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            background: "#fff",
                                            color: otp[index]
                                                ? "#1890ff"
                                                : "#d9d9d9",
                                            borderColor: otp[index]
                                                ? "#1890ff"
                                                : "#d9d9d9",
                                            transition: "all 0.3s ease",
                                            cursor: "text",
                                            userSelect: "none",
                                        }}
                                    >
                                        {otp[index] || ""}
                                    </div>
                                ))}
                                <Input
                                    ref={otpInputRef}
                                    size="large"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);
                                        setOtp(value);
                                    }}
                                    style={{
                                        position: "absolute",
                                        opacity: 0,
                                        zIndex: -1,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                />
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#999",
                                }}
                            >
                                Enter the 6-digit code sent to your phone
                            </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <Button
                                type="default"
                                size="large"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp("");
                                }}
                                style={{
                                    marginRight: 10,
                                    height: 40,
                                    borderRadius: 8,
                                    border: "1px solid #d9d9d9",
                                    fontWeight: 500,
                                    fontSize: 14,
                                }}
                            >
                                ← Back
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleVerifyOtp}
                                loading={loading}
                                style={{
                                    height: 40,
                                    borderRadius: 8,
                                    background:
                                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 12px rgba(82, 196, 26, 0.3)",
                                    fontWeight: 500,
                                    fontSize: 14,
                                }}
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </Button>
                        </div>

                        {receivedOtp && (
                            <div
                                style={{
                                    background:
                                        "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                                    border: "1px solid #bae7ff",
                                    borderRadius: 8,
                                    padding: 10,
                                    marginTop: 12,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#1890ff",
                                        fontWeight: 500,
                                    }}
                                >
                                    🧪 Testing Mode - OTP Code
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#1890ff",
                                        fontWeight: 600,
                                        marginTop: 3,
                                    }}
                                >
                                    {receivedOtp}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
