import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGen() {
    console.log('Testing Gemini Generation...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Say hello in Hindi");
        const response = await result.response;
        console.log('Gemini Response:', response.text());
    } catch (err) {
        console.error('Generation failed:', err.message);
    }
}

testGen();
