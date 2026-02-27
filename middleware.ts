import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect dashboard and API routes
    if (pathname.startsWith('/admin/dashboard')) {
        const session = request.cookies.get('admin_session')
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') {
        const session = request.cookies.get('admin_session')
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/dashboard/:path*', '/api/admin/:path*']
}
