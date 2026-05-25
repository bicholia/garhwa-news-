import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const articles = [
    // Society
    {
        _type: 'article',
        title: '"शर्मा जी का बेटा डॉक्टर बन गया, तुम भी बनो": झूठी शान के चक्कर में कैसे बच्चों की बलि ले रहा है कोटा?',
        slug: { _type: 'slug', current: 'kota-suicides-log-kya-kahenge' },
        excerpt: 'अपने अधूरे सपने और समाज में दिखावे के लिए बच्चों को रेस के घोड़े में तब्दील कर रहे हैं पेरेंट्स, मानसिक दबाव से टूट रहे हैं मासूम',
        content: '<p>कई बार यह बच्चों का सपना नहीं, बल्कि माता-पिता की वह झूठी शान होती है जो वे समाज के सामने पेश करना चाहते हैं। आज कोटा जैसे कोचिंग हब में जो बच्चे अपनी जान दे रहे हैं, उनके पीछे सिर्फ पढ़ाई का दबाव नहीं, बल्कि "लोग क्या कहेंगे" का खौफ है। पेरेंट्स अपने बच्चों से ज्यादा रिश्तेदारों की परवाह करते हैं।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    {
        _type: 'article',
        title: '"म्यूजिक और स्पोर्ट्स में कोई फ्यूचर नहीं, चुपचाप सीए की तैयारी करो": समाज की इज़्ज़त ने मार दिए लाखों हुनर',
        slug: { _type: 'slug', current: 'killing-passion-for-respectability' },
        excerpt: 'सेफ करियर और रिश्तेदारों के सामने रूतबा दिखाने के लिए बच्चों के असली सपनों को पैरों तले रौंद रहे हैं पेरेंट्स',
        content: '<p>भारत में आज भी अगर कोई बच्चा कहता है कि वह पेंटर, राइटर या म्यूज़िशियन बनना चाहता है, तो उसे बेकार समझ लिया जाता है। माता-पिता को डर लगता है कि जब रिश्तेदार पूछेंगे "बेटा क्या कर रहा है?", तो वे क्या जवाब देंगे? समाज की इसी झूठी इज़्ज़त को बचाने के लिए बच्चों को ज़बरदस्ती डॉक्टर या इंजीनियर की तैयारी में धकेल दिया जाता है।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    // Astrology
    {
        _type: 'article',
        title: 'देवगुरु बृहस्पति करने जा रहे हैं महा-गोचर: इन 3 राशियों की चमकने वाली है किस्मत, बरसेगा छप्पर फाड़ धन',
        slug: { _type: 'slug', current: 'jupiter-transit-2026-astrology' },
        excerpt: '12 साल बाद बन रहा है यह दुर्लभ राजयोग, जानें आपके करियर और पारिवारिक जीवन पर क्या पड़ेगा इसका असर?',
        content: '<p>ज्योतिष शास्त्र में देवगुरु बृहस्पति को सुख, ज्ञान और धन का कारक माना जाता है। 12 सालों के लंबे अंतराल के बाद बृहस्पति एक ऐसा दुर्लभ गज़केसरी योग बनाने जा रहे हैं, जो मेष, सिंह और धनु राशि वाले जातकों के लिए स्वर्णिम रहने वाला है। रुकी हुई शादियां तय होंगी और व्यापार में भारी मुनाफा होगा।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    {
        _type: 'article',
        title: 'क्या आपके घर में भी टिकता नहीं है पैसा? वास्तु शास्त्र के इन 5 आसान उपायों से दूर करें घर की नेगेटिव एनर्जी',
        slug: { _type: 'slug', current: 'vastu-shastra-tips-for-money' },
        excerpt: 'मुख्य द्वार से लेकर बेडरूम तक, छोटी-छोटी गलतियां बन सकती हैं कंगाली का कारण; जानें घर में सुख-शांति लाने के अचूक उपाय',
        content: '<p>वास्तु विशेषज्ञों का कहना है कि घर का मुख्य द्वार हमेशा साफ और रोशनी से भरा होना चाहिए। कभी भी उत्तर दिशा की ओर पैर करके न सोएं और टूटे हुए शीशे या बंद घड़ियों को तुरंत घर से बाहर निकाल दें। रोज़ शाम को घर के मुख्य दरवाज़े पर घी का दीपक जलाने से घर में मां लक्ष्मी का स्थायी वास होता है।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    // Relationships
    {
        _type: 'article',
        title: 'लव मैरिज या अरेंज मैरिज: भारत में आखिर कौन सी शादी होती है सबसे ज़्यादा सफल? जानें क्या कहते हैं आंकड़े',
        slug: { _type: 'slug', current: 'love-marriage-vs-arrange-marriage-success-rate' },
        excerpt: 'तलाक के बढ़ते मामलों के बीच युवाओं के मन में सबसे बड़ा सवाल, क्या माता-पिता की पसंद वाकई होती है सबसे बेहतर?',
        content: '<p>भारत में आज भी 80% से ज़्यादा शादियां अरेंज होती हैं और इनमें तलाक की दर दुनिया में सबसे कम है। विशेषज्ञों का मानना है कि अरेंज मैरिज में पार्टनर से उम्मीदें कम होती हैं और परिवार का पूरा सपोर्ट मिलता है, जो मुश्किल समय में रिश्ते को टूटने से बचाता है।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    {
        _type: 'article',
        title: 'न पूरी तरह लव, न पूरी तरह अरेंज: आज के युवा क्यों चुन रहे हैं "अरेंज-लव मैरिज" का नया रास्ता?',
        slug: { _type: 'slug', current: 'arranged-love-marriage-trend' },
        excerpt: 'मैट्रिमोनियल साइट्स से ढूंढते हैं पार्टनर, फिर 6 महीने डेटिंग के बाद लेते हैं शादी का फैसला',
        content: '<p>आजकल का युवा बहुत प्रैक्टिकल हो गया है। इसी से जन्म हुआ है एक नए ट्रेंड का— "अरेंज-लव मैरिज"। इसमें माता-पिता या मैट्रिमोनियल साइट्स के ज़रिए लड़का-लड़की मिलते हैं। इसके बाद दोनों परिवारों की सहमति से उन्हें 6 से 8 महीने का डेटिंग का समय दिया जाता है ताकि वे एक-दूसरे को समझ सकें।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    // Spirituality / Mind
    {
        _type: 'article',
        title: 'चंचल मन को कैसे करें काबू? भगवद्गीता में भगवान कृष्ण ने बताया है मन को गुलाम बनाने का सबसे अचूक तरीका',
        slug: { _type: 'slug', current: 'mind-control-bhagavad-gita-krishna' },
        excerpt: '"अभ्यास और वैराग्य" के बिना मन को वश में करना है हवा को मुट्ठी में पकड़ने जैसा, जानें अर्जुन के सवाल पर क्या था कृष्ण का जवाब',
        content: '<p>महाभारत के युद्ध में जब अर्जुन ने भगवान कृष्ण से पूछा कि मन को काबू कैसे करूं? तब कृष्ण ने जवाब दिया कि इसे दो हथियारों से जीता जा सकता है— "अभ्यास" और "वैराग्य"। जब मन भटके, तो उसे वापस लक्ष्य पर लाएं और मन को भटकाने वाले सुखों से दूरी बनाएं।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    },
    {
        _type: 'article',
        title: 'क्या मंदिर जाना और पूजा-पाठ करना ही असली धर्म है? स्वामी विवेकानंद के अनुसार जानें धर्म की वास्तविक परिभाषा',
        slug: { _type: 'slug', current: 'what-is-real-dharma-swami-vivekananda' },
        excerpt: 'दूसरों की मदद करना पुण्य है, और दूसरों को दुख देना ही पाप— दिखावे के कर्मकांडों से ऊपर है इंसानियत का धर्म',
        content: '<p>स्वामी विवेकानंद के अनुसार असली धर्म यह नहीं है कि आप रोज़ मंदिर जाएं। असली धर्म है— भूखे को खाना खिलाना, किसी रोते हुए को हंसाना और अपने स्वार्थ से ऊपर उठकर समाज के लिए काम करना। धर्म कोई लिबास नहीं, बल्कि आपके जीने का तरीका है।</p>',
        category: { _type: 'reference', _ref: 'category-local' },
        district: 'National',
        publishedAt: new Date().toISOString()
    }
];

async function run() {
    console.log('Publishing batch 2 of chat news to Sanity...');
    for (const doc of articles) {
        try {
            const existing = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug: doc.slug.current });
            if (existing) {
                console.log('⏩ Skipping (exists):', doc.title.substring(0, 40));
                continue;
            }
            const result = await client.create(doc);
            console.log('✅ Published:', result.title.substring(0, 40));
        } catch (err) {
            console.error('❌ Error publishing:', err.message);
        }
    }
    console.log('Done publishing chat news batch 2!');
}

run();
