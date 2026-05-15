import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Find duplicates based on normalized title
        const { rows: duplicates } = await sql`
            SELECT LOWER(REPLACE(title, ' ', '')) as norm_title, COUNT(*) as count
            FROM news
            GROUP BY LOWER(REPLACE(title, ' ', ''))
            HAVING COUNT(*) > 1
        `;

        let totalDeleted = 0;
        const log = [];

        for (const dup of duplicates) {
            // 2. For each duplicate set, keep the one with the highest ID (newest)
            const { rows: items } = await sql`
                SELECT id, title, published_at 
                FROM news 
                WHERE LOWER(REPLACE(title, ' ', '')) = ${dup.norm_title}
                ORDER BY id DESC
            `;

            const keepId = items[0].id;
            const deleteIds = items.slice(1).map(i => i.id);

            if (deleteIds.length > 0) {
                await sql`
                    DELETE FROM news 
                    WHERE id = ANY(${deleteIds})
                `;
                totalDeleted += deleteIds.length;
                log.push({
                    title: items[0].title,
                    deletedCount: deleteIds.length,
                    deletedIds: deleteIds
                });
            }
        }

        return NextResponse.json({
            success: true,
            totalDuplicatesFound: duplicates.length,
            totalItemsDeleted: totalDeleted,
            details: log
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
