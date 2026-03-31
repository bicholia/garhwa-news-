// app/api/admin/bulk-upload/route.ts
// Enterprise Bulk News Upload API for NR Daily News
// Features: Forgiving parse, weighted category detect, batch processing, dry-run

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import * as XLSX from 'xlsx'
import { insertNews } from '@/lib/db'

// ── Sanity Client ─────────────────────────────────────────────────────────────
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
})

// ── Category → Sanity _id lookup ─────────────────────────────────────────────
// We cache these at start of every batch request (avoids N+1 queries)
let categoryCache: Record<string, string> = {}

async function loadCategories() {
    const cats = await client.fetch(
        `*[_type == "category"]{ _id, "slug": slug.current, title }`
    )
    const map: Record<string, string> = {}
    cats.forEach((c: { _id: string; slug: string; title: string }) => {
        map[c.slug] = c._id
        map[c.title?.toLowerCase()] = c._id
    })
    categoryCache = map
}

// ── Weighted Category Detection ───────────────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, { weight: number; keywords: string[] }> = {
    garhwa: { weight: 5, keywords: ['गढ़वा', 'garhwa', 'Garhwa'] },
    palamu: { weight: 5, keywords: ['पलामू', 'palamu', 'Palamu', 'डालटनगंज'] },
    jharkhand: { weight: 4, keywords: ['झारखंड', 'jharkhand', 'रांची', 'ranchi'] },
    apradh: { weight: 3, keywords: ['हत्या', 'चोरी', 'FIR', 'पुलिस', 'गिरफ्तार', 'crime', 'murder', 'arrested', 'theft', 'robbery', 'अपराध'] },
    rajniti: { weight: 2, keywords: ['BJP', 'Congress', 'चुनाव', 'election', 'नेता', 'minister', 'CM', 'विधायक', 'सांसद', 'राजनीति'] },
    khel: { weight: 2, keywords: ['cricket', 'IPL', 'football', 'खेल', 'match', 'tournament', 'खिलाड़ी', 'sports'] },
    swasthya: { weight: 2, keywords: ['hospital', 'doctor', 'health', 'स्वास्थ्य', 'बीमारी', 'vaccine', 'अस्पताल', 'इलाज'] },
    shiksha: { weight: 2, keywords: ['school', 'college', 'exam', 'शिक्षा', 'परीक्षा', 'university', 'result', 'scholarship'] },
    vyapar: { weight: 2, keywords: ['business', 'economy', 'rupee', 'बाजार', 'व्यापार', 'price', 'market', 'महंगाई', 'tax'] },
    technology: { weight: 2, keywords: ['mobile', 'internet', 'AI', 'tech', 'app', 'digital', 'phone', 'computer', 'software'] },
    manoranjan: { weight: 2, keywords: ['film', 'bollywood', 'song', 'मनोरंजन', 'movie', 'actor', 'actress', 'music', 'song'] },
    dharm: { weight: 2, keywords: ['temple', 'mandir', 'puja', 'धर्म', 'त्योहार', 'festival', 'mosque', 'church', 'pooja', 'eid', 'diwali'] },
    rashtriya: { weight: 1, keywords: ['national', 'india', 'delhi', 'भारत', 'देश', 'राष्ट्रीय', 'New Delhi', 'Modi', 'PM'] },
}

function detectCategory(title: string, body: string): { primary: string; all: string[] } {
    const text = `${title} ${body}`
    const scores: Record<string, number> = {}

    for (const [cat, data] of Object.entries(CATEGORY_KEYWORDS)) {
        let matches = 0
        for (const kw of data.keywords) {
            if (text.toLowerCase().includes(kw.toLowerCase())) matches++
        }
        if (matches > 0) scores[cat] = matches * data.weight
    }

    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat)

    return {
        primary: sorted[0] || 'jharkhand',
        all: sorted.slice(0, 3),
    }
}

// ── Image Handling ───────────────────────────────────────────────────────────
async function downloadAndUploadImage(title: string): Promise<string | null> {
    try {
        const seed = encodeURIComponent(title.slice(0, 50))
        const imageUrl = `https://picsum.photos/seed/${seed}/1024/768`
        const response = await fetch(imageUrl)
        if (!response.ok) return null
        
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const asset = await client.assets.upload('image', buffer, {
            filename: `bulk-${Date.now()}.jpg`,
            contentType: 'image/jpeg'
        })
        return asset._id
    } catch (err) {
        console.error('[Image Upload Error]', err)
        return null
    }
}

