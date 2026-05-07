
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.production.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function uploadFromUrl(url, title) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');
        const buffer = await response.buffer();
        const asset = await client.assets.upload('image', buffer, {
            filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error(`Failed to upload: ${error.message}`);
        return null;
    }
}

async function fixSpecificArticle() {
    const articleId = 'CC9aAsv5ADznwtCv7XShjW'; // Correct ID for the slug
    console.log(`🛠️ Fixing specific article: ${articleId}`);

    const newTitle = "सुवेंदु अधिकारी के करीबी की हत्या: पश्चिम बंगाल में तनाव, भाजपा का टीएमसी पर हमला";
    const newExcerpt = "पश्चिम बंगाल के उत्तर 24 परगना में भाजपा नेता सुवेंदु अधिकारी के करीबी सहयोगी की हत्या के बाद राजनीतिक सरगर्मी बढ़ गई है।";
    const newContent = "पश्चिम बंगाल के उत्तर 24 परगना जिले में भाजपा नेता सुवेंदु अधिकारी के एक करीबी सहयोगी, चंद्रनाथ रथ की संदिग्ध परिस्थितियों में हत्या कर दी गई है। इस घटना के बाद इलाके में भारी तनाव व्याप्त है। भाजपा ने इस हत्या का आरोप सत्तारूढ़ तृणमूल कांग्रेस (TMC) पर लगाया है, जबकि टीएमसी ने इन आरोपों को निराधार बताया है। पुलिस ने मामले की जांच शुरू कर दी है और स्थिति को नियंत्रण में रखने के लिए अतिरिक्त सुरक्षा बल तैनात किया गया है। सुवेंदु अधिकारी ने इस घटना की कड़ी निंदा करते हुए निष्पक्ष जांच की मांग की है।";

    const imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
    const assetId = await uploadFromUrl(imageUrl, "west-bengal-news");

    if (!assetId) {
        console.error("Failed to upload image.");
        return;
    }

    try {
        await client.patch(articleId)
            .set({
                title: newTitle,
                excerpt: newExcerpt,
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        markDefs: [],
                        children: [{ _type: 'span', text: newContent, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: 'category-national' },
                district: 'india',
                featureImage: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: assetId }
                }
            })
            .commit();
        console.log(`✅ Article fixed successfully!`);
    } catch (err) {
        console.error(`❌ Error updating article:`, err.message);
    }
}

fixSpecificArticle();
