import React from "react";
import {
    MedicineBoxOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    HomeOutlined,
    HeartOutlined,
    CarOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";

const ServiceIcon = ({ service, size = 80, style = {} }) => {
    // Icon mapping based on service name or icon field
    const getIconComponent = (service) => {
        const iconName =
            service.icon?.toLowerCase() || service.name?.toLowerCase();

        if (iconName) {
            if (
                iconName.includes("medical") ||
                iconName.includes("health") ||
                iconName.includes("hospital")
            ) {
                return MedicineBoxOutlined;
            }
            if (
                iconName.includes("elderly") ||
                iconName.includes("care") ||
                iconName.includes("companion")
            ) {
                return UserOutlined;
            }
            if (
                iconName.includes("emergency") ||
                iconName.includes("urgent") ||
                iconName.includes("on-call")
            ) {
                return ExclamationCircleOutlined;
            }
            if (
                iconName.includes("discharge") ||
                iconName.includes("home") ||
                iconName.includes("support")
            ) {
                return HomeOutlined;
            }
            if (iconName.includes("heart") || iconName.includes("cardiac")) {
                return HeartOutlined;
            }
            if (
                iconName.includes("transport") ||
                iconName.includes("ambulance") ||
                iconName.includes("car")
            ) {
                return CarOutlined;
            }
            if (
                iconName.includes("phone") ||
                iconName.includes("call") ||
                iconName.includes("consultation")
            ) {
                return PhoneOutlined;
            }
            if (
                iconName.includes("appointment") ||
                iconName.includes("schedule") ||
                iconName.includes("booking")
            ) {
                return CalendarOutlined;
            }
            if (
                iconName.includes("time") ||
                iconName.includes("duration") ||
                iconName.includes("waiting")
            ) {
                return ClockCircleOutlined;
            }
            if (
                iconName.includes("premium") ||
                iconName.includes("vip") ||
                iconName.includes("special")
            ) {
                return StarOutlined;
            }
        }

        // Default fallback
        return null;
    };

    const IconComponent = getIconComponent(service);
    const backgroundColor = service.color || "#1890ff";
    const iconSize = Math.max(24, size * 0.3); // Responsive icon size

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: iconSize,
                fontWeight: "bold",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                ...style,
            }}
        >
            {IconComponent ? (
                <IconComponent style={{ fontSize: iconSize }} />
            ) : (
                service.name?.charAt(0)?.toUpperCase() || "S"
            )}
        </div>
    );
};

export default ServiceIcon;
