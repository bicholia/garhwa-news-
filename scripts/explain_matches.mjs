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
        const query = `*[_type == "article"] { _id, title, excerpt, slug, body }`;
        const articles = await client.fetch(query);
        
        const keywords = ['tump', 'isis', 'xuser', 'ane |', '二从', 'vGul', '°', 'Tear', 'faer', 'aera'];
        
        for (const art of articles) {
            const title = typeof art.title === 'string' ? art.title : '';
            const excerpt = typeof art.excerpt === 'string' ? art.excerpt : '';
            const slug = typeof art.slug?.current === 'string' ? art.slug.current : '';
            const bodyText = blocksToText(art.body);
            
            const matched = [];
            keywords.forEach(k => {
                const lowerK = k.toLowerCase();
                if (title.toLowerCase().includes(lowerK)) matched.push(`title: "${k}"`);
                if (excerpt.toLowerCase().includes(lowerK)) matched.push(`excerpt: "${k}"`);
                if (slug.toLowerCase().includes(lowerK)) matched.push(`slug: "${k}"`);
                if (bodyText.toLowerCase().includes(lowerK)) matched.push(`body: "${k}"`);
            });
            
            if (matched.length > 0) {
                console.log(`Article: ${title.substring(0, 50)}...`);
                console.log(`ID: ${art._id}`);
                console.log(`Matches: ${matched.join(', ')}`);
                console.log('---');
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
