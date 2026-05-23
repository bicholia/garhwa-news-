import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@sanity/client';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const LIFESTYLE_ARTICLES = [
    // Astrology (राशिफल)
    {
        title: "साप्ताहिक राशिफल: जानें इस सप्ताह किन राशि वालों पर बरसेगी भगवान शिव की कृपा, चमकेगी किस्मत",
        excerpt: "साप्ताहिक राशिफल के माध्यम से जानें कि इस सप्ताह किन राशि के जातकों को करियर, व्यापार और लव लाइफ में बड़ी सफलता मिलने जा रही है। भगवान शिव की कृपा से किनकी चमकेगी किस्मत।",
        content: "साप्ताहिक राशिफल के अनुसार, इस सप्ताह ग्रहों की चाल में बड़े बदलाव देखने को मिलेंगे। विशेष रूप से वृष, सिंह और तुला राशि के जातकों पर भगवान शिव की विशेष कृपा बरसेगी। नौकरीपेशा लोगों को पदोन्नति के योग बन रहे हैं और व्यापार में भी बड़ा मुनाफा होने की संभावना है।\n\nसिंह राशि के जातकों के लिए यह सप्ताह नए अवसर लेकर आ रहा है। अगर आप लंबे समय से किसी नए काम की शुरुआत करने की योजना बना रहे थे, तो इस सप्ताह उस योजना को अमलीजामा पहनाया जा सकता है। परिवार में सुख-शांति का माहौल रहेगा।\n\nवहीं, तुला राशि वाले लोगों को अपने स्वास्थ्य का विशेष ध्यान रखने की जरूरत होगी। वाहन चलाते समय सावधानी बरतें और अपने खर्चों पर थोड़ा नियंत्रण रखें। इस सप्ताह किए गए प्रयास आने वाले समय में आपको शुभ परिणाम देंगे।",
        categoryRef: "category-astrology",
        imagePrompt: "A glowing mystical astrolabe, stars and constellations background, divine golden energy light, professional photography, realistic, 16:9 aspect ratio"
    },
    {
        title: "आज का राशिफल: मेष, वृष और मिथुन राशि वालों के लिए आज का दिन रहेगा बेहद खास, जानें अपना भाग्य",
        excerpt: "दैनिक राशिफल के अनुसार मेष, वृष और मिथुन राशि के जातकों के लिए आज का दिन मिलाजुला रहेगा। कुछ जातकों को धन लाभ हो सकता है तो कुछ को संभलकर रहना होगा।",
        content: "आज का राशिफल बताता है कि मेष राशि के जातकों को आज अपने करियर में बड़ा उछाल देखने को मिल सकता है। वरिष्ठ अधिकारियों का सहयोग प्राप्त होगा। धन से जुड़े मामलों में फैसला लेते समय थोड़ा धैर्य रखें, जल्दबाजी में लिया गया निर्णय नुकसानदेह हो सकता है।\n\nवृष राशि के लोगों के लिए आज का दिन बहुत अनुकूल है। प्रेम संबंधों में मधुरता आएगी और पार्टनर के साथ अच्छा समय बिताने का मौका मिलेगा। नौकरी की तलाश कर रहे युवाओं को आज कोई शुभ समाचार मिल सकता है।\n\nमिथुन राशि के जातकों को आज अपनी वाणी पर संयम रखना होगा। कार्यस्थल पर किसी सहयोगी के साथ मतभेद हो सकता है। शांत रहें और अपने काम पर ध्यान केंद्रित करें। शाम को परिवार के साथ मंदिर दर्शन के लिए जा सकते हैं।",
        categoryRef: "category-astrology",
        imagePrompt: "astrology signs background, zodiac wheel, celestial universe, neon blue and gold color scheme, professional photography, realistic, 16:9"
    },
    {
        title: "सूर्य गोचर 2026: सूर्यदेव का राशि परिवर्तन, इन 4 राशि वाले जातकों को मिलेगा बंपर धन लाभ और तरक्की",
        excerpt: "सूर्यदेव जल्द ही राशि परिवर्तन करने जा रहे हैं। इस गोचर का सभी 12 राशियों पर गहरा प्रभाव पड़ेगा, लेकिन 4 भाग्यशाली राशियों को बंपर धन लाभ होने के योग बन रहे हैं।",
        content: "वैदिक ज्योतिष में सूर्यदेव को मान-सम्मान और आत्मा का कारक माना जाता है। सूर्यदेव का एक राशि से दूसरी राशि में प्रवेश करना 'संक्रांति' कहलाता है। सूर्य के इस गोचर से मेष, कर्क, कन्या और धनु राशि के जातकों की किस्मत चमकने वाली है।\n\nमेष राशि के जातकों के लिए यह गोचर आर्थिक मजबूती लेकर आएगा। नौकरी में प्रमोशन और मान-सम्मान में वृद्धि होगी। कर्क राशि के जातकों को पैतृक संपत्ति से लाभ मिल सकता है। छात्रों के लिए भी यह समय काफी अनुकूल रहने वाला है।\n\nकन्या और धनु राशि के व्यापारियों को इस दौरान बड़ी डील मिल सकती है, जिससे व्यापार का विस्तार होगा। सामाजिक कार्यों में आपकी रुचि बढ़ेगी। समाज में आपका प्रभाव बढ़ेगा और पुराने कर्ज से मुक्ति मिलेगी।",
        categoryRef: "category-astrology",
        imagePrompt: "Sun god energy radiating light rays, Vedic astrology illustration, cosmic background, orange and gold tones, professional photography, realistic, 16:9"
    },
    // Love & Relationships (प्रेम / रिश्ते)
    {
        title: "रिलेशनशिप टिप्स: अपने रिश्ते को हमेशा मजबूत रखने के लिए अपनाएं ये 5 खास बातें, कभी नहीं होगी अनबन",
        excerpt: "अगर आप अपने पार्टनर के साथ रिश्ते को हमेशा नया और मजबूत बनाए रखना चाहते हैं, तो इन 5 आसान रिलेशनशिप टिप्स को जरूर अपनाएं। इससे आपके बीच का प्यार और बढ़ेगा।",
        content: "एक स्वस्थ और मजबूत रिश्ते की नींव आपसी विश्वास और सम्मान पर टिकी होती है। आजकल की व्यस्त जीवनशैली में पार्टनर्स के बीच दूरियां आना आम बात है, लेकिन कुछ आसान बातों का ध्यान रखकर आप अपने रिश्ते को हमेशा तरोताजा रख सकते हैं। पहली बात है स्पष्ट बातचीत—अपने पार्टनर से खुलकर बातें करें और उनकी बातें भी ध्यान से सुनें।\n\nदूसरी महत्वपूर्ण बात है एक-दूसरे को स्पेस देना। प्यार का मतलब बंधन नहीं है। अपने पार्टनर को उनकी हॉबीज़ और दोस्तों के साथ समय बिताने की आजादी दें। इसके अलावा, एक-दूसरे की छोटी-छोटी खुशियों और प्रयासों की सराहना करना न भूलें।\n\nतीसरी बात, जब भी कोई विवाद या असहमति हो, तो चिल्लाने के बजाय शांत बैठकर बातचीत से समाधान निकालें। रिश्ते में माफी मांगना और माफ करना दोनों ही बहुत जरूरी हैं। इन छोटी-छोटी बातों को अपनाकर आप अपने पार्टनर के साथ एक खुशहाल जीवन जी सकते हैं।",
        categoryRef: "category-love-relationships",
        imagePrompt: "A happy couple walking holding hands in a park, warm sunset light filter, romantic bokeh background, cinematic photography, realistic, 16:9"
    },
    {
        title: "लव लाइफ: क्या आपका पार्टनर आपसे दूर जा रहा है? जानें इन संकेतों से और बचाएं अपना प्यार",
        excerpt: "रिश्ते में अचानक आए बदलावों को नजरअंदाज न करें। अगर आपका पार्टनर आपसे दूरियां बना रहा है, तो इन 5 मुख्य संकेतों से समझें और अपने प्यार को टूटने से बचाएं।",
        content: "जब कोई रिश्ता टूटने की कगार पर पहुंचता है, तो उसमें अचानक बदलाव नहीं आते, बल्कि कुछ संकेत पहले से ही मिलने लगते हैं। अगर आपका पार्टनर आपकी कॉल या मैसेज का जवाब देने में बहुत देर लगाता है, या उनके व्यवहार में बेरुखी आ गई है, तो यह पहला संकेत हो सकता है कि उनके मन में कुछ चल रहा है।\n\nदूसरा संकेत है बातचीत का कम होना। जब किसी रिश्ते में शेयरिंग खत्म हो जाती है, तो भावनात्मक जुड़ाव भी कमजोर होने लगता है। अगर आपका पार्टनर आपके साथ भविष्य की योजनाएं बनाना बंद कर दे, या छोटी-छोटी बातों पर गुस्सा होने लगे, तो स्थिति को समझने की कोशिश करें।\n\nऐसे समय में गुस्सा करने या आरोप लगाने के बजाय पार्टनर के साथ एक दोस्ताना और गंभीर बातचीत करें। उनकी चिंताओं को समझने की कोशिश करें और मिलकर समस्या का समाधान ढूंढें। प्यार और धैर्य से किसी भी कमजोर होते रिश्ते को दोबारा बचाया जा सकता है।",
        categoryRef: "category-love-relationships",
        imagePrompt: "An emotional couple sitting on a bench looking away from each other, sad moody atmosphere, rainy window overlay effect, professional photography, 16:9"
    },
    {
        title: "शादी से पहले पार्टनर से जरूर पूछें ये 4 महत्वपूर्ण सवाल, बाद में नहीं पछताना पड़ेगा",
        excerpt: "विवाह जीवन का सबसे बड़ा निर्णय होता है। शादी के बंधन में बंधने से पहले अपने होने वाले जीवनसाथी से इन 4 अहम मुद्दों पर खुलकर चर्चा जरूर कर लें।",
        content: "शादी केवल दो लोगों का मिलन नहीं है, बल्कि यह दो परिवारों और दो अलग-अलग जीवनशैलियों का जुड़ना है। शादी के बाद आने वाले बदलावों को आसानी से अपनाने के लिए शादी से पहले कुछ बातें स्पष्ट कर लेना बेहद जरूरी होता है। सबसे पहला सवाल करियर और भविष्य की योजनाओं को लेकर होना चाहिए।\n\nदूसरा अहम मुद्दा है फाइनेंशियल मैनेजमेंट का। दोनों की वित्तीय स्थिति, खर्च करने की आदतें और बचत की योजनाओं पर खुलकर चर्चा करें। तीसरा सवाल पारिवारिक मूल्यों और जिम्मेदारियों को लेकर होना चाहिए कि आप दोनों मिलकर घर और परिवार को कैसे संभालेंगे।\n\nचौथा और सबसे महत्वपूर्ण पहलू है आपसी तालमेल और व्यक्तिगत स्पेस का। शादी से पहले इन जरूरी मुद्दों पर बात करने से बाद में आने वाले कई विवादों को टाला जा सकता है और एक मजबूत वैवाहिक जीवन की शुरुआत की जा सकती है।",
        categoryRef: "category-love-relationships",
        imagePrompt: "A young couple sitting at a cozy cafe discussing seriously but with smiles, warm coffee cups on table, soft indoor lighting, professional photography, realistic, 16:9"
    }
];

