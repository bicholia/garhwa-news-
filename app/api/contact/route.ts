import { NextResponse } from 'next/server'
import { sendNotificationToTelegram } from '@/lib/telegram'

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { name, email, phone, subject, message } = data

        if (!name || !message) {
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
        }

        // Format the message for Telegram
        const telegramMessage = `
📬 *New Contact Form Submission*
--------------------------------
👤 *Name:* ${name}
📧 *Email:* ${email || 'Not provided'}
📱 *Phone:* ${phone || 'Not provided'}
🏢 *Branch:* ${subject || 'General'}

📝 *Message:*
${message}
--------------------------------
ThinkIndia.press Bureau
`

        const ok = await sendNotificationToTelegram(telegramMessage)

        if (ok) {
            return NextResponse.json({ success: true })
        } else {
            // Fallback: Even if telegram fails, we might want to log it or save to DB
            console.error('Failed to send contact notification to Telegram')
            return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
        }
    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
