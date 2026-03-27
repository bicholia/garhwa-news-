import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkPostgres() {
    console.log('🔍 Checking Postgres database for stray records...');
    try {
        const { rows } = await sql`SELECT slug, title, published_at FROM news ORDER BY published_at DESC LIMIT 10`;
        console.log('Latest 10 Postgres Records:');
        rows.forEach(r => console.log(`- ${r.title} | ${new Date(r.published_at).toLocaleString()}`));

        // Wipe all Postgres records since they are out of sync with Sanity
        console.log('\n🧹 Clearing Postgres news table to fix synchronization issue...');
        await sql`DELETE FROM news`;
        console.log('✅ Postgres news table cleared!');
    } catch (e) {
        console.error('Error with Postgres:', e);
    }
}
checkPostgres();
