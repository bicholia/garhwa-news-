import Link from 'next/link'
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    // Show max 5 pages around current page
    const getVisiblePages = () => {
        const delta = 2;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;
        const range = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i < right)) {
                range.push(i);
            }
        }
        return range;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col items-center gap-6 mt-16">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy/30 flex items-center gap-2">
                <Hash size={10} /> Agency Archive Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center justify-center gap-3">
                {currentPage > 1 && (
                    <Link
                        href={`${basePath}?page=${currentPage - 1}`}
                        className="flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-sm text-brand-navy hover:text-brand-gold hover:border-brand-gold/30 hover:shadow-lg transition-all"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                )}

                {visiblePages.map((page, index) => {
                    const prevPage = visiblePages[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                        <div key={page} className="flex items-center gap-3">
                            {showEllipsis && <span className="text-gray-300 font-black">...</span>}
                            <Link
                                href={`${basePath}?page=${page}`}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all shadow-sm ${page === currentPage
                                        ? 'bg-brand-navy text-white shadow-brand-navy/20 shadow-xl scale-110 z-10'
                                        : 'bg-white border border-gray-100 text-brand-navy hover:border-brand-gold/30 hover:text-brand-gold hover:shadow-lg'
                                    }`}
                            >
                                {page < 10 ? `0${page}` : page}
                            </Link>
                        </div>
                    );
                })}

                {currentPage < totalPages && (
                    <Link
                        href={`${basePath}?page=${currentPage + 1}`}
                        className="flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-sm text-brand-navy hover:text-brand-gold hover:border-brand-gold/30 hover:shadow-lg transition-all"
                    >
                        <ChevronRight size={20} />
                    </Link>
                )}
            </div>
        </div>
    )
}
