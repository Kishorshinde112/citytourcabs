/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          50: '#f0f7fd',
          100: '#dff0fa',
          500: '#1A96EB',
          600: '#1578BC',
          700: '#11629b',
        },
        primary: {
          blue: '#1A96EB',
          darkBlue: '#1578BC',
          green: '#10B981',
          accent: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['"Reddit Sans"', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Reddit Sans"', 'Poppins', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(26, 150, 235, 0.4)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
