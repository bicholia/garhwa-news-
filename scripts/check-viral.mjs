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

async function checkViral() {
  try {
    const articles = await client.fetch('*[_type == "article" && category._ref == "category-love-relationships"]{title}');
    console.log(`Found ${articles.length} viral articles.`);
    articles.forEach((a, i) => console.log(`${i+1}. ${a.title}`));
  } catch (err) {
    console.error(err);
  }
}

checkViral();
