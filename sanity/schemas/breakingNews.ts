// sanity/schemas/breakingNews.ts
// Ye breaking news ticker ke liye hai — bina redeploy ke update hoga!

import { defineField, defineType, type StringRule } from 'sanity'

export const breakingNewsSchema = defineType({
    name: 'breakingNews',
    title: 'Breaking News Ticker',
    type: 'document',
    description: 'Ye items Breaking News ticker mein dikhenge. New item add karo → publish → 60 sec mein live!',

    fields: [
        defineField({
            name: 'text',
            title: 'Breaking News Text',
            type: 'string',
            validation: (rule: StringRule) => rule.required().max(200),
        }),
        defineField({
            name: 'href',
            title: 'Link (optional)',
            type: 'string',
            description: 'Click karne pe kahan jayega? e.g. /news/my-article-slug',
        }),
        defineField({
            name: 'active',
            title: 'Active (Show on site)?',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],

    preview: {
        select: { title: 'text', active: 'active' },
        prepare({ title, active }: { title: string, active: boolean }) {
            return {
                title,
                subtitle: active ? 'Active — Ticker mein dikh raha hai' : 'Hidden',
            }
        },
    },

    orderings: [
        {
            title: 'Newest First',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
