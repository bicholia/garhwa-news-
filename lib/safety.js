/**
 * IDENTITY GUARD: Think India Brand Scrubber
 * This utility ensures that competitor brand names and specific phrases 
 * are removed or replaced to maintain the platform's independent identity.
 */

export function scrubBrandNames(text) {
    if (!text || typeof text !== 'string') return text;

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

    let scrubbed = text;
    agencies.forEach(regex => {
        // If it's a suffix like " - prabhatkhabar", remove it entirely
        scrubbed = scrubbed.replace(new RegExp(`\\s*[-|:]\\s*${regex.source}`, 'gi'), '');
        // Otherwise, replace with our bureau name
        scrubbed = scrubbed.replace(regex, 'ThinkIndia.press');
    });

    // Cleanup lingering suffixes that might have been left behind by partial matches
    scrubbed = scrubbed.replace(/ThinkIndia\.press\.com/gi, 'ThinkIndia.press');
    scrubbed = scrubbed.replace(/ThinkIndia\.press\.in/gi, 'ThinkIndia.press');
    scrubbed = scrubbed.replace(/Think India\.com/gi, 'ThinkIndia.press');
    scrubbed = scrubbed.replace(/ThinkIndia\.com/gi, 'ThinkIndia.press');
    scrubbed = scrubbed.replace(/Think India\.in/gi, 'ThinkIndia.press');
    scrubbed = scrubbed.replace(/ThinkIndia\.in/gi, 'ThinkIndia.press');

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
1. ❌ NEVER mention any other news agency (Prabhat Khabar, Jagran, Hindustan, Bhaskar, Aaj Tak, etc.).
2. ❌ If source text has a brand name, replace it with "ThinkIndia.press" or "हमारे विश्वसनीय सूत्रों" (Our reliable sources).
3. ❌ NO source links, NO "Courtesy:", NO "Credit:".

ADSENSE COMPLIANCE & HUMAN-LIKE WRITING:
1. ✍️ AVOID AI-PATTERNS: Do not use repetitive bullet points for everything. Use flowing paragraphs.
2. ✍️ LOCAL CONTEXT: If the news is about Jharkhand/Garhwa, add local significance. If it's national, explain how it impacts common people.
3. ✍️ ORIGINAL ANALYSIS: Don't just summarize. Add a "ThinkIndia Perspective" or analysis of "Why this matters".
4. ✍️ NATURAL FLOW: Start with a strong hook. Use transitions like "वहीं दूसरी ओर," "हैरानी की बात यह है कि," "स्थानीय लोगों का कहना है."
5. ✍️ NO HALLUCINATIONS: Stay 100% true to facts provided, but rewrite them in your own professional voice.

WRITING STRUCTURE:
- Headline: Professional, non-clickbait but engaging.
- Lead: 2-3 sentences explaining the core event.
- Body: Detailed analysis and facts in structured paragraphs.
- Conclusion: Summary of current status or next steps.

Language: Professional Hindi (शुद्ध और सरल हिंदी).
Format: CLEAN JSON object only.
`;
