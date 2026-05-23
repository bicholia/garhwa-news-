import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    const modelsToTest = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash-lite-001",
        "gemma-3-27b-it",
        "gemma-4-31b-it",
        "gemini-2.0-flash"
    ];
    for (const m of modelsToTest) {
        console.log(`Testing model: ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Say hello in Hindi");
            const response = await result.response;
            console.log(`✅ Success for ${m}:`, response.text().trim());
            return; // Found a working one!
        } catch (err) {
            console.error(`❌ Failed for ${m}:`, err.message);
        }
    }
}

test();
