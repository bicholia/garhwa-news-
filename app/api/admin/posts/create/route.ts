import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { revalidatePath } from 'next/cache'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

function makeSlug(title: string) {
    return (
        title
            .toLowerCase()
            .replace(/[^\u0900-\u097fa-zA-Z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 80) +
        '-' +
        Date.now().toString(36)
    )
}

// Convert HTML body string to Sanity portable text blocks
function htmlToBlocks(html: string) {
    if (!html) return []
    // Store HTML as a single portable text block (custom html type)
    // This keeps the rich formatting intact
    return [
        {
            _type: 'block',
            _key: Math.random().toString(36).slice(2),
            style: 'normal',
            markDefs: [],
            children: [
                {
                    _type: 'span',
                    _key: Math.random().toString(36).slice(2),
                    text: html, // Store raw HTML in text — frontend renders via dangerouslySetInnerHTML
                    marks: [],
                },
            ],
        },
    ]
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        if (!data.title || !data.body) {
            return NextResponse.json({ error: 'Title और Body ज़रूरी हैं' }, { status: 400 })
        }

        const doc: any = {
            _type: 'article',
            title: data.title,
            slug: {
                _type: 'slug',
                current: makeSlug(data.title),
            },
            excerpt: data.excerpt || '',
            body: htmlToBlocks(data.body),
            // Store raw HTML separately for easy retrieval
            bodyHtml: data.body,
            // Handle Category Reference (assuming we use fixed IDs or need to look them up)
            category: data.category ? {
                _type: 'reference',
                _ref: data.category.startsWith('category-') ? data.category : `category-${data.category}`
            } : undefined,
            // Handle Author Reference
            author: data.author ? {
                _type: 'reference',
                _ref: data.author
            } : {
                _type: 'reference',
                _ref: 'author-admin' // Fallback to seeded admin author
            },
            district: data.district || 'garhwa',
            featured: data.featured || false,
            publishedAt: new Date().toISOString(),
        }

        // Feature image (uploaded to Sanity assets)
        if (data.featureImageId) {
            doc.featureImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: data.featureImageId,
                },
            }
        } else if (data.featureImageUrl) {
            // External URL — store as string
            doc.featureImageUrl = data.featureImageUrl
        }

        // Tags
        if (data.tags) {
            doc.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        }

        const result = await client.create(doc)

        // Instant Live Update: Clear cache for home and news pages
        revalidatePath('/')
        revalidatePath('/(public)')
        revalidatePath(`/news/${doc.slug.current}`)

        return NextResponse.json({ success: true, id: result._id, slug: doc.slug.current })
    } catch (error: any) {
        console.error('Create post error:', error)
        return NextResponse.json({ error: error.message || 'Sanity error' }, { status: 500 })
    }
}
