import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

function blocksToText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    return blocks
        .map(block => {
            if (block._type !== 'block' || !block.children) return '';
            return block.children.map(child => child.text || '').join('');
        })
        .join('\n');
}

async function run() {
    try {
        console.log("🔍 Querying Sanity articles for keywords...");
        const query = `*[_type == "article"] { _id, title, excerpt, slug, publishedAt, body }`;
        const articles = await client.fetch(query);
        console.log(`Total articles: ${articles.length}`);
        
        const malformed = [];
        const keywords = ['tump', 'isis', 'xuser', 'ane |', '二从', 'vGul', '°', 'Tear', 'faer', 'aera'];
        
        for (const art of articles) {
            const title = typeof art.title === 'string' ? art.title : '';
            const excerpt = typeof art.excerpt === 'string' ? art.excerpt : '';
            const slug = typeof art.slug?.current === 'string' ? art.slug.current : '';
            const bodyText = blocksToText(art.body);
            
            const hasKeyword = keywords.some(k => 
                title.toLowerCase().includes(k.toLowerCase()) || 
                excerpt.toLowerCase().includes(k.toLowerCase()) || 
                slug.toLowerCase().includes(k.toLowerCase()) ||
                bodyText.toLowerCase().includes(k.toLowerCase())
            );
            
            // Also check for non-Hindi/non-English junk or strange characters
            const junkPattern = /[^\w\s\u0900-\u097F\.,।\-\?!\(\)@#%&:\/]/;
            const hasJunk = false; // junkPattern.test(title) || junkPattern.test(excerpt);
            
            if (hasKeyword || hasJunk) {
                malformed.push(art);
            }
        }
        
        console.log(`Found ${malformed.length} suspicious articles:`);
        malformed.forEach(art => {
            console.log(`ID: ${art._id}`);
            console.log(`Title: ${art.title}`);
            console.log(`Excerpt: ${art.excerpt}`);
            console.log(`Slug: ${art.slug?.current}`);
            console.log(`PublishedAt: ${art.publishedAt}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    }
}
run();
