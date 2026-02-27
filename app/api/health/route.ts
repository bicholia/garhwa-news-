import { client } from '@/lib/sanity'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // A lightweight query to verify the CMS is accessible
        await client.fetch('count(*[_type == "article"])')

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'degraded',
                error: error.message
            },
            { status: 503 }
        )
    }
}
