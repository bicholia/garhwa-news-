import { NextResponse } from 'next/server'

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
🏢 *Subject:* ${subject || 'General'}

📝 *Message:*
${message}
--------------------------------
ThinkIndia.press Bureau
`

        // Try to send to Telegram (non-blocking — don't fail the form if Telegram is down)
        try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN
            const chatId = process.env.TELEGRAM_CHAT_ID

            if (botToken && chatId) {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMessage,
                        parse_mode: 'Markdown'
                    })
                })
            } else {
                // Log to server console as fallback
                console.log('[Contact Form Submission]', { name, email, phone, subject, message })
            }
        } catch (telegramErr) {
            console.error('Telegram delivery failed (non-critical):', telegramErr)
        }

        // Always return success to the user
        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
