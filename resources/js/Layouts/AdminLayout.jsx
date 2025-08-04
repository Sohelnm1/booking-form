import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Typography,
    Avatar,
    Dropdown,
    Space,
    Button,
} from "antd";
import {
    DashboardOutlined,
    CalendarOutlined,
    TeamOutlined,
    UserOutlined,
    AppstoreOutlined,
    PlusOutlined,
    FormOutlined,
    FieldBinaryOutlined,
    ClockCircleOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    BellOutlined,
    ApiOutlined,
    NotificationOutlined,
} from "@ant-design/icons";
import { router } from "@inertiajs/react";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children, auth }) {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState("dashboard");

    // Determine current route and set selected key
    useEffect(() => {
        const updateSelectedKey = () => {
            const currentPath = window.location.pathname;
            let newSelectedKey = "dashboard"; // Default fallback

            // More specific route matching to avoid conflicts
            if (
                currentPath === "/admin/dashboard" ||
                currentPath.startsWith("/admin/dashboard/")
            ) {
                newSelectedKey = "dashboard";
            } else if (
                currentPath === "/admin/appointments" ||
                currentPath.startsWith("/admin/appointments/")
            ) {
                newSelectedKey = "appointments";
            } else if (
                currentPath === "/admin/employees" ||
                currentPath.startsWith("/admin/employees/")
            ) {
                newSelectedKey = "employees";
            } else if (
                currentPath === "/admin/customers" ||
                currentPath.startsWith("/admin/customers/")
            ) {
                newSelectedKey = "customers";
            } else if (
                currentPath === "/admin/services" ||
                currentPath.startsWith("/admin/services/")
            ) {
                newSelectedKey = "services";
            } else if (
                currentPath === "/admin/extras" ||
                currentPath.startsWith("/admin/extras/")
            ) {
                newSelectedKey = "extras";
            } else if (
                currentPath === "/admin/forms" ||
                currentPath.startsWith("/admin/forms/")
            ) {
                newSelectedKey = "forms";
            } else if (
                currentPath === "/admin/custom-fields" ||
                currentPath.startsWith("/admin/custom-fields/")
            ) {
                newSelectedKey = "custom-fields";
            } else if (
                currentPath === "/admin/times" ||
                currentPath.startsWith("/admin/times/")
            ) {
                newSelectedKey = "times";
            } else if (
                currentPath === "/admin/calendar" ||
                currentPath.startsWith("/admin/calendar/")
            ) {
                newSelectedKey = "calendar";
            } else if (
                currentPath === "/admin/settings" ||
                currentPath.startsWith("/admin/settings/")
            ) {
                newSelectedKey = "settings";
            } else if (
                currentPath === "/admin/integration" ||
                currentPath.startsWith("/admin/integration/")
            ) {
                newSelectedKey = "integration";
            } else if (
                currentPath === "/admin/notification" ||
                currentPath.startsWith("/admin/notification/")
            ) {
                newSelectedKey = "notification";
            }

            // Only update if the key is actually different to prevent unnecessary re-renders
            if (newSelectedKey !== selectedKey) {
                setSelectedKey(newSelectedKey);
            }
        };

        // Initial setup
        updateSelectedKey();

        // Listen for route changes
        const handleRouteChange = () => {
            // Small delay to ensure the route has changed
            setTimeout(updateSelectedKey, 100);
        };

        window.addEventListener("popstate", handleRouteChange);

        // Also listen for Inertia.js navigation events
        if (window.Inertia) {
            window.addEventListener("inertia:success", handleRouteChange);
        }

        return () => {
            window.removeEventListener("popstate", handleRouteChange);
            if (window.Inertia) {
                window.removeEventListener(
                    "inertia:success",
                    handleRouteChange
                );
            }
        };
    }, [selectedKey]);

    const menuItems = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            onClick: () => {
                setSelectedKey("dashboard");
                router.visit(route("admin.dashboard"), { replace: true });
            },
        },
        {
            key: "appointments",
            icon: <CalendarOutlined />,
            label: "Appointments",
            onClick: () => {
                setSelectedKey("appointments");
                router.visit(route("admin.appointments"), { replace: true });
            },
        },
        {
            key: "employees",
            icon: <TeamOutlined />,
            label: "Employees",
            onClick: () => {
                setSelectedKey("employees");
                router.visit(route("admin.employees"), { replace: true });
            },
        },
        {
            key: "customers",
            icon: <UserOutlined />,
            label: "Customers",
            onClick: () => {
                setSelectedKey("customers");
                router.visit(route("admin.customers"), { replace: true });
            },
        },
        {
            key: "services",
            icon: <AppstoreOutlined />,
            label: "Services",
            onClick: () => {
                setSelectedKey("services");
                router.visit(route("admin.services"), { replace: true });
            },
        },
        {
            key: "extras",
            icon: <PlusOutlined />,
            label: "Extras",
            onClick: () => {
                setSelectedKey("extras");
                router.visit(route("admin.extras"), { replace: true });
            },
        },
        {
            key: "forms",
            icon: <FormOutlined />,
            label: "Forms",
            onClick: () => {
                setSelectedKey("forms");
                router.visit(route("admin.forms"), { replace: true });
            },
        },
        {
            key: "custom-fields",
            icon: <FieldBinaryOutlined />,
            label: "Custom Fields",
            onClick: () => {
                setSelectedKey("custom-fields");
                router.visit(route("admin.custom-fields"), { replace: true });
            },
        },
        {
            key: "times",
            icon: <ClockCircleOutlined />,
            label: "Times",
            onClick: () => {
                setSelectedKey("times");
                router.visit(route("admin.times"), { replace: true });
            },
        },
        {
            key: "calendar",
            icon: <CalendarOutlined />,
            label: "Calendar",
            onClick: () => {
                setSelectedKey("calendar");
                router.visit(route("admin.calendar"), { replace: true });
            },
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => {
                setSelectedKey("settings");
                router.visit(route("admin.settings"), { replace: true });
            },
        },
        {
            key: "integration",
            icon: <ApiOutlined />,
            label: "Integration",
            onClick: () => {
                setSelectedKey("integration");
                router.visit(route("admin.integration"), { replace: true });
            },
        },
        {
            key: "notification",
            icon: <NotificationOutlined />,
            label: "Notification",
            onClick: () => {
                setSelectedKey("notification");
                router.visit(route("admin.notification"), { replace: true });
            },
        },
    ];

    const userMenuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: () => router.post(route("logout")),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: "#001529",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                }}
            >
                <div
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid #303030",
                        marginBottom: 16,
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: collapsed ? "16px" : "18px",
                        }}
                    >
                        {collapsed ? "BP" : "Booking Platform"}
                    </Title>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    style={{
                        borderRight: 0,
                        background: "#001529",
                    }}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: "0 24px",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 1,
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />

                    <Space size="large">
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            style={{ fontSize: "16px" }}
                        />

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar
                                    style={{
                                        backgroundColor: "#1890ff",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {auth?.user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "A"}
                                </Avatar>
                                {!collapsed && (
                                    <span style={{ color: "#333" }}>
                                        {auth?.user?.name || "Admin"}
                                    </span>
                                )}
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        margin: "24px",
                        padding: "24px",
                        background: "#f0f2f5",
                        borderRadius: "8px",
                        minHeight: "calc(100vh - 112px)",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
