import Link from 'next/link'

export default function SectionHeading({ title, link }: { title: string; link?: string }) {
    return (
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div className="relative">
                <h2 className="text-2xl lg:text-3xl font-bold text-brand-navy tracking-tight">
                    {title}
                </h2>
                <div className="absolute -bottom-[17px] left-0 w-16 h-1 bg-brand-gold rounded-full" />
            </div>
            {link && (
                <Link 
                    href={link} 
                    className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                    View All Archives <span className="text-brand-gold text-lg">&rarr;</span>
                </Link>
            )}
        </div>
    )
}
