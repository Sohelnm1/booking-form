import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Layout, Menu, Avatar, Button, Space, message, Drawer } from "antd";
import {
    CalendarOutlined,
    BookOutlined,
    LogoutOutlined,
    MenuOutlined,
    UserOutlined,
    HomeOutlined,
    QuestionCircleOutlined,
    GiftOutlined,
    CustomerServiceOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";
import CustomerLoginModal from "./CustomerLoginModal";

const { Header } = Layout;

export default function BookingHeader({ auth }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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

    const handleLogin = () => {
        setIsLoginModalVisible(true);
    };

    const handleLoginSuccess = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const menuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: () => {
                router.visit("/");
                setIsDrawerVisible(false);
            },
        },
        {
            key: "book-hospipal",
            icon: <BookOutlined />,
            label: "Book a HospiPal",
            onClick: () => {
                router.visit(route("booking.select-service"));
                setIsDrawerVisible(false);
            },
        },
        {
            key: "services",
            icon: <BookOutlined />,
            label: "Services",
            onClick: () => {
                router.visit(route("booking.select-service"));
                setIsDrawerVisible(false);
            },
        },
        {
            key: "extras",
            icon: <GiftOutlined />,
            label: "Extras",
            onClick: () => {
                message.info("Extras page coming soon");
                setIsDrawerVisible(false);
            },
        },
        {
            key: "how-it-works",
            icon: <QuestionCircleOutlined />,
            label: "How It Works",
            onClick: () => {
                message.info("How It Works page coming soon");
                setIsDrawerVisible(false);
            },
        },
        {
            key: "support",
            icon: <CustomerServiceOutlined />,
            label: "Support",
            onClick: () => {
                window.open("https://wa.me/917979911483", "_blank");
                setIsDrawerVisible(false);
            },
        },
        ...(isLoggedIn && currentUser
            ? [
                  {
                      key: "bookings",
                      icon: <CalendarOutlined />,
                      label: "My Bookings",
                      onClick: () => {
                          router.visit(route("customer.bookings"));
                          setIsDrawerVisible(false);
                      },
                  },
                  {
                      key: "profile",
                      icon: <UserOutlined />,
                      label: "Profile",
                      onClick: () => {
                          message.info("Profile settings coming soon");
                          setIsDrawerVisible(false);
                      },
                  },
              ]
            : []),
        // Add login button to mobile menu for non-logged in users
        ...(!isLoggedIn
            ? [
                  {
                      key: "login",
                      icon: <LoginOutlined />,
                      label: "Sign In",
                      className: "mobile-login-button",
                      onClick: () => {
                          handleLogin();
                          setIsDrawerVisible(false);
                      },
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
                <div
                    onClick={() => router.visit("/")}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Logo
                        variant="primary"
                        color="color"
                        background="white"
                        size="medium"
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 0,
                }}
            >
                {/* Primary CTA - Always Visible */}
                <Button
                    type="primary"
                    size="middle"
                    icon={<BookOutlined />}
                    onClick={() =>
                        router.visit(route("booking.select-service"))
                    }
                    style={{
                        background:
                            "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                        border: "none",
                        fontWeight: 600,
                        borderRadius: "6px",
                    }}
                >
                    <span className="hidden-xs">Book a HospiPal</span>
                    <span className="visible-xs">Book</span>
                </Button>

                {isLoggedIn && currentUser ? (
                    <Space size="small" className="hidden-xs">
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
                ) : (
                    <Button
                        type="text"
                        onClick={handleLogin}
                        size="middle"
                        className="header-signin-btn hidden-xs"
                    >
                        <span className="hidden-xs">Sign In</span>
                        <span className="visible-xs">Login</span>
                    </Button>
                )}

                {/* Hamburger menu - Always visible */}
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setIsDrawerVisible(true)}
                    size="middle"
                    style={{
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "36px",
                        width: "36px",
                        padding: "0",
                        borderRadius: "6px",
                    }}
                />
            </div>

            {/* Customer Login Modal */}
            <CustomerLoginModal
                isVisible={isLoginModalVisible}
                onClose={() => setIsLoginModalVisible(false)}
                onSuccess={handleLoginSuccess}
            />

            {/* Hamburger Menu Drawer */}
            <Drawer
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Logo
                            variant="primary"
                            color="color"
                            background="white"
                            size="medium"
                        />
                    </div>
                }
                placement="right"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                width={280}
                styles={{ body: { padding: 0 } }}
                headerStyle={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: "16px 24px",
                }}
            >
                <div style={{ padding: "16px 0" }}>
                    <Menu
                        mode="vertical"
                        items={menuItems}
                        style={{
                            border: "none",
                            fontSize: "16px",
                        }}
                        selectedKeys={[]}
                    />

                    {isLoggedIn && currentUser && (
                        <div
                            style={{
                                padding: "16px 24px",
                                borderTop: "1px solid #f0f0f0",
                                marginTop: "16px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: "12px",
                                }}
                            >
                                <Avatar
                                    style={{
                                        backgroundColor: "#1890ff",
                                    }}
                                >
                                    {getInitials(currentUser?.name)}
                                </Avatar>
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "14px",
                                        }}
                                    >
                                        {currentUser?.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#8c8c8c",
                                        }}
                                    >
                                        {currentUser?.email}
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="text"
                                icon={<LogoutOutlined />}
                                onClick={() => {
                                    handleLogout();
                                    setIsDrawerVisible(false);
                                }}
                                size="large"
                                style={{ width: "100%", textAlign: "left" }}
                            >
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </Drawer>
        </Header>
    );
}
