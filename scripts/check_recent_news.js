const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function check() {
    console.log('Fetching last 5 articles from Sanity...');
    try {
        const query = `*[_type == "article"] | order(publishedAt desc)[0...5] { title, publishedAt, _id }`;
        const articles = await client.fetch(query);
        console.log('Recent Articles:');
        articles.forEach(a => {
            console.log(`- [${a.publishedAt}] ${a.title} (${a._id})`);
        });
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}

check();
