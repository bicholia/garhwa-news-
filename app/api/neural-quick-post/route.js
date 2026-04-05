import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { AgentPulse, AgentStratos, AgentOracle, AgentVision, AgentSocial } from '@/lib/neural-agents';
import { insertNews, isTitleExists } from '@/lib/db.js';
import { sendToTelegram } from '@/lib/telegram';
import { scrubBrandNames } from '@/lib/safety';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function uploadImageToSanity(imageUrl, title) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const arrayBuffer = await response.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(arrayBuffer), {
            filename: `manual-${Date.now()}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}

async function getImageUrl(prompt) {
    const aiNodes = [
        { id: 'VISION_NODE_1', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&nologo=true` },
        { id: 'VISION_NODE_2', url: `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&model=midjourney&nologo=true` },
        { id: 'VISION_NODE_5', url: `https://api.airforce/v1/image/generations?prompt=${encodeURIComponent(prompt)}&model=flux` }
    ];

    for (const node of aiNodes) {
        try {
            const res = await fetch(node.url, { method: 'HEAD' });
            if (res.ok) return node.url;
        } catch (e) {}
    }
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1280&h=720&q=80`;
}

export async function POST(request) {
    try {
        const { tip, district = 'garhwa', secret } = await request.json();

        // Security Check
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!tip || tip.length < 5) {
            return NextResponse.json({ error: 'Tip is too short' }, { status: 400 });
        }

        // Check for duplicates
        if (await isTitleExists(tip)) {
            return NextResponse.json({ error: 'Similar news already exists' }, { status: 409 });
        }

        console.log(`🎙️ [NEURAL QUICKPOST] Processing tip: ${tip}`);

        // 🎙️ STEP 1: PULSE (Expansion)
        const pulseDraft = await AgentPulse("Breaking News Tip", tip);
        
        // 📈 STEP 2: STRATOS (SEO)
        const stratosSEO = await AgentStratos(pulseDraft);
        
        // 🎨 STEP 3: VISION (Image)
        const visionArt = await AgentVision(pulseDraft);
        const imgUrl = await getImageUrl(visionArt.fluxPrompt);
        const assetId = await uploadImageToSanity(imgUrl, pulseDraft.title);

        // 📲 STEP 4: SOCIAL (Publicist)
        const socialHook = await AgentSocial(pulseDraft);

        // PUBLICATION
        const finalSlug = `${stratosSEO.slug}-${Math.random().toString(36).substring(7)}`;
        const doc = {
            _type: 'article',
            title: pulseDraft.title,
            slug: { _type: 'slug', current: finalSlug },
            excerpt: stratosSEO.excerpts,
            body: pulseDraft.content.split('\n').filter(p => p.trim()).map(p => ({
                _type: 'block',
                children: [{ _type: 'span', text: p.trim() }]
            })),
            district: district || pulseDraft.leadDistrict || 'garhwa',
            category: { _type: 'reference', _ref: 'category-top-story' },
            publishedAt: new Date().toISOString(),
            seoKeywords: stratosSEO.seoKeywords,
            tags: stratosSEO.tags
        };

        if (assetId) {
            doc.featureImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
        }

        const sanityResult = await client.create(doc);
        
        await insertNews({
            title: doc.title,
            slug: finalSlug,
            content: pulseDraft.content,
            excerpt: doc.excerpt,
            image_url: assetId || '',
            category: 'top-story',
            district: doc.district,
            published_at: doc.publishedAt,
            highlights: []
        });

        // SOCIAL PUSH
        await sendToTelegram({
            ...doc,
            image_url: imgUrl,
            customMsg: socialHook.telegramMsg,
            category: { name: 'MANUAL BREAKING NEWS' }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Manual news synthesized and published!',
            title: pulseDraft.title,
            slug: finalSlug
        });

    } catch (error) {
        console.error('QuickPost Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
