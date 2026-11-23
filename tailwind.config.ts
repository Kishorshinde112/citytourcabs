import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A96EB',
          hover: '#1578BC',
        },
        brand: {
          orange: '#ea580c',
          blue: '#1A96EB',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['var(--font-reddit)', 'Reddit Sans', 'sans-serif'],
        reddit: ['var(--font-reddit)', 'Reddit Sans', 'sans-serif'],
        handwritten: ['var(--font-caveat)', 'Caveat', 'cursive'],
        handwriting: ['var(--font-caveat)', 'Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