// ── Auto-Tag Generator ────────────────────────────────────────────────────────
function generateTags(title: string, district: string, category: string): string[] {
    const tags: string[] = []
    if (district) tags.push(district)
    const wordRegex = /[\u0900-\u097F]{3,}|[A-Z][a-z]{2,}/g
    const matches = title.match(wordRegex) || []
    tags.push(...matches.slice(0, 5))
    if (category) tags.push(category)
    return [...new Set(tags.map(t => t.trim()).filter(Boolean))].slice(0, 8)
}

// ── Sentence-Aware Excerpt ────────────────────────────────────────────────────
function generateExcerpt(text: string, maxLength = 160): string {
    if (!text) return ''
    // Strip any HTML
    const plain = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (plain.length <= maxLength) return plain

    // Find last complete sentence within limit
    const sentenceEnd = /[।.!?]+/g
    let lastEnd = 0
    let m: RegExpExecArray | null
    while ((m = sentenceEnd.exec(plain)) !== null) {
        if (m.index + 1 >= maxLength) break
        lastEnd = m.index + 1
    }

    return lastEnd > 0 ? plain.slice(0, lastEnd) + '…' : plain.slice(0, maxLength - 1) + '…'
}

// ── Bullet-Proof Slug ─────────────────────────────────────────────────────────
const usedSlugs = new Set<string>()

function generateSlug(title: string, publishedAt: string): string {
    const date = publishedAt ? new Date(publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    const base = title
        .toLowerCase()
        .trim()
        .replace(/[\u0900-\u097F]+/g, w => {
            // Simple Hindi → latin transliteration trick: use unicode code point hex
            return [...w].map(c => c.codePointAt(0)!.toString(16)).join('')
        })
        .replace(/[^\w-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60)

    let slug = `${base}-${date}`

    if (usedSlugs.has(slug)) {
        const suffix = Math.random().toString(36).slice(2, 6)
        slug = `${slug}-${suffix}`
    }
    usedSlugs.add(slug)
    return slug
}

// ── Column Normalization ──────────────────────────────────────────────────────
function normalizeRow(row: Record<string, unknown>) {
    const getValue = (keys: string[]): string => {
        for (const key of keys) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                return String(row[key]).trim()
            }
        }
        return ''
    }

    const boolVal = (keys: string[]): boolean =>
        ['true', 'yes', '1', 'on', 'haan', 'हाँ'].includes(
            getValue(keys).toLowerCase()
        )

    const rawPublished = getValue(['publishedAt', 'published_date', 'date', 'तारीख'])
    let publishedAt = new Date().toISOString()
    if (rawPublished) {
        const parsed = new Date(rawPublished)
        if (!isNaN(parsed.getTime())) publishedAt = parsed.toISOString()
    }

    return {
        title: getValue(['title', 'Title', 'News Title', 'शीर्षक', 'headline']),
        body: getValue(['body', 'Body', 'content', 'Content', 'विवरण', 'details']),
        excerpt: getValue(['excerpt', 'Excerpt', 'summary', 'Summary', 'सारांश']),
        district: getValue(['district', 'District', 'जिला']),
        category: getValue(['category', 'Category', 'श्रेणी']),
        tags: getValue(['tags', 'Tags', 'टैग', 'keywords']),
        featured: boolVal(['featured', 'Featured', 'feature']),
        isBreaking: boolVal(['isBreaking', 'breaking', 'Breaking', 'breaking_news']),
        imageUrl: getValue(['imageUrl', 'ImageUrl', 'image', 'Image', 'चित्र', 'photo']),
        publishedAt,
    }
}

// ── Row Validator ─────────────────────────────────────────────────────────────
type RowError = { field: string; reason: string; severity: 'error' | 'warning'; suggestion?: string }

