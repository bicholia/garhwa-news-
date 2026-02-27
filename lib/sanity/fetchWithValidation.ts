import { client } from '../sanity'
import { ArticleSchema, Article } from '../validation/article'

export async function fetchArticleSafe(slug: string): Promise<Article | null> {
    try {
        const query = `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      featureImage {
        asset->{
          url
        }
      },
      author->{
        name,
        image
      },
      category->{
        title
      },
      publishedAt,
      district,
      tags
    }`
        const data = await client.fetch(query, { slug })

        if (!data) return null;

        // Parse and validate
        const result = ArticleSchema.safeParse(data)
        if (result.success) {
            return result.data
        }

        console.warn('Article validation failed, using defaults where possible:', result.error)

        // Attempt fallback parsing (using partial data or defaults)
        try {
            // If critical things failed, it might throw, but default() in Zod will handle missing fields
            return ArticleSchema.parse(data || {})
        } catch {
            return null; // Return null if completely unrecoverable
        }

    } catch (error) {
        console.error(`Failed to safely fetch article (slug: ${slug}):`, error)
        return null
    }
}
