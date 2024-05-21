/** @type {import('tailwindcss').Config} */


export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      xl: "1280px",
      lg: "1024px",
      md: '770px',
      sm: '640px',
      xs: '480px',

    },
    fontFamily: {
      medula: ['"Medula One"'],
      neuton: ['"Neuton"'],
    },
    extend: {
      colors: {
        primary: "rgb(150, 189, 157)",
        background: "rgb(9, 9, 11)",
      },
    },
  },
  plugins: [],
};
