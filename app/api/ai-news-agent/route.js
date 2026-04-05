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

// AI AGENTS (Moved to @/lib/neural-agents.js)

async function uploadImageToSanity(imageUrl, title) {

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
        { id: 'VISION_NODE_5', url: `https://api.airforce/v1/image/generations?prompt=${encodeURIComponent(prompt)}&model=flux` },
        { id: 'VISION_NODE_6', url: `https://api.airforce/v1/image/generations?prompt=${encodeURIComponent(prompt)}&model=sdxl` },
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

            const res = await fetch(node.url, { method: 'HEAD' });
            if (res.ok) return node.url;
        } catch (e) {
            console.error(`📸 ${node.id} FAIL: ${e.message}`);
        }
    }
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1280&h=720&q=80`;
}

function createSlug(title) {
  return title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
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

        for (const item of rawNews) {
            if (Date.now() - startTime > 55000) break;

            if (await isNewsExists(createSlug(item.title)) || await isTitleExists(item.title)) {
                console.log(`⏩ Skipping duplicate: ${item.title.substring(0, 30)}...`);
                continue;
            }

            // --- Neural Agency Pipeline ---
            
            // 🎙️ PULSE
            await logAgentAction({ agent_name: 'PULSE', type: 'WRITE', message: `Drafting investigative report: ${item.title.substring(0, 30)}...` });
            const pulseDraft = await AgentPulse(item.title, item.content);
            
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
                district: pulseDraft.leadDistrict || 'garhwa',
                category: { _type: 'reference', _ref: 'category-top-story' },
                publishedAt: new Date().toISOString(),
                seoKeywords: stratosSEO.seoKeywords,
                tags: stratosSEO.tags
            };

            if (assetId) {
                doc.featureImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
            }

            const sanityResult = await client.create(doc);
            const fullImageUrl = assetId ? urlFor(sanityResult.featureImage).url() : '';

            await insertNews({
                title: doc.title,
                slug: finalSlug,
                content: pulseDraft.content,
                excerpt: doc.excerpt,
                image_url: assetId || '',
                category: 'top-story',
                district: doc.district,
                published_at: doc.publishedAt,
                highlights: oracleCheck.highlights || []
            });

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
