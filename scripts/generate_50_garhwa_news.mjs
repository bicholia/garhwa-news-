
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

async function seedGarhwaNews() {
    console.log('🚀 Generating 50 Garhwa News Articles...');

    try {
        const authorId = 'author-admin';
        const categoryMap = {
            'crime': 'category-crime',
            'politics': 'category-politics',
            'jobs': 'category-jobs',
            'education': 'category-education',
            'business': 'category-business',
            'sports': 'category-sports',
            'entertainment': 'category-entertainment',
            'health': 'category-health',
            'agriculture': 'category-agriculture',
        };

        const newsData = [
            { title: "गढ़वा सदर अस्पताल में नई सिटी स्कैन मशीन का उद्घाटन", category: "health", excerpt: "गढ़वा सदर अस्पताल के मरीजों को अब बाहर नहीं जाना पड़ेगा।" },
            { title: "रंका में सड़क दुर्घटना में दो युवक घायल, रिम्स रेफर", category: "crime", excerpt: "तेज रफ्तार बाइक अनियंत्रित होकर पेड़ से टकराई।" },
            { title: "गढ़वा विधायक ने किया डंडा प्रखंड में पुल का शिलान्यास", category: "politics", excerpt: "5 करोड़ की लागत से बनेगा नया पुल।" },
            { title: "मझिआंव में अवैध बालू लदा ट्रैक्टर जब्त, चालक फरार", category: "crime", excerpt: "पुलिस की बड़ी कार्रवाई, माफियाओं में हड़कंप।" },
            { title: "विशुनपुरा में किसानों के लिए केसीसी ऋण मेला आयोजित", category: "agriculture", excerpt: "सैकड़ों किसानों को मिला ऋण का लाभ।" },
            { title: "गढ़वा में बिजली कटौती से लोग परेशान, विभाग को दी चेतावनी", category: "health", excerpt: "उमस भरी गर्मी में 12 घंटे हो रही कटौती।" },
            { title: "भवनाथपुर टाउनशिप में मनाया गया वार्षिक खेल महोत्सव", category: "sports", excerpt: "स्थानीय बच्चों ने दिखाया अपना हुनर।" },
            { title: "रमना प्रखंड में मनरेगा कार्यों की सोशल ऑडिट संपन्न", category: "politics", excerpt: "विकास कार्यों में पारदर्शिता लाने की कोशिश।" },
            { title: "डंडा में पेयजल संकट को लेकर महिलाओं ने किया प्रदर्शन", category: "health", excerpt: "पीने के पानी के लिए मीलों दूर जाना पड़ रहा है।" },
            { title: "गढ़वा रेलवे स्टेशन पर रुकी नई एक्सप्रेस ट्रेन, यात्रियों में खुशी", category: "business", excerpt: "दिल्ली के लिए अब मिलेगी सीधी कनेक्टिविटी।" },
            { title: "चिनीयां प्रखंड में हाथियों के झुंड ने मचाया उत्पात", category: "agriculture", excerpt: "किसानों की लहलहाती फसल को किया बर्बाद।" },
            { title: "गढ़वा शहर में अतिक्रमण हटाओ अभियान, कई दुकानें ध्वस्त", category: "politics", excerpt: "ट्रैफिक जाम की समस्या से मिलेगी मुक्ति।" },
            { title: "मेराल में 10वीं के छात्र ने किया कमाल, राज्य स्तर पर नाम रोशन", category: "education", excerpt: "टॉपर छात्र को किया गया सम्मानित।" },
            { title: "नगर उंटारी में बंशीधर महोत्सव की तैयारियां जोरों पर", category: "entertainment", excerpt: "पर्यटन विभाग ने जारी किया विशेष बजट।" },
            { title: "सगमा प्रखंड में मुखिया ने किया विकास योजनाओं की जांच", category: "politics", excerpt: "गुणवत्ता के साथ कोई समझौता नहीं होगा।" },
            { title: "बिशुनपुरा में विवाहिता की संदिग्ध मौत, मायके वालों का आरोप", category: "crime", excerpt: "दहेज हत्या का मामला दर्ज, पुलिस जांच में जुटी।" },
            { title: "गढ़वा में भारी वर्षा से जनजीवन अस्त-व्यस्त, नदियां उफान पर", category: "health", excerpt: "निचले इलाकों में घुसा पानी, प्रशासन अलर्ट।" },
            { title: "कांडी प्रखंड में किसान पाठशाला का आयोजन, नई तकनीक की जानकारी", category: "agriculture", excerpt: "ड्रिप इरिगेशन से बढ़ेगा उत्पादन।" },
            { title: "खरौंधी में सड़क निर्माण में अनियमितता, ग्रामीणों ने रोका काम", category: "politics", excerpt: "घटिया सामग्री के उपयोग का लगाया आरोप।" },
            { title: "गढ़वा बस स्टैंड से अवैध वसूली करते तीन युवक गिरफ्तार", category: "crime", excerpt: "पुलिस ने बिछाया जाल, रंगे हाथ पकड़े गए।" },
            { title: "धुरकी प्रखंड में बिरसा हरित ग्राम योजना का निरीक्षण", category: "agriculture", excerpt: "बंजर जमीन पर लहलहाएंगे फलदार पौधे।" },
            { title: "बरडीहा में शिक्षक की कमी से छात्र परेशान, स्कूल में तालाबंदी", category: "education", excerpt: "एक ही शिक्षक के भरोसे पूरा विद्यालय।" },
            { title: "गढ़वा के युवा क्रिकेटर का चयन रणजी टीम के लिए", category: "sports", excerpt: "जिले के लिए ऐतिहासिक पल, बधाई देने वालों का तांता।" },
            { title: "केतार प्रखंड में राशन कार्डधारियों ने डीलर पर लगाया आरोप", category: "politics", excerpt: "कम अनाज देने की शिकायत पहुंची अनुमंडल पदाधिकारी तक।" },
            { title: "चितविश्राम में आयोजित दंगल प्रतियोगिता में यूपी के पहलवान जीते", category: "sports", excerpt: "हजारों की संख्या में उमड़ी दर्शकों की भीड़।" },
            { title: "गढ़वा जिला मुख्यालय में कौशल विकास केंद्र का शुभारंभ", category: "jobs", excerpt: "युवाओं को मिलेगा हुनर और रोजगार।" },
            { title: "बड़गड़ प्रखंड में मलेरिया का प्रकोप, स्वास्थ्य टीम पहुंची", category: "health", excerpt: "लक्षण दिखने पर तुरंत जांच कराने की सलाह।" },
            { title: "गढ़वा पुलिस लाइन में मनाया गया शहीद दिवस", category: "social-events", excerpt: "वीर जवानों की कुर्बानी को किया गया नमन।" },
            { title: "रंका वन क्षेत्र में अवैध लकड़ी कटाई रोकने के लिए छापेमारी", category: "crime", excerpt: "ट्रक सहित कीमती कीमती सामान जब्त।" },
            { title: "चिनियाँ में निर्माणाधीन भवन की छत गिरी, दो मजदूर घायल", category: "crime", excerpt: "घायलों को निजी नर्सिंग होम में कराया गया भर्ती।" },
            { title: "गढ़वा सदर बाजार में आग लगने से लाखों का नुकसान", category: "business", excerpt: "शॉर्ट सर्किट बताया जा रहा है कारण।" },
            { title: "नगर उंटारी में आयोजित हुआ स्वदेशी मेला, हस्तशिल्प की मांग", category: "business", excerpt: "ग्रामीण कारीगरों को मिला बेहतरीन बाजार।" },
            { title: "खरौंधी में पुरानी रंजिश में मारपीट, तीन लोग जख्मी", category: "crime", excerpt: "थाने में दोनों पक्षों ने दर्ज कराई प्राथमिकी।" },
            { title: "गढ़वा कलेक्ट्रेट में जनता दरबार, कई समस्याओं का समाधान", category: "politics", excerpt: "डीसी ने सुनी जनसमस्याएं, अधिकारियों को दिए निर्देश।" },
            { title: "रमना में ट्रेन की चपेट में आने से बुजुर्ग की मौत", category: "crime", excerpt: "आरपीएफ ने शव को पोस्टमार्टम के लिए भेजा।" },
            { title: "गढ़वा में अंतर्राष्ट्रीय महिला दिवस पर सशक्त नारियों का सम्मान", category: "social-events", excerpt: "सफलता की कहानियों ने सबको प्रेरित किया।" },
            { title: "मेराल प्रखंड में पीएम आवास योजना की किश्त जारी", category: "politics", excerpt: "गरीबों का अपना घर होने का सपना होगा पूरा।" },
            { title: "भवनाथपुर में बिजली के तारों में उलझकर पक्षी की मौत", category: "health", excerpt: "शहरी क्षेत्रों में जर्जर तारों को बदलने की मांग।" },
            { title: "गढ़वा बाइपास रोड का निर्माण कार्य 80% पूरा, जल्द होगा चालू", category: "politics", excerpt: "शहर को भारी वाहनों के जाम से मिलेगी राहत।" },
            { title: "सगमा में आयोजित हुआ जिला स्तरीय फुटबॉल टूर्नामेंट", category: "sports", excerpt: "फाइनल मैच में रंका की टीम ने मारी बाजी।" },
            { title: "नगर उंटारी रेलवे स्टेशन के पास मिला नवजात का शव", category: "crime", excerpt: "पुलिस इलाके में लगे सीसीटीवी फुटेज खंगाल रही है।" },
            { title: "गढ़वा में खाद की किल्लत से किसान परेशान, लंबी लाइनें", category: "agriculture", excerpt: "यूरिया के लिए सुबह 4 बजे से ही लग रहे किसान।" },
            { title: "विशुनपुरा में पुरानी हवेली की दीवार गिरी, बाल-बाल बचे बच्चे", category: "health", excerpt: "जर्जर भवनों को चिह्नित करने का निर्देश।" },
            { title: "रमना प्रखंड में आंगनबाड़ी केंद्र का औचक निरीक्षण", category: "politics", excerpt: "बच्चों को मिलने वाले पोषाहार में मिली गड़बड़ी।" },
            { title: "गढ़वा में आयोजित हुआ मेगा ब्लड डोनेशन कैंप", category: "health", excerpt: "100 से अधिक युवाओं ने किया रक्तदान।" },
            { title: "मेराल में बैंक ऑफ बड़ौदा में लूट का प्रयास विफल", category: "crime", excerpt: "गार्ड की मुस्तैदी से भागे बदमाश, जांच शुरू।" },
            { title: "केतार में आयोजित हुई ग्राम सभा, विकास योजनाओं पर चर्चा", category: "politics", excerpt: "ग्रामीणों ने रखी सड़क और नाली की मांग।" },
            { title: "गढ़वा के स्कूलों में शुरू हुआ स्मार्ट क्लास रूम", category: "education", excerpt: "अब डिजिटल तरीके से पढ़ेंगे सरकारी स्कूल के बच्चे।" },
            { title: "कांडी में सिंचाई के अभाव में सूख रही फसलें, किसान चिंतित", category: "agriculture", excerpt: "सरकार से सहायता और मुआवजे की अपील।" },
            { title: "गढ़वा जिला परिषद की बैठक में हंगामा, विकास पर सवाल", category: "politics", excerpt: "सदस्यों ने लगाया सरकारी राशि के दुरुपयोग का आरोप।" }
        ];

        // Fetch a valid image asset to use for all articles (fallback)
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);
        if (!imageAsset) {
            throw new Error('No image assets found in Sanity. Please upload at least one image first.');
        }
        console.log(`📸 Using image asset: ${imageAsset._id}`);

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
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। यह खबर गढ़वा जिले के स्थानीय संवाददाताओं द्वारा भेजी गई है। हम इसकी पूरी सत्यता की पुष्टि कर रहे हैं और जल्द ही विस्तृत विवरण अपडेट करेंगे। हमारी टीम ग्राउंड जीरो पर मौजूद है।`, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryMap[item.category] || categoryMap['politics'] },
                author: { _type: 'reference', _ref: authorId },
                district: 'garhwa',
                featured: Math.random() > 0.8,
                isBreaking: Math.random() > 0.9,
                publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Last 7 days
                featureImage: {
                    _type: 'image',
                    asset: {
                        _type: "reference",
                        _ref: imageAsset._id
                    },
                    alt: item.title
                }
            };

            await client.create(doc);
            console.log(`✅ Article created: ${item.title}`);
        }

        console.log('✨ All 50 articles created successfully in Sanity!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
}

seedGarhwaNews();
