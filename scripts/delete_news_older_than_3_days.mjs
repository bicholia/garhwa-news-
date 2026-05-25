import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Calculate date 3 days ago
const date = new Date();
date.setDate(date.getDate() - 3);
const deleteBeforeDate = date.toISOString();

async function deleteOldNews() {
  try {
    console.log(`Starting bulk deletion of news items published before ${deleteBeforeDate} (3 days ago)...`);

    // Verify count before deletion
    const query = `count(*[(_type == "article" || _type == "breakingNews") && publishedAt < $date])`;
    const initialCount = await client.fetch(query, { date: deleteBeforeDate });
    console.log(`Documents found older than 3 days: ${initialCount}`);

    if (initialCount === 0) {
      console.log('No documents found to delete.');
      return;
    }

    // Sanity API allows deleting by query in a single transaction if we fetch IDs first,
    // or we can use the mutation API if the token has write access.
    // The previous script used client.delete({query}), let's fetch IDs and delete them to be safe if client.delete(query) is not supported in newer sdks,
    // wait, client.delete({query: ...}) is valid in @sanity/client.
    
    console.log('Fetching IDs to delete...');
    const idsToDelete = await client.fetch(`*[(_type == "article" || _type == "breakingNews") && publishedAt < $date]._id`, { date: deleteBeforeDate });
    
    if (idsToDelete.length > 0) {
        let transaction = client.transaction();
        idsToDelete.forEach(id => {
            transaction.delete(id);
        });
        
        await transaction.commit();
        console.log(`Successfully deleted ${idsToDelete.length} documents.`);
    }

    // Final verification
    const finalCount = await client.fetch(query, { date: deleteBeforeDate });
    console.log(`Remaining documents before the date: ${finalCount}`);
  } catch (error) {
    console.error('Error during bulk deletion:', error.message);
  }
}

deleteOldNews();
