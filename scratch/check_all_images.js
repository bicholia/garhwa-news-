const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function getAllMissingImages() {
  try {
    const articles = await client.fetch('*[_type == "article" && !defined(featureImage)]{ _id, title, category }');
    console.log(JSON.stringify(articles, null, 2));
    console.log(`Total missing: ${articles.length}`);
  } catch (err) {
    console.error(err);
  }
}

getAllMissingImages();
