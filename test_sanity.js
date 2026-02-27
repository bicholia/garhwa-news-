const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

async function test() {
    const articles = await client.fetch(`*[_type == "article"]{ title, "slug": slug.current, _id }[0...5]`)
    console.log("ARTICLES IN SANITY:")
    console.log(JSON.stringify(articles, null, 2))
}

test()
