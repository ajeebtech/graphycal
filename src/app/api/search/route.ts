import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || searchParams.get('q');

    if (!term) {
        return NextResponse.json({ error: 'Missing or invalid term parameter' }, { status: 400 });
    }

    if (!supabase) {
        console.error('Supabase client not initialized. Check environment variables.');
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('player_name, country, current_team')
            .ilike('player_name', `%${term}%`)
            .limit(10);

        if (error) {
            throw error;
        }

        const results = (profiles || []).map((profile) => ({
            id: profile.player_name, // Use name as ID for now
            name: profile.player_name,
            team: profile.current_team,
            country: profile.country,
        }));

        // Allow CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return NextResponse.json({ results }, { headers });

    } catch (error: any) {
        console.error('Error searching Supabase:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
