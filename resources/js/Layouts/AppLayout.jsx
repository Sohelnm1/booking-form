<<<<<<< HEAD
import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import Logo from "../Components/Logo";

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }) {
    const menuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
        },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        marginRight: "48px",
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
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["home"]}
                    items={menuItems}
                    style={{ flex: 1, border: "none" }}
                />
            </Header>
            <Content style={{ padding: "0 50px", marginTop: 16 }}>
                {children}
            </Content>
            <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
                <div style={{ marginBottom: 16 }}>
                    <Logo
                        variant="secondary"
                        color="grayscale"
                        background="white"
                        size="small"
                    />
                </div>
                HospiPal ©{new Date().getFullYear()} Created with Laravel, React
                & Ant Design
            </Footer>
        </Layout>
    );
}
=======
import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import Logo from "../Components/Logo";

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }) {
    const menuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
        },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        marginRight: "48px",
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
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["home"]}
                    items={menuItems}
                    style={{ flex: 1, border: "none" }}
                />
            </Header>
            <Content style={{ padding: "0 50px", marginTop: 16 }}>
                {children}
            </Content>
            <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
                <div style={{ marginBottom: 16 }}>
                    <Logo
                        variant="secondary"
                        color="grayscale"
                        background="white"
                        size="small"
                    />
                </div>
                HospiPal ©{new Date().getFullYear()} Created with Laravel, React
                & Ant Design
            </Footer>
        </Layout>
    );
}
>>>>>>> 7fe797d3646e3ab8c92507d8a985c91f49b15aee
