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

export async function fetchAllArticles() {
    return await client.fetch(`*[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        excerpt,
        "slug": slug.current,
        publishedAt,
        featureImage {
           asset-> { _id, url }
        },
        image_url
    }`)
}

export async function uploadImageAction(articleId: string, formData: FormData) {
    try {
        const file = formData.get('file') as File | null;
        const url = formData.get('url') as string | null;

        let assetId = null;

        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const asset = await client.assets.upload('image', buffer, {
                filename: file.name || `${articleId}.jpg`
            });
            assetId = asset._id;
        } else if (url && url.trim().length > 0) {
            const response = await fetch(url.trim());
            if (!response.ok) throw new Error("Failed to fetch image from URL");
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            const urlParts = url.split('/');
            let filename = urlParts[urlParts.length - 1] || `${articleId}.jpg`;
            if (filename.indexOf('.') === -1) filename += '.jpg';
            
            const asset = await client.assets.upload('image', buffer, {
                filename: filename
            });
            assetId = asset._id;
        } else {
             return { success: false, error: 'No image provided' };
        }

        await client.patch(articleId).set({
            featureImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            },
            image_url: null 
        }).commit();

        revalidatePath('/');
        revalidatePath('/admin/dashboard/image-manager');
        
        return { success: true };
    } catch (error: any) {
        console.error('uploadImageAction error:', error);
        return { success: false, error: error.message };
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
