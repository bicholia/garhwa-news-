import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import imageUrlBuilder from '@sanity/image-url';
import { fetchNewsSmart } from '@/lib/smartNewsFetcher';
import { insertNews, isNewsExists, cleanupOldNews } from '@/lib/db.js';
import { sendToTelegram } from '@/lib/telegram';
import { logAgentAction, initializeAgentLog } from '@/lib/apiUsageTracker';
import { scrubBrandNames, STRICT_SYSTEM_PROMPT } from '@/lib/safety';

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

// --- UNIVERSAL AI AUTO-FALLBACK SYSTEM (NEURAL NODES) ---
async function generateWithNeuralNodes(agentPrompt, inputTitle, inputContent, defaultGeminiModel = "gemini-2.0-flash") {
    const fullPrompt = `${STRICT_SYSTEM_PROMPT}\n\n${agentPrompt}\n\nTitle: ${inputTitle}\nContent: ${inputContent}`;
    
    const aiNodes = [
        { id: "GEMINI_CORE", type: "gemini", name: "gemini-2.0-flash" },
        { id: "NEURAL_NODE_1", type: "pollinations", name: "openai" }, 
        { id: "NEURAL_NODE_2", type: "pollinations", name: "mistral" },
        { id: "NEURAL_NODE_3", type: "pollinations", name: "llama" },
        { id: "NEURAL_NODE_4", type: "pollinations", name: "nemotron" },
        { id: "NEURAL_NODE_5", type: "pollinations", name: "p1" },
        { id: "NEURAL_NODE_6", type: "airforce", name: "gpt-4o-mini" },
        { id: "NEURAL_NODE_7", type: "airforce", name: "llama-3-8b" },
        { id: "NEURAL_NODE_8", type: "airforce", name: "deepseek-llm-67b-chat" },
        { id: "NEURAL_NODE_9", type: "hercai", name: "v3" },
        { id: "NEURAL_NODE_10", type: "pollinations", name: "searchgpt" }
    ];

    for (const node of aiNodes) {
        try {
            console.log(`📡 [NEURAL SYNC] Engaging ${node.id} (${node.name})...`);
            if (node.type === "gemini") {
                const model = genAI.getGenerativeModel({ model: node.name });
                const result = await model.generateContent(fullPrompt);
                const text = (await result.response).text().trim();
                if (!text) throw new Error('Empty Gemini response');
                return text;
            } else if (node.type === "pollinations") {
                const url = `https://text.pollinations.ai/`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        messages: [
                            { role: 'system', content: STRICT_SYSTEM_PROMPT }, 
                            { role: 'user', content: `${agentPrompt}\n\nTitle: ${inputTitle}\nContent: ${inputContent}\nIMPORTANT: Respond with ONLY a valid JSON object.` }
                        ], 
                        model: node.name,
                        jsonMode: true 
                    })
                });
                if (!res.ok) throw new Error(`Pollinations Status ${res.status}`);
                return await res.text();
            } else if (node.type === "airforce") {
                const url = `https://api.airforce/v1/chat/completions`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: STRICT_SYSTEM_PROMPT },
                            { role: 'user', content: fullPrompt }
                        ],
                        model: node.name
                    })
                });
                if (!res.ok) throw new Error(`Airforce Status ${res.status}`);
                const data = await res.json();
                return data.choices[0].message.content;
            } else if (node.type === "hercai") {
                const url = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(fullPrompt)}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Hercai Status ${res.status}`);
                const data = await res.json();
                return data.reply || data.content;
            }
        } catch (err) {
            console.error(`❌ ${node.id} FAIL: ${err.message}`);
            await new Promise(r => setTimeout(r, 500)); // Quick 500ms wait between nodes
        }
    }
    throw new Error('CRITICAL: All Neural Nodes (Core & Fallbacks) are offline.');
}

// --- BRAND SCRUBBER (Delegated to @/lib/safety) ---

// --- AGENT 1: PULSE (The Chief Reporter) ---
async function AgentPulse(title, content) {
    const now = new Date();
    const todayHindi = now.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    
    const agentPrompt = `Today: ${todayHindi}\nMission: Draft a 600-WORD IN-DEPTH INVESTIGATIVE REPORT in Hindi.\nStructure: 6 paragraphs (Intro, Core, Context, Impact, Admin, Conclusion).\nTone: Authoritative, Original Reporting, Empathic.\nOutput: JSON object { title, content, leadDistrict }`;

    const text = await generateWithNeuralNodes(agentPrompt, title, content, "gemini-2.0-flash");
    const parsed = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    
    // Hard Scrub the output
    parsed.title = scrubBrandNames(parsed.title);
    parsed.content = scrubBrandNames(parsed.content);
    return parsed;
}

// --- AGENT 2: STRATOS (SEO & Growth) ---
async function AgentStratos(article) {
    const agentPrompt = `Mission: Optimize for Google #1. Detect Micro-Location (Village/Block).\nOutput: JSON { slug, excerpts, seoKeywords, microLocation, tags }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content, "gemini-2.0-flash");
    const parsed = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    parsed.excerpts = scrubBrandNames(parsed.excerpts);
    return parsed;
}

// --- AGENT 3: ORACLE (Fact-Checker) ---
async function AgentOracle(article) {
    const agentPrompt = `Mission: Evaluate news reliability and check for "Competitor Brand Leakage".\nOutput: JSON { reliabilityScore (0-100), sentiment, isSafe (bool), highlights }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content, "gemini-1.5-flash");
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

// --- AGENT 4: VISION (Creative Director) ---
async function AgentVision(article) {
    const agentPrompt = `Mission: Design a High-Detail Cinematic Image Prompt for FLUX.\nTopic: ${article.title}\nOutput: JSON { fluxPrompt, visualStyle }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content, "gemini-1.5-flash");
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

// --- AGENT 5: SOCIAL (The Publicist) ---
async function AgentSocial(article) {
    const agentPrompt = `Mission: Draft specialized viral messages for Telegram/Twitter.\nOutput: JSON { telegramMsg, twitterHook }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content, "gemini-1.5-flash");
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

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
            
            // Special handling for HuggingFace (POST request)
            if (node.id === 'VISION_NODE_9') {
                 const res = await fetch(node.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ inputs: prompt })
                });
                if (!res.ok) throw new Error('HF Node Error');
                // Return a generic fallback if direct HF buffer isn't easily linkable here
                // For direct Sanity upload we'd need the buffer, but getImageUrl returns URL
                throw new Error('HF Buffer mode reserved'); 
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

            if (await isNewsExists(createSlug(item.title))) continue;

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
