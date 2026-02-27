import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

export async function POST(request: Request) {
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
