import { defineField, defineType, type StringRule } from 'sanity'

export const videoSchema = defineType({
    name: 'video',
    title: 'Video News',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'वीडियो शीर्षक (Title)',
            type: 'string',
            validation: (rule: StringRule) => rule.required(),
        }),
        defineField({
            name: 'youtubeId',
            title: 'YouTube Video ID',
            type: 'string',
            description: 'जैसे: dQw4w9WgXcQ (URL के अंत वाला हिस्सा)',
            validation: (rule: StringRule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
})
