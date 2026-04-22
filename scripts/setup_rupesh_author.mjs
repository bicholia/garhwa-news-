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

async function setupAuthor() {
    console.log('🚀 Setting up Rupesh Vishwakarma as Author...');

    const authorDoc = {
        _type: 'author',
        _id: 'author-rupesh',
        name: 'Rupesh Vishwakarma',
        slug: { _type: 'slug', current: 'rupesh-vishwakarma' },
        bio: 'Founder & Editor of ThinkIndia.press. AI Developer and Tech Evangelist from Palamu, Jharkhand. Creator of Maa Garhdevi AI.',
        image: {
            _type: 'image',
            _fixed_url: 'https://thinkindia.press/rupesh-avatar.png' // User can update real photo in Sanity later
        }
    };

    try {
        const result = await client.createOrReplace(authorDoc);
        console.log('✅ Author Profile Created/Updated! ID:', result._id);
    } catch (err) {
        console.error('❌ Error setting up author:', err.message);
    }
}

setupAuthor();
