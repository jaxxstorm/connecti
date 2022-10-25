/** @type {import('tailwindcss').Config} */

const gray = {
    100: "#f9f9fa",
    200: "#f2f2f4",
    300: "#e5e5e9",
    400: "#d8d9df",
    500: "#bebfc9",
    600: "#8e8f97",
    700: "#5f6065",
    800: "#2f3032",
    850: "#2b2b2c",
    900: "#131314",
};

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray: gray,
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xxl: "1536px",
        },
    },
    plugins: [],
}
