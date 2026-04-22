import { z } from 'zod'

export const ArticleSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Title is required').default('Untitled'),
    slug: z.object({
        current: z.string().min(1, 'Slug is required'),
    }).default({ current: 'untitled-article' }),
    excerpt: z.string().nullable().default('No excerpt available'),
    body: z.any().optional(), // Could be more strictly typed portable text, but any is safe here for Sanity block content
    featureImage: z.object({
        asset: z.object({
            url: z.string().url(),
        }).optional(),
    }).nullable().optional(),
    author: z.object({
        name: z.string(),
        image: z.any().optional(),
    }).nullable().default({ name: 'ThinkIndia.press' }),
    category: z.object({
        title: z.string(),
    }).nullable().default({ title: 'General' }),
    publishedAt: z.string().datetime().default(() => new Date().toISOString()),
    district: z.string().nullable().default('गढ़वा'),
    tags: z.array(z.string()).nullable().default([]),
})

export type Article = z.infer<typeof ArticleSchema>
