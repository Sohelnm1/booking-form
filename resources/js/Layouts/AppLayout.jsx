import React from "react";
import { Layout } from "antd";
import BookingHeader from "../Components/BookingHeader";

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children, auth }) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <BookingHeader auth={auth} />
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
