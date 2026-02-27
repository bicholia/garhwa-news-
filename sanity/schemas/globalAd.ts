import { defineField, defineType } from 'sanity'

export const globalAdSchema = defineType({
    name: 'globalAd',
    title: 'Global Ad Banners',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Campaign Title',
            type: 'string',
            validation: Rule => Rule.required(),
            description: 'Internal reference name for this banner'
        }),
        defineField({
            name: 'image',
            title: 'Banner Image',
            type: 'image',
            options: { hotspot: true },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'url',
            title: 'Target URL',
            type: 'url',
            description: 'Where should this click lead?'
        }),
        defineField({
            name: 'altText',
            title: 'Alt Text (SEO/Accessibility)',
            type: 'string',
            description: 'Provide a brief description of the banner.'
        }),
        defineField({
            name: 'slot',
            title: 'Ad Slot / Placement',
            type: 'string',
            options: {
                list: [
                    { title: 'Homepage Hero (Full Width)', value: 'homepage_hero' },
                    { title: 'Homepage Middle Banner', value: 'homepage_middle' },
                    { title: 'Article Top Leaderboard (728×90)', value: 'article_top_leaderboard' },
                    { title: 'Article Sidebar Rectangle (300×250)', value: 'article_sidebar_rectangle' },
                    { title: 'Article Below Content (300×250)', value: 'article_below_content' },
                    { title: 'Custom Size', value: 'custom' }
                ],
                layout: 'dropdown'
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'customWidth',
            title: 'Custom Width (px)',
            type: 'number',
            hidden: ({ document }) => document?.slot !== 'custom',
        }),
        defineField({
            name: 'customHeight',
            title: 'Custom Height (px)',
            type: 'number',
            hidden: ({ document }) => document?.slot !== 'custom',
        }),
        defineField({
            name: 'priority',
            title: 'Priority (Higher = First)',
            type: 'number',
            initialValue: 0,
            description: 'If multiple banners share the same slot and dates, the higher priority will render.'
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date (Optional)',
            type: 'datetime',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date (Optional)',
            type: 'datetime',
            description: 'When does this campaign automatically expire?'
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active?',
            type: 'boolean',
            initialValue: true,
            description: 'Toggle OFF to manually hide this banner without deleting it.'
        })
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'slot',
            media: 'image',
            isActive: 'isActive'
        },
        prepare(selection) {
            const { title, subtitle, media, isActive } = selection
            return {
                title: `${title} ${isActive ? '(Active)' : '(Inactive)'}`,
                subtitle: subtitle,
                media: media
            }
        }
    }
})
