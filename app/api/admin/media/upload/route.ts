import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

// ── Sanity Client ──────────────────────────────────────────────────────────────
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

// ── POST: Upload image to Sanity ───────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        // Verify token is configured
        if (!process.env.SANITY_TOKEN) {
            console.error('SANITY_TOKEN is not set in environment variables')
            return NextResponse.json(
                { error: 'Server configuration error: SANITY_TOKEN missing' },
                { status: 500 }
            )
        }

        let formData: FormData
        try {
            formData = await request.formData()
        } catch {
            return NextResponse.json(
                { error: 'Could not parse form data. Make sure you are sending multipart/form-data' },
                { status: 400 }
            )
        }

        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 })
        }

        // Validate file is an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: `Invalid file type: "${file.type}". Only image files (jpg, png, webp, gif) are allowed` },
                { status: 400 }
            )
        }

        // Validate reasonable file size (max 8MB)
        if (file.size > 8 * 1024 * 1024) {
            return NextResponse.json(
                { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum allowed is 8MB` },
                { status: 400 }
            )
        }

        // Convert File to Buffer (needed for Sanity's Node.js upload on server side)
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Sanity
        const asset = await client.assets.upload('image', buffer, {
            filename: file.name || `upload-${Date.now()}.jpg`,
            contentType: file.type || 'image/jpeg',
        })

        if (!asset?._id) {
            throw new Error('Sanity upload succeeded but no asset ID returned')
        }

        console.log('Image uploaded to Sanity:', asset._id)

        return NextResponse.json({
            success: true,
            url: asset.url,
            assetId: asset._id,       // e.g. "image-abc123-jpg"
            width: asset.metadata?.dimensions?.width,
            height: asset.metadata?.dimensions?.height,
        })

    } catch (error: any) {
        console.error('Image upload error:', {
            message: error.message,
            statusCode: error.statusCode,
            response: error.response?.body,
        })

        // Provide helpful error messages
        let userMessage = error.message || 'Unknown upload error'

        if (error.statusCode === 401 || error.statusCode === 403) {
            userMessage = 'Sanity permission denied. Check that SANITY_TOKEN has write access.'
        } else if (error.statusCode === 413) {
            userMessage = 'Image file is too large. Try a smaller image.'
        } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
            userMessage = 'Cannot connect to Sanity. Check your internet connection.'
        }

        return NextResponse.json(
            { error: userMessage },
            { status: error.statusCode || 500 }
        )
    }
}
