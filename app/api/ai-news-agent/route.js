import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import imageUrlBuilder from '@sanity/image-url';
import { fetchNewsSmart } from '@/lib/smartNewsFetcher';
import { insertNews, isNewsExists, isTitleExists, cleanupOldNews } from '@/lib/db.js';
import { sendToTelegram } from '@/lib/telegram';
import { logAgentAction, initializeAgentLog } from '@/lib/apiUsageTracker';
import { scrubBrandNames } from '@/lib/safety';
import { AgentPulse, AgentStratos, AgentOracle, AgentVision, AgentSocial } from '@/lib/neural-agents';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic'; 

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const builder = imageUrlBuilder(client);
function urlFor(source) {
    return builder.image(source);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI AGENTS (Shared logic moved to @/lib/neural-agents.js)

async function uploadImageToSanity(imageUrl, title) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const arrayBuffer = await response.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(arrayBuffer), {
            filename: `${createSlug(title)}.jpg`
        });
        return asset._id;
    } catch (error) {
        return null;
    }
}

async function getImageUrl(prompt) {
    const aiNodes = [
        { id: 'VISION_NODE_1', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&nologo=true` },
        { id: 'VISION_NODE_2', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=midjourney&nologo=true` },
        { id: 'VISION_NODE_3', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=sdxl&nologo=true` },
        { id: 'VISION_NODE_4', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=dall-e-3&nologo=true` },
        { id: 'VISION_NODE_5', url: `https://api.airforce.one/v1/image/generations?prompt=${encodeURIComponent(prompt)}&model=flux` },
        { id: 'VISION_NODE_6', url: `https://api.airforce.one/v1/image/generations?prompt=${encodeURIComponent(prompt)}&model=sdxl` },
        { id: 'VISION_NODE_7', url: `https://hercai.onrender.com/v3/text2image?prompt=${encodeURIComponent(prompt)}` },
        { id: 'VISION_NODE_8', url: `https://hercai.onrender.com/v3-beta/text2image?prompt=${encodeURIComponent(prompt)}` },
        { id: 'VISION_NODE_9', url: `https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5` }
    ];

    for (const node of aiNodes) {
        try {
            console.log(`🎨 [VISION SYNC] Synthesizing via ${node.id}...`);
            let finalUrl = node.url;
            
            // Fix: Refined skipping logic for HF
            if (node.id === 'VISION_NODE_9') {
                console.log(`📡 [VISION] VISION_NODE_9 (HF) requires buffer mode. Skipping...`);
                continue; 
            }

            const res = await fetch(node.url, { method: 'GET' });
            if (res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType?.startsWith('image/') || node.url.includes('pollinations.ai')) return node.url;
            }
        } catch (e) {
            console.error(`📸 ${node.id} FAIL: ${e.message}`);
        }
    }
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1280&h=720&q=80`;
}

function createSlug(title) {
  // BUG-05 FIX: Support Hindi characters by allowing Unicode in slug or using timestamp
  const base = title.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, '') // Keep alphanumeric and Hindi chars
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return `${base}-${Math.random().toString(36).substring(7)}`;
}

export async function GET(request) {
    const startTime = Date.now();
    const isManual = request.nextUrl.searchParams.get('manual') === 'true';
    const authHeader = request.headers.get('authorization');
    
    if (!isManual && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let publishedCount = 0;
    try {
        await initializeAgentLog();
        const rawNews = await fetchNewsSmart();
        
        // request-level cache to prevent processing the same thing twice in one run
        const processedTitles = new Set();

        for (const item of rawNews) {
            if (Date.now() - startTime > 55000) break;

            const normTitle = item.title.toLowerCase().replace(/\s+/g, '');
            if (processedTitles.has(normTitle)) continue;
            processedTitles.add(normTitle);

            const slugBase = createSlug(item.title)
            if (await isNewsExists(slugBase) || await isTitleExists(item.title)) {
                console.log(`⏩ Skipping duplicate: ${item.title.substring(0, 30)}...`);
                continue;
            }

            // --- Neural Agency Pipeline ---
            
            // 🎙️ PULSE
            await logAgentAction({ agent_name: 'PULSE', type: 'WRITE', message: `Drafting investigative report: ${item.title.substring(0, 30)}...` });
            const pulseDraft = await AgentPulse(item.title, item.content);
            
            // Re-check title after AI generation in case it changed drastically or another process finished
            if (await isTitleExists(pulseDraft.title)) {
                console.log(`⏩ Skipping duplicate (Post-AI): ${pulseDraft.title.substring(0, 30)}...`);
                continue;
            }

            // 📈 STRATOS
            await logAgentAction({ agent_name: 'STRATOS', type: 'WRITE', message: `Optimizing architecture & SEO for: ${pulseDraft.title.substring(0, 30)}` });
            const stratosSEO = await AgentStratos(pulseDraft);
            
            // ⚖️ ORACLE
            await logAgentAction({ agent_name: 'ORACLE', type: 'WRITE', message: `Verifying news accuracy & safety score.` });
            const oracleCheck = await AgentOracle(pulseDraft);
            if (!oracleCheck.isSafe) {
                await logAgentAction({ agent_name: 'ORACLE', type: 'FAIL', message: `News discarded: Safety/Policy violation detected.`, status: 'error' });
                continue;
            }

            // 🎨 VISION
            await logAgentAction({ agent_name: 'VISION', type: 'IMAGE', message: `Synthesizing cinematic visuals for the story.` });
            const visionArt = await AgentVision(pulseDraft);
            const imgUrl = await getImageUrl(visionArt.fluxPrompt);
            const assetId = await uploadImageToSanity(imgUrl, pulseDraft.title);
            if (!assetId) {
                await logAgentAction({ agent_name: 'VISION', type: 'FAIL', message: `Image synchronization failed. Continuing with text-only...`, status: 'warning' });
            }

            // 📲 SOCIAL
            await logAgentAction({ agent_name: 'SOCIAL', type: 'TELEGRAM', message: `Preparing distribution hook for Telegram & Social channels.` });
            const socialHook = await AgentSocial(pulseDraft);

            // PUBLICATION
            const detectedCategory = pulseDraft.category || item.category || 'top-story';
            const finalSlug = `${stratosSEO.slug}-${Math.random().toString(36).substring(7)}`;
            
            const doc = {
                _type: 'article',
                title: pulseDraft.title,
                slug: { _type: 'slug', current: finalSlug },
                excerpt: stratosSEO.excerpts,
                body: pulseDraft.content.split('\n').filter(p => p.trim()).map(p => ({
                    _type: 'block',
                    children: [{ _type: 'span', text: p.trim() }]
                })),
                district: pulseDraft.leadDistrict || item.district || 'garhwa',
                category: { _type: 'reference', _ref: `category-${detectedCategory}` }, // Pattern-based ref
                publishedAt: new Date().toISOString(),
                seoKeywords: stratosSEO.seoKeywords,
                tags: stratosSEO.tags
            };

            if (assetId) {
                doc.featureImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
            }

            let fullImageUrl = '';
            try {
                const sanityResult = await client.create(doc);
                fullImageUrl = assetId ? urlFor(sanityResult.featureImage).url() : '';

                await insertNews({
                    title: doc.title,
                    slug: finalSlug,
                    content: pulseDraft.content,
                    excerpt: doc.excerpt,
                    image_url: fullImageUrl || '',
                    category: detectedCategory,
                    district: doc.district,
                    published_at: doc.publishedAt,
                    highlights: oracleCheck.highlights || []
                });
            } catch (sanityErr) {
                console.warn('Sanity Create/DB Insert Fail:', sanityErr.message);
                // If it's a reference error for category, we try one last time with a safe fallback
                if (sanityErr.message.includes('reference') || sanityErr.message.includes('category')) {
                    doc.category = { _type: 'reference', _ref: 'category-top-story' };
                    try {
                       const sanityResult = await client.create(doc);
                       fullImageUrl = assetId ? urlFor(sanityResult.featureImage).url() : '';
                       await insertNews({
                           title: doc.title,
                           slug: finalSlug,
                           content: pulseDraft.content,
                           excerpt: doc.excerpt,
                           image_url: fullImageUrl || '',
                           category: detectedCategory,
                           district: doc.district,
                           published_at: doc.publishedAt,
                           highlights: oracleCheck.highlights || []
                       });
                    } catch (e) {
                       console.error('Final publication fallback failed:', e.message);
                       continue;
                    }
                } else {
                    continue; // Skip this item on other errors
                }
            }

            await sendToTelegram({
                ...doc,
                image_url: fullImageUrl,
                customMsg: socialHook.telegramMsg,
                category: { name: 'SUPER AGENT REPORT' }
            });

            await logAgentAction({ agent_name: 'PULSE', type: 'PUBLISH', message: `MISSION SUCCESS: Multi-Agent collaborative report live on all channels.` });
            publishedCount++;
            if (publishedCount >= 5) break; 
        }

        return NextResponse.json({ success: true, published: publishedCount });
    } catch (error) {
        console.error('Agent Orchestration Error:', error);
        await logAgentAction({ agent_name: 'ORACLE', type: 'FAIL', message: `Orchestration Fatal Error: ${error.message}`, status: 'error' });
        
        return NextResponse.json({ 
            success: false, 
            published: publishedCount,
            error: error.message,
            duration: `${(Date.now() - startTime) / 1000}s`
        }, { status: 500 });
    }
}

export async function OPTIONS() { return NextResponse.json({}, { status: 200 }); }
