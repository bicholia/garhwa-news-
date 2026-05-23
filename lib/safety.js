/**
 * IDENTITY GUARD: Think India Brand Scrubber
 * This utility ensures that competitor brand names and specific phrases 
 * are removed or replaced to maintain the platform's independent identity.
 */

export function scrubBrandNames(text) {
    if (!text || typeof text !== 'string') return text;

    let scrubbed = text;

    // Strip trailing English metadata or SEO tags (e.g. "| world news", "- daily news")
    scrubbed = scrubbed.replace(/\s*[\|-]\s*[a-zA-Z\s\d\.\:\/]+$/i, '');

    // Clean specific junk patterns/placeholders
    const junkPatterns = [
        /vgul\s*ot\s*ma/gi,
        /ane\s*\|/gi,
        /二从/g,
        /@xuser(>)?/gi,
        /xuser>/gi
    ];
    junkPatterns.forEach(pattern => {
        scrubbed = scrubbed.replace(pattern, '');
    });

    const agencies = [
        /www\.prabhatkhabar\.com/gi, /prabhatkhabar\.com/gi, /prabhatkhabar/gi, /Prabhat Khabar/gi, /प्रभात खबर/g, /प्रभातखबर/g,
        /www\.jagran\.com/gi, /jagran\.com/gi, /Dainik Jagran/gi, /Jagran/gi, /दैनिक जागरण/g, /जागरण/g,
        /www\.livehindustan\.com/gi, /livehindustan\.com/gi, /www\.hindustantimes\.com/gi, /hindustantimes\.com/gi, /Live Hindustan/gi, /Hindustan/gi, /हिंदुस्तान/g, /हिन्दुस्तान/g,
        /www\.bhaskar\.com/gi, /bhaskar\.com/gi, /Dainik Bhaskar/gi, /Bhaskar/gi, /दैनिक भास्कर/g, /भास्कर/g,
        /www\.aajtak\.in/gi, /aajtak\.in/gi, /Aaj Tak/gi, /आज तक/g, /zeenews\.india\.com/gi, /Zee News/gi, /news18\.com/gi, /News18/gi, /etvbharat\.com/gi, /ETV/gi,
        /amarujala\.com/gi, /Amar Ujala/gi, /अमर उजाला/g, /ndtv\.com/gi, /NDTV/gi, /abpnews\.abplive\.com/gi, /abplive\.com/gi, /ABP News/gi,
        /lagatar\.in/gi, /lagatar/gi, /लगातार/g, /news11bharat\.com/gi, /news11/gi, /News11 Bharat/gi, /नवलखा/g,
        /khabarmantra\.in/gi, /khabar mantra/gi, /खबर मंत्र/g, /etvbharat\.com/gi, /ETV/gi, /ईटीवी/g,
        /newswing\.com/gi, /news wing/gi, /न्यूज़ विंग/g, /kohramlive\.com/gi, /kohram/gi, /कोहराम/g,
        /sharpbharat\.com/gi, /sharp bharat/gi, /शार्प भारत/g, /localkhabar\.com/gi, /local khabar/gi, /लोकल खबर/g,
        /saharasamay\.com/gi, /Sahara Samay/gi, /सहारा समय/g, /Hindi News/gi, /Hindi/gi, /News in Hindi/gi, /Breaking News/gi, /Top Story/gi, /Reported by/gi, /Courtesy/gi,
        /Zee News/gi, /Zee/gi, /News18/gi, /News 18/gi, /ETV Bharat/gi, /ETV/gi, /Bharat/gi, /Hindustan/gi, /Hind/gi, /Prabhat/gi, /Prabha/gi, /Pra/gi, /Jagran/gi, /Jagr/gi, /Bhaskar/gi, /Bhas/gi
    ];

    agencies.forEach(regex => {
        // Step 1: Remove common brand suffixes (e.g. " - Prabhat Khabar", "| Jagran")
        scrubbed = scrubbed.replace(new RegExp(`\\s*[\\-\\|\\:]\\s*${regex.source}`, 'gi'), '');
        
        // Step 2: Only replace internal mentions if they look like a full agency name
        // (Prevents replacing "Bharat" or "News" when used generally)
        if (regex.source.length > 5) {
            scrubbed = scrubbed.replace(regex, 'ThinkIndia.press');
        }
    });

    // Cleanup: If the entire string is just "ThinkIndia.press", it was probably just a brand name.
    if (scrubbed.trim() === 'ThinkIndia.press') return 'Top Story';

    // Remove common source phrases and localize attribution
    scrubbed = scrubbed.replace(/सूत्रों के अनुसार/g, 'हमारे सूत्रों के अनुसार');
    scrubbed = scrubbed.replace(/खबरों के मुताबिक/g, 'ThinkIndia.press की रिपोर्ट के मुताबिक');
    
    // Additional generic cleanup
    scrubbed = scrubbed.replace(/Courtesy:/gi, 'Reported by:');
    scrubbed = scrubbed.replace(/Source:/gi, 'Bureau:');

    return scrubbed;
}

