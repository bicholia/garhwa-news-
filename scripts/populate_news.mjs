
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seed() {
    console.log('🚀 Starting comprehensive seeding...');

    try {
        // 1. Create Categories
        const categories = [
            { name: 'अपराध', slug: 'crime' },
            { name: 'राजनीति', slug: 'politics' },
            { name: 'सरकारी नौकरी', slug: 'jobs' },
            { name: 'शिक्षा', slug: 'education' },
            { name: 'व्यापार', slug: 'business' },
            { name: 'खेल', slug: 'sports' },
            { name: 'मनोरंजन', slug: 'entertainment' },
            { name: 'स्वास्थ्य', slug: 'health' },
            { name: 'कृषि', slug: 'agriculture' },
        ];

        const categoryMap = {};
        for (const cat of categories) {
            const doc = {
                _type: 'category',
                _id: `category-${cat.slug}`, // Fixed ID for easy reference
                name: cat.name,
                slug: { _type: 'slug', current: cat.slug },
            };
            const result = await client.createOrReplace(doc);
            categoryMap[cat.slug] = result._id;
            console.log(`✅ Category created: ${cat.name}`);
        }

        // 2. Create Author
        const authorDoc = {
            _type: 'author',
            _id: 'author-admin',
            name: 'NR News Bureau',
            slug: { _type: 'slug', current: 'nr-news-bureau' },
            bio: 'गढ़वा और पलामू की ताज़ा खबरों के लिए समर्पित हमारी टीम।',
        };
        const author = await client.createOrReplace(authorDoc);
        console.log(`✅ Author created: ${author.name}`);

        // 3. Create Articles
        const articles = [
            {
                title: "गढ़वा में नई सड़क परियोजना को मिली मंजूरी, विकास को मिलेगी रफ्तार",
                excerpt: "गढ़वा जिले के लिए बड़ी खुशखबरी! केंद्र सरकार ने नई 4-लेन सड़क परियोजना को हरी झंडी दे दी है।",
                category: "politics",
                district: "garhwa",
                body: "गढ़वा जिले के निवासियों के लिए एक बड़ी राहत की खबर है। लंबे समय से लंबित गढ़वा-रंका रोड के चौड़ीकरण के प्रस्ताव को आखिरकार मंजूरी मिल गई है। इस परियोजना से न केवल यातायात सुगम होगा, बल्कि व्यापारिक गतिविधियों में भी इजाफा होगा। मुख्यमंत्री ने कहा कि यह सड़क जिले की लाइफलाइन साबित होगी।",
                featured: true
            },
            {
                title: "पलामू में हाथियों का आतंक, वन विभाग ने जारी किया अलर्ट",
                excerpt: "पलामू के चैनपुर प्रखंड में जंगली हाथियों के झुंड ने फसलों को भारी नुकसान पहुंचाया है।",
                category: "agriculture",
                district: "palamu",
                body: "पलामू जिले के चैनपुर प्रखंड में हाथियों का एक झुंड पिछले तीन दिनों से डेरा डाले हुए है। स्थानीय किसानों की कई एकड़ फसल को हाथियों ने रौंद दिया है। वन विभाग की टीम मौके पर पहुंचकर हाथियों को खदेड़ने की कोशिश कर रही है। ग्रामीणों को रात में सतर्क रहने की सलाह दी गई है।"
            },
            {
                title: "झारखंड पुलिस में 5000 पदों पर भर्ती प्रक्रिया शुरू, जानें कैसे करें आवेदन",
                excerpt: "झारखंड सरकार ने पुलिस विभाग में खाली पदों को भरने का निर्णय लिया है। इच्छुक उम्मीदवार जल्द आवेदन करें।",
                category: "jobs",
                district: "jharkhand",
                body: "राज्य के बेरोजगार युवाओं के लिए मुख्यमंत्री ने एक बड़ी सौगात दी है। पुलिस विभाग में विभिन्न श्रेणियों के 5000 पदों पर भर्ती के लिए अधिसूचना जारी कर दी गई है। आवेदन प्रक्रिया अगले महीने की 10 तारीख से शुरू होगी। योग्यता और आयु सीमा की जानकारी आधिकारिक वेबसाइट पर उपलब्ध है।"
            },
            {
                title: "गढ़वा पुलिस ने अंतरराज्यीय गिरोह का किया भंडाफोड़, 5 अपराधी गिरफ्तार",
                excerpt: "एक गुप्त सूचना के आधार पर गढ़वा पुलिस ने छापेमारी कर बड़ी सफलता हासिल की है।",
                category: "crime",
                district: "garhwa",
                body: "गढ़वा के एसपी ने प्रेस कॉन्फ्रेंस कर बताया कि पिछले कई महीनों से क्षेत्र में चोरी की वारदातों को अंजाम देने वाले गैंग को पकड़ने में पुलिस सफल रही है। इनके पास से भारी मात्रा में सोना और नगदी बरामद की गई है। गिरफ्तार अपराधियों से पूछताछ की जा रही है।"
            },
            {
                title: "झारखंड में मानसून की दस्तक, कई जिलों में भारी बारिश की चेतावनी",
                excerpt: "मौसम विभाग ने झारखंड के कई जिलों के लिए 'येलो अलर्ट' जारी किया है।",
                category: "health",
                district: "jharkhand",
                body: "झारखंड में मानसून ने प्रवेश कर लिया है। रांची सहित अन्य जिलों में आज सुबह से रुक-रुक कर बारिश हो रही है। मौसम विज्ञान केंद्र के अनुसार, अगले 48 घंटों में भारी बारिश की संभावना है। प्रशासन ने लोगों को वज्रपात से बचने की चेतावनी दी है।"
            },
            {
                title: "पलामू किला क्षेत्र में पर्यटन को बढ़ावा देगी राज्य सरकार",
                excerpt: "झारखंड पर्यटन विभाग ने पलामू किला क्षेत्र के सुंदरीकरण के लिए करोड़ो का बजट जारी किया है।",
                category: "politics",
                district: "palamu",
                body: "पलामू का ऐतिहासिक किला अब और भी आकर्षक दिखेगा। सरकार ने यहाँ लाइट एंड साउंड शो शुरू करने का फैसला किया है। इसके अलावा सड़कों और पर्यटक सुविधाओं का विस्तार किया जाएगा। इससे स्थानीय लोगों को रोजगार के अवसर मिलेंगे।"
            }
        ];

        for (const art of articles) {
            const slug = art.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
                .slice(0, 100);

            const doc = {
                _type: 'article',
                title: art.title,
                slug: { _type: 'slug', current: slug },
                excerpt: art.excerpt,
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        markDefs: [],
                        children: [{ _type: 'span', text: art.body, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryMap[art.category] },
                author: { _type: 'reference', _ref: author._id },
                district: art.district,
                featured: art.featured || false,
                publishedAt: new Date().toISOString(),
            };

            await client.create(doc);
            console.log(`✅ Article created: ${art.title}`);
        }

        // 4. Create Videos
        const videos = [
            { title: 'गढ़वा में नई सड़क का मुआयना करते अधिकारी', youtubeId: 'lqW2j2HhX9Y' },
            { title: 'पलामू में बारिश के बाद नदी का रौद्र रूप', youtubeId: '5qap5aO4i9A' },
            { title: 'झारखंड स्थापना दिवस समारोह: विशेष कवरेज', youtubeId: 'dQw4w9WgXcQ' },
        ];

        for (const vid of videos) {
            await client.create({
                _type: 'video',
                title: vid.title,
                youtubeId: vid.youtubeId,
                publishedAt: new Date().toISOString(),
            });
            console.log(`✅ Video created: ${vid.title}`);
        }

        console.log('✨ All seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
}

seed();
