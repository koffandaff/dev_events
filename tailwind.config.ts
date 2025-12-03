// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Map your custom colors and background variables
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'dark-100': 'var(--color-dark-100)',
        'dark-200': 'var(--color-dark-200)',
        'light-100': 'var(--color-light-100)',
        'light-200': 'var(--color-light-200)',
        'border-dark': 'var(--color-border-dark)',
        // You should add all colors you use as classes here
      },
      // 2. Map your custom radius variable
      borderRadius: {
        'lg': 'var(--radius)',
        // Add other radius variants if needed
      }
      // You can also add more extensions for fonts, spacing, etc.
    },
  },
  plugins: [
    // This is often needed if you have a custom animate utility
    require('tailwindcss-animate'), 
    // If 'tw-animate-css' is a custom plugin, check its setup.
    // If it's just a set of CSS keyframes, the @import might be enough.
  ],
}