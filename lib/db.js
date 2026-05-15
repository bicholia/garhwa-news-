import { sql } from '@vercel/postgres';
import { normalizeText, scrubBrandNames, scrubSlug } from './safety.js';

// Utility to check if Postgres is available
const hasPostgres = () => !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);

// BUG-04 FIX: Dynamic Sanity Image URL Helper
const getSanityImageUrl = (assetRef) => {
    if (!assetRef) return null;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    
    // Format: image-7d7d...-1200x800-jpg -> https://cdn.sanity.io/images/proj/dataset/7d7d...-1200x800.jpg
    let ref = assetRef._ref || assetRef;
    
    // If it's the full asset object, it might have a 'url' already
    if (assetRef.url) return assetRef.url;
    
    // If it's still an object (e.g. the asset object itself without url), try to get the ID
    if (typeof ref !== 'string' && ref._id) ref = ref._id;
    
    if (typeof ref !== 'string' || !ref.startsWith('image-')) return null;
    
    const parts = ref.split('-');
    const id = parts[1];
    const dimensions = parts[2];
    const extension = parts[3];
    
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
};

/**
 * Utility to merge news from Postgres and Sanity, remove duplicates, and sort by date.
 */
export function mergeAndSortNews(pgNews, sanityNews, limit = 10) {
  const pgData = Array.isArray(pgNews) ? pgNews : (pgNews?.articles || []);
  const allRaw = [...pgData, ...sanityNews];
  
  const normalize = (t) => normalizeText(t);
  
  const merged = [];
  const seenTitles = new Set();
  const seenSlugs = new Set();

  allRaw.forEach(item => {
    const slug = typeof item.slug === 'string' ? item.slug : (item.slug?.current || item.slug);
    const title = normalize(item.title);
    
    if (!slug) return; // Skip invalid
    
    if (!seenSlugs.has(slug) && !seenTitles.has(title)) {
      merged.push({
        ...item,
        id: item._id || item.id,
        title: scrubBrandNames(item.title),
        excerpt: scrubBrandNames(item.excerpt),
        published_at: item.publishedAt || item.published_at,
        image_url: item.image_url || null,
        slug: scrubSlug(slug)
      });
      seenSlugs.add(slug);
      seenTitles.add(title);
    }
  });

  return merged
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.published_at).getTime();
      const dateB = new Date(b.publishedAt || b.published_at).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

// Mapping of category slugs to Hindi names
export const CATEGORY_MAP = {
  'crime': 'अपराध',
  'jobs': 'सरकारी नौकरियां',
  'education': 'शिक्षा',
  'sports': 'खेल',
  'weather': 'मौसम',
  'politics': 'राजनीति',
  'local': 'स्थानीय समाचार',
  'international': 'अंतर्राष्ट्रीय समाचार',
  'national': 'राष्ट्रीय समाचार',
  'life-update': 'जीवन मंत्र'
};

/**
 * Fallback helper for Sanity content
 */
async function getSanityFallback(query, params = {}, limit = 10) {
  try {
    const { client } = await import('./sanity');
    const results = await client.fetch(query, params);
    const data = Array.isArray(results) ? results : (results ? [results] : []);
    return data.map(item => ({
      ...item,
      id: item._id,
      title: scrubBrandNames(item.title),
      excerpt: scrubBrandNames(item.excerpt),
      published_at: item.publishedAt,
      // BUG-04 FIX: Use helper for robust URL building
      image_url: item.image_url || getSanityImageUrl(item.featureImage?.asset),
      slug: scrubSlug(item.slug?.current || item.slug)
    }));
  } catch (err) {
    console.error('[Sanity Fallback Error]', err);
    return [];
  }
}

export async function getAllNews(limit = 20) {
  if (!hasPostgres()) return getSanityFallback(`*[_type == "article"] | order(publishedAt desc)[0...${limit}]`, {}, limit);
  
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true 
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.warn('Postgres unavailable, using Sanity fallback.');
    return getSanityFallback(`*[_type == "article"] | order(publishedAt desc)[0...${limit}]`, {}, limit);
  }
}

export async function getNewsBySlug(slug) {
  if (!hasPostgres()) {
     const results = await getSanityFallback(`*[_type == "article" && slug.current == $slug][0]`, { slug }, 1);
     return results[0] || null;
  }

    try {
        const { rows } = await sql`
      SELECT * FROM news 
      WHERE slug = ${slug} AND is_published = true
    `;
        const article = rows[0] || null;
        if (article) {
            article.title = scrubBrandNames(article.title);
            article.excerpt = scrubBrandNames(article.excerpt);
            article.content = scrubBrandNames(article.content);
            article.slug = scrubSlug(article.slug);
        }
        return article;
    } catch (error) {
    const results = await getSanityFallback(`*[_type == "article" && slug.current == $slug][0]`, { slug }, 1);
    const article = results[0] || null;
    if (article) {
        article.title = scrubBrandNames(article.title);
        article.excerpt = scrubBrandNames(article.excerpt);
        article.content = scrubBrandNames(article.content);
        article.slug = scrubSlug(article.slug);
    }
    return article;
  }
}

export async function insertNews(newsItem) {
  if (!hasPostgres()) {
    console.error('insertNews skipped: No Postgres connection.');
    return { id: 'simulated-id' };
  }
  try {
    const { rows } = await sql`
      INSERT INTO news (
        title, slug, content, excerpt, image_url, 
        category, district, original_source, published_at, 
        is_published, is_promoted, priority, highlights, seo_keywords
      ) VALUES (
        ${newsItem.title}, 
        ${newsItem.slug}, 
        ${newsItem.content}, 
        ${newsItem.excerpt}, 
        ${newsItem.image_url}, 
        ${newsItem.category}, 
        ${newsItem.district}, 
        ${newsItem.original_source}, 
        ${newsItem.published_at},
        true,
        ${newsItem.is_promoted || false},
        ${newsItem.priority || 0},
        ${JSON.stringify(newsItem.highlights || [])},
        ${newsItem.seo_keywords || ""}
      )
      RETURNING id
    `;
    return rows[0];
  } catch (error) {
    console.error('Insert error:', error);
    throw error;
  }
}

