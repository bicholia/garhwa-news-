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

const authorId = 'author-admin';

const categories = [
    { title: 'Politics', id: 'category-politics' },
    { title: 'Crime', id: 'category-crime' },
    { title: 'Health', id: 'category-health' },
    { title: 'Education', id: 'category-education' },
    { title: 'Agriculture', id: 'category-agriculture' },
    { title: 'Business', id: 'category-business' },
    { title: 'Sports', id: 'category-sports' },
    { title: 'Public Issues', id: 'category-public-issues' },
    { title: 'Rural Development', id: 'category-rural-development' },
    { title: 'Social Events', id: 'category-social-events' }
];

const topics = [
    { cat: 'category-politics', title: 'गढ़वा विधानसभा चुनाव 2026: राजनीतिक समीकरणों में बड़ा बदलाव' },
    { cat: 'category-politics', title: 'सत्येंद्र नाथ तिवारी का तूफानी दौरा: रंका प्रखंड में जनसंवाद' },
    { cat: 'category-politics', title: 'झामुमो ने शुरू किया बूथ चलो अभियान: संगठन मजबूती पर जोर' },
    { cat: 'category-politics', title: 'भाजपा की जिला कार्यसमिति बैठक: आगामी चुनावों की रणनीति तय' },
    { cat: 'category-politics', title: 'गढ़वा नगर परिषद में विकास कार्यों की समीक्षा: पार्षदों ने उठाए सवाल' },
    { cat: 'category-politics', title: 'झारखंड सरकार की नई नियोजन नीति: युवाओं में जगी उम्मीद' },
    { cat: 'category-politics', title: 'कांग्रेस का हाथ से हाथ जोड़ो अभियान: ग्रामीण इलाकों में दस्तक' },
    { cat: 'category-politics', title: 'आजसू पार्टी का मिलन समारोह: कई दिग्गज शामिल' },
    { cat: 'category-politics', title: 'गढ़वा जिला प्रशासन का जनता दरबार: डीसी ने सुनी समस्याएं' },
    { cat: 'category-politics', title: 'राजनीतिक हलचल: निर्दलीय उम्मीदवारों की दावेदारी से मुकाबला रोचक' },

    { cat: 'category-crime', title: 'मझिआंव में हत्या का खुलासा: पुलिस ने आरोपी को किया गिरफ्तार' },
    { cat: 'category-crime', title: 'गढ़वा सदर में बड़ी डकैती की योजना विफल: 4 अपराधी हथियार के साथ धरे गए' },
    { cat: 'category-crime', title: 'साइबर ठगी का नया तरीका: गढ़वा के कई लोगों के खाते से उड़े पैसे' },
    { cat: 'category-crime', title: 'अवैध शराब भट्टी पर छापेमारी: भारी मात्रा में लहन नष्ट' },
    { cat: 'category-crime', title: 'भवनाथपुर में जमीन विवाद में खूनी संघर्ष: दो परिवारों के बीच मारपीट' },
    { cat: 'category-crime', title: 'पुलिस की बड़ी सफलता: अंतर्राज्यीय चोर गिरोह का पर्दाफाश' },
    { cat: 'category-crime', title: 'रमना प्रखंड में चोरी की घटनाओं से दहशत: ग्रामीणों ने की गश्त बढ़ाने की मांग' },
    { cat: 'category-crime', title: 'नशीले पदार्थों के खिलाफ अभियान: ब्राउन शुगर के साथ एक युवक गिरफ्तार' },
    { cat: 'category-crime', title: 'गढ़वा में सट्टा कारोबार पर अंकुश: पुलिस ने कई ठिकानों पर दबिश दी' },
    { cat: 'category-crime', title: 'सड़क दुर्घटना में फरार ड्राइवर गिरफ्तार: पुलिस ने ट्रक जब्त किया' },

    { cat: 'category-health', title: 'गढ़वा सदर अस्पताल में डायलिसिस यूनिट शुरू: मरीजों को बड़ी राहत' },
    { cat: 'category-health', title: 'जिले में डेंगू का खतरा: स्वास्थ्य विभाग ने जारी किया अलर्ट' },
    { cat: 'category-health', title: 'आयुष्मान कार्ड बनाने में गढ़वा अव्वल: हजारों गरीबों को मिला लाभ' },
    { cat: 'category-health', title: 'नि:शुल्क मोतियाबिंद ऑपरेशन शिविर: 100 बुजुर्गों की लौटी आंखों की रोशनी' },
    { cat: 'category-health', title: 'रंका अनुमंडल अस्पताल में डॉक्टरों की कमी: मरीजों को हो रही परेशानी' },
    { cat: 'category-health', title: 'बच्चों के लिए विशेष टीकाकरण अभियान: घर-घर पहुंच रही टीम' },
    { cat: 'category-health', title: 'गर्मी का कहर: लू से बचाव के लिए स्वास्थ्य विभाग की सलाह' },
    { cat: 'category-health', title: 'गढ़वा में खुला नया ट्रामा सेंटर: दुर्घटना के शिकार लोगों को मिलेगा त्वरित इलाज' },
    { cat: 'category-health', title: 'योग और प्राणायाम पर कार्यशाला: निरोगी रहने के दिए गए टिप्स' },
    { cat: 'category-health', title: 'स्वास्थ्य जांच शिविर: ग्रामीणों को मिली मुफ्त दवाइयां' },

    { cat: 'category-education', title: 'गढ़वा के सरकारी स्कूलों में स्मार्ट क्लास की धूम: बच्चे ले रहे रुचि' },
    { cat: 'category-education', title: 'मैट्रिक परीक्षा के परिणामों में गढ़वा का शानदार प्रदर्शन' },
    { cat: 'category-education', title: 'डिग्री कॉलेज में नामांकन की प्रक्रिया शुरू: छात्रों की भारी भीड़' },
    { cat: 'category-education', title: 'शिक्षा के अधिकार के तहत निजी स्कूलों में मुफ्त दाखिला: आवेदन जारी' },
    { cat: 'category-education', title: 'शिक्षकों की कमी से जूझ रहे प्राथमिक विद्यालय: ग्रामीणों में आक्रोश' },
    { cat: 'category-education', title: 'नई शिक्षा नीति पर जिला स्तरीय संगोष्ठी का आयोजन' },
    { cat: 'category-education', title: 'छात्रवृत्ति राशि का वितरण: मेधावी छात्रों के खिले चेहरे' },
    { cat: 'category-education', title: 'गढ़वा में खुला नया इंजीनियरिंग कॉलेज: तकनीकी शिक्षा को बढ़ावा' },
    { cat: 'category-education', title: 'प्रतियोगिता परीक्षाओं के लिए नि:शुल्क कोचिंग सेंटर का उद्घाटन' },
    { cat: 'category-education', title: 'शिक्षा क्षेत्र में नवाचार: गढ़वा की बिटिया ने बनाया अनोखा मॉडल' },

    { cat: 'category-agriculture', title: 'गढ़वा के किसानों के लिए खुशखबरी: सिंचाई योजनाओं के लिए बजट पास' },
    { cat: 'category-agriculture', title: 'खरीफ फसल की बुवाई शुरू: मानसून की पहली बारिश से किसान खुश' },
    { cat: 'category-agriculture', title: 'उन्नत खेती की तकनीक सीखने इजरायल जाएंगे गढ़वा के किसान' },
    { cat: 'category-agriculture', title: 'खेती में जैविक खाद का उपयोग: मिट्टी की उर्वरता बढ़ाने पर जोर' },
    { cat: 'category-agriculture', title: 'मशरूम उत्पादन बना रोजगार का माध्यम: गढ़वा की महिलाएं बनीं आत्मनिर्भर' },
    { cat: 'category-agriculture', title: 'कृषि मेला में उमड़ी भीड़: आधुनिक मशीनों का प्रदर्शन' },
    { cat: 'category-agriculture', title: 'टपक सिंचाई प्रणाली पर अनुदान: बागवानी फसलों के लिए वरदान' },
    { cat: 'category-agriculture', title: 'धान अधिप्राप्ति केंद्र का शुभारंभ: न्यूनतम समर्थन मूल्य पर होगी खरीद' },
    { cat: 'category-agriculture', title: 'किसानों को मिली केसीसी ऋण की सौगात: साहूकारों के चंगुल से मुक्ति' },
    { cat: 'category-agriculture', title: 'गर्मी में सब्जियों की खेती: गढ़वा के किसान कमा रहे मुनाफा' },

    { cat: 'category-business', title: 'गढ़वा में नए उद्योग लगाने की योजना: सरकार ने मांगी रिपोर्ट' },
    { cat: 'category-business', title: 'व्यापारी संघ की बैठक: बाजार की समस्याओं पर हुई चर्चा' },
    { cat: 'category-business', title: 'जीएसटी पंजीकरण शिविर: व्यापारियों को दी गई जानकारी' },
    { cat: 'category-business', title: 'गढ़वा सदर बाजार में अतिक्रमण हटाने का व्यापारियों ने किया विरोध' },
    { cat: 'category-business', title: 'स्टार्टअप इंडिया के तहत गढ़वा के युवाओं को मिल रही फंडिंग' },
    { cat: 'category-business', title: 'सूक्ष्म एवं लघु उद्योगों के लिए विशेष ऋण योजना' },
    { cat: 'category-business', title: 'ऑनलाइन शॉपिंग के दौर में स्थानीय दुकानदारों की चुनौती' },
    { cat: 'category-business', title: 'गढ़वा के पत्थर उद्योगों पर संकट: रॉयल्टी बढ़ाने का विरोध' },
    { cat: 'category-business', title: 'नए मॉल और शोरूम खुलने से बदला गढ़वा का व्यावसायिक परिदृश्य' },
    { cat: 'category-business', title: 'हस्तशिल्प और खादी को बढ़ावा: प्रदर्शनी में हुई लाखों की बिक्री' },

    { cat: 'category-sports', title: 'गढ़वा फुटबॉल चैंपियनशिप: रोमांचक मुकाबले में रंका ने जीता खिताब' },
    { cat: 'category-sports', title: 'क्रिकेट टूर्नामेंट का आगाज: पहले दिन मझिआंव की धमाकेदार जीत' },
    { cat: 'category-sports', title: 'जिले के एथलीटों ने राज्य स्तरीय स्पर्धा में जीते 5 पदक' },
    { cat: 'category-sports', title: 'खेल प्रतिभाओं को तराशने के लिए स्पोर्ट्स एकेडमी की स्थापना' },
    { cat: 'category-sports', title: 'कबड्डी प्रतियोगिता: ग्रामीण क्षेत्र के युवाओं ने दिखाया दम' },
    { cat: 'category-sports', title: 'इंडोर स्टेडियम में बैडमिंटन टूर्नामेंट: कई जिलों के खिलाड़ी पहुंचे' },
    { cat: 'category-sports', title: 'शतरंज प्रतियोगिता: स्कूली बच्चों के बीच कड़ी टक्कर' },
    { cat: 'category-sports', title: 'गढ़वा की बिटिया का चयन राष्ट्रीय हॉकी टीम के लिए' },
    { cat: 'category-sports', title: 'कुश्ती दंगल: हर साल की तरह इस बार भी उमड़ी भारी भीड़' },
    { cat: 'category-sports', title: 'खेल महोत्सव: मुख्यमंत्री ने खिलाड़ियों को किया सम्मानित' },

    { cat: 'category-public-issues', title: 'गढ़वा शहर में ट्रैफिक की समस्या विकराल: लोग परेशान' },
    { cat: 'category-public-issues', title: 'पेयजल संकट: कई मोहल्लों में 3 दिन से पानी की सप्लाई ठप' },
    { cat: 'category-public-issues', title: 'बिजली कटौती का कहर: उमस भरी गर्मी में रात भर परेशान रहे लोग' },
    { cat: 'category-public-issues', title: 'सड़क की जर्जर हालत: ग्रामीणों ने सड़क जाम कर किया प्रदर्शन' },
    { cat: 'category-public-issues', title: 'नालियों की सफाई न होने से जलजमाव: बीमारियों का खतरा बढ़ा' },
    { cat: 'category-public-issues', title: 'भ्रष्टाचार के खिलाफ एकजुट हुए ग्रामीण: खंड विकास कार्यालय का घेराव' },
    { cat: 'category-public-issues', title: 'राशन वितरण में अनियमितता: कार्डधारकों ने डीलर की शिकायत की' },
    { cat: 'category-public-issues', title: 'शहर में लावारिस पशुओं का आतंक: कई लोग हुए घायल' },
    { cat: 'category-public-issues', title: 'भूमिहीनों को पट्टा देने की प्रक्रिया में देरी: आवेदकों ने किया प्रदर्शन' },
    { cat: 'category-public-issues', title: 'वन भूमि पर अतिक्रमण: प्रशासन ने जारी किया सख्त नोटिस' },

    { cat: 'category-rural-development', title: 'मनरेगा के तहत गांवों में बन रही नई सड़कें: रोजगार भी मिला' },
    { cat: 'category-rural-development', title: 'बिरसा आवास योजना: आदिवासियों को मिल रहे पक्के मकान' },
    { cat: 'category-rural-development', title: 'गांवों में बिजली की रोशनी: सौर ऊर्जा प्लांट लगाने पर जोर' },
    { cat: 'category-rural-development', title: 'कौशल विकास केंद्र से प्रशिक्षित होकर गांव के युवा बन रहे कुशल' },
    { cat: 'category-rural-development', title: 'प्रधानमंत्री ग्राम सड़क योजना: गढ़वा के सुदूर गांवों तक पहुंची सड़क' },
    { cat: 'category-rural-development', title: 'स्वच्छ भारत अभियान: ग्रामीणों ने श्रमदान कर गांव को बनाया ओडीएफ' },
    { cat: 'category-rural-development', title: 'अमृत सरोवर योजना: पुराने तालाबों का हो रहा सौंदर्याीकरण' },
    { cat: 'category-rural-development', title: 'ग्रामीण पुस्तकालय का उद्घाटन: ज्ञान का प्रकाश फैल रहा' },
    { cat: 'category-rural-development', title: 'महिला स्वयं सहायता समूहों को बैंकों से मिला करोड़ों का ऋण' },
    { cat: 'category-rural-development', title: 'डिजिटल विलेज: गढ़वा का एक गांव बना पूरी तरह कैशलेस' },

    { cat: 'category-social-events', title: 'बंशीधर महोत्सव: सांस्कृतिक कार्यक्रमों ने बांधा समां' },
    { cat: 'category-social-events', title: 'विश्वकर्मा पूजा पर भव्य झांकी: श्रद्धा और उल्लास का माहौल' },
    { cat: 'category-social-events', title: 'सामूहिक विवाह सम्मेलन: 51 जोड़ों ने एक दूजे का थामा हाथ' },
    { cat: 'category-social-events', title: 'गढ़वा में साहित्य महोत्सव: कवियों और लेखकों का जमावड़ा' },
    { cat: 'category-social-events', title: 'छठ पूजा की तैयारियां: घाटों की सफाई और सजावट जोरों पर' },
    { cat: 'category-social-events', title: 'इफ्तार पार्टी: सामाजिक समरसता की दिखी अनोखी मिसाल' },
    { cat: 'category-social-events', title: 'होली मिलन समारोह: रंगों के त्यौहार में सराबोर हुए लोग' },
    { cat: 'category-social-events', title: 'श्रीकृष्ण जन्माष्टमी: डंडा और मझिआंव में विशेष पूजा' },
    { cat: 'category-social-events', title: 'रामलीला का मंचन: स्थानीय कलाकारों ने दिखाया हुनर' },
    { cat: 'category-social-events', title: 'आदिवासी उत्सव: पारंपरिक नृत्य और संगीत ने मोह लिया मन' }
];

