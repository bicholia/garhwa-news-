import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function checkCategories() {
  try {
    const categories = await client.fetch('*[_type == "category"]{_id, title, name}');
    console.log(JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkCategories();
