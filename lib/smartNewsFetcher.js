import Parser from 'rss-parser';
import { REGION_WEIGHTS } from './newsApiConfig.js';

const parser = new Parser({
  customFields: { item: ['media:content', 'enclosure'] }
});

// Targeted Local RSS Feeds (Completely Free & No Keys)
const LOCAL_RSS_SOURCES = [
  { name: 'Prabhat Khabar Garhwa', url: 'https://www.prabhatkhabar.com/rss/news/jharkhand/garhwa', district: 'garhwa' },
  { name: 'Prabhat Khabar Palamu', url: 'https://www.prabhatkhabar.com/rss/news/jharkhand/palamu', district: 'palamu' },
  { name: 'Live Hindustan Garhwa', url: 'https://www.livehindustan.com/jharkhand/garhwa/feed.rss', district: 'garhwa' },
  { name: 'Live Hindustan Jharkhand', url: 'https://www.livehindustan.com/rss/jharkhand', district: 'jharkhand' },
  { name: 'Dainik Bhaskar Garhwa', url: 'https://www.bhaskar.com/rss/jharkhand/garhwa/', district: 'garhwa' },
  { name: 'ETV Bharat Jharkhand', url: 'https://www.etvbharat.com/rss/jharkhand', district: 'jharkhand' },
  { name: 'Jagran Jharkhand', url: 'https://www.jagran.com/rss/jharkhand_state-news-hindi.xml', district: 'jharkhand' },
  { name: 'Google News Local', url: 'https://news.google.com/rss/search?q=Garhwa+Palamu+Jharkhand&hl=hi&gl=IN&ceid=IN:hi', district: 'jharkhand' }
];

function extractRssImage(item) {
    if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

function calculatePriority(title, content, district) {
    const text = (title + ' ' + content).toLowerCase();
    let score = 0;
    
    // Primary District Bonus
    if (text.match(/गढ़वा|भवनाथपुर|मझिआंव|उंटारी|डंडा|खरौंधी|कांडी|रमना|विशुनपुरा/)) score += REGION_WEIGHTS.garhwa;
    if (text.match(/पलामू|मेदिनीनगर|डालटनगंज|चैनपुर|हरिहरगंज/)) score += REGION_WEIGHTS.palamu;
    if (text.match(/लातेहार|बरवाडीह|चंदवा/)) score += REGION_WEIGHTS.latehar;
    if (text.match(/झारखंड|रांची|जमशेदपुर|धनबाद/)) score += REGION_WEIGHTS.jharkhand;
    
    return score;
}

export async function fetchNewsSmart() {
  let allArticles = [];
  
  // 1. Fetch from Local RSS Sources
  for (const source of LOCAL_RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      allArticles = [...allArticles, ...feed.items.map(i => ({
        title: i.title,
        content: i.contentSnippet || i.content || '',
        url: i.link,
        image_url: extractRssImage(i),
        source: source.name,
        district: source.district,
        publishedAt: i.pubDate
      }))];
    } catch (e) {
      console.error(`RSS Fetch Error (${source.name}):`, e.message);
    }
  }

  // 2. Deduplicate
  const unique = allArticles.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);

  // 3. ⏰ Freshness Filter: Only accept news from the last 48 hours
  const NOW = Date.now();
  const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours
  const fresh = unique.filter(item => {
    if (!item.publishedAt) return true; // Allow undated items (assume they are recent)
    const age = NOW - new Date(item.publishedAt).getTime();
    return age <= MAX_AGE_MS;
  });

  // 4. Regional Priority Sorting (newest-first as tiebreaker)
  const sorted = fresh.sort((a, b) => {
    const scoreA = calculatePriority(a.title, a.content, a.district);
    const scoreB = calculatePriority(b.title, b.content, b.district);
    
    if (scoreB !== scoreA) return scoreB - scoreA;
    
    // Newest first
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  });

  console.log(`📅 Freshness Filter: ${unique.length} total → ${fresh.length} recent (last 48h)`);
  return sorted.slice(0, 60);
}
