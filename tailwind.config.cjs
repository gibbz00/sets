/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
    plugins: [
      require("tailwindcss-scoped-groups")({
        groups: ["one", "two"],
      }),
    ],
}
