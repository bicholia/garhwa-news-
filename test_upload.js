require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
});

async function run() {
    try {
        console.log('Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
        console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
        console.log('Token starts with:', process.env.SANITY_TOKEN ? process.env.SANITY_TOKEN.substring(0, 5) : 'MISSING');

        // Let's create a test text buffer and upload it as an image asset
        const buffer = Buffer.from('<svg></svg>');

        console.log('Uploading test buffer...');
        const asset = await client.assets.upload('image', buffer, {
            filename: 'test.svg',
            contentType: 'image/svg+xml'
        });

        console.log('Upload success:', asset.url);
    } catch (err) {
        console.error('Upload Error:', err.message);
        if (err.response) {
            console.error('Response details:', JSON.stringify(err.response.body, null, 2));
        }
    }
}

run();
