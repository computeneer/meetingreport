/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					dark: "#1E104E",
					DEFAULT: "#452E5A",
				},
				accent: {
					orange: "#FF653F",
					yellow: "#FFC85C",
				},
			},
		},
	},
	plugins: [],
};
