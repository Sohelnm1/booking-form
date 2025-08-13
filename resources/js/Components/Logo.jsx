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

    // Mapping of logo variants to file numbers
    // PNG files: 1-12, SVG files: 13-24
    const getLogoFileNumber = () => {
        // PNG file mappings (1-12)
        const pngMappings = {
            // Primary logos
            "primary-color-white": 4, // primary logo-color-white background.png
            "primary-color-dark": 3, // primary logo-color-dark background.png
            "primary-grayscale-white": 2, // primary logo- grayscale color-white background.png
            "primary-grayscale-dark": 1, // primary logo- grayscale color-dark background.png

            // Secondary logos
            "secondary-color-white": 6, // secondary logo-color-white background.png
            "secondary-color-dark": 5, // secondary logo-color-dark background.png
            "secondary-grayscale-white": 8, // secondary logo-grayscale color-white background.png
            "secondary-grayscale-dark": 7, // secondary logo-grayscale color-dark background.png

            // Tertiary logos
            "tertiary-gradient-white": 9, // tertiary logo (icon)-gradient color-white and dark background.png
            "tertiary-grayscale-white": 11, // tertiary logo (icon)-grayscale color-white background.png
            "tertiary-grayscale-dark": 10, // tertiary logo (icon)-grayscale color-dark background.png
            "tertiary-monochrome-white": 12, // tertiary logo (icon)-monochrome color-white background.png
        };

        // SVG file mappings (13-24) - same pattern but +12
        const svgMappings = {
            // Primary logos
            "primary-color-white": 15, // primary logo-color-white background.svg
            "primary-color-dark": 14, // primary logo-color-dark background.svg
            "primary-grayscale-white": 16, // primary logo-grayscale color-white background.svg
            "primary-grayscale-dark": 13, // primary logo- grayscale color-dark background.svg

            // Secondary logos
            "secondary-color-white": 18, // secondary logo-color-white background.svg
            "secondary-color-dark": 17, // secondary logo-color-dark background.svg
            "secondary-grayscale-white": 20, // secondary logo-grayscale color-white background.svg
            "secondary-grayscale-dark": 19, // secondary logo-grayscale color-dark background.svg

            // Tertiary logos
            "tertiary-gradient-white": 21, // tertiary logo (icon)-gradient color-white and dark background.svg
            "tertiary-grayscale-white": 23, // tertiary logo (icon)-grayscale color-white background.svg
            "tertiary-grayscale-dark": 22, // tertiary logo (icon)-grayscale color-dark background.svg
            "tertiary-monochrome-white": 24, // tertiary logo (icon)-monochrome color-white background.svg
        };

        const key = `${variant}-${color}-${background}`;
        return {
            png: pngMappings[key] || 4, // Default to primary color white if not found
            svg: svgMappings[key] || 15,
        };
    };

    const getLogoSrc = () => {
        const fileNumber = getLogoFileNumber().png;
        return `/PNG/${fileNumber}.png`;
    };

    const getLogoSrcSvg = () => {
        const fileNumber = getLogoFileNumber().svg;
        return `/SVG Files/${fileNumber}.svg`;
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
