import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Layout, Menu, Avatar, Button, Space, message } from "antd";
import {
    CalendarOutlined,
    BookOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";

const { Header } = Layout;

export default function BookingHeader({ auth }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        if (auth && auth.user) {
            setIsLoggedIn(true);
            setCurrentUser(auth.user);
        }
    }, [auth]);

    const getInitials = (name) => {
        if (!name) return "CU";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    // Force a page refresh to get a new CSRF token
                    window.location.reload();
                },
            }
        );
    };

    const menuItems = [
        {
            key: "services",
            icon: <BookOutlined />,
            label: "Services",
            onClick: () => router.visit(route("booking.select-service")),
        },
        ...(isLoggedIn && currentUser
            ? [
                  {
                      key: "bookings",
                      icon: <CalendarOutlined />,
                      label: "Your Bookings",
                      onClick: () => router.visit(route("customer.bookings")),
                  },
              ]
            : []),
    ];

    return (
        <Header
            style={{
                background: "#fff",
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                height: "auto",
                minHeight: 64,
                overflow: "hidden",
                maxWidth: "100vw",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    minWidth: 0,
                }}
            >
                <Logo
                    variant="primary"
                    color="color"
                    background="white"
                    size="medium"
                />
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    flex: 1,
                    justifyContent: "flex-end",
                    minWidth: 0,
                    overflow: "hidden",
                }}
            >
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    selectedKeys={["services"]}
                    style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "14px",
                        minWidth: 0,
                        flexShrink: 1,
                        maxWidth: "100%",
                    }}
                />

                {isLoggedIn && currentUser ? (
                    <Space size="small" style={{ flexShrink: 0 }}>
                        <Avatar
                            style={{
                                backgroundColor: "#1890ff",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                message.info("Profile settings coming soon")
                            }
                        >
                            {getInitials(currentUser?.name)}
                        </Avatar>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            size="small"
                        >
                            <span className="hidden-xs">Logout</span>
                        </Button>
                    </Space>
                ) : null}
            </div>
        </Header>
    );
}
