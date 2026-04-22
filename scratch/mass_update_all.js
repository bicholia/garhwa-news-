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

async function updateAllMissing() {
  try {
    const assetCache = {};
    for (const [key, path] of Object.entries(imageMap)) {
      console.log(`Uploading ${key}...`);
      const asset = await client.assets.upload('image', fs.createReadStream(path));
      assetCache[key] = asset._id;
    }

    const articles = await client.fetch('*[_type == "article" && !defined(featureImage)]{ _id, title, category }');
    console.log(`Found ${articles.length} articles to update.`);

    for (const article of articles) {
      let key = 'development'; // Default
      const title = article.title.toLowerCase();
      const cat = (typeof article.category === 'string' ? article.category : (article.category?._ref || '')).toLowerCase();

      if (title.includes('पुलिस') || title.includes('चोरी') || title.includes('गिरफ्तार') || title.includes('साइबर') || title.includes('नशा') || cat.includes('crime')) key = 'crime';
      else if (title.includes('एसपी') || title.includes('कमान')) key = 'sp';
      else if (title.includes('बैठक') || title.includes('लालू') || title.includes('जदयू') || title.includes('भाजपा') || title.includes('वोटर') || cat.includes('politics')) key = 'politics';
      else if (title.includes('आवास') || title.includes('योजना') || cat.includes('welfare')) key = 'welfare';
      else if (title.includes('स्कूल') || title.includes('छात्रा') || title.includes('पेपर लीक') || title.includes('iti') || cat.includes('education')) key = 'education';
      else if (title.includes('अस्पताल') || title.includes('दवा') || title.includes('स्वास्थ्य') || title.includes('डायलिसिस') || cat.includes('health')) key = 'health';
      else if (title.includes('झुमइर') || title.includes('संस्कृति') || title.includes('गुफाओं') || cat.includes('culture')) key = 'culture';
      else if (title.includes('आग') || title.includes('बारिश') || title.includes('मानसून') || title.includes('मौसम') || cat.includes('environment') || cat.includes('weather')) key = 'environment';
      else if (title.includes('रामनवमी') || title.includes('जुलूस') || title.includes('पथराव') || title.includes('तनाव') || cat.includes('religion')) key = 'religion';
      else if (title.includes('मौत') || title.includes('मृत्यु') || title.includes('चिराग') || title.includes('पलायन')) key = 'tragedy';
      else if (title.includes('कनाडा') || title.includes('अमेरिका') || title.includes('प्रधानमंत्री') || cat.includes('international')) key = 'international';

      console.log(`Updating "${article.title}" [${key}]`);
      await client.patch(article._id)
        .set({
          featureImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetCache[key] },
            alt: article.title,
            caption: 'समाचार चित्र'
          }
        })
        .commit();
    }
    console.log('Update complete!');
  } catch (err) {
    console.error(err);
  }
}

updateAllMissing();
