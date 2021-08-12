module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "custom-gray": {
          DEFAULT: "#b5bdc4",
          light: "#eef0f1",
        }
      },
      fontFamily: {
        noto: '"Noto Sans", sans-serif',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
