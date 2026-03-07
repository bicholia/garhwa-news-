
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

async function seedSpecificNews() {
    console.log('📰 Generating News for Jharkhand, Health, and Public Issues...');

    try {
        const authorId = 'author-admin';

        const SpecificNews = [
            // Jharkhand (district: jharkhand)
            { title: "झारखंड स्थापना दिवस: राजधानी रांची में भव्य कार्यक्रमों का आयोजन", type: 'jharkhand', excerpt: "मुख्यमंत्री ने राज्यवासियों को दी बधाई, कई नई योजनाओं का किया शिलान्यास।" },
            { title: "झारखंड में मानसून की दस्तक: किसानों के चेहरे खिले, धान की बुवाई शुरू", type: 'jharkhand', excerpt: "मौसम विभाग ने अगले 48 घंटों में भारी बारिश की चेतावनी जारी की।" },
            { title: "पोटो हो खेल मैदान योजना: झारखंड के गांवों में खेल प्रतिभाओं को मिलेगा मंच", type: 'jharkhand', excerpt: "पलामू और गढ़वा समेत सभी जिलों में बनेंगे आधुनिक खेल के मैदान।" },
            { title: "झारखंड पर्यटन: नेतरहाट और साहेबगंज में बढ़ी पर्यटकों की आमद", type: 'jharkhand', excerpt: "प्राकृतिक सुंदरता और शांति के लिए मशहूर स्थानों का कायाकल्प कर रही है सरकार।" },
            { title: "छोटा नागपुर की सांस्कृतिक विरासत: करमा उत्सव की धूम", type: 'jharkhand', excerpt: "भाई-बहन के अटूट प्रेम का प्रतीक यह त्योहार पूरे राज्य में हर्षोल्लास के साथ मनाया गया।" },
            { title: "झारखंड पुलिस का 'मिशन सुरक्षा': उग्रवाद प्रभावित इलाकों में कड़ी सतर्कता", type: 'jharkhand', excerpt: "आईजी ने सुरक्षा व्यवस्था का लिया जायजा, शांतिपूर्ण माहौल बनाने की अपील।" },
            { title: "रांची-पटना वंदे भारत एक्सप्रेस: समय की बचत और आरामदेह सफर", type: 'jharkhand', excerpt: "यात्रियों ने ट्रेन की सुविधाओं को सराहा, बढ़ी टिकटों की डिमांड।" },
            { title: "झारखंड की बेटियां खेल जगत में चमकीं: हॉकी में जीता गोल्ड मेडल", type: 'jharkhand', excerpt: "राज्य सरकार ने खिलाड़ियों के लिए नकद इनाम और नौकरी की घोषणा की।" },
            { title: "जमशेदपुर टाटानगर बना भारत का 'स्टील हब' नंबर वन", type: 'jharkhand', excerpt: "निर्यात में रिकॉर्ड बढ़ोत्तरी, हज़ारों युवाओं को मिलेगा रोजगार।" },
            { title: "झारखंड विधानसभा सत्र: विपक्षी दलों का हंगामा, जनता के मुद्दों पर चर्चा", type: 'jharkhand', excerpt: "सदन की कार्यवाही कई बार स्थगित, मुख्यमंत्रियों ने दिया जवाब।" },

            // Health (category-health)
            { title: "आयुष्मान भारत योजना: झारखंड के 50 लाख परिवारों को मिला बीमा कवर", type: 'health', excerpt: "मुफ्त इलाज की सुविधा से गरीब परिवारों को बड़ी राहत, अस्पतालों में विशेष डेस्क।" },
            { title: "ब्लड बैंक की कमी: रांची रिम्स में रक्तदान शिविर का आयोजन", type: 'health', excerpt: "युवाओं ने बढ़-चढ़कर लिया हिस्सा, 'रक्तदान महादान' के नारे से गूंजा परिसर।" },
            { title: "डेंगू से बचाव: नगर निगम ने शुरू किया एंटी-लार्वा छिड़काव", type: 'health', excerpt: "बारिश के बाद बढ़ते खतरों को देखते हुए स्वास्थ्य विभाग अलर्ट पर।" },
            { title: "मानसिक स्वास्थ्य: मोबाइल एडिक्शन बन रहा है गंभीर समस्या, विशेषज्ञ हैरान", type: 'health', excerpt: "बच्चों में बढ़ रही है चिड़चिड़ाहट और नींद की कमी, डिजिटल डिटॉक्स जरूरी।" },
            { title: "आयुर्वेद का बढ़ता क्रेज: प्राकृतिक इलाज की ओर लौट रहे हैं लोग", type: 'health', excerpt: "जड़ी-बूटियों और शुद्ध खान-पान से लाइलाज बीमारियों पर काबू पाने का दावा।" },
            { title: "क्या आप भी पीते हैं कम पानी? हो सकती हैं किडनी की समस्याएं", type: 'health', excerpt: "डॉक्टरों ने हाइड्रेटेड रहने की दी सलाह, रोजाना 8 गिलास पानी है अनिवार्य।" },
            { title: "झारखंड के सदर अस्पतालों में टेली-मेडिसिन सेवा की शुरुआत", type: 'health', excerpt: "अब गांव बैठे विशेषज्ञ डॉक्टरों से ले सकेंगे परामर्श, तकनीक का बड़ा लाभ।" },
            { title: "हृदय रोग: कम उम्र में बढ़ते हार्ट अटैक के पीछे क्या है कारण?", type: 'health', excerpt: "स्ट्रेस और अनहेल्दी डाइट से बढ़ रहा है खतरा, रेगुलर चेकअप है समाधान।" },
            { title: "मातृ वंदना योजना: गर्भवती महिलाओं के लिए पौष्टिक आहार की व्यवस्था", type: 'health', excerpt: "आंगनबाड़ी केंद्रों के माध्यम से दी जा रही है विशेष सहायता।" },
            { title: "मलेरिया मुक्त झारखंड: स्वास्थ्यकर्मियों की घर-घर दस्तक", type: 'health', excerpt: "जांच और दवाओं के वितरण से गिरी मरीजों की संख्या।" },

            // Public Issues (category-public-issues)
            { title: "सड़क जाम की समस्या: मेदिनीनगर के मुख्य चौक पर घंटों फंसे रहे वाहन", type: 'public-issues', excerpt: "अतिक्रमण हटाने की मांग तेज, प्रशासन की सुस्त रफ़्तार से जनता त्रस्त।" },
            { title: "पानी की किल्लत: गर्मी आने से पहले ही सूखने लगे हैंडपंप", type: 'public-issues', excerpt: "ग्रामीणों ने पानी की टंकी बनाने की मांग को लेकर किया प्रदर्शन।" },
            { title: "बिजली कटौती: परीक्षाओं के समय घंटों गुल रहती है लाइट", type: 'public-issues', excerpt: "छात्रों की पढ़ाई हो रही है बाधित, बिजली विभाग ने दिया सुधार का भरोसा।" },
            { title: "कचरे का अंबार: वार्ड नंबर 10 में फैली गंदगी से बीमारियों का डर", type: 'public-issues', excerpt: "नगर निगम को कई बार दी गई सूचना, लेकिन सफाई नहीं हुई।" },
            { title: "टूटी सड़कें: पहली ही बारिश में गड्डों में तब्दील हुई प्रधानमंत्री ग्राम सड़क", type: 'public-issues', excerpt: "ठेकेदार की लापरवाही और घटिया निर्माण सामग्री का लगाया आरोप।" },
            { title: "रोजगार की तलाश: पलायन करने को मजबूर हो रहे हैं जिले के युवा", type: 'public-issues', excerpt: "स्थानीय स्तर पर उद्योगों की कमी, सरकार से ठोस नीति की मांग।" },
            { title: "स्कूल में शिक्षकों की कमी: एक ही मास्टर के भरोसे पूरा प्राथमिक विद्यालय", type: 'public-issues', excerpt: "बच्चों का भविष्य दांव पर, शिक्षा विभाग की अनदेखी से अभिभावक नाराज।" },
            { title: "साइबर क्राइम का नया सेंटर: जामताड़ा के बाद अब गढ़वा में भी सक्रिय हुए ठग", type: 'public-issues', excerpt: "बैंक अधिकारी बनकर उड़ा रहे हैं पैसे, पुलिस ने जारी की एडवाइजरी।" },
            { title: "नशामुक्ति अभियान: युवाओं में बढ़ता ड्रग्स का शौक चिंता का विषय", type: 'public-issues', excerpt: "सामाजिक संगठनों ने शुरू की जागरूकता रैली, पुलिस ने कई जगह की छापेमारी।" },
            { title: "गरीबों का राशन: कोटेदार द्वारा कम अनाज देने की शिकायत", type: 'public-issues', excerpt: "कार्डधारकों ने लगाया धांधली का आरोप, एमओ ने जांच के आदेश दिए।" }
        ];

        // Image asset
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);

        for (const item of SpecificNews) {
            const slug = `${item.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
                .slice(0, 80)}-${Math.floor(Math.random() * 1000)}`;

            const isJharkhand = item.type === 'jharkhand';

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
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। यह विस्तृत रिपोर्ट हमारे न्यूज़ डेस्क द्वारा जनता के हितों और ताज़ा गतिविधियों को ध्यान में रखकर तैयार की गई है।`, marks: [] }]
                    }
                ],
                category: {
                    _type: 'reference',
                    _ref: isJharkhand ? 'category-top-story' : (item.type === 'health' ? 'category-health' : 'category-public-issues')
                },
                author: { _type: 'reference', _ref: authorId },
                district: isJharkhand ? 'jharkhand' : 'none',
                featured: Math.random() > 0.8,
                isBreaking: Math.random() > 0.9,
                publishedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
                featureImage: {
                    _type: 'image',
                    asset: { _type: "reference", _ref: imageAsset?._id || "" },
                    alt: item.title
                }
            };

            await client.create(doc);
            console.log(`✅ News created: ${item.title}`);
        }

        console.log('✨ Success! News for Jharkhand, Health, and Public Issues is live.');
    } catch (err) {
        console.error('❌ Error seeding:', err.message);
    }
}

seedSpecificNews();
