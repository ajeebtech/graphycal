import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || searchParams.get('q');

    if (!term) {
        return NextResponse.json({ error: 'Missing or invalid term parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(`http://localhost:4000/api/search?term=${encodeURIComponent(term)}`);

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();

        // Allow CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return NextResponse.json(data, { headers });

    } catch (error: any) {
        console.error('Error searching backend:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
