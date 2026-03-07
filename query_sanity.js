const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function run() {
    const categories = await client.fetch(`*[_type == "category"]{_id, title, slug}`);
    console.log('Categories:', categories);

    const authors = await client.fetch(`*[_type == "author"]{_id, name}`);
    console.log('Authors:', authors);
}

run().catch(console.error);
