/**
 * Shared Sanity client factory.
 * IMPORTANT: Do NOT call createClient() at module level in API routes.
 * Always call getSanityClient() inside the request handler so that
 * environment variables are available at runtime, not build time.
 */
import { createClient, type SanityClient } from '@sanity/client'

export function getSanityClient(): SanityClient {
    return createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: false,
        apiVersion: '2024-01-01',
        token: process.env.SANITY_TOKEN,
    })
}

export function getSanityReadClient(): SanityClient {
    return createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: true,
        apiVersion: '2024-01-01',
    })
}
