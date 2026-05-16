import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function main() {
    const authors = [
        {
            _id: 'author-suhasini',
            _type: 'author',
            name: 'सुहासिनी शर्मा',
            slug: { _type: 'slug', current: 'suhasini-sharma' },
            bio: 'Editor-in-Chief at ThinkIndia.press'
        },
        {
            _id: 'author-admin',
            _type: 'author',
            name: 'ThinkIndia Bureau',
            slug: { _type: 'slug', current: 'thinkindia-bureau' },
            bio: 'Official News Bureau'
        }
    ];

    for (const author of authors) {
        console.log(`Ensuring author: ${author.name}...`);
        await client.createOrReplace(author);
    }
    console.log('Authors updated successfully.');
}

main().catch(console.error);
