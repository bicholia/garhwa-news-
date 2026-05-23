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

async function run() {
    try {
        const query1 = `*[_type == "article" && category->name == "राशिफल"] | order(publishedAt desc)[0...3] { title, "category": category->name }`;
        const query2 = `*[_type == "article" && category->slug.current == "astrology"] | order(publishedAt desc)[0...3] { title, "category": category->name }`;
        const query3 = `*[_type == "article" && category->slug.current == "love-relationships"] | order(publishedAt desc)[0...3] { title, "category": category->name }`;
        
        const res1 = await client.fetch(query1);
        const res2 = await client.fetch(query2);
        const res3 = await client.fetch(query3);
        
        console.log("Query by category->name == 'राशिफल':", res1);
        console.log("Query by category->slug.current == 'astrology':", res2);
        console.log("Query by category->slug.current == 'love-relationships':", res3);
    } catch (e) {
        console.error(e);
    }
}
run();
