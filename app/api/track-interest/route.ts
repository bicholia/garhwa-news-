import { NextResponse } from 'next/server'
import { sendNotificationToTelegram } from '@/lib/telegram'

export async function POST(request: Request) {
    try {
        const { event } = await request.json()

        if (event === 'cookie_accept') {
            const timestamp = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' })
            const message = `🍪 **नई कुकी स्वीकृति (New Cookie Accept!)**\n\nएक पाठक ने वेबसाइट की कुकीज़ स्वीकार की हैं और साइट में रुचि दिखाई है।\n\n🕒 समय: ${timestamp}\n🌐 वेबसाइट: ${process.env.NEXT_PUBLIC_SITE_URL || 'nrdailynews.vercel.app'}`

            await sendNotificationToTelegram(message)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Track Interest API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
