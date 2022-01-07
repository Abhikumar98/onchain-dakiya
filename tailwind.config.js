const colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			screens: {
				xs: { max: "425px" },
				sm: { max: "768px" },
				"max-lg": { max: "1024px" },
			},
			animation: {
				"animate-alt-spin": "spin 1s linear infinite reverse",
				"spin-slow": "spin 3s linear infinite",
			},
			height: {
				154: "38rem",
			},
		},
		fontFamily: {
			inter: ["Inter"],
			landing: ["Clash Display"],
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: colors.trueGray,
			indigo: colors.indigo,
			red: colors.rose,
			yellow: colors.amber,
			blue: colors.blue,
			green: colors.green,
			primaryBackground: "#2C2C35",
			secondaryBackground: "#1e1e24",
			primaryText: "#ffffff",
			secondaryText: "#A9A9B7",
			messageHover: "#40404a",
			landing: "#101013",
			"heading-color": "var(--heading-color)",
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
