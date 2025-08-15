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
            onClick: () => router.visit(route("welcome")),
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
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Logo
                    variant="primary"
                    color="color"
                    background="white"
                    size="medium"
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    selectedKeys={["services"]}
                    style={{ border: "none", background: "transparent" }}
                />

                {isLoggedIn && currentUser ? (
                    <Space>
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
                        >
                            Logout
                        </Button>
                    </Space>
                ) : null}
            </div>
        </Header>
    );
}
