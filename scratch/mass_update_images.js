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
  police: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\police_investigation_garhwa_1776842172900.png',
  sp: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\sp_garhwa_office_1776842195913.png',
  development: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\garhwa_development_meeting_1776842216198.png',
  canada: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\justin_trudeau_canada_news_1776842236851.png',
  health: 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\93918fde-3b6d-4984-b825-03cf703c7d33\\pcos_health_awareness_1776842263721.png'
};

const articleToImage = {
  // Police/Crime
  'dHFGBsvhEmkHrHP72sgTj3': 'police',
  'dHFGBsvhEmkHrHP72q5Jna': 'police',
  // SP
  'dBMFq9dItfmhVExuJ9NLVM': 'sp',
  // Development
  'pg1kzkgrEjayuDjwkPIBOJ': 'development',
  'xTY4K3d8XxEZLgzGDV3H5v': 'development',
  // Canada
  'dBMFq9dItfmhVExuJNtMqW': 'canada',
  'dBMFq9dItfmhVExuJKBOES': 'canada',
  'dBMFq9dItfmhVExuJBfUsq': 'canada',
  'pg1kzkgrEjayuDjwkPIU8l': 'canada',
  'pg1kzkgrEjayuDjwkPDvYx': 'canada',
  'dBMFq9dItfmhVExuJ9GqTq': 'canada',
  '64GpCn800p3NS4svqyLruy': 'canada',
  'pg1kzkgrEjayuDjwkPAPpp': 'canada',
  // Health
  'pg1kzkgrEjayuDjwkPIWvD': 'health',
  '64GpCn800p3NS4svqyM3Ai': 'health',
  'pg1kzkgrEjayuDjwkPDvyV': 'health',
  '64GpCn800p3NS4svqyLutN': 'health',
  'pg1kzkgrEjayuDjwkPAS39': 'health',
  '64GpCn800p3NS4svqtHHNV': 'health'
};

async function updateAllImages() {
  try {
    const assetCache = {};

    for (const [imgKey, imgPath] of Object.entries(imageMap)) {
      console.log(`Uploading ${imgKey} image...`);
      const asset = await client.assets.upload('image', fs.createReadStream(imgPath));
      assetCache[imgKey] = asset._id;
      console.log(`Uploaded ${imgKey}: ${asset._id}`);
    }

    for (const [articleId, imgKey] of Object.entries(articleToImage)) {
      console.log(`Updating article ${articleId} with ${imgKey} image...`);
      await client.patch(articleId)
        .set({
          featureImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetCache[imgKey]
            },
            alt: imgKey + ' image',
            caption: 'News Image'
          }
        })
        .commit();
      console.log(`Updated ${articleId}`);
    }
    console.log('All updates complete!');
  } catch (err) {
    console.error('Error updating images:', err);
  }
}

updateAllImages();
