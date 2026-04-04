import { NextResponse } from 'next/server'
import { verifyTelegramBot, detectChannelId, sendNotificationToTelegram } from '@/lib/telegram'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'verify') {
        const result = await verifyTelegramBot()
        return NextResponse.json(result)
    }

    if (action === 'detect') {
        const result = await detectChannelId()
        return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request: Request) {
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: 'Message missing' }, { status: 400 })

    const ok = await sendNotificationToTelegram(message)
    return NextResponse.json({ ok })
}