function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0900-\u097F\s\-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80);
}

async function uploadImage(imageUrl, title) {
    try {
        console.log(`🖼️ Downloading image from Pollinations: ${imageUrl.substring(0, 80)}...`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`☁️ Uploading to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: `${createSlug(title)}.jpg`
        });
        console.log(`✅ Asset created: ${asset._id}`);
        return asset._id;
    } catch (e) {
        console.error(`❌ Image upload failed: ${e.message}`);
        return null;
    }
}

async function run() {
    console.log("🚀 Starting Lifestyle Articles Publisher...");
    for (const art of LIFESTYLE_ARTICLES) {
        console.log(`\n📝 Processing: "${art.title}"`);
        const slug = `${createSlug(art.title)}-${Math.random().toString(36).substring(7)}`;
        
        const count = await client.fetch(`count(*[_type == "article" && title == $title])`, { title: art.title });
        if (count > 0) {
            console.log("⏭️ Article already exists, skipping.");
            continue;
        }

        const seed = Math.floor(Math.random() * 1000000);
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(art.imagePrompt)}?width=800&height=450&nologo=true&seed=${seed}`;
        const assetId = await uploadImage(imgUrl, art.title);

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
                    children: [{ _type: 'span', text: art.content, marks: [] }]
                }
            ],
            category: { _type: 'reference', _ref: art.categoryRef },
            author: { _type: 'reference', _ref: 'author-admin' },
            district: 'national',
            publishedAt: new Date().toISOString(),
        };

        if (assetId) {
            doc.featureImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            };
        }

        try {
            const res = await client.create(doc);
            console.log(`✅ Published successfully! ID: ${res._id}`);
        } catch (err) {
            console.error(`❌ Publish failed: ${err.message}`);
        }
        
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("\n🎉 Finished publishing lifestyle articles!");
}
run();
