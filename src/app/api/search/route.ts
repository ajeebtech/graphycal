import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || searchParams.get('q');

    if (!term) {
        return NextResponse.json({ error: 'Missing or invalid term parameter' }, { status: 400 });
    }

    try {
        // Removed Redis caching for simplicity in this demo environment.
        // In a production app with Redis, we would wrap this fetch in getCached().

        const response = await fetch(
            `https://www.vlr.gg/search/auto/?term=${encodeURIComponent(term)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from VLR.gg');
        }

        const data = await response.json();

        // The user's code didn't strictly filter for players, but the previous request did.
        // The previous prompt said "i only want to search players, so only show me players".
        // I will keep the player filtering logic while using the user's fetch structure.

        const players = Array.isArray(data) ? data.filter((item: any) =>
            item.id && item.id.startsWith('/search/r/player/')
        ).map((item: any) => ({
            ...item,
            // Ensure we have a consistent ID/name
            name: item.value || item.label,
        })) : [];

        // Set CORS and Cache Headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
        };

        return NextResponse.json({ results: players }, { headers });

    } catch (error: any) {
        console.error('Error proxying VLR.gg request:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
