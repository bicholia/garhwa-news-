import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt या Link ज़रूरी है' }, { status: 400 })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const aiPrompt = `आप 'NR Daily News' (गढ़वा पलामू न्यूज़) के एक एक्सपर्ट न्यूज़ एडिटर हैं।
नीचे दी गई जानकारी (या लिंक के विवरण) को एक बेहतरीन हिंदी न्यूज़ आर्टिकल में बदलें।

जानकारी: ${prompt}

नियम:
1. हेडलाइन (Title) बहुत आकर्षक और स्थानीय होनी चाहिए।
2. खबर कम से कम 300 शब्दों की हो और उसमें जानकारी का विस्तार हो।
3. एक छोटा सारांश (Excerpt) भी लिखें जो 30-40 शब्दों का हो।
4. कैटेगरी (Category) इनमें से चुनें: [crime, politics, jobs, education, local, health, sports, love-affairs, gossip]
5. जिला (District) इनमें से चुनें: [garhwa, palamu, jharkhand]

आउटपुट सिर्फ JSON फॉर्मेट में दें जैसा नीचे दिया गया है (कोई और टेक्स्ट न लिखें):
{
  "title": "आकर्षक हेडलाइन",
  "excerpt": "छोटा सारांश",
  "content": "पूरी खबर का HTML फॉर्मेट (सिर्फ <p>, <br>, <strong> टैग्स का इस्तेमाल करें)",
  "category": "category-slug",
  "district": "district-slug"
}`

        const result = await model.generateContent(aiPrompt)
        const response = await result.response
        const text = response.text()
        
        // Extract JSON from response (sometimes AI wraps it in markdown blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('AI से सही जवाब नहीं मिला')
        }

        const generatedData = JSON.parse(jsonMatch[0])

        return NextResponse.json(generatedData)
    } catch (error: any) {
        console.error('AI Generation Error:', error)
        return NextResponse.json({ error: error.message || 'AI जनरेशन में समस्या आई' }, { status: 500 })
    }
}
