import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {currentPage > 1 && (
                <Link
                    href={`${basePath}?page=${currentPage - 1}`}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-red-400 hover:text-red-600 transition-colors"
                >
                    <ChevronLeft size={16} /> पिछला
                </Link>
            )}

            {pages.map(page => (
                <Link
                    key={page}
                    href={`${basePath}?page=${page}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === currentPage
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-200 hover:border-red-400 hover:text-red-600'
                        }`}
                >
                    {page}
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link
                    href={`${basePath}?page=${currentPage + 1}`}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-red-400 hover:text-red-600 transition-colors"
                >
                    अगला <ChevronRight size={16} />
                </Link>
            )}
        </div>
    )
}
