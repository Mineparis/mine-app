module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				primary: '#ff6072',
				neutral: {
					900: '#111',
					800: '#333',
					700: '#555',
					600: '#777',
					200: '#e5e5e5',
				},
			},
			transitionProperty: {
				'bg-color': 'background-color',
				'colors': 'color',
			},
			zIndex: {
				60: '60', // pour overlay catégorie au-dessus du header sticky
			}
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
};