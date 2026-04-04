import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt या Link ज़रूरी है' }, { status: 400 })
        }

        // Using gemini-1.5-flash for speed and local context awareness
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const aiPrompt = `आप 'NR Daily News' (गढ़वा पलामू न्यूज़ ब्यूरो) के एक सीनियर एडिटर हैं।
नीचे दी गई जानकारी या लिंक के विवरण को एक संपूर्ण हिंदी न्यूज़ आर्टिकल में बदलें। 

जानकारी: ${prompt}

नियम:
1. हेडलाइन: बहुत आकर्षक, स्थानीय और क्लिक करने लायक होनी चाहिए (गढ़वा/पलामू संदर्भ जोड़ें)।
2. खबर: कम से कम 300-400 शब्दों की हो। तथ्यों को विस्तार से समझाएं। 
3. सारांश: 30-40 शब्दों का एक मजबूत 'Excerpt' जो न्यूज़ ज़ैल में दिखे।
4. कैटेगरी: इनमें से एक चुनें: [top-story, crime, administration, city-facilities, disaster-accident, health-education, public-issues, rural-development, social-events, politics, sports, entertainment, jobs]
5. जिला: [garhwa, palamu, jharkhand]
6. इमेज प्रॉम्प्ट (Image Prompt): न्यूज़ के हिसाब से एक अंग्रेजी में 'High quality realistic news photography' प्रॉम्प्ट लिखें (सिर्फ प्रॉम्प्ट, कोई और टेक्स्ट नहीं)।

आउटपुट सिर्फ शुद्ध JSON फॉर्मेट में दें (बिना किसी बैकथिक्स या कोड ब्लॉक के):
{
  "title": "आकर्षक हेडलाइन",
  "excerpt": "छोटा सारांश",
  "content": "पूरी खबर का HTML फॉर्मेट (सिर्फ <p>, <br>, <strong> टैग्स)",
  "category": "category-slug",
  "district": "district-slug",
  "imagePrompt": "A realistic photo of [news context] in a local Indian city setting, high resolution, news style"
}`

        const result = await model.generateContent(aiPrompt)
        const response = await result.response
        const text = response.text()
        
        // Clean up response if AI included markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('AI से सही जवाब नहीं मिला (JSON format issue)')
        }

        const generatedData = JSON.parse(jsonMatch[0])

        return NextResponse.json(generatedData)
    } catch (error: any) {
        console.error('AI Generation Error:', error)
        return NextResponse.json({ error: error.message || 'AI जनरेशन में समस्या आई' }, { status: 500 })
    }
}
