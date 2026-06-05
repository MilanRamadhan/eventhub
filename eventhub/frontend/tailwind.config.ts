import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        'border-dark': '#1e1e2e',
        accent: '#6366f1',
      },
      boxShadow: {
        'indigo-glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'indigo-glow-lg': '0 0 40px rgba(99, 102, 241, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
