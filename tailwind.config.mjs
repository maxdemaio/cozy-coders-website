/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'medula': ['"Medula One"'],
			'neuton': ['"Neuton"']
		},
		extend: {
			colors: {
				'primary': 'rgb(150, 189, 157)',
				'background': 'rgb(9, 9, 11)',
			},
		},
	},
	plugins: [],
}
