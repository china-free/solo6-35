/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f5fa',
          100: '#dce8f3',
          200: '#b9d0e6',
          300: '#8aafd2',
          400: '#5487b9',
          500: '#3369a0',
          600: '#255385',
          700: '#1e436c',
          800: '#1b395a',
          900: '#1e3a5f',
          950: '#11233d',
        },
        accent: {
          500: '#ff6b35',
          600: '#e85a28',
        },
        status: {
          pending: '#94a3b8',
          contacted: '#3b82f6',
          quoted: '#f59e0b',
          closed: '#10b981',
          lost: '#ef4444',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
