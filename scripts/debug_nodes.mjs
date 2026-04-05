import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testNodes() {
    const prompt = "Reply with 'Hello NR' in JSON format: {\"reply\": \"Hello NR\"}";

    console.log("--- NODE 0: GEMINI CORE ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        console.log("Gemini Output:", (await result.response).text());
    } catch (e) { console.error("Gemini Error:", e.message); }

    console.log("\n--- NODE 1: POLLINATIONS ---");
    try {
        const url = `https://text.pollinations.ai/`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'mistral-large', json: true })
        });
        console.log("Pollinations Status:", res.status);
        console.log("Pollinations Output:", await res.text());
    } catch (e) { console.error("Pollinations Error:", e.message); }

    console.log("\n--- NODE 2: HERCAI ---");
    try {
        const url = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(prompt)}`;
        const res = await fetch(url);
        console.log("Hercai Status:", res.status);
        console.log("Hercai Output:", await res.text());
    } catch (e) { console.error("Hercai Error:", e.message); }
}

testNodes();