/**
 * SUPER NORMALIZER: Consistent deduplication across the platform.
 * Removes punctuation, whitespace, and known brand suffixes for comparison.
 */
export function normalizeText(t) {
    if (!t || typeof t !== 'string') return '';
    let norm = t.trim().toLowerCase();
    // Remove punctuation, special characters, keeping Hindi Unicode
    norm = norm.replace(/[^\w\s\u0900-\u097F]/gi, ''); 
    // Remove all whitespace
    norm = norm.replace(/\s+/g, '');
    // Remove known competitor brand names and variations
    const brandSuffixes = /(prabhat khabar|prabhatkhabar|dainik jagran|jagran|live hindustan|hindustan|dainik bhaskar|bhaskar|aaj tak|zee news|news18|etv|amar ujala|ndtv|abp news|प्रभात खबर|प्रभातखबर|दैनिक जागरण|जागरण|हिंदुस्तान|हिन्दुस्तान|दैनिक भास्कर|भास्कर|आज तक|अमर उजाला|prabhatkhabarcom|jagrancom|livehindustancom|hindustantimescom|bhaskarcom|aajtak|aajtakin)/gi;
    norm = norm.replace(brandSuffixes, '');
    return norm;
}

/**
 * SLUG SCRUBBER: Removes competitor names from URLs.
 */
export function scrubSlug(slug) {
    if (!slug || typeof slug !== 'string') return slug;
    const brands = [
        'prabhat-khabar', 'prabhatkhabar', 'dainik-jagran', 'jagran', 'live-hindustan', 'hindustantimes', 'hindustan',
        'dainik-bhaskar', 'bhaskar', 'aaj-tak', 'aajtakin', 'aajtak', 'zee-news', 'news18', 'etv', 'amar-ujala', 'ndtv', 'abp-news',
        'lagatar', 'news11', 'news11bharat', 'khabarmantra', 'newswing', 'kohram', 'sharpbharat', 'localkhabar', 'saharasamay'
    ];
    let scrubbed = slug;
    brands.forEach(brand => {
        // Use regex that ensures we target the brand as a full segment in the slug
        // Matches at start (+dash), end (dash+), or between dashes
        const regex = new RegExp(`(^|-)(${brand})(-|$)`, 'gi');
        scrubbed = scrubbed.replace(regex, '$1$3');
    });
    // Clean up trailing/leading dashes and double dashes
    return scrubbed.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * PORTABLE TEXT SCRUBBER: Recursively scrubs brand names from Sanity blocks.
 */
export function scrubPortableText(blocks) {
    if (!Array.isArray(blocks)) return blocks;
    return blocks.map(block => {
        if (block._type !== 'block' || !block.children) return block;
        return {
            ...block,
            children: block.children.map(child => ({
                ...child,
                text: child.text ? scrubBrandNames(child.text) : child.text
            }))
        };
    });
}

/**
 * STRICT SYSTEM PROMPT: Centralized instructions for all Neural AI Nodes.
 * This ensures absolute brand neutrality, white-labeling, and AdSense compliance.
 * We focus on "EEAT" (Experience, Expertise, Authoritativeness, and Trustworthiness).
 */
export const STRICT_SYSTEM_PROMPT = `
[STRICT IDENTITY: THINKINDIA.PRESS]
You are a senior Investigative Journalist for "ThinkIndia.press" (Garhwa, Jharkhand). 
Your goal is to provide high-value, original reporting that passes strict Google AdSense quality checks.

CRITICAL IDENTITY RULES:
1. ❌ NEVER mention any other news agency.
2. ❌ If source text has a brand name, replace it with "ThinkIndia.press" or "हमारे सूत्रों".
3. ❌ NO source links, NO "Courtesy:", NO "Credit:".
4. ❌ HEADLINE MUST BE ORIGINAL: Never return only "ThinkIndia.press" as a headline. Always write a descriptive, news-worthy headline in Hindi.

ADSENSE COMPLIANCE & HUMAN-LIKE WRITING:
1. ✍️ AVOID AI-PATTERNS: Use flowing paragraphs.
2. ✍️ LOCAL CONTEXT: Focus on Jharkhand/Garhwa significance.
3. ✍️ NATURAL FLOW: Use transitions and active voice.

Language: Professional Hindi (शुद्ध और सरल हिंदी).
Format: CLEAN JSON object only.
{
  "title": "Clear News Headline",
  "excerpt": "Brief summary",
  "content": "Detailed report..."
}
`;
