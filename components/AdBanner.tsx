import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@sanity/client'

// Server-side Sanity client — always fetches fresh (no CDN cache)
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,      // Never serve stale CDN cache
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

interface AdBannerProps {
    slot: string
    imageUrl?: string
    link?: string
    alt?: string
    width?: number
    height?: number
    className?: string
    style?: React.CSSProperties
}

async function getGlobalBanner(slot: string) {
    try {
        const result = await client.fetch(
            `*[_type == "globalAd" && slot == $slot && isActive == true && (startDate == null || startDate <= now()) && (endDate == null || endDate >= now())] | order(priority desc, _createdAt desc)[0] {
                _id,
                title,
                slot,
                customWidth,
                customHeight,
                url,
                altText,
                image {
                    asset-> {
                        _id,
                        url
                    }
                }
            }`,
            { slot }
            // Note: Sanity client v6+ automatically skips CDN cache when useCdn: false
        )
        return result ?? null
    } catch (err) {
        console.error('[AdBanner] Sanity fetch error for slot:', slot, err)
        return null
    }
}

export default async function AdBanner({
    slot,
    imageUrl,
    link,               // ⚠️ Default to undefined, NOT '/contact' — we only link if URL provided
    alt = 'Advertisement',
    width = 728,
    height = 90,
    className = '',
    style = {}
}: AdBannerProps) {

    let finalImageUrl = imageUrl
    let finalLink: string | undefined = link
    let finalAlt = alt
    let finalWidth = width
    let finalHeight = height

    // If no direct image provided, fetch from Sanity by slot
    if (!finalImageUrl) {
        const globalAd = await getGlobalBanner(slot)
        if (globalAd?.image?.asset?.url) {
            finalImageUrl = globalAd.image.asset.url
            // Only set link if the ad actually has a URL
            finalLink = globalAd.url && globalAd.url.trim() ? globalAd.url.trim() : undefined
            finalAlt = globalAd.altText || globalAd.title || alt
            if (globalAd.slot === 'custom') {
                finalWidth = globalAd.customWidth || width
                finalHeight = globalAd.customHeight || height
            }
        }
    }

    // No ad found — show the placeholder block
    if (!finalImageUrl) {
        return (
            <div
                className={className}
                style={{
                    width: '100%',
                    maxWidth: finalWidth,
                    minHeight: Math.max(finalHeight, 80),
                    background: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '1.5rem auto',
                    textAlign: 'center',
                    color: '#64748b',
                    overflow: 'hidden',
                    padding: '1rem',
                    ...style
                }}
            >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 4 }}>
                    विज्ञापन (Advertisement)
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>यहाँ अपना विज्ञापन दें</div>
                <Link
                    href="/contact"
                    style={{ display: 'inline-block', marginTop: 6, fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none', background: '#eff6ff', padding: '4px 12px', borderRadius: 4 }}
                >
                    संपर्क करें
                </Link>
            </div>
        )
    }

    // ── Render real ad image ──────────────────────────────────────────────────
    const imgElement = (
        <Image
            src={finalImageUrl}
            alt={finalAlt}
            width={finalWidth}
            height={finalHeight}
            style={{ width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'block' }}
            unoptimized   // Sanity CDN URLs don't need Next.js optimisation
        />
    )

    return (
        <div
            className={className}
            style={{
                width: '100%',
                maxWidth: finalWidth,
                margin: '1.5rem auto',
                textAlign: 'center',
                ...style
            }}
        >
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Advertisement
            </span>
            {/* Only wrap in <a> if we actually have a target URL */}
            {finalLink ? (
                <a href={finalLink} target="_blank" rel="noopener noreferrer nofollow" style={{ display: 'block' }}>
                    {imgElement}
                </a>
            ) : (
                imgElement
            )}
        </div>
    )
}
