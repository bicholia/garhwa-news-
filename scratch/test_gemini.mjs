
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGeminiModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];

    for (const modelName of models) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, respond with 'OK'");
            const text = (await result.response).text().trim();
            console.log(`${modelName} Success: ${text}`);
        } catch (e) {
            console.error(`${modelName} Fail: ${e.message}`);
        }
    }
}

testGeminiModels();
