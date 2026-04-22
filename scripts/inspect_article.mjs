import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function run() {
    try {
        const docWithImage = await client.fetch('*[_type == "article" && (defined(featureImage) || defined(image_url))][0]');
        if (docWithImage) {
            console.log("Article with image found:");
            console.log(JSON.stringify(docWithImage, null, 2));
        } else {
            console.log("No articles with images found in Sanity.");
        }
    } catch (e) {
        console.error(e);
    }
}
run();
