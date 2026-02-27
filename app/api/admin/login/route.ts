import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { password } = await request.json()
        const adminPassword = process.env.ADMIN_PASSWORD

        console.log('[Login] attempt received')
        console.log('[Login] env password set:', !!adminPassword)

        if (!adminPassword) {
            return NextResponse.json({ error: 'Server config error: password not set' }, { status: 500 })
        }

        if (password !== adminPassword) {
            console.log('[Login] wrong password')
            return NextResponse.json({ error: 'गलत पासवर्ड (Invalid password)' }, { status: 401 })
        }

        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: false, // false for localhost dev
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/'
        })

        console.log('[Login] success, cookie set')
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[Login] error:', error)
        return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 })
    }
}
