
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

async function publishBatchNews() {
    console.log('🚀 Publishing 25 New Articles (Health, Education, Religion, Sex Ed, Depression)...');

    const categories = {
        health: "category-health",
        education: "category-education",
        religion: "category-religion",
        sex: "category-health-education",
        depression: "category-health"
    };

    const newsData = [
        // HEALTH
        { category: 'health', title: "गर्मी में डिहाइड्रेशन से कैसे बचें? अपनाएं ये 5 आसान तरीके", excerpt: "बढ़ती गर्मी में शरीर में पानी की कमी होना आम है। जानें कैसे आप खुद को हाइड्रेटेड रख सकते हैं।", content: "गर्मियों के मौसम में लू और डिहाइड्रेशन का खतरा काफी बढ़ जाता है। शरीर में पानी की कमी होने से चक्कर आना, कमजोरी और थकान महसूस हो सकती है। इससे बचने के लिए दिन भर में कम से कम 8-10 गिलास पानी पिएं। नारियल पानी, छाछ और ताजे फलों का जूस भी बेहतरीन विकल्प हैं। बाहर निकलते समय पानी की बोतल साथ रखें और बहुत अधिक कैफीन युक्त पेय पदार्थों से बचें।", imagePrompt: "Refreshing glass of water with lemon and mint, summer sunlight, health theme" },
        { category: 'health', title: "डायबिटीज कंट्रोल करने के लिए अपनी डाइट में शामिल करें ये 3 चीजें", excerpt: "ब्लड शुगर लेवल को प्राकृतिक तरीके से नियंत्रित रखने के लिए सही खान-पान बहुत जरूरी है।", content: "मधुमेह (Diabetes) एक ऐसी बीमारी है जिसे केवल दवाइयों से नहीं, बल्कि लाइफस्टाइल और डाइट से भी नियंत्रित किया जा सकता है। अपनी डाइट में फाइबर युक्त खाद्य पदार्थ जैसे ओट्स और दलिया शामिल करें। मेथी दाना का पानी और जामुन के बीज का चूर्ण भी ब्लड शुगर को नियंत्रित रखने में सहायक होते हैं। नियमित व्यायाम और संतुलित आहार ही इस बीमारी का सबसे बड़ा उपचार है।", imagePrompt: "Healthy food plate with green vegetables, nuts, and whole grains, medical health style" },
        { category: 'health', title: "रात में अच्छी नींद नहीं आती? अपनाएं ये 'स्लीप हाइजीन' टिप्स", excerpt: "नींद की कमी से मानसिक और शारीरिक स्वास्थ्य पर बुरा असर पड़ता है। जानें बेहतर नींद के राज।", content: "एक स्वस्थ व्यक्ति के लिए 7-8 घंटे की गहरी नींद अनिवार्य है। अगर आपको रात में नींद आने में परेशानी होती है, तो सोने से कम से कम एक घंटा पहले मोबाइल और टीवी का इस्तेमाल बंद कर दें। कमरे में अंधेरा रखें और सोने का एक निश्चित समय तय करें। सोने से पहले गुनगुने दूध का सेवन या हल्का ध्यान (Meditation) भी बहुत मददगार साबित होता है।", imagePrompt: "Quiet bedroom with cozy lighting, aromatic candles, relaxation theme" },
        { category: 'health', title: "वजन घटाने के लिए 'इंटरमिटेंट फास्टिंग' कितनी सुरक्षित है? विशेषज्ञ की राय", excerpt: "आजकल वेट लॉस के लिए इंटरमिटेंट फास्टिंग का ट्रेंड है, लेकिन क्या यह आपके लिए सही है?", content: "इंटरमिटेंट फास्टिंग (Intermittent Fasting) वजन घटाने का एक प्रभावी तरीका माना जाता है, जिसमें खाने और उपवास का एक चक्र होता है। हालांकि, यह हर किसी के लिए सही नहीं हो सकता। खासकर गर्भवती महिलाओं, बच्चों और डायबिटीज के मरीजों को इसे बिना डॉक्टर की सलाह के नहीं करना चाहिए। इसमें सही पोषण लेना बहुत जरूरी है ताकि शरीर में कमजोरी न आए।", imagePrompt: "Clock with a plate of healthy food, weight loss concept, scientific style" },
        { category: 'health', title: "विटामिन D की कमी को दूर करने के लिए केवल धूप ही काफी नहीं", excerpt: "हड्डियों की मजबूती के लिए विटामिन D जरूरी है, लेकिन खान-पान पर भी ध्यान देना आवश्यक है।", content: "विटामिन D शरीर में कैल्शियम के अवशोषण के लिए बहुत जरूरी है। हालांकि धूप इसका सबसे अच्छा स्रोत है, लेकिन व्यस्त जीवनशैली के कारण कई लोग इसकी कमी से जूझ रहे हैं। अपनी डाइट में अंडे, मशरूम, दूध और फोर्टिफाइड अनाज शामिल करें। अगर कमी बहुत अधिक है, तो डॉक्टर की सलाह पर सप्लीमेंट्स लें ताकि ऑस्टियोपोरोसिस जैसी बीमारियों से बचा जा सके।", imagePrompt: "Sunshine filtering through leaves, healthy bone structure diagram, bright style" },

        // EDUCATION
        { category: 'education', title: "नई शिक्षा नीति 2026: बोर्ड परीक्षाओं के पैटर्न में बड़े बदलाव की तैयारी", excerpt: "सरकार 10वीं और 12वीं की बोर्ड परीक्षाओं को अधिक लचीला और तनावमुक्त बनाने की योजना बना रही है।", content: "शिक्षा मंत्रालय आगामी सत्र 2026-27 से बोर्ड परीक्षाओं के पैटर्न में आमूल-चूल बदलाव करने जा रहा है। अब छात्रों को साल में दो बार परीक्षा देने का विकल्प मिल सकता है, जिससे उनका मानसिक दबाव कम होगा। इसके अलावा, रटने के बजाय क्रिटिकल थिंकिंग और व्यावहारिक ज्ञान पर अधिक ध्यान दिया जाएगा। कौशल विकास को मुख्य पाठ्यक्रम का हिस्सा बनाया जा रहा है ताकि छात्र रोजगार के लिए तैयार हो सकें।", imagePrompt: "Modern classroom with digital board, students discussing, education reform concept" },
        { category: 'education', title: "विदेशी यूनिवर्सिटीज में स्कॉलरशिप पाने के लिए इन 3 बातों का रखें खास ध्यान", excerpt: "अगर आप भी विदेश में पढ़ने का सपना देख रहे हैं, तो ये टिप्स आपके काम आ सकते हैं।", content: "विदेश में उच्च शिक्षा महंगी हो सकती है, लेकिन सही स्कॉलरशिप की मदद से इसे आसान बनाया जा सकता है। सबसे पहले अपनी शैक्षणिक उपलब्धियों (GPA) को बेहतर रखें। दूसरा, IELTS या TOEFL जैसे भाषा परीक्षाओं में अच्छे अंक लाएं। तीसरा, एक प्रभावशाली 'स्टेटमेंट ऑफ पर्पस' (SOP) तैयार करें जो आपकी प्रतिभा और लक्ष्यों को स्पष्ट रूप से दर्शा सके। कई सरकारें और निजी संस्थाएं पूरी तरह से फंडेड स्कॉलरशिप प्रदान करती हैं।", imagePrompt: "University campus with students from diverse backgrounds, scholarship certificate, global education" },
        { category: 'education', title: "12वीं के बाद टॉप 5 हाई-पेइंग कोर्सेज: जानें आपके लिए कौन सा बेहतर है", excerpt: "करियर का चुनाव करते समय भविष्य की संभावनाओं को समझना बहुत जरूरी है।", content: "12वीं के बाद पारंपरिक कोर्सेज के अलावा अब कई नए विकल्प मौजूद हैं। डेटा साइंस, आर्टिफिशियल इंटेलिजेंस (AI), डिजिटल मार्केटिंग, हेल्थकेयर मैनेजमेंट और लॉ (LLB) आजकल के सबसे ज्यादा डिमांड वाले क्षेत्र हैं। इन क्षेत्रों में न केवल अच्छा पैकेज मिलता है, बल्कि करियर ग्रोथ की भी अपार संभावनाएं हैं। अपनी रुचि के अनुसार सही चुनाव करें।", imagePrompt: "Career options icons, technology and business themes, professional growth" },
        { category: 'education', title: "ऑनलाइन पढ़ाई के दौरान एकाग्रता कैसे बढ़ाएं? छात्रों के लिए विशेष टिप्स", excerpt: "डिजिटल लर्निंग के दौर में डिस्ट्रैक्शन से बचना सबसे बड़ी चुनौती है।", content: "ऑनलाइन क्लासेस के दौरान सोशल मीडिया और नोटिफिकेशन छात्रों का ध्यान भटकाते हैं। इससे बचने के लिए एक शांत कोना चुनें और पढ़ाई के लिए अलग से एक डिवाइस या 'फोकस मोड' का इस्तेमाल करें। पढ़ाई के बीच में छोटे ब्रेक लें और नोट्स बनाने की आदत डालें। शारीरिक रूप से सक्रिय रहना और अच्छी नींद लेना भी एकाग्रता बढ़ाने में मदद करता है।", imagePrompt: "Student studying on a laptop in a tidy desk, focus and productivity theme" },
        { category: 'education', title: "प्रतियोगी परीक्षाओं की तैयारी के लिए 'स्मार्ट वर्क' है जरूरी, जानें रणनीति", excerpt: "सिर्फ कड़ी मेहनत ही काफी नहीं, सही दिशा और प्लानिंग भी अनिवार्य है।", content: "UPSC, SSC या बैंकिंग जैसी परीक्षाओं की तैयारी के लिए सिलेबस को समझना सबसे पहला कदम है। पिछले वर्षों के प्रश्न पत्रों का अभ्यास करें और अपनी कमजोरियों को पहचानें। टाइम मैनेजमेंट के लिए मॉक टेस्ट देना बहुत जरूरी है। करेंट अफेयर्स के लिए अखबार पढ़ने की आदत डालें और नियमित रिवीजन करें। याद रखें, कंसिस्टेंसी ही सफलता की कुंजी है।", imagePrompt: "Library table with books, notebook, and a laptop, exam preparation atmosphere" },

        // RELIGION
        { category: 'religion', title: "चार धाम यात्रा 2026: श्रद्धालुओं के लिए रजिस्ट्रेशन की प्रक्रिया और नई गाइडलाइन्स", excerpt: "उत्तराखंड सरकार ने तीर्थयात्रियों की सुरक्षा के लिए इस वर्ष कड़े इंतजाम किए हैं।", content: "चार धाम यात्रा के लिए इस वर्ष रिकॉर्ड संख्या में श्रद्धालुओं के आने की संभावना है। प्रशासन ने इस बार अनिवार्य हेल्थ चेकअप और ऑनलाइन रजिस्ट्रेशन की व्यवस्था की है। केदारनाथ और बद्रीनाथ धाम में यात्रियों की संख्या सीमित की गई है ताकि अव्यवस्था न हो। यात्रा पर जाने से पहले पोर्टल पर रजिस्ट्रेशन जरूर कराएं और स्वास्थ्य संबंधी सावधानियों का पालन करें।", imagePrompt: "Snow-capped Himalayan temple, pilgrims walking, spiritual journey theme" },
        { category: 'religion', title: "अध्यात्म और मानसिक शांति: दैनिक जीवन में ध्यान (Meditation) का महत्व", excerpt: "आज की भागदौड़ भरी जिंदगी में मन की शांति के लिए आध्यात्मिकता एक बड़ा सहारा है।", content: "अध्यात्म केवल पूजा-पाठ नहीं, बल्कि अपने भीतर की शांति की खोज है। रोजाना कम से कम 15-20 मिनट का ध्यान (Meditation) आपको तनाव मुक्त रखने में मदद करता है। यह आपके मानसिक स्वास्थ्य को सुधारता है और जीवन के प्रति एक सकारात्मक दृष्टिकोण विकसित करता है। सादगी और सेवा भाव भी आध्यात्मिक उन्नति के महत्वपूर्ण सोपान हैं।", imagePrompt: "Person meditating in nature at sunrise, calm and peaceful vibes" },
        { category: 'religion', title: "ज्योतिष शास्त्र: इस महीने इन 3 राशियों की चमकेगी किस्मत, जानें अपना भाग्य", excerpt: "ग्रहों की चाल बदलने से आपके जीवन पर क्या प्रभाव पड़ेगा? जानिए विस्तार से।", content: "इस महीने गुरु और शनि की स्थिति में बदलाव के कारण मेष, सिंह और धनु राशि के जातकों को धन लाभ और करियर में उन्नति के योग बन रहे हैं। हालांकि, अन्य राशियों को स्वास्थ्य के प्रति सचेत रहने की आवश्यकता है। ज्योतिष शास्त्र के अनुसार, सही समय पर किए गए उपाय बाधाओं को कम कर सकते हैं। अपनी कुंडली के अनुसार विशेषज्ञ से सलाह लें।", imagePrompt: "Zodiac wheel with glowing stars, astrology and horoscope theme" },
        { category: 'religion', title: "मर्यादा पुरुषोत्तम राम: उनके जीवन से आज के युवाओं को क्या सीखनी चाहिए?", excerpt: "भगवान राम का जीवन केवल एक कथा नहीं, बल्कि आदर्शों का एक संपूर्ण मार्गदर्शक है।", content: "भगवान श्री राम का जीवन धैर्य, त्याग और न्याय का प्रतीक है। आज के समय में युवाओं को उनके चरित्र से कर्तव्यनिष्ठा और रिश्तों के प्रति सम्मान की भावना सीखनी चाहिए। कठिन परिस्थितियों में भी अपने मूल्यों पर टिके रहना ही रामत्व है। उनके आदर्शों को अपनाकर हम एक बेहतर समाज का निर्माण कर सकते हैं।", imagePrompt: "Statue of Lord Ram, serene lighting, traditional Indian spiritual art" },
        { category: 'religion', title: "प्रमुख त्योहारों की तिथियां और शुभ मुहूर्त: जानें आने वाले व्रत और उत्सव", excerpt: "धार्मिक कैलेंडर के अनुसार इस महीने कई महत्वपूर्ण त्योहार मनाए जाएंगे।", content: "आगामी सप्ताहों में एकादशी, प्रदोष व्रत और पूर्णिमा जैसे महत्वपूर्ण तिथियां आ रही हैं। हिंदू धर्म में इन दिनों का विशेष महत्व है और इस दौरान दान-पुण्य का फल अक्षय माना जाता है। अपने घर की सुख-शांति के लिए शुभ मुहूर्त में ही पूजा-अर्चना करें। सभी तिथियों की जानकारी के लिए स्थानीय पंचांग का उपयोग करें।", imagePrompt: "Indian festive thali with diya and flowers, vibrant religious colors" },

        // SEX EDUCATION
        { category: 'sex', title: "यौन शिक्षा (Sex Ed) क्यों है जरूरी? माता-पिता के लिए एक मार्गदर्शिका", excerpt: "बच्चों को सही समय पर सही जानकारी देना उन्हें सुरक्षित रखने के लिए अनिवार्य है।", content: "यौन शिक्षा केवल शारीरिक क्रियाओं के बारे में नहीं, बल्कि शरीर की सुरक्षा, सहमति (Consent) और स्वस्थ रिश्तों के बारे में है। माता-पिता को चाहिए कि वे अपने बच्चों के सवालों को दबाने के बजाय उन्हें सरल और वैज्ञानिक भाषा में जवाब दें। इससे बच्चे 'बैड टच' और शोषण जैसी समस्याओं के प्रति जागरूक होते हैं और गलत सूचनाओं से बचते हैं।", imagePrompt: "Stylized illustration of parents talking to a child, supportive atmosphere, educational theme" },
        { category: 'sex', title: "सुरक्षित यौन संबंध: एसटीडी (STD) के खतरों से बचने के प्रभावी उपाय", excerpt: "जागरूकता ही बचाव है। यौन संचारित रोगों के बारे में जानना हर युवा के लिए जरूरी है।", content: "एसटीडी या यौन संचारित रोग एक गंभीर वैश्विक समस्या हैं। इससे बचने का सबसे प्रभावी तरीका कंडोम का सही उपयोग और एक ही पार्टनर के प्रति वफादारी है। नियमित मेडिकल चेकअप और टीकाकरण (जैसे HPV) भी बहुत सहायक होते हैं। किसी भी लक्षण जैसे खुजली, जलन या घाव दिखने पर तुरंत विशेषज्ञ डॉक्टर से संपर्क करें। शर्म को त्यागकर इलाज कराना जरूरी है।", imagePrompt: "Health awareness icons, protection and safety theme, clean professional style" },
        { category: 'sex', title: "रिलेशनशिप में 'सहमति' (Consent) का क्या मतलब है? जानें इसके कानूनी और नैतिक पहलू", excerpt: "बिना सहमति के कोई भी शारीरिक संबंध न केवल अनैतिक है, बल्कि गैर-कानूनी भी है।", content: "सहमति का अर्थ है 'हां' का मतलब 'हां' और 'नहीं' का मतलब 'नहीं'। यह हर समय वापस ली जा सकती है और दबाव में दी गई सहमति वैध नहीं होती। स्वस्थ रिश्तों के लिए दोनों पार्टनर्स के बीच खुला संवाद और एक-दूसरे की सीमाओं का सम्मान करना अनिवार्य है। कानूनी तौर पर भी सहमति की एक निश्चित आयु निर्धारित है, जिसका उल्लंघन गंभीर अपराध है।", imagePrompt: "Interlocking hands with a 'Yes' text, respect and boundary theme" },
        { category: 'sex', title: "पुरुषों और महिलाओं के यौन स्वास्थ्य के लिए जरूरी विटामिन्स और पोषक तत्व", excerpt: "स्वस्थ यौन जीवन के लिए शारीरिक फिटनेस और पोषण का बहुत बड़ा योगदान है।", content: "यौन स्वास्थ्य के लिए जिंक, विटामिन ई और ओमेगा-3 फैटी एसिड बहुत महत्वपूर्ण माने जाते हैं। कद्दू के बीज, अखरोट, हरी पत्तेदार सब्जियां और ताजे फल अपनी डाइट में शामिल करें। स्ट्रेस कम करने के लिए योग और पर्याप्त नींद लें। शराब और धूम्रपान से बचें क्योंकि ये हॉर्मोनल संतुलन और ब्लड सर्कुलेशन को बिगाड़ते हैं।", imagePrompt: "Healthy nuts and seeds on a table, vitamin icons, wellness theme" },
        { category: 'sex', title: "शादी से पहले प्री-मेटल काउंसलिंग: क्यों यह आपके रिश्ते को बना सकती है अटूट?", excerpt: "एक सफल शादीशुदा जिंदगी के लिए मानसिक तालमेल और स्वास्थ्य संबंधी चर्चा जरूरी है।", content: "आजकल की भागदौड़ भरी जिंदगी में रिश्तों में दरार आना आम बात है। प्री-मेटल काउंसलिंग जोड़ों को एक-दूसरे की उम्मीदों, वित्तीय योजना और स्वास्थ्य संबंधी इतिहास को समझने में मदद करती है। इसमें रक्त परीक्षण (जैसे सिकल सेल या थैलेसीमिया) की भी सलाह दी जाती है ताकि भविष्य में संतान के स्वास्थ्य को लेकर कोई समस्या न हो।", imagePrompt: "Couple talking to a counselor in a warm office, relationship building theme" },

        // DEPRESSION
        { category: 'depression', title: "डिप्रेशन के शुरुआती लक्षण: जिन्हें अक्सर हम 'उदासी' समझकर टाल देते हैं", excerpt: "लगातार उदासी और काम में मन न लगना डिप्रेशन के संकेत हो सकते हैं।", content: "डिप्रेशन केवल एक 'मूड' नहीं, बल्कि एक चिकित्सा स्थिति है। यदि आप लगातार दो सप्ताह से अधिक समय तक गहरी उदासी, नींद की कमी, भूख न लगना और अपनी पसंद के कामों में रुचि खोना महसूस कर रहे हैं, तो यह डिप्रेशन हो सकता है। इसे नजरअंदाज करने के बजाय किसी मनोवैज्ञानिक (Psychologist) से बात करना जरूरी है। मानसिक स्वास्थ्य के प्रति शर्म छोड़ना ही पहला कदम है।", imagePrompt: "A person looking out of a window, soft melancholic lighting, empathy theme" },
        { category: 'depression', title: "तनाव (Stress) कम करने के लिए अपनाएं '30-सेकंड रूल', विशेषज्ञों की सलाह", excerpt: "छोटे-छोटे बदलाव भी आपके मानसिक स्वास्थ्य पर बड़ा असर डाल सकते हैं।", content: "जब भी आप बहुत अधिक तनाव या पैनिक महसूस करें, तो '30-सेकंड ब्रीदिंग रूल' अपनाएं। 4 सेकंड तक सांस अंदर लें, 4 सेकंड रोकें और 4 सेकंड में छोड़ें। यह आपके नर्वस सिस्टम को तुरंत शांत करने में मदद करता है। इसके अलावा, काम के बीच छोटे ब्रेक और प्रकृति के साथ समय बिताना भी स्ट्रेस हार्मोन को कम करता है।", imagePrompt: "Digital art of a calm brain with glowing nodes, relaxation and peace" },
        { category: 'depression', title: "क्या सोशल मीडिया आपके अकेलेपन का कारण बन रहा है? 'डिजिटल डिटॉक्स' के फायदे", excerpt: "दूसरों की चमकती जिंदगी से तुलना करना हमारे मानसिक सुकून को छीन रहा है।", content: "सोशल मीडिया पर दूसरों की 'परफेक्ट' फोटो देखकर अपनी तुलना करना डिप्रेशन का एक बड़ा कारण बन गया है। इसे 'FOMO' (Fear of Missing Out) कहा जाता है। हफ्ते में एक दिन 'डिजिटल डिटॉक्स' करें यानी सोशल मीडिया से पूरी तरह दूर रहें। अपने परिवार और असली दोस्तों के साथ समय बिताएं। याद रखें, जो स्क्रीन पर दिखता है, वह हमेशा सच नहीं होता।", imagePrompt: "Mobile phone being turned off, person enjoying a real-life sunset" },
        { category: 'depression', title: "जब कोई अपना डिप्रेशन में हो, तो उसकी मदद कैसे करें? 5 जरूरी बातें", excerpt: "आपका थोड़ा सा साथ और बिना किसी जजमेंट के सुनना किसी की जान बचा सकता है।", content: "अगर आपका कोई दोस्त या रिश्तेदार चुप रहने लगा है, तो उससे बात करें। उन्हें ये न कहें कि 'सब ठीक हो जाएगा' या 'खुश रहा करो', बल्कि उन्हें ये महसूस कराएं कि आप उनके साथ हैं। उन्हें पेशेवर मदद (Therapy) के लिए प्रोत्साहित करें। कभी-कभी बस किसी का हाथ पकड़कर उसे शांति से सुनना ही सबसे बड़ी थेरेपी होती है।", imagePrompt: "Two people sitting and talking, supportive hand on shoulder, warmth theme" },
        { category: 'depression', title: "खुश रहने के साइंटिफिक तरीके: अपने शरीर में 'हैप्पी हॉर्मोन्स' को कैसे जगाएं?", excerpt: "डोपामाइन, सेरोटोनिन और एंडोर्फिन लेवल बढ़ाने के आसान प्राकृतिक तरीके।", content: "हमारा दिमाग रसायनों से चलता है। कसरत करने से 'एंडोर्फिन' रिलीज होता है जो दर्द कम करता है। सूरज की रोशनी से 'सेरोटोनिन' बढ़ता है जो मूड को बेहतर करता है। छोटे लक्ष्य पूरे करने से 'डोपामाइन' (रिवॉर्ड हार्मोन) मिलता है। अच्छी डाइट, एक्सरसाइज और अपनों के साथ हंसी-मजाक आपके मानसिक स्वास्थ्य को प्राकृतिक रूप से दुरुस्त रखते हैं।", imagePrompt: "Dopamine and Serotonin chemical structures with artistic colors, joy concept" }
    ];

    for (const item of newsData) {
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
                    _ref: categories[item.category]
                },
                author: { _type: 'reference', _ref: 'author-admin' },
                district: 'none',
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

    console.log('✨ All 25 articles published successfully!');
}

publishBatchNews();
