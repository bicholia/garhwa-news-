
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

async function updateNewsForToday() {
    console.log('🚀 Updating News for Garhwa, Palamu, and Jharkhand (March 8, 2026)...');

    try {
        const authorId = 'author-admin';
        const categoryMap = {
            'top-story': 'category-top-story',
            'crime': 'category-crime',
            'administration': 'category-administration',
            'city-facilities': 'category-city-facilities',
            'disaster-accident': 'category-disaster-accident',
            'health-education': 'category-health-education',
            'public-issues': 'category-public-issues',
            'rural-development': 'category-rural-development',
            'social-events': 'category-social-events',
            'politics': 'category-politics',
            'sports': 'category-sports',
            'entertainment': 'category-entertainment',
            'business': 'category-business',
            'finance': 'category-finance',
            'technology': 'category-technology',
            'jobs': 'category-jobs',
            'lifestyle': 'category-lifestyle',
            'love-relationships': 'category-love-relationships',
            'astrology': 'category-astrology',
            'religion': 'category-religion',
            'national': 'category-national',
            'international': 'category-international',
            'auto': 'category-auto',
            'agriculture': 'category-agriculture',
        };

        const newsData = [
            // Garhwa
            { title: "गढ़वा में अंतरराष्ट्रीय महिला दिवस पर विशेष कार्यक्रम आयोजित", district: "garhwa", category: "social-events", excerpt: "रामासाहू आउटडोर स्टेडियम में स्वास्थ्य, फिटनेस और सशक्तिकरण को बढ़ावा देने के लिए एक दिवसीय कार्यक्रम।" },
            { title: "नीलकंठ महादेव मंदिर में विराट श्री रुद्र महायज्ञ का शुभारंभ", district: "garhwa", category: "religion", excerpt: "बंडा पहाड़ स्थित मंदिर में आज जलयात्रा के साथ 16 मार्च तक चलने वाले महायज्ञ की शुरुआत हुई।" },
            { title: "मुखिया शरीफ अंसारी पर हमले के मामले में तीन आरोपी गिरफ्तार", district: "garhwa", category: "crime", excerpt: "कोरवाडीह पंचायत के मुखिया पर जानलेवा हमले के मामले में पुलिस ने की बड़ी कार्रवाई।" },
            { title: "मंडल डैम परियोजना स्थल पर प्रशासन और ग्रामीणों के बीच नोकझोंक", district: "garhwa", category: "administration", excerpt: "निरीक्षण के दौरान विस्थापितों के विरोध के बाद पुलिस को करना पड़ा हल्का बल प्रयोग।" },
            { title: "मेराल थाना क्षेत्र में अवैध बालू तस्करी का धंधा धड़ल्ले से जारी", district: "garhwa", category: "crime", excerpt: "कनहर नदी घाट से बालू की तस्करी जारी, राजस्व को हो रहा है भारी नुकसान।" },
            { title: "स्कूल में डीजे पर अश्लील गानों पर नृत्य, प्रभारी हेडमास्टर निलंबित", district: "garhwa", category: "health-education", excerpt: "मेराल के सोहबरिया स्कूल में विदाई समारोह के दौरान मर्यादा लांघने पर विभाग की कार्रवाई।" },
            { title: "लापरवाही के कारण 25 छात्र परीक्षा से वंचित, स्कूल प्रबंधन को नोटिस", district: "garhwa", category: "health-education", excerpt: "उत्क्रमित उच्च विद्यालय बाना के हेडमास्टर और क्लर्क से मांगा गया स्पष्टीकरण।" },
            { title: "गढ़वा में मनरेगा कर्मियों की हड़ताल 9 मार्च से, मांगों पर अड़े", district: "garhwa", category: "rural-development", excerpt: "बकाया मानदेय और नियमितीकरण को लेकर तीन दिवसीय सांकेतिक हड़ताल की घोषणा।" },

            // Palamu
            { title: "पलामू में बिजली कटौती: लेस्लीगंज और पांकी में 5 घंटे आपूर्ति ठप", district: "palamu", category: "city-facilities", excerpt: "रविवार को रखरखाव कार्य के कारण सुबह 11 बजे से शाम 4 बजे तक बिजली बंद रहेगी।" },
            { title: "पलामू में अंतरराष्ट्रीय महिला दिवस पर न्याय और अधिकार की मांग", district: "palamu", category: "social-events", excerpt: "जिले में विभिन्न कार्यक्रमों के जरिए महिलाओं को किया गया जागरूक और सम्मानित।" },
            { title: "विश्व हिंदू परिषद ने पलामू में राम जन्मोत्सव की शुरू की तैयारियां", district: "palamu", category: "religion", excerpt: "19 मार्च से 2 अप्रैल तक जिले के 200 स्थानों पर आयोजित होंगे भव्य कार्यक्रम।" },
            { title: "चैनपुर में करंट लगने से एक व्यक्ति की मौत, परिजनों में कोहराम", district: "palamu", category: "disaster-accident", excerpt: "चढ़नवा गांव में हाईटेंशन तार की चपेट में आने से 47 वर्षीय व्यक्ति ने गंवाई जान।" },
            { title: "बड़गड़ के दुबियाठी गांव में मारपीट, सूर्यदेव यादव की मौत", district: "palamu", category: "crime", excerpt: "हिंसक झड़प में एक व्यक्ति की जान गई, दो अन्य गंभीर रूप से घायल।" },
            { title: "पांडू पुलिस ने बुजुर्ग को मॉब लिंचिंग से बचाया, अफवाह से तनाव", district: "palamu", category: "crime", excerpt: "बच्चा चोर की अफवाह के बाद ग्रामीणों ने बुजुर्ग को घेरा, पुलिस ने सुरक्षित निकाला।" },

            // Jharkhand / National (Relevant to area)
            { title: "नीतीश कुमार के बेटे निशांत कुमार जदयू में शामिल, राजनीति में एंट्री", district: "jharkhand", category: "politics", excerpt: "पटना में आयोजित कार्यक्रम में निशांत की एंट्री से कार्यकर्ताओं में भारी उत्साह।" },
            { title: "जमशेदपुर में छात्रों के बीच हिंसक गैंगवार, चापड़ से हमला", district: "jharkhand", category: "crime", excerpt: "शहर में कानून व्यवस्था पर सवाल, घायलों को अस्पताल में कराया गया भर्ती।" },
            { title: "झारखंड में मौसम का मिजाज बदला, अगले दो दिनों में बढ़ेगी गर्मी", district: "jharkhand", category: "city-facilities", excerpt: "सुबह में हल्का कुहासा, दोपहर में खिली धूप के साथ न्यूनतम तापमान में होगा इजाफा।" }
        ];

        // 1. Delete old articles for specified districts (not viral ones)
        const districtsToDelete = ['garhwa', 'palamu', 'jharkhand'];
        console.log(`🧹 Deleting old non-viral articles for: ${districtsToDelete.join(', ')}...`);

        // We exclude category-love-relationships and articles with specific keywords in title if necessary
        // but the constraint is mostly on category.
        const deleteQuery = `*[_type == "article" && district in $districts && category._ref != $viralCatId]`;
        const viralCatId = categoryMap['love-relationships'];

        const oldArticles = await client.fetch(deleteQuery, { districts: districtsToDelete, viralCatId });
        console.log(`Found ${oldArticles.length} old articles to delete.`);

        for (const art of oldArticles) {
            await client.delete(art._id);
        }
        console.log('✅ Old articles cleaned up.');

        // 2. Fetch a fallback image asset
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);
        if (!imageAsset) {
            console.log('⚠️ No image assets found. Creating articles without images...');
        } else {
            console.log(`📸 Using image asset: ${imageAsset._id}`);
        }

        // 3. Create today's news
        for (const item of newsData) {
            const slug = `${item.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
                .slice(0, 80)}-${Math.floor(Math.random() * 1000)}`;

            const doc = {
                _type: 'article',
                title: item.title,
                slug: { _type: 'slug', current: slug },
                excerpt: item.excerpt,
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        markDefs: [],
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। यह खबर हमारे स्थानीय संवाददाताओं और विश्वसनीय स्रोतों के माध्यम से प्राप्त हुई है। विस्तृत जानकारी के लिए बने रहें।`, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryMap[item.category] || categoryMap['top-story'] },
                author: { _type: 'reference', _ref: authorId },
                district: item.district,
                featured: Math.random() > 0.7,
                isBreaking: Math.random() > 0.8,
                publishedAt: new Date().toISOString(),
            };

            if (imageAsset) {
                doc.featureImage = {
                    _type: 'image',
                    asset: { _type: "reference", _ref: imageAsset._id },
                    alt: item.title
                };
            }

            await client.create(doc);
            console.log(`✅ Created: ${item.title} (${item.district})`);
        }

        console.log('✨ Today\'s news update completed successfully!');
    } catch (err) {
        console.error('❌ Update failed:', err.message);
    }
}

updateNewsForToday();
