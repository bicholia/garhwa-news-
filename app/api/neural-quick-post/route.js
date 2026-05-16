import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ error: 'Neural Quick Post disabled by admin.' }, { status: 403 });
}

export async function POST() {
    return NextResponse.json({ error: 'Neural Quick Post disabled by admin.' }, { status: 403 });
}
