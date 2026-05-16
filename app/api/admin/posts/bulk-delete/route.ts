import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity-client'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const client = getSanityClient()
    try {
        const { ids } = await request.json()

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: 'No IDs provided' },
                { status: 400 }
            )
        }

        // Use a transaction to delete all securely and efficiently
        const transaction = client.transaction()
        for (const id of ids) {
            transaction.delete(id)
        }

        await transaction.commit()

        return NextResponse.json({ success: true, count: ids.length })
    } catch (error: any) {
        console.error('Bulk delete error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to bulk delete posts' },
            { status: 500 }
        )
    }
}
