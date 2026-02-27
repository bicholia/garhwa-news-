
import { defineField, defineType } from 'sanity'

export const videoSchema = defineType({
    name: 'video',
    title: 'Video News',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'वीडियो शीर्षक (Title)',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'youtubeId',
            title: 'YouTube Video ID',
            type: 'string',
            description: 'जैसे: dQw4w9WgXcQ (URL के अंत वाला हिस्सा)',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
})
