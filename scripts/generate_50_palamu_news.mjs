
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

async function seedPalamuNews() {
    console.log('🚀 Generating 50 Palamu News Articles...');

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
            { title: "पलामू प्रमंडलीय मुख्यालय डालटनगंज में ट्रैफिक जाम से मिलेगी मुक्ति", category: "politics", excerpt: "प्रशासन ने शहर के प्रमुख चौराहों पर नए ट्रैफिक सिग्नल लगाने का निर्णय लिया है।" },
            { title: "चैनपुर प्रखंड में हाथियों का उत्पात, कई घरों को किया ध्वस्त", category: "agriculture", excerpt: "जंगली हाथियों के झुंड ने फसलों को भारी नुकसान पहुंचाया, ग्रामीणों ने पेड़ पर चढ़कर बचाई जान।" },
            { title: "मेदिनीनगर सदर अस्पताल में ऑक्सीजन प्लांट का सफल ट्रायल", category: "health", excerpt: "आपातकालीन स्थिति में अब मरीजों को ऑक्सीजन की कमी नहीं होगी।" },
            { title: "पांकी विधानसभा क्षेत्र में नई सड़कों का जाल बिछाएगी सरकार", category: "politics", excerpt: "50 करोड़ की लागत से ग्रामीण क्षेत्रों की कनेक्टिविटी सुधारी जाएगी।" },
            { title: "हुसैनाबाद में अवैध कोयला लदा ट्रक जब्त, एक गिरफ्तार", category: "crime", excerpt: "गुप्त सूचना के आधार पर पुलिस ने छापेमारी कर बड़ी सफलता पाई।" },
            { title: "पलामू किला क्षेत्र में फिल्म सिटी बनाने का प्रस्ताव केंद्र को भेजा", category: "entertainment", excerpt: "स्थानीय पर्यटन और रोजगार को मिलेगा भारी बढ़ावा।" },
            { title: "छतरपुर में पेयजल संकट: कोयल नदी से पाइपलाइन बिछाने की मांग", category: "health", excerpt: "भीषण गर्मी से पहले जलापूर्ति योजना पर काम शुरू करने की अपील।" },
            { title: "हरिहरगंज बाजार में भीषण आग, लाखों की संपत्ति जलकर खाक", category: "business", excerpt: "शॉर्ट सर्किट से लगी आग पर कड़ी मशक्कत के बाद काबू पाया गया।" },
            { title: "पलामू टाइगर रिजर्व में बाघों की संख्या बढ़ी, वन विभाग में उत्साह", category: "agriculture", excerpt: "कैमरा ट्रैप में दिखे नए शावक, सुरक्षा और बढ़ाई गई।" },
            { title: "बिश्रामपुर में किसानों के लिए उन्नत बीज वितरण कार्यक्रम", category: "agriculture", excerpt: "दाल और तिलहन की खेती को बढ़ावा देने के लिए राज्य सरकार की पहल।" },
            { title: "डालटनगंज रेलवे स्टेशन को अमृत भारत स्टेशन योजना में शामिल किया गया", category: "business", excerpt: "वर्ल्ड क्लास सुविधाओं के साथ स्टेशन का होगा पुनर्विकास।" },
            { title: "लेस्लीगंज में आयोजित हुआ स्वास्थ्य मेला, सैकड़ों ग्रामीणों ने कराई जांच", category: "health", excerpt: "मुफ्त दवाओं और परामर्श से स्थानीय लोगों को मिली राहत।" },
            { title: "पलामू पुलिस ने साइबर ठगी गिरोह के 4 सदस्यों को दबोचा", category: "crime", excerpt: "बिहार और झारखंड के सीमावर्ती इलाकों में सक्रिय था गिरोह।" },
            { title: "बैरक में रहने वाले पुलिसकर्मियों के लिए मेदिनीनगर में बनेगा नया आवास", category: "politics", excerpt: "पुलिस लाइन के आधुनिकीकरण के लिए बजट स्वीकृत।" },
            { title: "नावाडीह प्रखंड में आयोजित हुई जिला स्तरीय एथलेटिक्स मीट", category: "sports", excerpt: "पलामू के धावकों ने कई स्वर्ण पदक अपने नाम किए।" },
            { title: "चैनपुर में अष्टयाम यज्ञ का आयोजन, भक्तिमय हुआ वातावरण", category: "social-events", excerpt: "हजारों श्रद्धालुओं ने की भगवान की आराधना, भंडारे का आयोजन।" },
            { title: "पलामू प्रमंडल में 'पढ़े पलामू' अभियान की शुरुआत", category: "education", excerpt: "सरकारी स्कूलों में लाइब्रेरी और डिजिटल लर्निंग पर फोकस।" },
            { title: "सड़क सुरक्षा माह के तहत डालटनगंज में चलाया गया जागरूकता अभियान", category: "health", excerpt: "बिना हेलमेट चलने वालों को गुलाब का फूल देकर दी गई सलाह।" },
            { title: "मनातू प्रखंड के सुदूर गांवों में पहली बार पहुंची बिजली", category: "politics", excerpt: "आजादी के बाद पहली बार जगमगाए घर, ग्रामीणों में खुशी।" },
            { title: "पलामू जिला परिषद की स्वास्थ्य समिति की बैठक संपन्न", category: "health", excerpt: "ग्रामीण उपकेंद्रों में नर्सों की तैनाती का लिया गया फैसला।" },
            { title: "सतबरवा प्रखंड में मक्का की खेती में लगा कीड़ा, किसान परेशान", category: "agriculture", excerpt: "कृषि वैज्ञानिकों की टीम ने प्रभावित क्षेत्रों का दौरा किया।" },
            { title: "डालटनगंज कचहरी परिसर में वकील और मुवक्किल के बीच झड़प", category: "crime", excerpt: "पुलिस ने बीच-बचाव कर मामले को शांत कराया।" },
            { title: "पलामू के युवाओं के लिए सेना भर्ती रैली की तिथि घोषित", category: "jobs", excerpt: "ग्लोरी ग्राउंड में अगले महीने से शुरू होगी दौड़।" },
            { title: "हैदरनगर में दुर्गा पूजा महोत्सव को लेकर शांति समिति की बैठक", category: "social-events", excerpt: "भाईचारे के साथ त्योहार मनाने और सुरक्षा व्यवस्था पर चर्चा।" },
            { title: "नीलांबर-पीतांबर विश्वविद्यालय में नए सत्र के नामांकन शुरू", category: "education", excerpt: "कॉलेजों में सीट बढ़ाने की मांग को लेकर छात्रों का प्रदर्शन।" },
            { title: "पलामू मेडिकल कॉलेज में सुपर स्पेशियलिटी सेवाओं की शुरुआत", category: "health", excerpt: "कार्डियोलॉजी और नेफ्रोलॉजी के डॉक्टर अब हर हफ्ते बैठेंगे।" },
            { title: "पाटन प्रखंड में अवैध शराब भट्टी नष्ट, 500 लीटर लहन बरामद", category: "crime", excerpt: "आबकारी विभाग और पुलिस की संयुक्त कार्रवाई।" },
            { title: "डालटनगंज शहर में जलभराव की समस्या, ड्रेनेज सिस्टम फेल", category: "politics", excerpt: "हल्की बारिश में भी सड़कों पर जमा हो रहा पानी, नगर निगम सुस्त।" },
            { title: "पलामू के कलाकारों ने देवघर में बिखेरा अपनी कला का जादू", category: "entertainment", excerpt: "सांस्कृतिक कार्यक्रम में पलामू की लुप्त होती परंपराओं को दिखाया।" },
            { title: "मोहम्मदगंज प्रखंड में कोयल नदी पर बना कोराज बांध क्षतिग्रस्त", category: "agriculture", excerpt: "सिंचाई व्यवस्था ठप, प्रशासन से जल्द मरम्मत की मांग।" },
            { title: "छतरपुर में ज्वेलरी शॉप में दिनदहाड़े लूट का प्रयास", category: "crime", excerpt: "हवाई फायरिंग कर भागे अपराधी, सीसीटीवी में कैद हुए चेहरे।" },
            { title: "पलामू में कुपोषण उन्मूलन के लिए विशेष आंगनबाड़ी अभियान", category: "health", excerpt: "कम वजन वाले बच्चों को अतिरिक्त पोषक आहार दिया जाएगा।" },
            { title: "हरिहरगंज-औरंगाबाद मुख्य सड़क पर ट्रक पलटा, चालक की मौत", category: "crime", excerpt: "ब्रेक फेल होने की वजह से अनियंत्रित होकर पलटा वाहन।" },
            { title: "सतबरवा में आयोजित हुई फुटबॉल प्रतियोगिता, चैनपुर टीम जीती", category: "sports", excerpt: "फाइनल मैच में रोमांचक मुकाबले के बाद मिली जीत।" },
            { title: "मेदिनीनगर सदर प्रखंड में राशन कार्ड में नाम जुड़वाने के लिए उमड़ी भीड़", category: "politics", excerpt: "प्रज्ञा केंद्रों पर सर्वर की समस्या से लोग हो रहे परेशान।" },
            { title: "पलामू में अवैध वन भूमि अतिक्रमण पर विभाग की बड़ी कार्रवाई", category: "politics", excerpt: "सैकड़ों एकड़ सरकारी जमीन से हटाए गए अवैध निर्माण।" },
            { title: "बिश्रामपुर माइंस एरिया में धूल कणों से लोग बीमार, प्रदर्शन", category: "health", excerpt: "प्रदूषण बोर्ड से नियमों के उल्लंघन की जांच करने की मांग।" },
            { title: "नायब तहसीलदार पर भ्रष्टाचार का आरोप, डीसी से शिकायत", category: "politics", excerpt: "दाखिल-खारिज के नाम पर पैसे मांगने का वीडियो वायरल।" },
            { title: "पलामू का तापमान 44 डिग्री पहुंचा, लू से जनजीवन बेहाल", category: "health", excerpt: "प्रशासन ने स्कूलों के समय में किया बदलाव।" },
            { title: "हुसैनाबाद में रेल ओवरब्रिज का निर्माण कार्य शुरू", category: "politics", excerpt: "कई सालों से रेलवे क्रॉसिंग पर जाम से जूझ रहे थे लोग।" },
            { title: "पलामू के मेधावी छात्रों को राज्यपाल करेंगे सम्मानित", category: "education", excerpt: "मैट्रिक और इंटर टॉपरों के लिए रांची में विशेष समारोह।" },
            { title: "पलामू में बालू का खेल: माफियाओं ने बनाई नई सड़कें", category: "crime", excerpt: "पर्यावरण नियमों की धज्जियां उड़ाकर हो रहा अवैध खनन।" },
            { title: "छतरपुर के सुदूरवर्ती इलाकों में मोबाइल टावर लगाने का काम शुरू", category: "business", excerpt: "डिजिटल इंडिया अभियान के तहत संचार व्यवस्था होगी मजबूत।" },
            { title: "पलामू के चियांकी हवाई अड्डे के विस्तार को मिली हरी झंडी", category: "business", excerpt: "अब मेदिनीनगर से सीधी हवाई सेवा शुरू होने की उम्मीद।" },
            { title: "हरिहरगंज प्रखंड में हाथ से बना सामान विदेश भेजेगा जेएसएलपीएस", category: "business", excerpt: "सखी मंडल की महिलाओं की आमदनी में होगा इजाफा।" },
            { title: "पलामू में आयोजित हुई कबीर सत्संग सभा, उमड़ी भीड़", category: "social-events", excerpt: "शांति और सद्भाव का संदेश लेकर दूर-दूर से पहुंचे लोग।" },
            { title: "मेदिनीनगर के पोखरा पर सौंदर्यकरण कार्य में लापरवाही", category: "politics", excerpt: "नगर निगम के ठेकेदार को काम रोकने और स्पष्टीकरण का नोटिस।" },
            { title: "पलामू के जंगलों में फिर लगी आग, करोड़ों की वन संपदा खाक", category: "health", excerpt: "गर्मी बढ़ते ही आग लगने की घटनाओं में इजाफा, वन विभाग बेबस।" },
            { title: "डालटनगंज में सड़क चौड़ीकरण के लिए कटेंगे 200 पेड़", category: "politics", excerpt: "विकास और पर्यावरण के बीच छिड़ी बहस, विरोध शुरू।" },
            { title: "पलामू पुलिस ने बरामद किए 100 चोरी के मोबाइल", category: "crime", excerpt: "असली मालिकों को वापस लौटाए गए फोन, चेहरे खिले।" }
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
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। यह खबर न्यूज़ ब्यूरो के स्थानीय संवाददाताओं द्वारा भेजी गई है। हमारी टीम पूरे क्षेत्र की खबरों पर नज़र बनाए हुए है।`, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryMap[item.category] || categoryMap['politics'] },
                author: { _type: 'reference', _ref: authorId },
                district: 'palamu',
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

        console.log('✨ All 50 Palamu articles created successfully in Sanity!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
}

seedPalamuNews();
