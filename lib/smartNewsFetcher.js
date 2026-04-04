import Parser from 'rss-parser';
import { REGION_WEIGHTS } from './newsApiConfig.js';

const parser = new Parser({
  customFields: { item: ['media:content', 'enclosure'] }
});

// Targeted Local RSS Feeds (Completely Free & No Keys)
// Targeted Local RSS Feeds (Completely Free & No Keys)
const LOCAL_RSS_SOURCES = [
  { name: 'Prabhat Khabar Garhwa', url: 'https://www.prabhatkhabar.com/rss/news/jharkhand/garhwa', district: 'garhwa' },
  { name: 'Prabhat Khabar Palamu', url: 'https://www.prabhatkhabar.com/rss/news/jharkhand/palamu', district: 'palamu' },
  { name: 'Live Hindustan Garhwa', url: 'https://www.livehindustan.com/jharkhand/garhwa/feed.rss', district: 'garhwa' },
  { name: 'Live Hindustan Jharkhand', url: 'https://www.livehindustan.com/rss/jharkhand', district: 'jharkhand' },
  { name: 'Dainik Bhaskar Garhwa', url: 'https://www.bhaskar.com/rss/jharkhand/garhwa/', district: 'garhwa' },
  { name: 'Dainik Bhaskar Palamu', url: 'https://www.bhaskar.com/rss/jharkhand/palamu/', district: 'palamu' },
  { name: 'ETV Bharat Jharkhand', url: 'https://www.etvbharat.com/rss/jharkhand', district: 'jharkhand' },
  { name: 'Jagran Jharkhand', url: 'https://www.jagran.com/rss/jharkhand_state-news-hindi.xml', district: 'jharkhand' },
  { name: 'Google News Local', url: 'https://news.google.com/rss/search?q=Garhwa+Palamu+Jharkhand+Crime+Political&hl=hi&gl=IN&ceid=IN:hi', district: 'jharkhand' },
  { name: 'Zee News Jharkhand', url: 'https://zeenews.india.com/hindi/india/bihar-jharkhand/rss', district: 'jharkhand' }
];

function extractRssImage(item) {
    if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

function calculateViralScore(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    let score = 50; // Base score
    
    // High Impact Keywords
    if (text.match(/हत्या|मर्डर|गोली|अपराध|गिरफ्तार|बड़ी खबर/)) score += 30; // Crime/Breaking
    if (text.match(/दुर्घटना|हादसा|मौत|मृत्यु|आग/)) score += 25; // Disaster/Accident
    if (text.match(/मुख्यमंत्री|विधायक|मंत्री|चुनाव|हेमंत/)) score += 20; // Politics
    if (text.match(/नौकरी|भर्ती|रिजल्ट/)) score += 15; // Jobs/Education
    
    // Freshness Bonus (if we had exact minutes, but for now we trust the RSS order)
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
        publishedAt: i.pubDate,
        viralScore: calculateViralScore(i.title, i.contentSnippet || i.content || '')
      }))];
    } catch (e) {
      console.error(`RSS Fetch Error (${source.name}):`, e.message);
    }
  }

  // 2. Deduplicate
  const unique = allArticles.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);

  // 3. ⏰ STRICT Freshness Filter: Only current news (last 48 hours)
  const NOW = Date.now();
  const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours
  const fresh = unique.filter(item => {
    if (!item.publishedAt) return false;
    const pubTime = new Date(item.publishedAt).getTime();
    if (isNaN(pubTime)) return false;
    const age = NOW - pubTime;
    return age >= 0 && age <= MAX_AGE_MS;
  });

  // 4. Verification Logic: Ignore items with "Archives" or "Flashback" in title
  const filtered = fresh.filter(item => {
    const text = item.title.toLowerCase();
    return !text.includes('flashback') && !text.includes('archives') && !text.includes('पुरानी यादें');
  });

  console.log(`📅 Intelligence Engine: ${unique.length} total → ${filtered.length} viral (last 48h)`);
  
  // 5. Final Sort: Viral Score DESC then Date DESC
  const final = filtered.sort((a, b) => {
    if (b.viralScore !== a.viralScore) return b.viralScore - a.viralScore;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  return final.slice(0, 60);
}
