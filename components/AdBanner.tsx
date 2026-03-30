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
                className={`flex flex-col items-center justify-center p-8 my-10 border border-brand-navy/10 rounded-3xl bg-brand-navy/[0.02] relative overflow-hidden group ${className}`}
                style={{
                    maxWidth: finalWidth,
                    minHeight: Math.max(finalHeight, 120),
                    ...style
                }}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-3 italic">
                    Global Intelligence Ad Slot
                </span>
                <div className="text-xl lg:text-2xl font-black text-brand-navy font-serif mb-4 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-brand-navy/20" /> 
                    Reserve This Space 
                    <span className="w-8 h-[1px] bg-brand-navy/20" />
                </div>
                <Link
                    href="/contact"
                    className="bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-brand-gold transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    Contact Bureau
                </Link>
                <div className="absolute bottom-4 right-8 text-[8px] font-bold uppercase tracking-widest text-brand-navy/10">
                    Ref: {slot.toUpperCase()} - {finalWidth}x{finalHeight}
                </div>
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
            className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized   // Sanity CDN URLs don't need Next.js optimisation
        />
    )

    return (
        <div
            className={`my-12 text-center ${className}`}
            style={{
                maxWidth: finalWidth,
                margin: '3rem auto',
                ...style
            }}
        >
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold mb-3 italic">
                Strategic Partner Briefing
            </span>
            {/* Only wrap in <a> if we actually have a target URL */}
            {finalLink ? (
                <a href={finalLink} target="_blank" rel="noopener noreferrer nofollow" className="block transform hover:scale-[1.01] transition-transform duration-500">
                    {imgElement}
                </a>
            ) : (
                imgElement
            )}
        </div>
    )
}
