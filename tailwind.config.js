/**
 * This is needed to integrate custom CSS variables with Tailwind in a way that supports Tailwind's opacity utilities
 * @param variableName - HSL values
 * @returns function that returns hsla or hsl
 */
function withOpacity(variableName) {
  return ({ opacityValue }) =>
    // opacityValue comes from Tailwind
    opacityValue !== undefined
      ? `hsla(var(${variableName}), ${opacityValue})`
      : `hsl(var(${variableName}))`;
}

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        theme: {
          primary: withOpacity("--color-text-primary"),
          inverted: withOpacity("--color-text-inverted"),
          link: withOpacity("--color-text-link"),
        },
      },
      backgroundColor: {
        theme: {
          primary: withOpacity("--color-bg-primary"),
          secondary: withOpacity("--color-bg-secondary"),
          inverted: withOpacity("--color-bg-inverted"),
          "btn-primary": withOpacity("--color-btn-primary"),
          "btn-secondary": withOpacity("--color-btn-secondary"),
          "btn-success": withOpacity("--color-btn-success"),
          "btn-danger": withOpacity("--color-btn-danger"),
        },
      },
      borderColor: {
        theme: {
          primary: withOpacity("--color-border-primary"),
        },
      },
      ringColor: {
        theme: {
          primary: withOpacity("--color-btn-primary"),
          secondary: withOpacity("--color-btn-secondary"),
          success: withOpacity("--color-btn-success"),
          danger: withOpacity("--color-btn-danger"),
        },
      },
      ringOffsetColor: {
        theme: {
          primary: withOpacity("--color-bg-primary"),
        }
      },
      fontFamily: {
        noto: '"Noto Sans", sans-serif',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [],
};
