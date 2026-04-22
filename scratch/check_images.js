const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkImages() {
  try {
    const articles = await client.fetch('*[_type == "article"] | order(publishedAt desc)[0...20] { _id, title, featureImage }');
    console.log(JSON.stringify(articles, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkImages();
