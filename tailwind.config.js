/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#0F2C59',
        'primary-light': '#164B8A',
        'secondary': '#0D1282',
        'accent': '#F31559',
        'accent-light': '#FF6D9C',
        'success': '#10B981',
        'warning': '#FBBF24',
        'error': '#EF4444',
        'gold': '#FFB000',
        'text-dark': '#1E293B',
        'text-light': '#64748B',
        'background': '#F8FAFC',
        'border': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
      },
      backgroundImage: {
        'sri-lanka-map': "url('https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        'courier-hero': "url('https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
    },
  },
  plugins: [],
};