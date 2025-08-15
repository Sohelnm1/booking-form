import React from "react";

const Logo = ({
    variant = "primary",
    color = "color",
    background = "white",
    size = "medium",
    className = "",
    style = {},
}) => {
    // Define size mappings
    const sizeMap = {
        small: { width: 80, height: 80 },
        medium: { width: 200, height: 60 },
        large: { width: 320, height: 100 },
    };

    // Mapping of logo variants to file names
    const getLogoFileName = () => {
        // PNG file mappings
        const pngMappings = {
            // Primary logos
            "primary-color-white": "primary logo-color-white background.png",
            "primary-color-dark": "primary logo-color-dark background.png",
            "primary-grayscale-white":
                "primary logo- grayscale color-white background.png",
            "primary-grayscale-dark":
                "primary logo- grayscale color-dark background.png",

            // Secondary logos
            "secondary-color-white":
                "secondary logo-color-white background.png",
            "secondary-color-dark": "secondary logo-color-dark background.png",
            "secondary-grayscale-white":
                "secondary logo-grayscale color-white background.png",
            "secondary-grayscale-dark":
                "secondary logo-grayscale color-dark background.png",

            // Tertiary logos
            "tertiary-gradient-white":
                "tertiary logo (icon)-gradient color-white and dark background.png",
            "tertiary-grayscale-white":
                "tertiary logo (icon)-grayscale color-white background.png",
            "tertiary-grayscale-dark":
                "tertiary logo (icon)-grayscale color-dark background.png",
            "tertiary-monochrome-white":
                "tertiary logo (icon)-monochrome color-white background.png",
        };

        // SVG file mappings
        const svgMappings = {
            // Primary logos
            "primary-color-white": "primary logo-color-white background.svg",
            "primary-color-dark": "primary logo-color-dark background.svg",
            "primary-grayscale-white":
                "primary logo-grayscale color-white background.svg",
            "primary-grayscale-dark":
                "primary logo- grayscale color-dark background.svg",

            // Secondary logos
            "secondary-color-white":
                "secondary logo-color-white background.svg",
            "secondary-color-dark": "secondary logo-color-dark background.svg",
            "secondary-grayscale-white":
                "secondary logo-grayscale color-white background.svg",
            "secondary-grayscale-dark":
                "secondary logo-grayscale color-dark background.svg",

            // Tertiary logos
            "tertiary-gradient-white":
                "tertiary logo (icon)-gradient color-white and dark background.svg",
            "tertiary-grayscale-white":
                "tertiary logo (icon)-grayscale color-white background.svg",
            "tertiary-grayscale-dark":
                "tertiary logo (icon)-grayscale color-dark background.svg",
            "tertiary-monochrome-white":
                "tertiary logo (icon)-monochrome color-white background.svg",
        };

        const key = `${variant}-${color}-${background}`;
        return {
            png: pngMappings[key] || "primary logo-color-white background.png", // Default to primary color white if not found
            svg: svgMappings[key] || "primary logo-color-white background.svg",
        };
    };

    const getLogoSrc = () => {
        const fileName = getLogoFileName().png;
        return `/PNG/${encodeURIComponent(fileName)}`;
    };

    const getLogoSrcSvg = () => {
        const fileName = getLogoFileName().svg;
        return `/SVG Files/${encodeURIComponent(fileName)}`;
    };

    const logoStyle = {
        ...sizeMap[size],
        objectFit: "contain",
        ...style,
    };

    return (
        <img
            src={getLogoSrc()}
            alt="HospiPal Logo"
            style={logoStyle}
            className={className}
            onError={(e) => {
                // Fallback to SVG if PNG fails
                e.target.src = getLogoSrcSvg();
                e.target.onerror = (e2) => {
                    // Final fallback - hide element if both PNG and SVG fail
                    e2.target.style.display = "none";
                };
            }}
        />
    );
};

export default Logo;
