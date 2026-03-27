import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.production.local') });

async function checkNews() {
    console.log('Connecting to database...');
    try {
        const result = await sql`SELECT count(*) FROM news`;
        console.log('Total news in Postgres:', result.rows[0].count);
        
        const latest = await sql`SELECT title, published_at FROM news ORDER BY published_at DESC LIMIT 10`;
        console.log('Latest 10 news articles:');
        latest.rows.forEach(row => {
            console.log(`- ${row.title} (${row.published_at})`);
        });
    } catch (error) {
        console.error('Error checking news:', error.message);
    }
}

checkNews();
