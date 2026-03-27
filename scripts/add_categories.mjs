import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function run() {
    await client.createOrReplace({
        _type: 'category',
        _id: 'category-weather',
        name: 'मौसम',
        slug: { _type: 'slug', current: 'weather' }
    });
    console.log("Added category-weather");

    await client.createOrReplace({
        _type: 'category',
        _id: 'category-local',
        name: 'स्थानीय समाचार',
        slug: { _type: 'slug', current: 'local' }
    });
    console.log("Added category-local");
}
run();
