// schemas/article.ts — Article document schema for NR Daily News
// FIELDS: title, slug, excerpt, body (blocks), featureImage, category, district, publishedAt, author, seo

import { defineField, defineType } from 'sanity'

export const articleSchema = defineType({
    name: 'article',
    title: 'समाचार लेख',
    type: 'document',
    // Group fields for better Studio UX
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'meta', title: 'Meta & Category' },
        { name: 'seo', title: 'SEO' },
        { name: 'ads', title: 'Advertisements' },
    ],

    fields: [
        // ── CONTENT GROUP ──────────────────────────────────────────
        defineField({
            name: 'title',
            title: 'शीर्षक (Title)',
            type: 'string',
            validation: (Rule) =>
                Rule.custom((title, context) => {
                    if (!title) {
                        return 'शीर्षक (Title) is required'
                    }
                    if (typeof title === 'string' && title.length < 5) {
                        return 'Title must be at least 5 characters'
                    }
                    return true
                }).required().max(120),
        }),

        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            group: 'content',
            options: {
                source: 'title',
                maxLength: 100,
                slugify: (input: string) =>
                    input.toLowerCase().trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]/g, '')
                        .slice(0, 100),
            },
            validation: Rule => Rule.required().error('Slug required hai'),
        }),

        defineField({
            name: 'excerpt',
            title: 'सारांश (Excerpt)',
            type: 'text',
            group: 'content',
            rows: 3,
            description: 'Homepage aur Google mein dikh ne wala short summary (120-160 chars ideal)',
            validation: Rule => Rule.required().max(200),
        }),

        defineField({
            name: 'featureImage',
            title: 'मुख्य चित्र (Feature Image)',
            type: 'image',
            validation: (Rule) =>
                Rule.custom((image, context) => {
                    if (!image) return 'Each article needs a featured image'
                    return true
                }).required(),
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Image Description (Alt text)',
                    type: 'string',
                    description: 'SEO ke liye important — image kya dikhata hai',
                }),
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'string',
                }),
            ],
        }),

        defineField({
            name: 'body',
            title: 'खबर का विवरण (Article Body)',
            type: 'array',
            group: 'content',
            validation: (Rule) =>
                Rule.custom((body, context) => {
                    if (!body || (Array.isArray(body) && body.length === 0)) {
                        return 'Article body cannot be empty'
                    }
                    return true
                }).required(),
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                            { title: 'Underline', value: 'underline' },
                        ],
                    },
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Image Description',
                        },
                    ],
                },
            ],
        }),

        // ── META GROUP ──────────────────────────────────────────────
        defineField({
            name: 'category',
            title: 'श्रेणी (Category)',
            type: 'reference',
            to: [{ type: 'category' }],
            group: 'meta',
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'author',
            title: 'लेखक (Author)',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'meta',
        }),

        defineField({
            name: 'district',
            title: 'जिला (District)',
            type: 'string',
            group: 'meta',
            options: {
                list: [
                    { title: 'गढ़वा', value: 'garhwa' },
                    { title: 'पलामू', value: 'palamu' },
                    { title: 'झारखंड (State)', value: 'jharkhand' },
                    { title: 'राष्ट्रीय', value: 'national' },
                ],
                layout: 'radio',
            },
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'featured',
            title: 'Homepage पर Feature करें?',
            type: 'boolean',
            group: 'meta',
            description: 'हाँ करने पर यह Homepage के Hero section में दिखेगा',
            initialValue: false,
        }),

        defineField({
            name: 'isBreaking',
            title: 'Breaking News?',
            type: 'boolean',
            group: 'meta',
            description: 'हाँ करने पर Breaking News ticker में दिखेगा',
            initialValue: false,
        }),

        defineField({
            name: 'publishedAt',
            title: 'प्रकाशन तिथि (Published At)',
            type: 'datetime',
            group: 'meta',
            initialValue: () => new Date().toISOString(),
            options: {
                dateFormat: 'DD-MM-YYYY',
                timeFormat: 'HH:mm',
            },
        }),

        // ── SEO GROUP ────────────────────────────────────────────────
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
            description: 'Google search result mein dikh ne wala title (60 chars max). Blank chhodo to article title use hoga.',
            validation: Rule => Rule.max(60),
        }),

        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            group: 'seo',
            rows: 2,
            description: 'Google search result mein dikh ne wala description (160 chars max)',
            validation: Rule => Rule.max(160),
        }),

        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'e.g. गढ़वा, सड़क दुर्घटना, पुलिस',
        }),

        // ── ADS GROUP ────────────────────────────────────────────────
        defineField({
            name: 'localAd',
            title: 'Local Banner Ad',
            type: 'object',
            group: 'ads',
            description: 'Admin dashboard se upload kiya gaya ad banner',
            fields: [
                defineField({
                    name: 'image',
                    title: 'Ad Banner Image',
                    type: 'image',
                    options: { hotspot: true }
                }),
                defineField({
                    name: 'url',
                    title: 'Ad Link (Target URL)',
                    type: 'url',
                    description: 'Ad par click karne par kahan jayega'
                }),
                defineField({
                    name: 'isActive',
                    title: 'Is Ad Active?',
                    type: 'boolean',
                    initialValue: true
                })
            ]
        }),

        // ── BULK UPLOAD METADATA ─────────────────────────────────────
        defineField({
            name: 'importMetadata',
            title: 'Import Metadata (Bulk Upload)',
            type: 'object',
            group: 'meta',
            description: 'Bulk upload se add hone par automatically fill hota hai',
            options: { collapsible: true, collapsed: true },
            fields: [
                defineField({
                    name: 'batchId',
                    title: 'Batch ID',
                    type: 'string',
                    description: 'Bulk upload batch identifier (rollback ke liye)'
                }),
                defineField({
                    name: 'importedAt',
                    title: 'Import Time',
                    type: 'datetime',
                }),
                defineField({
                    name: 'source',
                    title: 'Source',
                    type: 'string',
                    initialValue: 'manual',
                    description: 'bulk-upload | manual'
                }),
                defineField({
                    name: 'originalRow',
                    title: 'Original Excel Row #',
                    type: 'number',
                }),
                defineField({
                    name: 'autoCategory',
                    title: 'Category Auto-Detected?',
                    type: 'boolean',
                    description: 'True = AI ne category detect ki, False = admin ne manually set ki'
                }),
            ]
        }),
    ],

    // Preview in Studio
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'featureImage',
            district: 'district',
        },
        prepare({ title, subtitle, media, district }) {
            return {
                title,
                subtitle: `${subtitle} | District: ${district}`,
                media,
            }
        },
    },

    // Sort by newest first in Studio
    orderings: [
        {
            title: 'Newest First',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
