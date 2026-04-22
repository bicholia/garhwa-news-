import { NewsSkeleton } from '@/components/Skeleton'

export default function Loading() {
    return (
        <div className="container py-12">
            <NewsSkeleton />
        </div>
    )
}
