'use server'

import { createClient } from '@sanity/client'
import { revalidatePath } from 'next/cache'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

export async function fetchMissingImageArticles() {
    return await client.fetch(`*[_type == "article" && !defined(featureImage)] | order(publishedAt desc) {
        _id,
        title,
        excerpt,
        "slug": slug.current,
        publishedAt
    }`)
}

export async function attachAIImage(id: string, title: string) {
    try {
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(title)}?width=800&height=450&nologo=true`
        const response = await fetch(imgUrl)
        const arrayBuffer = await response.arrayBuffer()
        
        const asset = await client.assets.upload('image', Buffer.from(arrayBuffer), {
            filename: `${id}-ai.jpg`
        })
        
        await client.patch(id).set({
            featureImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: asset._id }
            }
        }).commit()
        
        revalidatePath('/admin/dashboard/image-manager')
        return { success: true }
    } catch (error: any) {
        console.error('attachAIImage error:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteArticle(id: string) {
    try {
        await client.delete(id)
        revalidatePath('/admin/dashboard/image-manager')
        return { success: true }
    } catch (error: any) {
        console.error('deleteArticle error:', error)
        return { success: false, error: error.message }
    }
}
