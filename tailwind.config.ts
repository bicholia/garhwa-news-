import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-navy': '#0B1120',
                'brand-gold': '#C5A059',
                'brand-red': '#D91616',
                'brand-accent': '#8B0000',
                'ndtv-black': '#050505',
                'ndtv-gray': '#F8FAFC',
                'news-paper': '#FDFDFD',
                'news-text': '#0B1120',
                'news-muted': '#64748B',
            },
            fontFamily: {
                serif: ['Lora', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.03)',
                'premium-hover': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 8px 15px -5px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
}
export default config
