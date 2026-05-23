import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

async function run() {
    try {
        if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
            console.log("No Postgres environment variables found.");
            return;
        }
        console.log("Querying Postgres for suspicious keywords...");
        const { rows } = await sql`
            SELECT id, title, slug, excerpt, category, district, published_at FROM news
            WHERE title ILIKE '%tump%' OR title ILIKE '%isis%' OR title ILIKE '%xuser%'
            OR excerpt ILIKE '%tump%' OR excerpt ILIKE '%isis%' OR excerpt ILIKE '%xuser%'
            OR content ILIKE '%tump%' OR content ILIKE '%isis%' OR content ILIKE '%xuser%'
        `;
        console.log(`Found ${rows.length} malformed articles in Postgres:`);
        rows.forEach(r => {
            console.log(`ID: ${r.id}`);
            console.log(`Title: ${r.title}`);
            console.log(`Slug: ${r.slug}`);
            console.log(`PublishedAt: ${r.published_at}`);
            console.log('---');
        });
    } catch (e) {
        console.error("Postgres Query Error:", e.message);
    }
}
run();
