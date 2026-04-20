import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrubBrandNames, STRICT_SYSTEM_PROMPT } from './safety.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * --- UNIVERSAL AI AUTO-FALLBACK SYSTEM (NEURAL NODES) ---
 */
export async function generateWithNeuralNodes(agentPrompt, inputTitle, inputContent) {
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
                const url = `https://api.airforce.one/v1/chat/completions`;
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
            await new Promise(r => setTimeout(r, 500)); 
        }
    }
    throw new Error('CRITICAL: All Neural Nodes (Core & Fallbacks) are offline.');
}

/** --- AGENT 1: PULSE (The Chief Reporter) --- */
export async function AgentPulse(title, content) {
    const now = new Date();
    const todayHindi = now.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    
    const agentPrompt = `Today: ${todayHindi}
Mission: समाचार को 'Think India' (थिंक इंडिया न्यूज़ ब्यूरो) के लिए एक सीनियर एडिटर के अंदाज़ में लिखें। 
JSON प्रारूप में जवाब दें: {"title": "", "content": "", "leadDistrict": "india", "category": "national"}
- भाषा आधिकारिक, निष्पक्ष और गंभीर होनी चाहिए (NDTV स्टाइल)।
- खबर कम से कम 500-700 शब्दों की हो, जिसमें विस्तार से जानकारी दी गई हो।
- लेख में 'थिंक इंडिया ब्यूरो' का संदर्भ जोड़ें।
- leadDistrict के लिए इनमें से एक चुनें: [india, garhwa, palamu, jharkhand, crime, sports, international].
- category के लिए इनमें से एक चुनें: [national, international, life-update, crime, sports, politics, education, weather].
- यदि खबर रिश्तों, जीवन या रिलेशनशिप पर है तो category: 'life-update' चुनें।
Output: JSON object { title, content, leadDistrict, category }`;

    try {
        const text = await generateWithNeuralNodes(agentPrompt, title, content);
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart === -1 || jsonEnd === 0) throw new Error('No JSON found in response');
        
        const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
        parsed.title = scrubBrandNames(parsed.title || title);
        parsed.content = scrubBrandNames(parsed.content || content);
        parsed.leadDistrict = parsed.leadDistrict || 'india';
        return parsed;
    } catch (err) {
        console.error('AgentPulse Error, falling back:', err);
        return { title: scrubBrandNames(title), content: scrubBrandNames(content), leadDistrict: 'india' };
    }
}

/** --- AGENT 2: STRATOS (SEO & Growth) --- */
export async function AgentStratos(article) {
    const agentPrompt = `Mission: Optimize for Google #1. Detect Micro-Location (Village/Block).\nOutput: JSON { slug, excerpts, seoKeywords, microLocation, tags }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content);
    const parsed = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    parsed.excerpts = scrubBrandNames(parsed.excerpts);
    return parsed;
}

/** --- AGENT 3: ORACLE (Fact-Checker) --- */
export async function AgentOracle(article) {
    const agentPrompt = `Mission: Evaluate news reliability and check for "Competitor Brand Leakage".\nOutput: JSON { reliabilityScore (0-100), sentiment, isSafe (bool), highlights }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content);
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

/** --- AGENT 4: VISION (Creative Director) --- */
export async function AgentVision(article) {
    const agentPrompt = `Mission: Design a High-Detail Cinematic Image Prompt for FLUX.\nTopic: ${article.title}\nOutput: JSON { fluxPrompt, visualStyle }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content);
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

/** --- AGENT 5: SOCIAL (The Publicist) --- */
export async function AgentSocial(article) {
    const agentPrompt = `Mission: Draft specialized viral messages for Telegram/Twitter.\nOutput: JSON { telegramMsg, twitterHook }`;

    const text = await generateWithNeuralNodes(agentPrompt, article.title, article.content);
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}
