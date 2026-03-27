import { NextResponse } from 'next/server';
import { 
  getAllNews, 
  getNewsBySlug, 
  getNewsByCategory, 
  getNewsByDistrict 
} from '@/lib/db';

/**
 * Public API to fetch news items.
 * Query Parameters:
 * - limit: number of items (default 20)
 * - category: filter by category
 * - slug: fetch a single item by slug
 * - district: filter by district
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const category = searchParams.get('category');
  const district = searchParams.get('district');
  const slug = searchParams.get('slug');
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  
  try {
    let data;
    let count = 0;
    
    if (slug) {
      // Fetch single news post
      data = await getNewsBySlug(slug);
      count = data ? 1 : 0;
      // Convert single object to array for consistency if needed, 
      // but usually slug requests return the object directly.
      // We'll return it as 'data' property.
    } else if (district) {
      // Fetch by district
      const result = await getNewsByDistrict(district, limit, offset);
      data = result.articles;
      count = result.total;
    } else if (category) {
      // Fetch by category
      data = await getNewsByCategory(category, limit);
      count = data.length;
    } else {
      // Fetch all news items
      data = await getAllNews(limit);
      count = data.length;
    }
    
    return NextResponse.json({
      success: true,
      data: data,
      count: count
    });
    
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// OPTIONS request for CORS handling
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
