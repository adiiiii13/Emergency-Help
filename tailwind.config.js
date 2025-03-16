/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-amber-500',
    'text-amber-500',
    'bg-blue-500',
    'text-blue-500',
    'bg-red-500',
    'text-red-500',
    'bg-cyan-500',
    'text-cyan-500'
  ]
};
