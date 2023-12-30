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
				'primary': '#96BD9D',
				'light-1': '#F2F1EB',
				'light-2': '#EEE7DA'
			},
		},
	},
	plugins: [],
}
