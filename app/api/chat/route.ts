import { NextResponse } from 'next/server';
import { getAllNews } from '@/lib/db';

export const maxDuration = 60; // Allow enough time for AI generation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        // 1. Fetch Latest News for Context (The "Memory")
        // We fetch the latest 5 news articles from the database to give the AI context about current events.
        const latestNews = await getAllNews(5);
        
        let newsContext = "Latest News Context for Jharkhand/Garhwa:\n";
        if (latestNews && latestNews.length > 0) {
            latestNews.forEach((news: any, index: number) => {
                newsContext += `${index + 1}. Title: ${news.title || ''}\n   Summary: ${news.excerpt || ''}\n`;
            });
        } else {
            newsContext += "No recent news available at the moment.\n";
        }

        // 2. Build the Full Prompt
        const systemPrompt = `You are 'ThinkIndia.press AI', an advanced and highly intelligent news assistant for the 'ThinkIndia.press' news portal.
Your primary language is Hindi.
You must answer questions accurately, briefly, and professionally.
If a user asks about current events (Jharkhand, India, or International/US news), refer strictly to the following news context if provided. 

${newsContext}

IMAGE GENERATION RULE:
If the user asks for a "photo", "image", "tasveer", or "chitra", you MUST generate a high-quality image using Pollinations AI. 
To do this, simply return a response that starts with "IMAGE_URL:" followed by a URL in this format: https://pollinations.ai/p/[DESCRIPTIVE_PROMPT]?width=1024&height=1024&nologo=true
Example: IMAGE_URL:https://pollinations.ai/p/beautiful_jharkhand_landscape?width=1024&height=1024&nologo=true

Always maintain a journalistic, authoritative, and helpful tone. Keep responses concise (2-4 sentences max).`;

        const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
        const isImageRequest = lastUserMessage.includes('photo') || lastUserMessage.includes('image') || lastUserMessage.includes('तस्वीर') || lastUserMessage.includes('चित्र');

        if (isImageRequest) {
            const imagePrompt = lastUserMessage.replace(/photo|image|तस्वीर|चित्र|दिखाओ|बनाओ|show|create/g, '').trim() || "news coverage";
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true`;
            return NextResponse.json({ reply: `IMAGE_URL:${imageUrl}` });
        }

        // 3. Call Pollinations AI (The "Brain") - 100% Free, Keyless
        const payload = {
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'openai', 
            jsonMode: false
        };

        const aiResponse = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!aiResponse.ok) {
            throw new Error(`AI API responded with status: ${aiResponse.status}`);
        }

        const replyText = await aiResponse.text();

        return NextResponse.json({ reply: replyText });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Sorry, the AI is temporarily unavailable. Please try again later.' }, { status: 500 });
    }
}
