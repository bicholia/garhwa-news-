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

        const aiPrompt = `आप 'Think India' (थिंक इंडिया न्यूज़ ब्यूरो) के एक सीनियर मैनेजिंग एडिटर हैं।
नीचे दी गई जानकारी या लिंक के विवरण को एक उच्च स्तरीय, प्रमाणिक हिंदी न्यूज़ आर्टिकल में बदलें, जैसा कि NDTV या बड़े न्यूज़ चैनलों पर दिखता है।

जानकारी: ${prompt}

पत्रकारिता के मानक (Journalism Standards):
1. हेडलाइन: बहुत ही गंभीर, प्रभावशाली और सूचनात्मक होनी चाहिए (क्लिकबेट से बचें, तथ्यों पर ध्यान दें)।
2. खबर की लंबाई: खबर कम से कम 500-700 शब्दों की होनी चाहिए। इसमें पूर्ण विवरण, पृष्ठभूमि (Background), और यदि संभव हो तो विशेषज्ञों या सूत्रों के हवाले से जानकारी जोड़ें।
3. टोन (Tone): आवाज़ "Authoritative, Neutral और Fearless" होनी चाहिए। 'थिंक इंडिया ब्यूरो' के अंदाज़ में लिखें।
4. सारांश (Excerpt): 120-150 शब्दों का एक विस्तृत सारांश (Lead Paragraph) लिखें जो पाठक को पूरी खबर का सार दे सके।
5. कैटेगरी: इनमें से एक चुनें: [top-story, crime, administration, city-facilities, disaster-accident, health-education, public-issues, rural-development, social-events, politics, sports, entertainment, jobs]
6. जिला: [india, garhwa, palamu, jharkhand]
7. इमेज प्रॉम्प्ट (Image Prompt): न्यूज़ के हिसाब से एक अंग्रेजी में 'High quality realistic news photography, photorealistic, 8k, professional news camera style' प्रॉम्प्ट लिखें।

आउटपुट JSON फॉर्मेट में दें:
{
  "title": "प्रभावशाली हेडलाइन",
  "excerpt": "विस्तृत 150 शब्दों का सारांश",
  "content": "पूरी खबर का HTML फॉर्मेट (सिर्फ <p>, <br>, <strong> टैग्स इस्तेमाल करें, खबर 500+ शब्दों की हो)",
  "category": "category-slug",
  "district": "district-slug",
  "imagePrompt": "A professional news photograph of [context], ultra-realistic, news reporting style"
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
