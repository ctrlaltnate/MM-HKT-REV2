/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-canvas': '#070816',
        'bg-world-night': '#0D1025',
        'surface-1': '#17162E',
        'surface-2': '#262047',
        'surface-3': '#352C5E',
        'brand-purple': {
          DEFAULT: '#8B5CF6',
          dark: '#6D28D9',
          light: '#A78BFA'
        },
        'brand-pink': {
          DEFAULT: '#FF4FD8',
          dark: '#DB2777',
          light: '#F472B6'
        },
        'brand-cyan': {
          DEFAULT: '#37E7FF',
          dark: '#0284C7',
          light: '#7DD3FC'
        },
        'brand-mango': {
          DEFAULT: '#FFD84D',
          dark: '#D97706',
          light: '#FDE68A'
        },
        'status-success': '#4ADE80',
        'status-warning': '#FBBF24',
        'status-danger': '#FF5A6F',
        'status-info': '#38BDF8',
        'text-primary': '#F8F7FF',
        'text-muted': '#BBB6D5',
        'text-dim': '#7B759D',
        'text-on-accent': '#070816',
      },
      fontFamily: {
        display: ['Chakra Petch', 'sans-serif'],
        body: ['Noto Sans Thai', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.45)',
        'neon-pink': '0 0 20px rgba(255, 79, 216, 0.45)',
        'neon-cyan': '0 0 20px rgba(55, 231, 255, 0.45)',
        'neon-mango': '0 0 20px rgba(255, 216, 77, 0.45)',
      }
    },
  },
  plugins: [],
}
