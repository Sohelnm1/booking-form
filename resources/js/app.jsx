import "./bootstrap";
import "../css/app.css";
import "antd/dist/reset.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
    title: (title) => `${title} - Booking Website`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Make route function globally available from Ziggy
        if (window.route) {
            // Ziggy is already loaded
        } else {
            // Fallback route function
            window.route = (name, params = {}) => {
                const routes = {
                    welcome: "/",
                    login: "/login",
                    register: "/register",
                    logout: "/logout",
                    "customer.dashboard": "/customer/dashboard",
                    "employee.dashboard": "/employee/dashboard",
                    "admin.dashboard": "/admin/dashboard",
                };
                return routes[name] || "/";
            };
        }

        root.render(<App {...props} />);
    },
});