function validateRow(row: ReturnType<typeof normalizeRow>, rowNum: number): RowError[] {
    const errors: RowError[] = []

    if (!row.title) {
        errors.push({ field: 'title', reason: 'Title (शीर्षक) khali hai', severity: 'error' })
    } else if (row.title.length < 5) {
        errors.push({ field: 'title', reason: 'Title bahut chhota hai (minimum 5 chars)', severity: 'error' })
    }

    if (!row.body) {
        errors.push({ field: 'body', reason: 'News body (विवरण) khali hai', severity: 'error' })
    }

    const validDistricts = ['garhwa', 'palamu', 'jharkhand', 'national']
    if (row.district && !validDistricts.includes(row.district.toLowerCase())) {
        errors.push({
            field: 'district',
            reason: `"${row.district}" valid nahi. Use: garhwa, palamu, jharkhand, national`,
            severity: 'warning',
            suggestion: 'jharkhand use hoga by default',
        })
    }

    return errors
}

// ── Build Sanity Doc ──────────────────────────────────────────────────────────
async function buildSanityDoc(
    row: ReturnType<typeof normalizeRow>,
    rowNum: number,
    batchId: string,
    isDryRun: boolean
) {
    // Category resolution
    let categorySlug = row.category.toLowerCase()
    let detected = false
    if (!categorySlug) {
        const detected_result = detectCategory(row.title, row.body)
        categorySlug = detected_result.primary
        detected = true
    }

    // Find Sanity category _id
    const categoryId = categoryCache[categorySlug]
        || categoryCache[Object.keys(categoryCache).find(k =>
            k.includes(categorySlug) || categorySlug.includes(k)
        ) || '']

    // Tags
    const rawTags = row.tags
        ? row.tags.split(/[,،;]/).map(t => t.trim()).filter(Boolean)
        : []
    const autoTags = rawTags.length > 0 ? rawTags : generateTags(row.title, row.district, categorySlug)

    // Excerpt
    const excerpt = row.excerpt || generateExcerpt(row.body, 160)

    // Slug
    const slug = generateSlug(row.title, row.publishedAt)

    // District normalization
    const district = (['garhwa', 'palamu', 'jharkhand', 'national'].includes(row.district?.toLowerCase()))
        ? row.district.toLowerCase()
        : 'jharkhand'

    // Build portable text body from plain text
    const bodyBlocks = row.body
        .split('\n')
        .filter(p => p.trim())
        .map(p => ({
            _type: 'block',
            _key: Math.random().toString(36).slice(2, 10),
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text: p.trim(), marks: [] }],
        }))

    // Handle Image (skip actual upload on dry run)
    let assetRef = null
    if (!isDryRun) {
        assetRef = await downloadAndUploadImage(row.title)
    }

    const doc: Record<string, unknown> = {
        _type: 'article',
        title: row.title,
        slug: { _type: 'slug', current: slug },
        excerpt,
        body: bodyBlocks,
        district,
        publishedAt: row.publishedAt,
        featured: row.featured,
        isBreaking: row.isBreaking,
        tags: autoTags,
        importMetadata: {
            _type: 'object',
            batchId,
            importedAt: new Date().toISOString(),
            source: 'bulk-upload',
            originalRow: rowNum,
            autoCategory: detected,
        },
    }

    if (categoryId) {
        doc.category = { _type: 'reference', _ref: categoryId }
    }

    if (assetRef) {
        doc.featureImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetRef }
        }
    } else {
        // Fallback placeholder ref if possible, or just skip
        // (Schema requires it, so in dry run we return placeholder info)
    }

    return doc
}

