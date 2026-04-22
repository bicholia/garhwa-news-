const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function removeVideoNews() {
  try {
    const articles = await client.fetch('*[_type == "article" && (title match "video" || title match "वीडियो" || title match "यूट्यूब" || title match "youtube")]{_id, title}');
    console.log(`Found ${articles.length} articles that might be video related.`);
    for (const article of articles) {
      console.log(`Deleting: ${article.title}`);
      await client.delete(article._id);
    }
    console.log('Cleanup complete.');
  } catch (err) {
    console.error(err);
  }
}

removeVideoNews();
