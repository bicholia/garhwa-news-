import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log('Testing Gemini API Key:', process.env.GEMINI_API_KEY?.substring(0, 5) + '...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("こんにちは - say hello in Hindi");
        const response = await result.response;
        console.log('Gemini Response test passed. Output:', response.text());
    } catch (err) {
        console.error('Generation failed (this might be due to quota limits):', err.message);
    }
}

test();
