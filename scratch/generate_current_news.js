const { createClient } = require('@sanity/client');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

const imageMap = {
  crime: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\police_investigation_garhwa_1776842172900.png',
  sp: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\sp_garhwa_office_1776842195913.png',
  development: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\garhwa_development_meeting_1776842216198.png',
  politics: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\jharkhand_politics_meeting_1776842448644.png',
  welfare: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\rural_housing_jharkhand_1776842468824.png',
  education: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\garhwa_school_students_1776842490295.png',
  culture: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\jharkhand_culture_dance_1776842510745.png',
  environment: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\jharkhand_forest_fire_1776842532839.png',
  religion: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\ram_navami_garhwa_1776842554541.png',
  health: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\pcos_health_awareness_1776842263721.png',
  tragedy: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\tragedy_news_placeholder_1776842575120.png',
  international: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\justin_trudeau_canada_news_1776842236851.png'
};

const freshNews = [
    { title: "गढ़वा में लू का कहर: प्रशासन ने जारी किया रेड अलर्ट, स्कूलों का समय बदला", cat: "category-disaster-accident", district: "garhwa" },
    { title: "पलामू पुलिस की बड़ी कार्रवाई, अंतरराज्यीय वाहन चोर गिरोह का भंडाफोड़", cat: "category-crime", district: "palamu" },
    { title: "झारखंड में मानसून की दस्तक: अगले 48 घंटों में भारी बारिश की चेतावनी", cat: "category-disaster-accident", district: "jharkhand" },
    { title: "गढ़वा के नए डीसी ने पदभार संभाला, विकास कार्यों में तेजी लाने का निर्देश", cat: "category-administration", district: "garhwa" },
    { title: "मझिआंव में रहस्यमयी बीमारी से दहशत, स्वास्थ्य विभाग की टीम रवाना", cat: "category-health-education", district: "garhwa" },
    { title: "लोकसभा चुनाव: झारखंड में सभी राजनीतिक दलों ने झोंकी पूरी ताकत", cat: "category-politics", district: "jharkhand" },
    { title: "पलामू टाइगर रिजर्व में नया शावक दिखा, पर्यटकों में भारी उत्साह", cat: "category-social-events", district: "palamu" },
    { title: "रंका में ग्रामीणों का प्रदर्शन, तीन महीने से राशन नहीं मिलने का आरोप", cat: "category-public-issues", district: "garhwa" },
    { title: "गढ़वा सदर अस्पताल में नई डायलिसिस मशीन शुरू, मरीजों को मिलेगी राहत", cat: "category-health-education", district: "garhwa" },
    { title: "झारखंड बोर्ड 10वीं का रिजल्ट जल्द, शिक्षा मंत्री ने दी अहम जानकारी", cat: "category-health-education", district: "jharkhand" },
    { title: "भवनाथपुर में जमीन विवाद को लेकर खूनी संघर्ष, आधा दर्जन लोग घायल", cat: "category-crime", district: "garhwa" },
    { title: "किसानों के लिए अच्छी खबर: सरकार ने बढ़ाया धान खरीद का समर्थन मूल्य", cat: "category-agriculture", district: "jharkhand" },
    { title: "गढ़वा में अवैध बालू खनन के खिलाफ बड़ा अभियान, दर्जनों ट्रैक्टर जब्त", cat: "category-crime", district: "garhwa" },
    { title: "पलामू में हाथियों का उत्पात, कई एकड़ फसल बर्बाद, ग्रामीण डरे", cat: "category-disaster-accident", district: "palamu" },
    { title: "झारखंड में नई उद्योग नीति लागू, रोजगार के नए अवसर खुलने की उम्मीद", cat: "category-business", district: "jharkhand" },
    { title: "गढ़वा में भव्य रामनवमी जुलूस की तैयारी, पुलिस छावनी में तब्दील हुआ शहर", cat: "category-religion", district: "garhwa" },
    { title: "कनाडा में भारतीय छात्रों के लिए नया नियम, दूतावास ने जारी की एडवाइजरी", cat: "category-international", district: "national" },
    { title: "झारखंड विधानसभा में विपक्ष का हंगामा, कार्यवाही कल तक के लिए स्थगित", cat: "category-politics", district: "jharkhand" },
    { title: "गढ़वा की होनहार बेटी ने नेशनल एथलेटिक्स में जीता गोल्ड मेडल", cat: "category-sports", district: "garhwa" },
    { title: "डंडई में डायन बिसाही के शक में महिला से मारपीट, तीन गिरफ्तार", cat: "category-crime", district: "garhwa" },
    { title: "पलामू में स्वास्थ्य शिविर का आयोजन, सैकड़ों ग्रामीणों का हुआ मुफ्त इलाज", cat: "category-health-education", district: "palamu" },
    { title: "झारखंड में सड़क दुर्घटनाओं में कमी लाने के लिए नई ट्रैफिक योजना", cat: "category-city-facilities", district: "jharkhand" },
    { title: "गढ़वा में अतिक्रमण हटाओ अभियान शुरू, कई अवैध निर्माण ध्वस्त", cat: "category-administration", district: "garhwa" },
    { title: "प्रधानमंत्री आवास योजना: पलामू में हजारों लाभुकों को मिली घर की चाबी", cat: "category-rural-development", district: "palamu" },
    { title: "गढ़वा में पारंपरिक आदिवासी नृत्य महोत्सव का भव्य आयोजन", cat: "category-social-events", district: "garhwa" }
];