export async function cleanupOldNews(days = 30) {
  if (!hasPostgres()) return { success: true, count: 0 };
  try {
    const { rowCount } = await sql`
      DELETE FROM news 
      WHERE published_at < NOW() - INTERVAL '1 day' * ${days}
    `;
    return { success: true, count: rowCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function isNewsExists(slug) {
  if (!hasPostgres()) return false;
  try {
    const { rows } = await sql`SELECT id FROM news WHERE slug = ${slug}`;
    return rows.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * NEW: Title-based deduplication to catch identical news with different slugs.
 */
export async function isTitleExists(title) {
  if (!hasPostgres()) return false;
  try {
    const norm = normalizeText(title);
    if (!norm) return false;
    
    // Check for existing title with normalized comparison
    const { rows } = await sql`
        SELECT id FROM news 
        WHERE LOWER(REPLACE(title, ' ', '')) = ${norm}
        OR title ILIKE ${title}
        LIMIT 1
    `;
    return rows.length > 0;
  } catch (error) {
    console.error('isTitleExists error:', error);
    return false;
  }
}

export async function getNewsByCategory(category, limit = 10) {
  if (!hasPostgres()) return getSanityFallback(`*[_type == "article" && category == $category] | order(publishedAt desc)[0...${limit}]`, { category }, limit);
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true AND category = ${category}
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    return getSanityFallback(`*[_type == "article" && category == $category] | order(publishedAt desc)[0...${limit}]`, { category }, limit);
  }
}

export async function getNewsByCategoryPage(categoryOrSlug, limit = 12, offset = 0) {
  const categoryName = CATEGORY_MAP[categoryOrSlug] || categoryOrSlug;
  if (!hasPostgres()) {
      // BUG-13 FIX: Sanity range logic [start...end] where end is index, not count
      const articles = await getSanityFallback(`*[_type == "article" && category == $categoryName] | order(publishedAt desc)[$offset...$limit]`, { categoryName, offset, limit: offset + limit }, limit);
      return { articles, total: articles.length }; // Approximation
  }
  try {
    const articlesQuery = sql`
      SELECT * FROM news 
      WHERE is_published = true AND category = ${categoryName}
      ORDER BY published_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    const countQuery = sql`
      SELECT COUNT(*) as total FROM news 
      WHERE is_published = true AND category = ${categoryName}
    `;
    const [articlesResult, countResult] = await Promise.all([articlesQuery, countQuery]);
    return {
      articles: articlesResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  } catch (error) {
    return { articles: [], total: 0 };
  }
}

export async function getRelatedNews(category, district, excludeSlug, limit = 3) {
  if (!hasPostgres()) return [];
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true AND slug != ${excludeSlug}
      AND (category = ${category} OR district = ${district})
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    return [];
  }
}

export async function searchNews(query, limit = 20) {
  if (!hasPostgres()) return [];
  try {
    const searchTerm = `%${query}%`;
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true AND (title ILIKE ${searchTerm} OR content ILIKE ${searchTerm})
      ORDER BY priority DESC, is_promoted DESC, published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    return [];
  }
}

export async function getNewsByDistrict(district, limit = 12, offset = 0) {
  if (!hasPostgres()) {
       const { client } = await import('./sanity');
       // BUG-13 FIX: Correct range logic for Sanity $offset...$limit
       const articles = await client.fetch(`*[_type == "article" && district == $district] | order(publishedAt desc)[$offset...$limit]`, { district, offset, limit: offset + limit });
       const total = await client.fetch(`count(*[_type == "article" && district == $district])`, { district });
       return {
         articles: articles.map(item => ({
           ...item,
           id: item._id,
           published_at: item.publishedAt,
           // BUG-04 FIX: Use helper
           image_url: item.image_url || getSanityImageUrl(item.featureImage?.asset),
           slug: item.slug?.current || item.slug
         })),
         total
       };
  }
  try {
    const articlesQuery = sql`
      SELECT * FROM news 
      WHERE is_published = true AND district = ${district}
      ORDER BY published_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    const countQuery = sql`
      SELECT COUNT(*) as total FROM news 
      WHERE is_published = true AND district = ${district}
    `;
    const [articlesResult, countResult] = await Promise.all([articlesQuery, countQuery]);
    return {
      articles: articlesResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  } catch (error) {
     return { articles: [], total: 0 };
  }
}

export async function initializeDatabase() {
  if (!hasPostgres()) return { success: true, message: 'Database initialization skipped: No connection string.' };
  try {
    // 1. Create Table First
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image_url TEXT,
        category VARCHAR(100) DEFAULT 'स्थानीय समाचार',
        district VARCHAR(100) DEFAULT 'jharkhand',
        original_source TEXT,
        views INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        is_promoted BOOLEAN DEFAULT false,
        priority INTEGER DEFAULT 0,
        highlights JSONB DEFAULT '[]',
        seo_keywords TEXT DEFAULT '',
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Add/Verify Columns (Incremental IDs)
    await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0`;
    await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT ''`;
    
    // 3. Create Indices
    await sql`CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_category ON news(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_district ON news(district)`;

    return { success: true, message: 'Database initialized & hardened' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
