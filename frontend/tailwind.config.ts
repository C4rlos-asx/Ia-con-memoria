import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aion-black': '#0B0D0E',
        'aion-gray': '#121417',
        'aion-green': '#00E676',
        'aion-green-secondary': '#00B86B',
        'aion-gray-light': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'aion-glow': '0 0 30px rgba(0, 230, 118, 0.5)',
        'aion-card': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'aion': '22px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 230, 118, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