async function generateArticleBody(title) {
    const intro = `गढ़वा ब्यूरो: ${title}। इस खबर ने पूरे क्षेत्र में चर्चा का विषय बना दिया है। हमारे संवाददाता ने बताया कि यह घटना वर्तमान स्थिति को दर्शाती है और प्रशासन अलर्ट पर है। इस विस्तृत रिपोर्ट में हम आपको इस मामले के हर पहलू से रूबरू कराएंगे।\n\n`;
    const context = `विस्तार से जानकारी के अनुसार, इसके पीछे कई कारण बताए जा रहे हैं। स्थानीय लोगों का कहना है कि यह समस्या पिछले काफी समय से बनी हुई थी, लेकिन अब इसने एक नया रूप ले लिया है। विशेषज्ञों का मानना है कि यदि समय रहते उचित कदम नहीं उठाए गए, तो स्थिति बदल सकती है।\n\n`;
    const quote = `एक स्थानीय निवासी ने बातचीत के दौरान बताया, "हमें उम्मीद है कि प्रशासन हमारी समस्याओं को समझेगा और न्यायोचित फैसला लेगा।" वहीं, प्रशासनिक अधिकारियों ने आश्वासन दिया है कि वे नियमों के तहत ही काम कर रहे हैं।\n\n`;
    const closing = `यह खबर हमें यह याद दिलाती है कि अभी भी बहुत कुछ करना बाकी है। हम अपनी पत्रकारिता के माध्यम से जनता की आवाज बुलंद करते रहेंगे और सच्चाई को सामने लाते रहेंगे। देखते रहें NR Daily News।`;
    return intro + context + quote + closing;
}

function determineImageKey(title, cat) {
  const t = title.toLowerCase();
  const c = cat.toLowerCase();
  if (t.includes('पुलिस') || t.includes('गिरफ्तार') || t.includes('चोर') || t.includes('मारपीट') || t.includes('अवैध') || c.includes('crime')) return 'crime';
  if (t.includes('डीसी') || t.includes('एसपी')) return 'sp';
  if (t.includes('विकास') || t.includes('अतिक्रमण') || c.includes('development')) return 'development';
  if (t.includes('चुनाव') || t.includes('राजनीति') || t.includes('विधानसभा') || c.includes('politics')) return 'politics';
  if (t.includes('योजना') || t.includes('राशन') || t.includes('आवास') || c.includes('welfare')) return 'welfare';
  if (t.includes('स्कूल') || t.includes('रिजल्ट') || t.includes('बोर्ड') || c.includes('education')) return 'education';
  if (t.includes('नृत्य') || t.includes('महोत्सव') || c.includes('culture')) return 'culture';
  if (t.includes('लू') || t.includes('मानसून') || t.includes('बारिश') || t.includes('हाथी') || c.includes('environment')) return 'environment';
  if (t.includes('रामनवमी') || t.includes('पूजा') || c.includes('religion')) return 'religion';
  if (t.includes('बीमारी') || t.includes('अस्पताल') || t.includes('स्वास्थ्य') || c.includes('health')) return 'health';
  if (t.includes('दुर्घटना') || t.includes('मौत')) return 'tragedy';
  if (t.includes('कनाडा') || t.includes('अंतर्राष्ट्रीय') || c.includes('international')) return 'international';
  return 'politics'; // fallback
}

async function run() {
  console.log('🚀 Generating Fresh Current News...');
  try {
    const assetCache = {};
    console.log('Uploading AI Images...');
    for (const [key, path] of Object.entries(imageMap)) {
      if (fs.existsSync(path)) {
        const asset = await client.assets.upload('image', fs.createReadStream(path));
        assetCache[key] = asset._id;
      } else {
        console.warn(`Warning: Image file not found at ${path}`);
      }
    }

    const authorId = 'author-admin';

    for (let i = 0; i < freshNews.length; i++) {
        const topic = freshNews[i];
        const bodyText = await generateArticleBody(topic.title);
        const imageKey = determineImageKey(topic.title, topic.cat);
        const assetId = assetCache[imageKey] || Object.values(assetCache)[0]; // fallback to first available

        const slug = `${topic.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\u0900-\u097fa-zA-Z0-9\-]/g, '')
            .slice(0, 80)}-${Date.now()}`;

        const doc = {
            _type: 'article',
            title: topic.title,
            slug: { _type: 'slug', current: slug },
            excerpt: `${topic.title} के बारे में पूरी खबर विस्तार से पढ़ें।`,
            body: [
                {
                    _type: 'block',
                    style: 'normal',
                    children: [{ _type: 'span', text: bodyText }]
                }
            ],
            category: { _type: 'reference', _ref: topic.cat },
            author: { _type: 'reference', _ref: authorId },
            district: topic.district,
            publishedAt: new Date(Date.now() - (i * 3600000)).toISOString(), // Last 24 hours
            featured: i < 5, // Feature the top 5
            isBreaking: i < 3, // Top 3 are breaking
        };

        if (assetId) {
            doc.featureImage = {
                _type: 'image',
                asset: { _type: "reference", _ref: assetId },
                alt: topic.title,
                caption: 'NR Daily News'
            };
        }

        console.log(`[${i + 1}/${freshNews.length}] Publishing: ${topic.title}...`);
        await client.create(doc);
    }

    console.log('✅ Success! Fresh news published globally.');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

run();
