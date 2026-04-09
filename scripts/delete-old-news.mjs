import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
})

const deleteBeforeDate = '2026-04-04T00:00:00Z'

async function deleteOldNews() {
  try {
    console.log(`Starting bulk deletion of news items published before ${deleteBeforeDate}...`)

    // Verify count before deletion
    const query = `count(*[(_type == "article" || _type == "breakingNews") && publishedAt < $date])`
    const initialCount = await client.fetch(query, { date: deleteBeforeDate })
    console.log(`Documents found: ${initialCount}`)

    if (initialCount === 0) {
      console.log('No documents found to delete.')
      return
    }

    // Perform bulk deletion
    const result = await client.delete({
      query: `*[(_type == "article" || _type == "breakingNews") && publishedAt < $date]`,
      params: { date: deleteBeforeDate }
    })

    console.log(`Successfully deleted documents.`)
    
    // Final verification
    const finalCount = await client.fetch(query, { date: deleteBeforeDate })
    console.log(`Remaining documents before the date: ${finalCount}`)
  } catch (error) {
    console.error('Error during bulk deletion:', error)
  }
}

deleteOldNews()
