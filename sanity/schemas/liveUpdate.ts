import { defineField, defineType, type StringRule } from 'sanity'

export const liveUpdateSchema = defineType({
    name: 'liveUpdate',
    title: 'Live Blog Updates',
    type: 'document',
    fields: [
        defineField({
            name: 'text',
            title: 'Update Text',
            type: 'string',
            validation: (rule: StringRule) => rule.required(),
        }),
        defineField({
            name: 'isNew',
            title: 'Is New/Important?',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Time',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
})
