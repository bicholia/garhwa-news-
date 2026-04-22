const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkDrafts() {
  try {
    const drafts = await client.fetch('*[_id in path("drafts.**")]{_id, title}');
    console.log(`Found ${drafts.length} drafts.`);
    console.log(JSON.stringify(drafts, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkDrafts();
