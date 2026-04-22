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

const imagePath = 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\youtube_village_board_garhwa_1776842047049.png';

async function publishNews() {
  try {
    console.log('Uploading image...');
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: 'youtube_village_board.png'
    });
    console.log('Image uploaded:', imageAsset._id);

    const article = {
      _type: 'article',
      title: "'यूट्यूब वाला गांव' बना चर्चा का विषय: गढ़वा के रंका में 'यूट्यूब मोड़' का बोर्ड हुआ वायरल",
      slug: {
        _type: 'slug',
        current: 'youtube-wala-gaon-garhwa-viral-news-' + Date.now()
      },
      excerpt: "गढ़वा जिले के रंका प्रखंड का बहाहारा गांव इन दिनों सोशल मीडिया पर खूब चर्चा बटोर रहा है। यहाँ के एक मोड़ को 'यूट्यूब मोड़' के नाम से जाना जा रहा है, जिसका आधिकारिक बोर्ड भी लगा दिया गया है।",
      featureImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          ref: imageAsset._id
        },
        alt: 'यूट्यूब मोड़ बोर्ड गढ़वा',
        caption: 'गढ़वा के रंका प्रखंड में लगा यूट्यूब मोड़ का बोर्ड'
      },
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "झारखंड के गढ़वा जिले से एक दिलचस्प खबर सामने आ रही है। रंका प्रखंड के बहाहारा गांव में एक सड़क के मोड़ को स्थानीय लोगों ने 'यूट्यूब मोड़' का नाम दिया है। यह नाम सोशल मीडिया पर इतना वायरल हुआ कि अब वहां आधिकारिक तौर पर एक बोर्ड लगा दिया गया है।"
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "ग्रामीणों का कहना है कि इस इलाके में नेटवर्क की अच्छी सुविधा होने के कारण युवा यहाँ बैठकर यूट्यूब वीडियो देखते और अपलोड करते थे, जिसके बाद इस जगह का नाम ही यूट्यूब मोड़ पड़ गया। अब यह जगह सेल्फी प्वाइंट बन गई है और दूर-दूर से लोग इसे देखने आ रहे हैं।"
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ],
      category: {
        _type: 'reference',
        _ref: 'category-local'
      },
      author: {
        _type: 'reference',
        _ref: 'author-admin'
      },
      district: 'garhwa',
      location: 'रंका, गढ़वा',
      featured: true,
      isBreaking: true,
      publishedAt: new Date().toISOString()
    };

    console.log('Creating article...');
    const result = await client.create(article);
    console.log('Article published successfully:', result._id);

    // Also update breaking news ticker
    console.log('Updating breaking news ticker...');
    await client.create({
      _type: 'breakingNews',
      text: "गढ़वा: रंका का 'बहाहारा' बना झारखंड का पहला यूट्यूब वाला गांव, 'यूट्यूब मोड़' का बोर्ड वायरल",
      active: true,
      publishedAt: new Date().toISOString(),
      href: `/news/${result.slug.current}`
    });
    console.log('Breaking news ticker updated.');

  } catch (err) {
    console.error('Error publishing news:', err);
  }
}

publishNews();
