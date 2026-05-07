
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.production.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function uploadImageFromPollinations(prompt, title) {
    try {
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`;
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Image fetch failed');
        const buffer = await response.buffer();
        const asset = await client.assets.upload('image', buffer, {
            filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error(`Failed to upload image for ${title}:`, error.message);
        return null;
    }
}

async function publishTodayNews() {
    console.log('🚀 Publishing Today\'s News (7 May 2026)...');

    const newsItems = [
        {
            title: "मेराल: करकोमा गांव में भीषण सड़क हादसा, दंपती समेत तीन घायल",
            excerpt: "मेराल थाना क्षेत्र के करकोमा गांव में एक अनियंत्रित मोटरसाइकिल के दुर्घटनाग्रस्त होने से उस पर सवार पति-पत्नी और एक अन्य व्यक्ति गंभीर रूप से घायल हो गए।",
            content: "मेराल (गढ़वा): जिला अंतर्गत मेराल थाना क्षेत्र के करकोमा गांव में बुधवार की देर शाम एक सड़क हादसे में तीन लोग गंभीर रूप से घायल हो गए। प्राप्त जानकारी के अनुसार, एक अनियंत्रित मोटरसाइकिल सड़क किनारे पलट गई, जिससे उस पर सवार पति-पत्नी और उनके एक साथी को गहरी चोटें आईं। स्थानीय ग्रामीणों की मदद से घायलों को तुरंत पास के प्राथमिक स्वास्थ्य केंद्र ले जाया गया, जहां प्राथमिक उपचार के बाद उन्हें गढ़वा सदर अस्पताल रेफर कर दिया गया है। डॉक्टरों के अनुसार, घायलों में से एक की स्थिति नाजुक बनी हुई है। पुलिस मामले की जांच कर रही है।",
            category: "category-local",
            district: "garhwa",
            imagePrompt: "Accident scene on a rural Indian road, motorcycle on side, ambulance in background, realistic style"
        },
        {
            title: "गढ़वा: इंटरमीडिएट परीक्षा के परिणामों में बेटियों ने मारी बाजी",
            excerpt: "झारखंड एकेडमिक काउंसिल द्वारा जारी इंटरमीडिएट परीक्षा के परिणामों में गढ़वा के धुरकी और भवनाथपुर के छात्र-छात्राओं ने उत्कृष्ट प्रदर्शन किया है।",
            content: "गढ़वा: जैक इंटरमीडिएट परीक्षा 2026 के परिणाम घोषित होने के बाद गढ़वा जिले में खुशी का माहौल है। इस वर्ष भी छात्राओं ने छात्रों की तुलना में बेहतर प्रदर्शन किया है। धुरकी प्रखंड में जितेंद्र यादव ने विज्ञान संकाय में और सविता कुमारी ने कला संकाय में प्रखंड टॉपर बनने का गौरव हासिल किया है। भवनाथपुर के राजकीय उच्च विद्यालय की सुप्रिया कुमारी ने भी शानदार अंक प्राप्त कर विद्यालय का नाम रोशन किया है। जिला शिक्षा पदाधिकारी ने सभी सफल छात्र-छात्राओं को बधाई दी और उनके उज्जवल भविष्य की कामना की है।",
            category: "category-local",
            district: "garhwa",
            imagePrompt: "Indian students celebrating exam results, holding sweets, wearing school uniforms, happy faces"
        },
        {
            title: "जनगणना 2027: खरौंधी में प्रगणकों का गहन प्रशिक्षण शिविर शुरू",
            excerpt: "आगामी 2027 की जनगणना की तैयारियों को लेकर खरौंधी प्रखंड मुख्यालय में प्रगणकों का तीन दिवसीय प्रशिक्षण शुरू हुआ।",
            content: "खरौंधी (गढ़वा): भारत सरकार के निर्देशानुसार आगामी 2027 की जनगणना की जमीनी स्तर पर तैयारी शुरू हो गई है। इसी कड़ी में खरौंधी प्रखंड कार्यालय के सभागार में प्रगणकों और पर्यवेक्षकों के लिए तीन दिवसीय प्रशिक्षण शिविर का आयोजन किया गया। प्रशिक्षण के पहले दिन मास्टर ट्रेनर्स ने प्रगणकों को डिजिटल टूल्स और मोबाइल ऐप के माध्यम से डेटा संकलन करने की बारीकियों को समझाया। बीडीओ ने कहा कि जनगणना एक महत्वपूर्ण राष्ट्रीय कार्य है और इसमें किसी भी प्रकार की त्रुटि बर्दाश्त नहीं की जाएगी। प्रशिक्षण 9 मई तक चलेगा।",
            category: "category-local",
            district: "garhwa",
            imagePrompt: "Government official training workers in a hall, computers and papers, rural India setting"
        },
        {
            title: "चिनिया पुलिस की बड़ी कार्रवाई: दुष्कर्म के दो आरोपी गिरफ्तार",
            excerpt: "गढ़वा जिले के चिनिया थाना क्षेत्र में एक महिला के साथ दुष्कर्म के आरोप में पुलिस ने दो स्थानीय युवकों को गिरफ्तार किया है।",
            content: "चिनिया (गढ़वा): चिनिया पुलिस ने दुष्कर्म के मामले में त्वरित कार्रवाई करते हुए दो आरोपियों को गिरफ्तार कर जेल भेज दिया है। थाना प्रभारी ने बताया कि पीड़िता द्वारा दर्ज कराई गई शिकायत के आधार पर पुलिस ने छापेमारी की और दोनों आरोपियों को धर दबोचा। बताया जाता है कि घटना के बाद आरोपी फरार होने की फिराक में थे, लेकिन पुलिस की सतर्कता से उन्हें पकड़ लिया गया। पुलिस मामले की गहन जांच कर रही है और पीड़िता को मेडिकल जांच के लिए सदर अस्पताल भेजा गया है।",
            category: "category-local",
            district: "garhwa",
            imagePrompt: "Indian police station building, police jeep, serious atmosphere"
        },
        {
            title: "वंदे मातरम का अपमान अब होगा दंडनीय अपराध, कैबिनेट ने दी कानून को मंजूरी",
            excerpt: "केंद्र सरकार ने राष्ट्रीय सम्मान के प्रतीकों की रक्षा के लिए वंदे मातरम का अपमान करने वालों के खिलाफ कड़ी सजा का प्रावधान किया है।",
            content: "नई दिल्ली: राष्ट्रीय सम्मान के प्रति गौरव और संप्रभुता को अक्षुण्ण रखने के उद्देश्य से केंद्र सरकार ने एक बड़ा कदम उठाया है। केंद्रीय कैबिनेट ने 'प्रिवेंशन ऑफ इंसल्ट्स टू नेशनल ऑनर एक्ट' में संशोधन को मंजूरी दे दी है। इसके तहत अब राष्ट्रीय गीत 'वंदे मातरम' का जानबूझकर अपमान करना या उसका अनादर करना दंडनीय अपराध होगा। दोषी पाए जाने पर जेल और भारी जुर्माने का प्रावधान किया गया है। सरकार का कहना है कि राष्ट्रीय प्रतीकों का सम्मान हर नागरिक का मौलिक कर्तव्य है।",
            category: "category-top-story",
            district: "india",
            imagePrompt: "Indian flag and national symbols, cinematic lighting, patriotic theme"
        },
        {
            title: "भारत-वियतनाम के बीच ऐतिहासिक समझौता: 'एन्हांस्ड स्ट्रैटेजिक पार्टनरशिप' पर मुहर",
            excerpt: "प्रधानमंत्री नरेंद्र मोदी और वियतनाम के राष्ट्रपति के बीच हुई वार्ता के बाद दोनों देशों ने रक्षा और व्यापार में सहयोग बढ़ाने पर सहमति जताई।",
            content: "नई दिल्ली: भारत की 'एक्ट ईस्ट' नीति को मजबूती देते हुए प्रधानमंत्री नरेंद्र मोदी और वियतनाम के शीर्ष नेतृत्व के बीच द्विपक्षीय वार्ता सफल रही। दोनों देशों ने अपने संबंधों को 'एन्हांस्ड कॉम्प्रिहेंसिव स्ट्रैटेजिक पार्टनरशिप' में अपग्रेड करने का फैसला लिया है। इस समझौते के तहत रक्षा उत्पादन, समुद्री सुरक्षा और सेमीकंडक्टर टेक्नोलॉजी के क्षेत्र में सहयोग बढ़ाया जाएगा। पीएम मोदी ने कहा कि वियतनाम भारत के लिए इंडो-पैसिफिक क्षेत्र में एक महत्वपूर्ण साझेदार है।",
            category: "category-top-story",
            district: "india",
            imagePrompt: "Modi shaking hands with Vietnamese leader, flags of India and Vietnam, diplomatic meeting"
        },
        {
            title: "CJI की चेतावनी: न्याय प्रणाली में AI का इस्तेमाल गरीबों के खिलाफ हो सकता है पक्षपाती",
            excerpt: "मुख्य न्यायाधीश डी.वाई. चंद्रचूड़ ने कहा कि AI मॉडल में मौजूद पूर्वाग्रह गरीबों के लिए न्याय प्रक्रिया को कठिन बना सकते हैं।",
            content: "नई दिल्ली: भारत के मुख्य न्यायाधीश (CJI) डी.वाई. चंद्रचूड़ ने न्यायपालिका में बढ़ती तकनीक और आर्टिफिशियल इंटेलिजेंस (AI) के उपयोग पर महत्वपूर्ण टिप्पणी की है। एक कानूनी सेमिनार को संबोधित करते हुए उन्होंने कहा कि हालांकि तकनीक न्याय की गति बढ़ा सकती है, लेकिन हमें इसके खतरों के प्रति भी सावधान रहना होगा। उन्होंने चेताया कि यदि AI एल्गोरिदम में डेटा का पूर्वाग्रह (Bias) है, तो यह गरीबों और वंचितों के प्रति भेदभाव कर सकता है। उन्होंने पारदर्शिता और मानवीय निगरानी की आवश्यकता पर बल दिया।",
            category: "category-top-story",
            district: "india",
            imagePrompt: "Legal scales of justice with digital AI circuit lines, court background"
        },
        {
            title: "IPL 2026: सुरक्षा कारणों से बदला गया फाइनल का वेन्यू, अब अहमदाबाद में होगा मुकाबला",
            excerpt: "बीसीसीआई ने घोषणा की है कि आईपीएल 2026 का फाइनल मुकाबला अब बेंगलुरु के बजाय अहमदाबाद के नरेंद्र मोदी स्टेडियम में होगा।",
            content: "अहमदाबाद: क्रिकेट प्रेमियों के लिए एक बड़ा अपडेट आया है। बीसीसीआई ने सुरक्षा कारणों और प्रशासनिक व्यस्तताओं का हवाला देते हुए आईपीएल 2026 के फाइनल मैच के वेन्यू में बदलाव किया है। पहले यह मैच बेंगलुरु के चिन्नास्वामी स्टेडियम में होना था, लेकिन अब यह दुनिया के सबसे बड़े स्टेडियम, नरेंद्र मोदी स्टेडियम, अहमदाबाद में खेला जाएगा। बीसीसीआई के सचिव ने बताया कि दर्शकों की भारी भीड़ और सुरक्षा इंतजामों को देखते हुए यह फैसला लिया गया है। फाइनल की तारीखों में कोई बदलाव नहीं किया गया है।",
            category: "category-viral-news",
            district: "india",
            imagePrompt: "Massive cricket stadium filled with crowd, night match, stadium lights"
        },
        {
            title: "मौसम अपडेट: झारखंड के कई जिलों में भारी बारिश और वज्रपात की चेतावनी",
            excerpt: "मौसम विभाग ने गढ़वा, पलामू और लातेहार समेत कई जिलों में 'येलो अलर्ट' जारी किया है।",
            content: "रांची: झारखंड के लोगों के लिए मौसम से जुड़ी एक बड़ी खबर है। मौसम केंद्र रांची ने अगले 48 घंटों के दौरान राज्य के कई हिस्सों में तेज आंधी और भारी बारिश का पूर्वानुमान जारी किया है। विशेष रूप से पलामू प्रमंडल के गढ़वा और लातेहार जिलों में वज्रपात (ठनका) की प्रबल आशंका है। किसानों को खेतों में न जाने और सुरक्षित स्थानों पर रहने की सलाह दी गई है। तापमान में 3 से 4 डिग्री की गिरावट आने की संभावना है, जिससे लोगों को गर्मी से राहत मिलेगी।",
            category: "category-local",
            district: "jharkhand",
            imagePrompt: "Dark stormy clouds over rural Indian fields, lightning, heavy rain"
        },
        {
            title: "गढ़वा सदर अस्पताल में नई डायलिसिस यूनिट का उद्घाटन",
            excerpt: "स्थानीय विधायक ने सदर अस्पताल में मरीजों की सुविधा के लिए नई डायलिसिस यूनिट का उद्घाटन किया।",
            content: "गढ़वा: जिलावासियों को स्वास्थ्य सेवाओं के क्षेत्र में एक बड़ी सौगात मिली है। गढ़वा सदर अस्पताल में नवनिर्मित अत्याधुनिक डायलिसिस यूनिट का आज भव्य उद्घाटन किया गया। अब किडनी की बीमारियों से जूझ रहे मरीजों को डायलिसिस के लिए रांची या बनारस जाने की मजबूरी नहीं होगी। अस्पताल प्रबंधन ने बताया कि यहां बीपीएल कार्ड धारकों के लिए मुफ्त और अन्य के लिए न्यूनतम दर पर सेवा उपलब्ध होगी। उद्घाटन समारोह में कई गणमान्य लोग उपस्थित थे।",
            category: "category-local",
            district: "garhwa",
            imagePrompt: "Modern hospital ward, dialysis machines, doctors and nurses, clean environment"
        }
    ];

    for (const item of newsItems) {
        try {
            const slug = `${item.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
                .slice(0, 80)}-${Math.random().toString(36).substring(7)}`;

            console.log(`🖼️ Generating image for: ${item.title}`);
            const assetId = await uploadImageFromPollinations(item.imagePrompt, item.title);

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
                        children: [{ _type: 'span', text: item.content, marks: [] }]
                    }
                ],
                category: {
                    _type: 'reference',
                    _ref: item.category
                },
                author: { _type: 'reference', _ref: 'author-admin' },
                district: item.district,
                publishedAt: new Date().toISOString(),
                featureImage: assetId ? {
                    _type: 'image',
                    asset: { _type: "reference", _ref: assetId }
                } : undefined
            };

            await client.create(doc);
            console.log(`✅ Published: ${item.title}`);
        } catch (err) {
            console.error(`❌ Error publishing ${item.title}:`, err.message);
        }
    }

    console.log('✨ All news published successfully!');
}

publishTodayNews();
