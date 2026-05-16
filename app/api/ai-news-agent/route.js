import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ error: 'AI Agent disabled by admin.' }, { status: 403 });
}

export async function POST() {
    return NextResponse.json({ error: 'AI Agent disabled by admin.' }, { status: 403 });
}
