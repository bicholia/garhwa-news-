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
                'brand-navy': '#0F172A',
                'brand-gold': '#B45309',
                'brand-red': '#E31E24',
                'ndtv-black': '#000000',
                'ndtv-gray': '#F5F5F5',
                'news-paper': '#F8FAF9',
                'news-text': '#1E293B',
            },
            fontFamily: {
                serif: ['"PT Serif"', 'serif'],
                sans: ['Roboto', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
export default config
