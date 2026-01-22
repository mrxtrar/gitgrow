import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Git Graph Palette - Emerald variations
                'git': {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
            },
            animation: {
                'blink': 'blink 1s step-end infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(52, 211, 153, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

export default config
