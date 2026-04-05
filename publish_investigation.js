import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentPulse, AgentStratos } from './lib/neural-agents.js';
import { insertNews } from './lib/db.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function publishInvestigativeReport() {
    console.log('🚀 Publishing Investigative Ground Report to Sanity & Postgres...');
    
    const rawScript = `
    “जरा देखिए—ये गढ़वा के मदरसा रोड में स्थित एक स्कूल का हाल है।
    हमारी टीम ने लगभग 3 महीने तक इस स्कूल के एक गार्ड पर नजर रखी और उसकी हरकतों की पूरी सच्चाई सामने लाई।
    दोस्तों, यह गार्ड बच्चों के साथ बेहद गलत व्यवहार करता है।
    यह बच्चों को जातिसूचक शब्दों से बुलाता है, जैसे कि ‘ये मेहता…’ और कई बार ऐसे-ऐसे शब्दों का इस्तेमाल करता है कि बताना भी मुश्किल है।
    यह बच्चों को धमकी देता है— ‘मार के चमड़ी उखाड़ देंगे’, ‘मार के बामे-बाम कर देंगे’, ‘मारेंगे तो देह फट जाएगा’।
    पूरे स्कूल में डंडा पूरी तरह से बंद है, वहीं यह गार्ड बच्चों को बांस की छड़ी से मारता है।
    यह कई बार शराब पीकर भी स्कूल आया है। (कम से कम दो बार)।
    स्कूल के भीतर किताबों की बिक्री से जुड़ी गतिविधियों में शामिल है, जो स्थानीय नियमों के अनुरूप नहीं है।
    31 मार्च को रिपोर्टर ने देखा कि स्कूल में गढ़वा DC के ऑर्डर के बावजूद बुक्स सेल होते हैं।
    स्कूल गार्ड का नाम: राज कुमार पाण्डेय, स्कूल: ब्राइट फ्यूचर स्कूल, वाइस प्रिंसिपल: सुनीता पटेल।”
    `;

    try {
        // 1. AI Synthesis (using fallbacks)
        console.log('📡 [NEURAL SYNC] Synthesizing 600-word investigative piece...');
        const pulseReport = await AgentPulse("Bright Future School Investigation Garhwa", rawScript);

        // 2. Upload Image
        console.log('📸 Uploading Guard Image...');
        const imagePath = join('C:', 'Users', 'LAPPY PLUS', '.gemini', 'antigravity', 'brain', 'a1c9ec32-bc69-4925-86ea-1619c0ae204a', 'media__1775386179418.png');
        const imageData = fs.readFileSync(imagePath);
        const asset = await client.assets.upload('image', imageData, {
            filename: `guard-report-${Date.now()}.png`
        });

        // 3. Create Sanity Document
        const title = "एक्सक्लूसिव ग्राउंड रिपोर्ट: गढ़वा के Bright Future School में बच्चों की सुरक्षा और नियमों के साथ खिलवाड़?";
        const slug = `exclusive-bright-future-school-investigation-${Date.now()}`;
        
        const sanityDoc = {
            _type: 'article',
            title: title,
            slug: { _type: 'slug', current: slug },
            excerpt: "हमारी टीम की 3 महीने की जांच में सामने आया स्कूल के भीतर का काला सच। गार्ड राज कुमार पाण्डेय द्वारा बच्चों का शोषण और अवैध बुक्स बिक्री का मामला।",
            content: pulseReport.content, // Using expanded content
            body: [
                {
                    _type: 'block',
                    style: 'normal',
                    markDefs: [],
                    children: [{ _type: 'span', text: pulseReport.content, marks: [] }]
                }
            ],
            category: { _type: 'reference', _ref: 'category-crime' }, // Linking to crime category for gravity
            district: 'garhwa',
            publishedAt: new Date().toISOString(),
            featured: true,
            isBreaking: true,
            featureImage: {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: asset._id
                },
                alt: "Bright Future School Guard Investigation"
            }
        };

        const sanityResult = await client.create(sanityDoc);
        console.log('✅ Sanity Document Created:', sanityResult._id);

        // 4. Try Postgres Insert
        try {
            await insertNews({
                title,
                slug,
                content: pulseReport.content,
                excerpt: sanityDoc.excerpt,
                image_url: asset.url,
                category: "local",
                district: "garhwa",
                published_at: sanityDoc.publishedAt,
                is_published: true,
                is_promoted: true,
                priority: 200
            });
            console.log('✅ Postgres Sync Complete.');
        } catch (e) {
            console.warn('⚠️ Postgres Sync Failed (using Sanity fallback):', e.message);
        }

        console.log('✨ All Done. News is live on the Hero Banner!');
        
    } catch (error) {
        console.error('❌ Final Publish Failed:', error.message);
    }
}

publishInvestigativeReport();
