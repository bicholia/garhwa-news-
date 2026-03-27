import { sql } from '@vercel/postgres';

/**
 * Utility to merge news from Postgres and Sanity, remove duplicates, and sort by date.
 */
export function mergeAndSortNews(pgNews, sanityNews, limit = 10) {
  const merged = [...pgNews];
  const seenSlugs = new Set(pgNews.map(n => n.slug));

  sanityNews.forEach(item => {
    const slug = typeof item.slug === 'string' ? item.slug : item.slug?.current;
    if (!seenSlugs.has(slug)) {
      merged.push({
        ...item,
        // Normalize fields for the UI
        id: item._id,
        published_at: item.publishedAt,
        image_url: item.featureImage?.asset ? null : null, // ArticleCard handles this
        slug: slug
      });
      seenSlugs.add(slug);
    }
  });

  return merged
    .sort((a, b) => {
      // 1. Sort by Priority (Mera Search) 
      const priorityA = a.priority || (a.is_promoted ? 100 : 0);
      const priorityB = b.priority || (b.is_promoted ? 100 : 0);
      if (priorityB !== priorityA) return priorityB - priorityA;
      
      // 2. Then by date
      return new Date(b.publishedAt || b.published_at) - new Date(a.publishedAt || a.published_at);
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
  'local': 'स्थानीय समाचार'
};

export async function getAllNews(limit = 20) {
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true 
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error('Database error in getAllNews, falling back to Sanity:', error);
    // Fallback to Sanity if Postgres fails
    try {
      const { client } = await import('./sanity');
      const sanityNews = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...${limit}]`);
      return sanityNews.map(item => ({
        ...item,
        id: item._id,
        published_at: item.publishedAt,
        image_url: item.featureImage?.asset ? null : null,
        slug: item.slug?.current || item.slug
      }));
    } catch (sanityError) {
      console.error('Sanity fallback failed too:', sanityError);
      return [];
    }
  }
}

/**
 * Fetch a single news item by its slug.
 * @param {string} slug - The news slug.
 * @returns {Promise<Object|null>}
 */
export async function getNewsBySlug(slug) {
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE slug = ${slug} AND is_published = true
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Database error in getNewsBySlug, falling back to Sanity:', error);
    try {
      const { client } = await import('./sanity');
      const item = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug });
      if (!item) return null;
      return {
        ...item,
        id: item._id,
        published_at: item.publishedAt,
        image_url: item.featureImage?.asset ? null : null,
        slug: item.slug?.current || item.slug
      };
    } catch (sanityError) {
      console.error('Sanity fallback failed:', sanityError);
      return null;
    }
  }
}

/**
 * Insert a new news item into the database.
 * @param {Object} newsItem - The news item object.
 * @returns {Promise<Object>}
 */
export async function insertNews(newsItem) {
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
    console.error('Insert error in insertNews:', error);
    throw error;
  }
}

/**
 * Automatically delete news items older than a certain number of days.
 * @param {number} days - Age in days.
 */
export async function cleanupOldNews(days = 30) {
  try {
    const { rowCount } = await sql`
      DELETE FROM news 
      WHERE published_at < NOW() - INTERVAL '1 day' * ${days}
    `;
    console.log(`Cleaned up ${rowCount} old news items.`);
    return { success: true, count: rowCount };
  } catch (error) {
    console.error('Cleanup error in cleanupOldNews:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if a news item already exists based on its slug.
 * @param {string} slug - The news slug.
 * @returns {Promise<boolean>}
 */
export async function isNewsExists(slug) {
  try {
    const { rows } = await sql`
      SELECT id FROM news WHERE slug = ${slug}
    `;
    return rows.length > 0;
  } catch (error) {
    console.error('Check error in isNewsExists:', error);
    return false;
  }
}

/**
 * Fetch news items by category.
 * @param {string} category - The category name.
 * @param {number} limit - Number of items to fetch.
 * @returns {Promise<Array>}
 */
export async function getNewsByCategory(category, limit = 10) {
  try {
    const { rows } = await sql`
      SELECT * FROM news 
      WHERE is_published = true AND category = ${category}
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error('Database error in getNewsByCategory, falling back to Sanity:', error);
    try {
       const { client } = await import('./sanity');
       const sanityNews = await client.fetch(`*[_type == "article" && category == $category] | order(publishedAt desc)[0...${limit}]`, { category });
       return sanityNews.map(item => ({
        ...item,
        id: item._id,
        published_at: item.publishedAt,
        image_url: item.featureImage?.asset ? null : null,
        slug: item.slug?.current || item.slug
      }));
    } catch (sanityError) {
       return [];
    }
  }
}

/**
 * Fetch news items by category with pagination support.
 * @param {string} categoryOrSlug - The category name in Hindi or the English slug.
 * @param {number} limit - Number of items to fetch.
 * @param {number} offset - Number of items to skip.
 * @returns {Promise<{articles: Array, total: number}>}
 */
export async function getNewsByCategoryPage(categoryOrSlug, limit = 12, offset = 0) {
  try {
    const categoryName = CATEGORY_MAP[categoryOrSlug] || categoryOrSlug;
    
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
    console.error('Database error in getNewsByCategoryPage:', error);
    return { articles: [], total: 0 };
  }
}
/**
 * Fetch related news items by category or district.
 * @param {string} category - The category to match.
 * @param {string} district - The district to match.
 * @param {string} excludeSlug - The slug to exclude.
 * @param {number} limit - Number of items to fetch.
 * @returns {Promise<Array>}
 */
export async function getRelatedNews(category, district, excludeSlug, limit = 3) {
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
    console.error('Database error in getRelatedNews:', error);
    return [];
  }
}
/**
 * Search news items by query string.
 * @param {string} query - The search query.
 * @param {number} limit - Number of items to fetch.
 * @returns {Promise<Array>}
 */
export async function searchNews(query, limit = 20) {
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
    console.error('Database error in searchNews:', error);
    return [];
  }
}

/**
 * Fetch news items by district with pagination support.
 * @param {string} district - The district name.
 * @param {number} limit - Number of items to fetch.
 * @param {number} offset - Number of items to skip.
 * @returns {Promise<{articles: Array, total: number}>}
 */
export async function getNewsByDistrict(district, limit = 12, offset = 0) {
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
    console.error('Database error in getNewsByDistrict, falling back to Sanity:', error);
    try {
      const { client } = await import('./sanity');
      const articles = await client.fetch(`*[_type == "article" && district == $district] | order(publishedAt desc)[$offset...$limit]`, { district, offset, limit: offset + limit });
      const total = await client.fetch(`count(*[_type == "article" && district == $district])`, { district });
      
      return {
        articles: articles.map(item => ({
          ...item,
          id: item._id,
          published_at: item.publishedAt,
          image_url: item.featureImage?.asset ? null : null,
          slug: item.slug?.current || item.slug
        })),
        total
      };
    } catch (sanityError) {
      return { articles: [], total: 0 };
    }
  }
}

/**
 * Initialize the database by creating the news table and indexes.
 * This should be run once during setup.
 */
export async function initializeDatabase() {
  try {
    // Add district column if it doesn't exist (Migration)
    try {
      await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false`;
      await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0`;
      await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'`;
      await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT ''`;
    } catch (e) {
      console.log('Migration columns might already exist');
    }

    // Create news table if it doesn't exist
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

    // Create indexes for faster querying
    await sql`CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_category ON news(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_news_district ON news(district)`;

    console.log('Database initialized successfully with news table and indexes');
    return { success: true, message: 'Database initialized' };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}
