import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

// Upload profile picture to Sanity
export async function POST(request: Request) {
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
