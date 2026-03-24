import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*') // Select all columns to find the stats
            .eq('player_name', name)
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
