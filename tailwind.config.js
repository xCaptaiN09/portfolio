/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        ink: '#0B0B0C',
        cream: '#EDECE4',
        orange: '#FF4D00',
      },
    },
  },
  plugins: [],
}
