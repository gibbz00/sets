/** @type {import('tailwindcss').Config} */

let dynamicClasses = require('./src/lib/utils/RegisterDynamicTailwindClass.cjs')

console.log([...dynamicClasses])
module.exports = {
	variants: {
		fill: ['group-hover'],
	},
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [...dynamicClasses],
	theme: {
		extend: {},
	},
	plugins: [
		require('tailwindcss-scoped-groups')({
			groups: ['one', 'two'],
		}),
	],
}
