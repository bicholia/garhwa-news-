const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function resetDatabase() {
  try {
    console.log('Fetching all articles...');
    const articles = await client.fetch('*[_type == "article"]{_id}');
    console.log(`Found ${articles.length} articles to delete.`);

    if (articles.length === 0) {
      console.log('No articles found. Database is already clean.');
      return;
    }

    let batch = client.transaction();
    let count = 0;

    for (const article of articles) {
      batch.delete(article._id);
      count++;

      // Sanity transactions have a size limit, so we commit in batches of 50
      if (count % 50 === 0) {
        console.log(`Committing batch of 50 deletions...`);
        await batch.commit();
        batch = client.transaction();
      }
    }

    // Commit any remaining
    if (count % 50 !== 0) {
      console.log(`Committing final batch...`);
      await batch.commit();
    }

    console.log('✅ Global Reset Complete: All articles have been deleted.');
  } catch (err) {
    console.error('❌ Error during reset:', err);
  }
}

resetDatabase();
