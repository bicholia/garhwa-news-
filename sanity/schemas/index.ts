// sanity/schemas/index.ts — Root schema file
import { articleSchema } from './article'
import { breakingNewsSchema } from './breakingNews'
import { authorSchema } from './author'
import { categorySchema } from './category'
import { videoSchema } from './video'
import { liveUpdateSchema } from './liveUpdate'
import { globalAdSchema } from './globalAd'

export const schemaTypes = [articleSchema, breakingNewsSchema, authorSchema, categorySchema, videoSchema, liveUpdateSchema, globalAdSchema]
