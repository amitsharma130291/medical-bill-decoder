/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:  '#0F7B8C',
          blue:  '#2D4A7A',
          amber: '#E8A020',
          // Legacy shim so existing brand-600/700 refs still resolve
          50:  '#EFF9FA',
          100: '#D0EFF3',
          500: '#0F7B8C',
          600: '#2D4A7A',
          700: '#243D66',
          900: '#1A2D4A',
        },
        surface: '#F7F8FA',
        ink: '#1A2332',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
