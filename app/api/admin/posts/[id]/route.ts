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

// ── GET: Fetch a single post for editing ──────────────────────────────────────
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Use GROQ to expand category slug and image URL
        const post = await client.fetch(
            `*[_id == $id][0]{
                _id,
                title,
                excerpt,
                bodyHtml,
                body,
                district,
                featured,
                tags,
                publishedAt,
                featureImageUrl,
                featureImage {
                    asset-> { _id, url }
                },
                category-> {
                    _id,
                    name,
                    slug { current }
                }
            }`,
            { id }
        )

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error: any) {
        console.error('GET post error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch post' }, { status: 500 })
    }
}

// ── PUT: Update an existing post ──────────────────────────────────────────────
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        if (!data.title) {
            return NextResponse.json({ error: 'Title ज़रूरी है' }, { status: 400 })
        }

        const patch: any = {
            title: data.title,
            excerpt: data.excerpt || '',
            district: data.district || 'garhwa',
            featured: data.featured || false,
        }

        // Update body HTML
        if (data.body) {
            patch.bodyHtml = data.body
            patch.body = [
                {
                    _type: 'block',
                    _key: Math.random().toString(36).slice(2),
                    style: 'normal',
                    markDefs: [],
                    children: [
                        {
                            _type: 'span',
                            _key: Math.random().toString(36).slice(2),
                            text: data.body,
                            marks: [],
                        },
                    ],
                },
            ]
        }

        // Update category reference
        if (data.category) {
            patch.category = {
                _type: 'reference',
                _ref: data.category.startsWith('category-')
                    ? data.category
                    : `category-${data.category}`
            }
        }

        // Update feature image
        if (data.featureImageId) {
            patch.featureImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: data.featureImageId,
                },
            }
        } else if (data.featureImageUrl) {
            patch.featureImageUrl = data.featureImageUrl
        }

        // Update tags
        if (data.tags) {
            patch.tags = typeof data.tags === 'string'
                ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                : data.tags
        }

        const result = await client.patch(id).set(patch).commit()

        // Revalidate pages
        revalidatePath('/')
        revalidatePath(`/news`)
        revalidatePath('/admin/dashboard/posts')

        return NextResponse.json({ success: true, id: result._id })
    } catch (error: any) {
        console.error('PUT post error:', error)
        return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
    }
}

// ── DELETE: Remove a post ─────────────────────────────────────────────────────
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await client.delete(id)
        revalidatePath('/')
        revalidatePath('/admin/dashboard/posts')
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('DELETE post error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
