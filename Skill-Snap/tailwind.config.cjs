module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        display: ['Lora', 'serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)'
      }
    }
  },
  plugins: [],
};
