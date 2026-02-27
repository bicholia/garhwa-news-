import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

// ── GET: All global banners ───────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get('active') === 'true'

        let filter = `_type == "globalAd"`
        if (activeOnly) filter += ` && isActive == true`

        const query = `*[${filter}] | order(priority desc, _createdAt desc) {
            _id,
            title,
            slot,
            customWidth,
            customHeight,
            priority,
            startDate,
            endDate,
            isActive,
            url,
            altText,
            image {
                asset-> {
                    _id,
                    url
                }
            }
        }`

        const banners = await client.fetch(query)
        return NextResponse.json(Array.isArray(banners) ? banners : [])
    } catch (error: any) {
        console.error('[global-ads GET] Error:', error)
        return NextResponse.json(
            { error: 'Could not fetch banners: ' + (error.message || 'Unknown') },
            { status: 500 }
        )
    }
}

// ── POST: Create / Update / Delete ────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        let body: any
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        const {
            action, id, title, imageAssetId,
            url, altText, slot, customWidth, customHeight,
            priority, startDate, endDate, isActive
        } = body

        // ── DELETE ────────────────────────────────────────────────────────────
        if (action === 'delete') {
            if (!id) return NextResponse.json({ error: 'id is required for delete' }, { status: 400 })
            await client.delete(id)
            try { revalidatePath('/', 'layout') } catch { /* cache clear not critical */ }
            return NextResponse.json({ success: true, message: 'Banner deleted' })
        }

        // ── CREATE / UPDATE ───────────────────────────────────────────────────
        if (action === 'create' || action === 'update') {
            // Validate required fields
            const missing: string[] = []
            if (!title?.trim()) missing.push('title')
            if (!slot?.trim()) missing.push('slot')
            if (!imageAssetId?.trim()) missing.push('imageAssetId (upload an image first)')
            if (missing.length > 0) {
                return NextResponse.json(
                    { error: `Missing required fields: ${missing.join(', ')}` },
                    { status: 400 }
                )
            }

            const doc: Record<string, unknown> = {
                _type: 'globalAd',
                title: title.trim(),
                url: (url || '').trim(),
                altText: (altText || '').trim(),
                slot: slot.trim(),
                priority: priority ? parseInt(String(priority), 10) : 0,
                isActive: isActive !== undefined ? Boolean(isActive) : true,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAssetId.trim()
                    }
                }
            }

            // Custom size fields
            if (slot === 'custom') {
                if (customWidth) doc.customWidth = parseInt(String(customWidth), 10)
                if (customHeight) doc.customHeight = parseInt(String(customHeight), 10)
            }

            // Optional date fields — set to null to clear if empty
            doc.startDate = startDate || null
            doc.endDate = endDate || null

            if (action === 'update' && id) {
                // Remove _type from patch (Sanity doesn't allow changing type)
                const { _type, ...patchData } = doc
                await client.patch(id).set(patchData).commit()
            } else {
                await client.create(doc as Parameters<typeof client.create>[0])
            }

            try { revalidatePath('/', 'layout') } catch { /* cache clear not critical */ }
            return NextResponse.json({ success: true, message: 'Banner saved successfully' })
        }

        return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 })

    } catch (error: any) {
        console.error('[global-ads POST] Error:', {
            message: error.message,
            statusCode: error.statusCode,
        })

        let msg = error.message || 'Unknown error'
        if (error.statusCode === 401 || error.statusCode === 403) {
            msg = 'Permission denied. Check SANITY_TOKEN has write permissions.'
        }

        return NextResponse.json({ error: 'Failed to save banner: ' + msg }, { status: error.statusCode || 500 })
    }
}
