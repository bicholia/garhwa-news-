
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

async function seedLoveNews() {
    console.log('💖 Generating Love & Relationship News Articles...');

    try {
        const authorId = 'author-admin';
        const categoryId = 'category-love-relationships'; // Based on previous query

        const loveNews = [
            { title: "7 साल का प्यार, फिर इकरार: बचपन के दोस्तों ने रचाई अनोखी शादी", excerpt: "दोनों के परिवार वाले पहले खिलाफ थे, लेकिन अंत में प्यार की जीत हुई।" },
            { title: "सोशल मीडिया पर हुई दोस्ती, समंदर पार से शादी करने पहुंची विदेशी दुल्हन", excerpt: "फेसबुक पर शुरू हुई लव स्टोरी अब शादी के पवित्र बंधन में बंध गई है।" },
            { title: "शादी के मंडप से प्रेमी संग फरार हुई दुल्हन, इलाके में चर्चा का विषय", excerpt: "दुल्हे और बारातियों के होश उड़ गए जब उन्हें पता चला कि दुल्हन पीछे के रास्ते से निकल गई।" },
            { title: "50 साल की उम्र में मिला सच्चा साथी, समाज की परवाह किए बिना की शादी", excerpt: "अकेलेपन से जूझ रहे बुजुर्ग जोड़े ने एक नई शुरुआत की मिसाल पेश की।" },
            { title: "प्रेम प्रसंग में बाधा बना परिवार, प्रेमी जोड़े ने नदी में कूदकर दी जान", excerpt: "इलाके में शोक की लहर, पुलिस मामले की जांच में जुटी।" },
            { title: "प्यार या धोखा? ऑनलाइन डेटिंग ऐप पर हुआ 5 लाख का फ्रॉड", excerpt: "सावधान! मीठी बातों में फंसकर महिला ने गंवा दिए अपनी जिंदगी भर की कमाई।" },
            { title: "रिश्तों में कड़वाहट दूर करने के 5 अचूक उपाय, आज ही आज़माएं", excerpt: "पार्टनर के साथ तालमेल बिठाने और पुरानी यादें ताजा करने के लिए विशेषज्ञ की सलाह।" },
            { title: "Valentine's Day Special: इस बार गिफ्ट नहीं, इन यादों के साथ मनाएं जश्न", excerpt: "कुछ अनोखे तरीके जिससे आप अपने पार्टनर का दिल दोबारा जीत सकते हैं।" },
            { title: "बॉलीवुड एक्ट्रेस और क्रिकेटर के अफेयर की चर्चाएं तेज, साथ आए नजर", excerpt: "लंदन की सड़कों पर हाथ में हाथ डाले घूमते दिखे दोनों स्टार्स।" },
            { title: "शादी के 10 साल बाद पति को पता चला पत्नी का पुराना राज, मचा कोहराम", excerpt: "धोखे और फरेब की इस अजीब कहानी ने सबको हैरान कर दिया।" },
            { title: "मूक-बधिर जोड़े की शादी ने जीता सबका दिल, बिना बोले बयां किया प्यार", excerpt: "इशारों-इशारों में हुई बातें अब सात फेरों तक पहुँच गई हैं।" },
            { title: "प्रेमिका को पाने के लिए प्रेमी ने पार की सरहद, गैरकानूनी तरीके से घुसा देश में", excerpt: "सुरक्षा एजेंसियों ने किया गिरफ्तार, अब जेल में कट रहे हैं दिन।" },
            { title: "Long Distance Relationship को कैसे बनाएं मजबूत? पढ़ें ये जरूरी टिप्स", excerpt: "दूरी को प्यार के बीच न आने दें, तकनीक का इस्तेमाल और विश्वास है सबसे जरूरी।" },
            { title: "क्या आपको भी है 'First Sight Love'? विज्ञान क्या कहता है इसके बारे में", excerpt: "पहली नजर के प्यार के पीछे का मनोवैज्ञानिक सच जानकर चौंक जाएंगे आप।" },
            { title: "लिव-इन रिलेशनशिप में हत्या: प्रेमी ने गुस्से में आकर प्रेमिका को उतारा मौत के घाट", excerpt: "दिल्ली जैसी वारदात एक बार फिर दोहराई गई, इलाके में दहशत।" },
            { title: "मंदिर में हुआ अनोखा विवाह: भगवान को साक्षी मानकर एक हुए प्रेमी जोड़े", excerpt: "बिना किसी तामझाम के सादगी भरी शादी की हर तरफ तारीफ हो रही है।" },
            { title: "Ex-Lover के शादी में पहुँच कर प्रेमी ने मचाया बवाल, पुलिस बुलानी पड़ी", excerpt: "पुराना प्यार भुलाना भारी पड़ा, बारातियों के साथ हुई जमकर हाथापाई।" },
            { title: "वैवाहिक जीवन में खुशहाली के लिए वास्तु के ये बदलाव हैं बहुत जरूरी", excerpt: "बेडरूम की दिशा और रंग कैसे आपके रिश्ते को प्रभावित करते हैं, जानें यहाँ।" },
            { title: "क्या आपका पार्टनर आपसे कुछ छुपा रहा है? इन संकेतों से पहचानें सच्चाई", excerpt: "रिश्ते में शक की जगह अगर विश्वास कम हो रहा है, तो ये लेख आपके लिए है।" },
            { title: "प्यार के लिए छोड़ा राजपाठ: इस राजकुमार ने आम लड़की के लिए दी बड़ी कुर्बानी", excerpt: "इतिहास फिर दोहराया गया, सत्ता से बड़ी है प्रेम की ताकत।" }
        ];

        // Fetch a valid image asset
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);

        for (const item of loveNews) {
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
                        children: [{ _type: 'span', text: `${item.title}: ${item.excerpt}। प्यार और रिश्तों की जटिलताओं और उनकी सुंदरता को बयां करती यह विशेष रिपोर्ट हमारे न्यूज़ ब्यूरो द्वारा तैयार की गई है।`, marks: [] }]
                    }
                ],
                category: { _type: 'reference', _ref: categoryId },
                author: { _type: 'reference', _ref: authorId },
                district: 'none',
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
            console.log(`✅ Love Story created: ${item.title}`);
        }

        console.log('✨ Success! 20 love & relationship stories live.');
    } catch (err) {
        console.error('❌ Error seeding:', err.message);
    }
}

seedLoveNews();
