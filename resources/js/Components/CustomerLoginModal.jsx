import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";

export default function CustomerLoginModal({ isVisible, onClose, onSuccess }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState(""); // For testing

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

    return (
        <Modal
            title="Customer Login"
            open={isVisible}
            onCancel={handleClose}
            footer={null}
            width={480}
            centered
        >
            <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 32 }}>
                    <p style={{ fontSize: 16, color: "#666" }}>
                        {!otpSent
                            ? "Enter your phone number to receive an OTP"
                            : "Enter the 6-digit OTP sent to your phone"}
                    </p>
                </div>

                {!otpSent ? (
                    <div>
                        <Input
                            size="large"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{ marginBottom: 16 }}
                            maxLength={10}
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSendOtp}
                            loading={loading}
                            style={{ width: "100%" }}
                        >
                            Send OTP
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Input
                            size="large"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ marginBottom: 16 }}
                            maxLength={6}
                        />
                        <div style={{ marginBottom: 16 }}>
                            <Button
                                type="default"
                                size="large"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp("");
                                }}
                                style={{ marginRight: 8 }}
                            >
                                Back
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleVerifyOtp}
                                loading={loading}
                            >
                                Verify OTP
                            </Button>
                        </div>
                        {receivedOtp && (
                            <p style={{ fontSize: 12, color: "#999" }}>
                                Test OTP: {receivedOtp}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
