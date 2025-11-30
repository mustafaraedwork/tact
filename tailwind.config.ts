import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--primary)",
                    dark: "var(--primary-dark)",
                    light: "var(--primary-light)",
                },
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                gold: "var(--gold)",
                light: "var(--light)",
                dark: "var(--dark)",
                success: "var(--success)",
                danger: "var(--danger)",
                warning: "var(--warning)",
                info: "var(--info)",
                background: {
                    primary: "var(--bg-primary)",
                    secondary: "var(--bg-secondary)",
                },
                border: "var(--gray-light)",
            },
            fontFamily: {
                heading: ["var(--font-cairo)", "sans-serif"],
                body: ["var(--font-ibm)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
