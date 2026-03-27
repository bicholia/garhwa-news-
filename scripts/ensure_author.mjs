
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function ensureAuthor() {
    console.log('Checking for author-admin...');
    try {
        const author = await client.createOrReplace({
            _id: 'author-admin',
            _type: 'author',
            name: 'NR Daily Editor',
            bio: 'Official editor for NR Daily News.'
        });
        console.log('✅ Author ensured:', author.name);
    } catch (err) {
        console.error('❌ Error ensuring author:', err.message);
    }
}

ensureAuthor();
