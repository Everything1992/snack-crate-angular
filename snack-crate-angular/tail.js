/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{html,js,jsx,ts,tsx,vue}",
        "./public/**/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5a4",
                accent: "#7c3aed"
            },
            spacing: {
                "128": "32rem",
                "144": "36rem"
            }
        }
    },
    plugins: []
}