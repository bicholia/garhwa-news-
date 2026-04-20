import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('[Analytics] Interest Tracked:', body)
        // In a real app, you would save this to the database or an analytics service.
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 })
    }
}
