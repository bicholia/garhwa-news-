import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity-client'

export const dynamic = 'force-dynamic'

// Upload profile picture to Sanity
export async function POST(request: Request) {
    const client = getSanityClient()
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file' }, { status: 400 })
        }

        const asset = await client.assets.upload('image', file, {
            filename: 'admin-profile-' + Date.now(),
            contentType: file.type,
        })

        return NextResponse.json({ url: asset.url, assetId: asset._id })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
