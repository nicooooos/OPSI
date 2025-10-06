/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,index}.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(15px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast-popup': {
          'from': { opacity: '0', transform: 'translate(-50%, -20px)' },
          'to': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        'fade-in-fast-modal': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'fade-in-fast-popup': 'fade-in-fast-popup 0.3s ease-out forwards',
        'fade-in-fast-modal': 'fade-in-fast-modal 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}