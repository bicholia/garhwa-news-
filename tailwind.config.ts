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
                'brand-accent': '#C21807',
                'ndtv-black': '#000000',
                'ndtv-gray': '#F8FAFC',
                'news-paper': '#FDFDFD',
                'news-text': '#1E293B',
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