// ── MAIN POST HANDLER ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    const isDryRun = req.nextUrl.searchParams.get('dryRun') === 'true'
    const BATCH_SIZE = 50

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        if (!file) {
            return NextResponse.json({ error: 'Koi file upload nahi ki' }, { status: 400 })
        }

        // Read file
        const buffer = Buffer.from(await file.arrayBuffer())
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
            return NextResponse.json({ error: 'Excel mein koi sheet nahi mili' }, { status: 400 })
        }
        const sheet = workbook.Sheets[sheetName]
        if (!sheet) {
            return NextResponse.json({ error: 'Sheet read nahi ho payi' }, { status: 400 })
        }
        const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (rawRows.length === 0) {
            return NextResponse.json({ error: 'Excel file empty hai ya format galat hai' }, { status: 400 })
        }

        if (rawRows.length > 1000) {
            return NextResponse.json({ error: 'Ek baar mein maximum 1000 rows allowed hain' }, { status: 400 })
        }

        // Load Sanity categories
        await loadCategories()

        // Reset slug tracker per request
        usedSlugs.clear()

        const batchId = `bulk-${Date.now()}`
        const results = {
            batchId,
            success: 0,
            failed: 0,
            total: rawRows.length,
            validationErrors: [] as { row: number; title: string; errors: RowError[] }[],
            uploadErrors: [] as { row: number; title: string; error: string }[],
            preview: [] as unknown[],
            isDryRun,
        }

        // Parse + validate ALL rows first
        const validRows: { doc: Record<string, unknown>; rowNum: number; title: string; normalized: ReturnType<typeof normalizeRow> }[] = []

        for (let i = 0; i < rawRows.length; i++) {
            const normalized = normalizeRow(rawRows[i] as Record<string, unknown>)
            const errors = validateRow(normalized, i + 2) // row 1 = header

            if (errors.some(e => e.severity === 'error')) {
                results.failed++
                results.validationErrors.push({ row: i + 2, title: normalized.title || `Row ${i + 2}`, errors })
                continue
            }

            const doc = await buildSanityDoc(normalized, i + 2, batchId, isDryRun)
            validRows.push({ doc, rowNum: i + 2, title: normalized.title, normalized })

            // For dry-run we return the built docs as preview
            if (isDryRun) {
                results.preview.push({ row: i + 2, ...doc, _validationWarnings: errors })
            }
        }

        if (isDryRun) {
            return NextResponse.json({
                ...results,
                message: `Dry-run complete. ${validRows.length} rows valid, ${results.failed} invalid.`,
            })
        }

        // Upload in batches of 50
        for (let b = 0; b < validRows.length; b += BATCH_SIZE) {
            const batch = validRows.slice(b, b + BATCH_SIZE)

            const settled = await Promise.allSettled(
                batch.map(async ({ doc, normalized }) => {
                    // Create in Sanity
                    const sanityResult = await client.create(doc as any)
                    
                    // Sync to Postgres (best effort)
                    try {
                        await insertNews({
                            title: normalized.title,
                            slug: (doc.slug as any).current,
                            content: normalized.body,
                            excerpt: doc.excerpt as string,
                            image_url: null, // asset assigned in sanity
                            category: normalized.category || (doc.category as any)?._ref || 'स्थानीय समाचार',
                            district: normalized.district || 'jharkhand',
                            original_source: 'bulk-upload',
                            published_at: normalized.publishedAt,
                            is_promoted: normalized.featured,
                            priority: normalized.featured ? 100 : 0,
                            highlights: [],
                            seo_keywords: (doc.tags as string[]).join(', ')
                        })
                    } catch (pgErr) {
                        console.warn('[Postgres Sync Failed]', pgErr)
                    }
                    
                    return sanityResult
                })
            )

            settled.forEach((outcome, idx) => {
                const batchItem = batch[idx]!
                const { rowNum, title } = batchItem
                if (outcome.status === 'fulfilled') {
                    results.success++
                } else {
                    results.failed++
                    results.uploadErrors.push({
                        row: rowNum,
                        title,
                        error: (outcome.reason as Error).message,
                    })
                }
            })
        }

        return NextResponse.json({
            ...results,
            message: `${results.success} articles successfully publish hue, ${results.failed} fail hue.`,
        })
    } catch (err: unknown) {
        console.error('[bulk-upload] Error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Server error' },
            { status: 500 }
        )
    }
}

// ── GET: Return sample template info ─────────────────────────────────────────
export async function GET() {
    return NextResponse.json({
        templateColumns: [
            'title', 'body', 'excerpt', 'district', 'category', 'tags',
            'featured', 'isBreaking', 'publishedAt'
        ],
        districtValues: ['garhwa', 'palamu', 'jharkhand', 'national'],
        categoryValues: [
            'garhwa', 'palamu', 'jharkhand', 'rashtriya', 'apradh',
            'rajniti', 'khel', 'swasthya', 'shiksha', 'vyapar',
            'technology', 'manoranjan', 'dharm'
        ],
        notes: [
            'category aur tags blank chhodo — system auto-detect karega',
            'featured / isBreaking: yes/no ya 1/0 likhein',
            'publishedAt blank chhodo → aaj ka date use hoga',
        ],
    })
}
