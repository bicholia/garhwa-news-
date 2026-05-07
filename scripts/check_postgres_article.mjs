
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.production.local') });

async function checkPostgres() {
    const slug = 'private-assistant-murder-garhwa-incident-tweets-and-iran-threat-vvosko';
    try {
        const { rows } = await sql`SELECT id, title FROM news WHERE slug = ${slug}`;
        console.log('Postgres Articles:', JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Postgres error:', err.message);
    }
}

checkPostgres();
