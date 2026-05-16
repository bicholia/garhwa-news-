import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity-client'

export const dynamic = 'force-dynamic'

// ── GET: All articles with their local ad status ───────────────────────────────
export async function GET() {
    const client = getSanityClient()
    try {
        const posts = await client.fetch(`
            *[_type == "article"] | order(publishedAt desc) {
                _id,
                title,
                publishedAt,
                localAd {
                    url,
                    isActive,
                    image {
                        asset-> {
                            _id,
                            url
                        }
                    }
                }
            }
        `)
        return NextResponse.json(Array.isArray(posts) ? posts : [])
    } catch (error: any) {
        console.error('[ads GET] Sanity fetch error:', error)
        return NextResponse.json(
            { error: 'Could not fetch articles: ' + (error.message || 'Unknown error') },
            { status: 500 }
        )
    }
}

// ── POST: Update or remove a local ad for an article ──────────────────────────
export async function POST(request: Request) {
    const client = getSanityClient()
    try {
        let body: any
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        const { id, action, imageAssetId, url, isActive } = body

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Article ID (id) is required' }, { status: 400 })
        }

        // Verify article exists before patching
        const exists = await client.fetch(`*[_id == $id][0]._id`, { id })
        if (!exists) {
            return NextResponse.json({ error: `Article with id "${id}" not found in Sanity` }, { status: 404 })
        }

        if (action === 'remove') {
            await client.patch(id).unset(['localAd']).commit()
            return NextResponse.json({ success: true, message: 'Ad removed successfully' })
        }

        if (action === 'update' || !action) {
            if (!imageAssetId || typeof imageAssetId !== 'string') {
                return NextResponse.json(
                    { error: 'imageAssetId is required to set an ad. Upload an image first.' },
                    { status: 400 }
                )
            }

            await client.patch(id).set({
                localAd: {
                    _type: 'object',
                    image: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: imageAssetId
                        }
                    },
                    url: (url || '').trim(),
                    isActive: isActive !== undefined ? Boolean(isActive) : true
                }
            }).commit()

            return NextResponse.json({ success: true, message: 'Local ad saved successfully' })
        }

        return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 })

    } catch (error: any) {
        console.error('[ads POST] Error:', error)
        return NextResponse.json(
            { error: 'Failed to save ad: ' + (error.message || 'Unknown error') },
            { status: 500 }
        )
    }
}
