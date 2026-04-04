import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import imageUrlBuilder from '@sanity/image-url';
import { fetchNewsSmart } from '@/lib/smartNewsFetcher';
import { insertNews, isNewsExists, cleanupOldNews } from '@/lib/db.js';
import { sendToTelegram } from '@/lib/telegram';
import { logAgentAction, initializeAgentLog } from '@/lib/apiUsageTracker';

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

// --- BRAND SCRUBBER (Hardcoded Protection) ---
function scrubBrandNames(text) {
    if (!text) return text;
    const agencies = [
        /प्रभात खबर/g, /प्रभातखबर/g, /Prabhat Khabar/gi,
        /दैनिक जागरण/g, /जागरण/g, /Dainik Jagran/gi, /Jagran/gi,
        /हिंदुस्तान/g, /हिन्दुस्तान/g, /Live Hindustan/gi, /Hindustan/gi,
        /दैनिक भास्कर/g, /भास्कर/g, /Dainik Bhaskar/gi, /Bhaskar/gi,
        /आज तक/g, /Aaj Tak/gi, /Zee News/gi, /News18/gi, /ETV/gi,
        /अमर उजाला/g, /Amar Ujala/gi, /NDTV/gi, /ABP News/gi
    ];
    let scrubbed = text;
    agencies.forEach(regex => {
        scrubbed = scrubbed.replace(regex, 'NR Daily News Bureau');
    });
    // Remove common source phrases
    scrubbed = scrubbed.replace(/सूत्रों के अनुसार/g, 'हमारे सूत्रों के अनुसार');
    scrubbed = scrubbed.replace(/खबरों के मुताबिक/g, 'NR Daily News की रिपोर्ट के मुताबिक');
    return scrubbed;
}

// --- AGENT 1: PULSE (The Chief Reporter) ---
async function AgentPulse(title, content) {
    const now = new Date();
    const todayHindi = now.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    
    const prompt = `[AGENT: PULSE | ROLE: INVESTIGATIVE REPORTER]
CRITICAL IDENTITY: You are an exclusive investigator for "NR Daily News". 
STRICT RULE: NEVER mention other news agencies (Prabhat Khabar, Jagran, Hindustan, etc.). 
If the source mentions them, REMOVE THEM or act as if NR Daily News discovered the facts.

Today: ${todayHindi}
Mission: Draft a 600-WORD IN-DEPTH INVESTIGATIVE REPORT in Hindi.
Structure: 6 paragraphs (Intro, Core, Context, Impact, Admin, Conclusion).
Tone: Authoritative, Original Reporting, Empathic.

Input: ${title} | ${content}
Output: JSON object { title, content, leadDistrict }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
    const parsed = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    
    // Hard Scrub the output
    parsed.title = scrubBrandNames(parsed.title);
    parsed.content = scrubBrandNames(parsed.content);
    return parsed;
}

// --- AGENT 2: STRATOS (SEO & Growth) ---
async function AgentStratos(article) {
    const prompt = `[AGENT: STRATOS | ROLE: SEO SPECIALIST]
Mission: Optimize for Google #1. Detect Micro-Location (Village/Block).
Input Title/Content: ${article.title}
Output: JSON { slug, excerpts, seoKeywords, microLocation, tags }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
    const parsed = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    parsed.excerpts = scrubBrandNames(parsed.excerpts);
    return parsed;
}

// --- AGENT 3: ORACLE (Fact-Checker) ---
async function AgentOracle(article) {
    const prompt = `[AGENT: ORACLE | ROLE: ACCURACY & SENTIMENT]
Mission: Evaluate news reliability and check for "Competitor Brand Leakage".
STRICT CHECK: If any other agency name (Jagran, Prabhat, etc.) is mentioned, set isSafe=false.

Input: ${article.content}
Output: JSON { reliabilityScore (0-100), sentiment, isSafe (bool), highlights }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

// --- AGENT 4: VISION (Creative Director) ---
async function AgentVision(article) {
    const prompt = `[AGENT: VISION | ROLE: VISUAL ARTIST]
Mission: Design a High-Detail Cinematic Image Prompt for FLUX.
Topic: ${article.title}
Output: JSON { fluxPrompt, visualStyle }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

// --- AGENT 5: SOCIAL (The Publicist) ---
async function AgentSocial(article) {
    const prompt = `[AGENT: SOCIAL | ROLE: PUBLICIST]
Mission: Draft specialized viral messages for Telegram/Twitter.
Input: ${article.title}
Output: JSON { telegramMsg, twitterHook }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
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
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&nologo=true`;
    return aiUrl;
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
                featureImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
                seoKeywords: stratosSEO.seoKeywords,
                tags: stratosSEO.tags
            };

            const sanityResult = await client.create(doc);
            const fullImageUrl = urlFor(sanityResult.featureImage).url();

            await insertNews({
                title: doc.title,
                slug: finalSlug,
                content: pulseDraft.content,
                excerpt: doc.excerpt,
                image_url: assetId,
                category: 'top-story',
                district: doc.district,
                published_at: doc.publishedAt,
                highlights: oracleCheck.highlights
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
