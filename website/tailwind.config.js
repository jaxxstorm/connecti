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

const blue = {
    100: "#edeffb",
    200: "#dbdef7",
    300: "#b8bdf0",
    400: "#949de8",
    500: "#717ce1",
    600: "#4d5bd9",
    700: "#3e49ae",
    800: "#2e3782",
    900: "#1f2457",
};

const green = {
    100: "#e0fff2",
    200: "#b2fbe0",
    300: "#81eeca",
    400: "#4ce1b4",
    500: "#2fc89f",
    600: "#25a78b",
    700: "#1d8673",
    800: "#19675b",
    900: "#155148",
};

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray,
                blue,
                green,
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
