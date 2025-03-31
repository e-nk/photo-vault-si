import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        border: 'var(--border)',
        'accent-indigo': 'var(--accent-indigo)',
        'accent-indigo-light': 'var(--accent-indigo-light)',
        'accent-rose': 'var(--accent-rose)',
        'accent-rose-light': 'var(--accent-rose-light)',
        'accent-violet': 'var(--accent-violet)',
        'accent-amber': 'var(--accent-amber)',
        'accent-cyan': 'var(--accent-cyan)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        overlay: 'var(--overlay)',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px - larger boxed layout
        '9xl': '96rem', // 1536px - even larger if needed
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.05), transparent, rgba(244, 63, 94, 0.05))',
        'text-gradient': 'linear-gradient(to right, var(--accent-indigo-light), rgba(255, 255, 255, 0.9), var(--accent-rose-light))',
        'text-gradient-white': 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.8))',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'xl': 'calc(var(--radius) + 0.5rem)',
        '2xl': 'calc(var(--radius) + 1rem)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'float': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(15px)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config