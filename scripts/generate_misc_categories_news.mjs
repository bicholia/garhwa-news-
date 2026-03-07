
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

async function seedMiscNews() {
    console.log('🚀 Generating 50 Miscellaneous Category News Articles...');

    try {
        const authorId = 'author-admin';

        // Fetch all categories to get their IDs
        const categories = await client.fetch(`*[_type == "category"]{_id, slug}`);
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.slug.current] = cat._id;
        });

        const newsData = [
            // Sports (sports)
            { title: "WPL 2026: मुंबई इंडियंस और दिल्ली कैपिटल्स के बीच रोमांचक मुकाबला आज", category: "sports", excerpt: "महिला प्रीमियर लीग में आज दो दिग्गज टीमें आमने-सामने होंगी।" },
            { title: "IPL ऑक्शन 2026: नए खिलाड़ियों पर करोड़ों की बारिश, टीमें तैयार", category: "sports", excerpt: "आईपीएल के अगले सीजन के लिए खिलाड़ियों की नीलामी संपन्न, कई युवा चेहरे चमके।" },
            { title: "पेरिस ओलंपिक की तैयारी: नीरज चोपड़ा ने शुरू किया विशेष अभ्यास सत्र", category: "sports", excerpt: "गोल्डन बॉय नीरज चोपड़ा एक बार फिर देश के लिए पदक जीतने के लिए पसीना बहा रहे हैं।" },
            { title: "भारतीय हॉकी टीम ने एशियन चैंपियंस ट्रॉफी में दर्ज की शानदार जीत", category: "sports", excerpt: "फाइनल में जगह बनाने की ओर भारतीय टीम का एक और मजबूत कदम।" },

            // Technology (technology)
            { title: "AI क्रांति: अब ओपेन एआई ने लॉन्च किया नया सर्च इंजन 'SearchGPT'", category: "technology", excerpt: "गूगल के दबदबे को चुनौती देने के लिए नया प्लेटफॉर्म तैयार, बदल जाएगा सर्च का तरीका।" },
            { title: "iPhone 17 Pro Max के लीक्स आए सामने, कैमरा होगा और भी दमदार", category: "technology", excerpt: "एप्पल के नए फ्लैगशिप फोन में 48MP का पेरिस्कोप लेंस होने की संभावना।" },
            { title: "भारत में शुरू होगी 6G टेस्टिंग, इंटरनेट की रफ्तार होगी सुपरफास्ट", category: "technology", excerpt: "दूरसंचार मंत्रालय ने अगले स्तर की कनेक्टिविटी के लिए रोडमैप तैयार किया।" },
            { title: "क्या रोबोट लेंगे इंसानों की जगह? नए ह्यूमनॉइड रोबोट ने दुनिया को चौंकाया", category: "technology", excerpt: "फैक्ट्रियों और घरों में मदद करने के लिए तैयार हो रहे हैं बुद्धिमान रोबोट।" },

            // International (international)
            { title: "अमेरिका चुनाव 2026: चुनावी सरगर्मियां तेज, प्रमुख उम्मीदवार मैदान में", category: "international", excerpt: "दुनिया की नजरें अगले राष्ट्रपति चुनाव पर, अर्थव्यवस्था और सुरक्षा मुख्य मुद्दे।" },
            { title: "मिडिल ईस्ट में बढ़ता तनाव: शांति वार्ता विफल होने की कगार पर", category: "international", excerpt: "अंतर्राष्ट्रीय समुदाय की अपील के बावजूद संघर्ष जारी, मानवीय संकट गहराया।" },
            { title: "जलवायु परिवर्तन: संयुक्त राष्ट्र की रिपोर्ट में खतरनाक चेतावनी", category: "international", excerpt: "बढ़ते तापमान को रोकने के लिए तुरंत कड़े कदम उठाने की जरूरत, ग्लेशियर पिघल रहे हैं।" },
            { title: "जापान में शक्तिशाली भूकंप के झटके, सुनामी की चेतावनी जारी", category: "international", excerpt: "तटीय इलाकों को खाली कराया गया, जान-माल के नुकसान की आशंका।" },

            // National (national)
            { title: "संसद में बजट सत्र: वित्त मंत्री ने पेश किए विकास के नए लक्ष्य", category: "national", excerpt: "आधारभूत संरचना और शिक्षा पर विशेष ध्यान, युवाओं के लिए नई योजनाओं का ऐलान।" },
            { title: "भारत बना दुनिया की तीसरी सबसे बड़ी अर्थव्यवस्था, नया कीर्तिमान", category: "national", excerpt: "विदेशी निवेश और मजबूत मैन्युफैक्चरिंग सेक्टर ने दी आर्थिक रफ्तार।" },
            { title: "वंदे भारत एक्सप्रेस के 10 नए रूट घोषित, रेलवे का कायाकल्प", category: "national", excerpt: "हाई-स्पीड ट्रेनों से कटेगा सफर का समय, यात्रियों को मिलेगी विश्वस्तरीय सुविधाएं।" },
            { title: "स्वच्छ भारत अभियान: इस बार इंदौर ने फिर मारी बाजी, सबसे साफ शहर घोषित", category: "national", excerpt: "सफाई के मानकों पर खरा उतरने के लिए कई शहरों को मिला सम्मान।" },

            // Business/Finance (business/finance)
            { title: "शेयर बाजार में रिकॉर्ड उछाल: सेंसेक्स और निफ्टी नई ऊंचाई पर", category: "business", excerpt: "आईटी और बैंकिंग शेयरों में जबरदस्त खरीदारी से निवेशकों की चांदी।" },
            { title: "गोल्ड की कीमतों में गिरावट, शादी के सीजन में ग्राहकों को राहत", category: "finance", excerpt: "अंतर्राष्ट्रीय बाजार में उतार-चढ़ाव का असर घरेलू कीमतों पर दिखा।" },
            { title: "स्टार्टअप इंडिया: भारतीय यूनिकॉर्न्स की संख्या 150 के पार", category: "business", excerpt: "तकनीक और नवाचार के दम पर युवा उद्यमी रच रहे हैं इतिहास।" },
            { title: "GST कलेक्शन ने तोड़े पुराने रिकॉर्ड, सरकारी खजाने में भारी बढ़ोतरी", category: "finance", excerpt: "आर्थिक सुधारों और बेहतर निगरानी से बढ़ा राजस्व संग्रह।" },

            // Entertainment (entertainment)
            { title: "ऑस्कर 2026: भारतीय फिल्म को मिला बेस्ट इंटरनेशनल फीचर का नॉमिनेशन", category: "entertainment", excerpt: "पूरा देश गर्व महसूस कर रहा है, फिल्म की कहानी ने दुनिया का दिल जीता।" },
            { title: "शाहरुख खान की अगली एक्शन फिल्म का पोस्टर रिलीज, सोशल मीडिया पर हंगामा", category: "entertainment", excerpt: "किंग खान एक बार फिर बड़े पर्दे पर धमाके के लिए तैयार, फैंस में उत्साह।" },
            { title: "OTT प्लेटफॉर्म्स पर इस हफ्ते रिलीज हो रही हैं ये 5 शानदार वेब सीरीज", category: "entertainment", excerpt: "क्राइम थ्रिलर से लेकर कॉमेडी तक, वीकेंड के लिए पूरा मनोरंजन तैयार।" },
            { title: "दिग्गज गायक का निधन, संगीत जगत में शोक की लहर", category: "entertainment", excerpt: "अपनी मधुर आवाज से करोड़ों दिलों पर राज करने वाले कलाकार ने ली अंतिम सांस।" },

            // Health (health)
            { title: "बदलते मौसम में बढ़ रहा है वायरल का खतरा, डॉक्टर दे रहे संभलने की सलाह", category: "health", excerpt: "इम्युनिटी बढ़ाने के लिए खान-पान में बदलाव और व्यायाम जरूरी।" },
            { title: "योग के फायदे: रोज 20 मिनट का अभ्यास तनाव से दिलाएगा मुक्ति", category: "health", excerpt: "मानसिक और शारीरिक स्वास्थ्य के लिए प्राचीन विद्या बन रही है वरदान।" },
            { title: "भारत में सस्ती होंगी कैंसर की दवाएं, सरकार का बड़ा फैसला", category: "health", excerpt: "मरीजों को आर्थिक बोझ से बचाने के लिए कीमतों पर लगाई गई लगाम।" },
            { title: "जंक फूड का बढ़ता सेवन बन रहा है मोटापे का कारण, विशेषज्ञों की चिंता", category: "health", excerpt: "स्कूली बच्चों में बढ़ रही है लाइफस्टाइल बीमारियों की आशंका।" },

            // Education (education)
            { title: "UPSC सिविल सेवा परीक्षा के नतीजे घोषित, बेटियों ने फिर लहराया परचम", category: "education", excerpt: "टॉप 10 में से 6 स्थान लड़कियों ने किए हासिल, संघर्ष और सफलता की कहानियां।" },
            { title: "नया शिक्षा सत्र: स्कूलों में लागू होगी नई राष्ट्रीय शिक्षा नीति", category: "education", excerpt: "कौशल विकास और मातृभाषा में पढ़ाई पर दिया जाएगा जोर।" },
            { title: "विदेश में पढ़ाई का सपना होगा आसान, शिक्षा मंत्रालय ने साइन किए नए समझौते", category: "education", excerpt: "स्कॉलरशिप और वीजा नियमों में ढील से छात्रों को मिलेगी बड़ी मदद।" },
            { title: "प्रतियोगी परीक्षाओं के लिए सरकार देगी मुफ्त कोचिंग, रजिस्ट्रेशन शुरू", category: "education", excerpt: "आर्थिक रूप से कमजोर छात्रों के लिए अच्छी खबर, अब पैसों की कमी नहीं बनेगी बाधा।" },

            // Lifestyle/Astrology (lifestyle/astrology)
            { title: "आज का राशिफल: मेष से मीन तक, जानें कैसा रहेगा आपका दिन", category: "astrology", excerpt: "ग्रहों की चाल का आपकी किस्मत पर क्या होगा असर, पढ़ें विस्तृत भविष्यफल।" },
            { title: "समर वैकेशन 2026: भारत की ये 5 जगहें हैं घूमने के लिए बेस्ट", category: "lifestyle", excerpt: "गर्मी से राहत और खूबसूरत नजारों का आनंद लेने के लिए आज ही प्लान करें ट्रिप।" },
            { title: "किचन टिप्स: खाने को फ्रेश और टेस्टी रखने के अनोखे तरीके", category: "lifestyle", excerpt: "घरेलू नुस्खों से बचाएं समय और पैसा, खाना बनेगा और भी लजीज।" },
            { title: "वास्तु शास्त्र: घर में शांति और खुशहाली लाने के आसान उपाय", category: "astrology", excerpt: "दिशाओं का सही चुनाव बदल सकता है आपकी जिंदगी की दिशा।" },

            // Agriculture (agriculture)
            { title: "जैविक खेती से बढ़ेगी किसानों की आय, सरकार दे रही है ट्रेनिंग", category: "agriculture", excerpt: "बिना केमिकल के पैदावार बढ़ाने और मिट्टी की उर्वरता बचाने की मुहिम।" },
            { title: "मानसून की भविष्यवाणी: इस साल सामान्य से अधिक बारिश होने की उम्मीद", category: "agriculture", excerpt: "किसानों के चेहरे खिले, खरीफ की फसलों के लिए अच्छा संकेत।" },
            { title: "ड्रोन टेक्नोलॉजी अब खेतों में, कीटनाशक छिड़काव हुआ आसान", category: "agriculture", excerpt: "आधुनिक तकनीक से खेती में कम मेहनत और सटीक परिणाम।" },

            // Auto (auto)
            { title: "Electric Vehicles: भारत में तेजी से बढ़ रही है इलेक्ट्रिक कारों की डिमांड", category: "auto", excerpt: "बढ़ते पेट्रोल के दाम और पर्यावरण संरक्षण के लिए लोग अपना रहे नई तकनीक।" },
            { title: "Tata Safari का नया फेसलिफ्ट मॉडल हुआ पेश, लुक और फीचर्स बेमिसाल", category: "auto", excerpt: "एसयूवी सेगमेंट में हलचल, लग्जरी और मजबूती का नया संगम।" },

            // Religion (religion)
            { title: "अयोध्या राम मंदिर में श्रद्धालुओं की भारी भीड़, सुरक्षा के कड़े इंतजाम", category: "religion", excerpt: "दर्शन के लिए ऑनलाइन स्लॉट बुकिंग अनिवार्य, भक्तों में भारी उत्साह।" },
            { title: "गंगा दशहरा: हज़ारों श्रद्धालुओं ने लगाई आस्था की डुबकी", category: "religion", excerpt: "पवित्र नदियों के घाटों पर उमड़ा जनसैलाब, दान और पुण्य का विशेष महत्व।" },

            // Miscellaneous (transport/administration/development)
            { title: "झारखंड में 100 नए पुलों का निर्माण जल्द, कनेक्टिविटी होगी बेहतर", category: "development", excerpt: "ग्रामीण विकास विभाग ने जारी किया टेंडर, बारिश से पहले काम पूरा करने का लक्ष्य।" },
            { title: "सड़क परिवहन: अब टोल नाकों पर नहीं रुकना होगा, नया जीपीएस सिस्टम लागू", category: "transport", excerpt: "चलती गाड़ियों से कटेगा पैसा, जाम की समस्या से मिलेगी मुक्ति।" },
            { title: "स्मार्ट सिटी मिशन: रांची और धनबाद में बदल रही है शहर की सूरत", category: "development", excerpt: "डिजिटल सुविधाएं और सौंदर्यीकरण का काम अंतिम चरण में।" },
            { title: "प्रशासनिक फेरबदल: राज्य के 20 आईएएस अधिकारियों का तबादला", category: "administration", excerpt: "काम की गति बढ़ाने और सुशासन के लिए सरकार ने उठाए कदम।" },
            { title: "ग्रामीण विकास: हर घर नल जल योजना में झारखंड ने की बड़ी प्रगति", category: "rural-development", excerpt: "सुदूरवर्ती गांवों तक स्वच्छ पेयजल पहुँचाने का मिशन सफल हो रहा है।" },
            { title: "स्थानीय निकाय चुनाव की तारीखों का ऐलान जल्द, वार्ड स्तर पर तैयारी तेज", category: "local", excerpt: "राजनीतिक पार्टियों ने कसी कमर, जनता के बीच पहुँच रहे उम्मीदवार।" },
            { title: "शहर की सुविधाओं में इजाफा: मेदिनीनगर में बनेगा नया बस स्टैंड और पार्क", category: "city-facilities", excerpt: "नगर निगम ने मंजूर किया 10 करोड़ का बजट, अत्याधुनिक सुविधाओं से होगा लैस।" }
        ];

        // Fetch a valid image asset
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);
        if (!imageAsset) {
            throw new Error('No image assets found in Sanity.');
        }

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
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। यह समाचार हमारे विशेष संपादकीय डेस्क द्वारा देश-विदेश की ताज़ा गतिविधियों पर नज़र रखते हुए तैयार किया गया है। हम आप तक सबसे सटीक और महत्वपूर्ण जानकारी पहुँचाने के लिए प्रतिबद्ध हैं। विशेष जानकारी के लिए हमें संपर्क करें।`, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryMap[item.category] || categoryMap['top-story'] },
                author: { _type: 'reference', _ref: authorId },
                district: ['Garhwa', 'Palamu'].includes(item.category) ? item.category.toLowerCase() : 'none',
                featured: Math.random() > 0.8,
                isBreaking: Math.random() > 0.9,
                publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                featureImage: {
                    _type: 'image',
                    asset: { _type: "reference", _ref: imageAsset._id },
                    alt: item.title
                }
            };

            await client.create(doc);
            console.log(`✅ Article created: ${item.title} (${item.category})`);
        }

        console.log('✨ Success! 50 articles created for miscellaneous categories.');
    } catch (err) {
        console.error('❌ Error seeding:', err.message);
    }
}

seedMiscNews();
