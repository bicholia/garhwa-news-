import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

async function checkPostgresDuplicates() {
    try {
        console.log('🔍 Checking Postgres for duplicates...');
        const { rows } = await sql`
            SELECT title, COUNT(*) as count 
            FROM news 
            GROUP BY title 
            HAVING COUNT(*) > 1
        `;
        
        if (rows.length === 0) {
            console.log('No duplicates found in Postgres.');
            return;
        }

        console.log(`Found ${rows.length} duplicate titles in Postgres:`);
        for (const row of rows) {
            console.log(`- "${row.title}" (${row.count} copies)`);
            
            // Fetch the IDs to delete (keep the newest)
            const { rows: instances } = await sql`
                SELECT id, published_at 
                FROM news 
                WHERE title = ${row.title} 
                ORDER BY published_at DESC
            `;
            
            const toKeep = instances[0].id;
            const toDelete = instances.slice(1).map(i => i.id);
            
            console.log(`  Keeping ID: ${toKeep}`);
            console.log(`  Deleting IDs: ${toDelete.join(', ')}`);
            
            for (const id of toDelete) {
                await sql`DELETE FROM news WHERE id = ${id}`;
                console.log(`  ✅ Deleted ID: ${id}`);
            }
        }
        console.log('✨ Postgres cleanup complete!');
    } catch (err) {
        console.error('Postgres Error:', err.message);
    }
}

checkPostgresDuplicates();
