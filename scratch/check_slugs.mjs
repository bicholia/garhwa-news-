import { client } from '../lib/sanity.ts';

async function checkSlugs() {
    try {
        const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...10] {
            title,
            "slug": slug.current,
            _id
        }`);
        console.log('Last 10 articles slugs:');
        articles.forEach(a => {
            console.log(`- ${a.title}: ${a.slug} (${a._id})`);
        });
    } catch (e) {
        console.error(e);
    }
}

checkSlugs();