async function generateArticleBody(title, cat) {
    // Constructing a ~500 word high-quality article body in Hindi
    const intro = `गढ़वा: ${title}। इस खबर ने आज पूरे गढ़वा जिले में चर्चा का विषय बना दिया है। हमारे संवाददाता ने बताया कि यह घटना क्षेत्र की वर्तमान सामाजिक और राजनीतिक स्थिति को दर्शाती है। स्थानीय प्रशासन और आम जनता के बीच इस मुद्दे को लेकर काफी चर्चा हो रही है। इस विस्तृत रिपोर्ट में हम आपको इस मामले के हर पहलू से रूबरू कराएंगे।\n\n`;

    const context = `विस्तार से जानकारी के अनुसार, ${title} के पीछे कई कारण बताए जा रहे हैं। स्थानीय लोगों का कहना है कि यह समस्या पिछले काफी समय से बनी हुई थी, लेकिन अब इसने एक गंभीर रूप ले लिया है। विशेषज्ञों का मानना है कि यदि समय रहते उचित कदम नहीं उठाए गए, तो स्थिति और भी चुनौतीपूर्ण हो सकती है। प्रशासन इस मामले की गहराई से जांच कर रहा है और जल्द ही किसी ठोस नतीजे पर पहुंचने की उम्मीद है।\n\n`;

    const impact = `इस घटना का सबसे बड़ा प्रभाव जिले के विकास कार्यों और आम जनजीवन पर पड़ रहा है। ${title} से जुड़े लोगों का कहना है कि उन्हें काफी उम्मीदें थीं, लेकिन वर्तमान परिस्थितियों ने उन्हें सोचने पर मजबूर कर दिया है। जनप्रतिनिधियों ने भी इस मुद्दे पर अपनी राय रखी है और सरकार से हस्तक्षेप की मांग की है। गढ़वा जिले के विभिन्न क्षेत्रों जैसे रंका, मझिआंव, भवनाथपुर और नगर उंटारी में भी इसका असर देखने को मिल रहा है।\n\n`;

    const quote = `एक स्थानीय निवासी ने बातचीत के दौरान बताया, "हमें उम्मीद है कि प्रशासन हमारी समस्याओं को समझेगा और ${title} के संबंध में न्यायोचित फैसला लेगा। हम लंबे समय से इसके समाधान की प्रतीक्षा कर रहे हैं।" वहीं, प्रशासनिक अधिकारियों ने आश्वासन दिया है कि वे नियमों के तहत ही काम कर रहे हैं और किसी के साथ अन्याय नहीं होने दिया जाएगा। पुलिस विभाग ने भी सुरक्षा व्यवस्था कड़ी कर दी है ताकि कोई अप्रिय घटना न हो।\n\n`;

    const extraDetail = `इस पूरे मामले में एक और महत्वपूर्ण बात यह है कि ${title} का सीधा संबंध जिले की अर्थव्यवस्था और सामाजिक ताने-बाने से है। हाल के दिनों में इस तरह की घटनाओं में वृद्धि देखी गई है, जो कहीं न कहीं जागरूकता की कमी और संसाधनों के अभाव को दर्शाती है। सामाजिक कार्यकर्ताओं ने अपील की है कि लोग धैर्य बनाए रखें और अफवाहों पर ध्यान न दें। जिले के प्रमुख बुद्धिजीवियों ने भी इस विषय पर एक संगोष्ठी आयोजित करने का निर्णय लिया है ताकि एक सार्थक समाधान निकाला जा सके।\n\n`;

    const futureOutlook = `निष्कर्ष के तौर पर, ${title} एक ऐसा मुद्दा है जिसे नजरअंदाज नहीं किया जा सकता। आने वाले समय में यह देखना दिलचस्प होगा कि सरकार और प्रशासन इसके लिए क्या ठोस नीति बनाते हैं। फिलहाल, सभी की निगाहें आने वाले अपडेट्स पर टिकी हैं। हमारी टीम पल-पल की जानकारी एकत्रित कर रही है और जैसे ही कोई नया मोड़ आता है, हम आपको सबसे पहले सूचित करेंगे। आप हमारे पोर्टल से जुड़े रहें और निष्पक्ष खबरों के लिए हमें फॉलो करते रहें।\n\n`;

    const closing = `गढ़वा जिला झारखंड का एक महत्वपूर्ण हिस्सा है और यहाँ की हर छोटी-बड़ी खबर सीधे तौर पर राज्य की प्रगति से जुड़ी होती है। ${title} जैसी खबरें हमें यह याद दिलाती हैं कि अभी भी बहुत कुछ करना बाकी है। हम अपनी पत्रकारिता के माध्यम से जनता की आवाज बुलंद करते रहेंगे और सच्चाई को सामने लाते रहेंगे। धन्यवाद।`;

    return intro + context + impact + quote + extraDetail + futureOutlook + closing;
}

async function run() {
    console.log('🚀 Generating 100 Long-Form Articles...');

    try {
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);
        if (!imageAsset) throw new Error('No image assets found');

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const bodyText = await generateArticleBody(topic.title, topic.cat);

            const slug = `${topic.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
                .slice(0, 80)}-${Date.now()}-${i}`;

            const doc = {
                _type: 'article',
                title: topic.title,
                slug: { _type: 'slug', current: slug },
                excerpt: `${topic.title} के बारे में विस्तृत जानकारी और विश्लेषण। जानें क्या है पूरा मामला और क्या होगा इसका असर।`,
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        children: [{ _type: 'span', text: bodyText }]
                    }
                ],
                category: { _type: 'reference', _ref: topic.cat },
                author: { _type: 'reference', _ref: authorId },
                district: 'garhwa',
                publishedAt: new Date(Date.now() - (i * 3600000)).toISOString(), // Spread over last 100 hours
                featureImage: {
                    _type: 'image',
                    asset: { _type: "reference", _ref: imageAsset._id }
                }
            };

            console.log(`[${i + 1}/100] Creating: ${topic.title}...`);
            await client.create(doc);
        }

        console.log('✅ Success! 100 Long-form articles published.');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

run();
