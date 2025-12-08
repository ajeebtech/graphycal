'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';


interface PlayerRadarProps {
    p1?: any;
    p2?: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#050505',
                border: '1px solid #ff3300',
                padding: '1rem',
                fontFamily: 'monospace'
            }}>
                <p style={{ color: '#fff', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} style={{ color: entry.color, marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold' }}>{entry.name}: </span>
                        {/* Use the raw value we passed in the data payload */}
                        {index === 0 ? entry.payload.rawA : entry.payload.rawB}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PlayerRadar({ p1, p2 }: PlayerRadarProps) {
    // Normalization Helpers
    // We normalize everything to be roughly 0-100 scale for visual comparison
    const norm = (val: number, max: number) => (val / max) * 100;

    const data = [
        {
            subject: 'RATING',
            A: p1 ? norm(p1.rating, 1.5) : 0,
            B: p2 ? norm(p2.rating, 1.5) : 0,
            rawA: p1 ? p1.rating : '-',
            rawB: p2 ? p2.rating : '-',
            fullMark: 100
        },
        {
            subject: 'ACS',
            A: p1 ? norm(p1.acs, 300) : 0,
            B: p2 ? norm(p2.acs, 300) : 0,
            rawA: p1 ? p1.acs : '-',
            rawB: p2 ? p2.acs : '-',
            fullMark: 100
        },
        {
            subject: 'K/D',
            A: p1 ? norm(p1.kd_ratio, 1.5) : 0,
            B: p2 ? norm(p2.kd_ratio, 1.5) : 0,
            rawA: p1 ? p1.kd_ratio : '-',
            rawB: p2 ? p2.kd_ratio : '-',
            fullMark: 100
        },
        {
            subject: 'KAST',
            A: p1 ? p1.kast_percentage : 0,  // Already %
            B: p2 ? p2.kast_percentage : 0,
            rawA: p1 ? p1.kast_percentage + '%' : '-',
            rawB: p2 ? p2.kast_percentage + '%' : '-',
            fullMark: 100
        },
        {
            subject: 'ADR',
            A: p1 ? norm(p1.adr, 200) : 0,
            B: p2 ? norm(p2.adr, 200) : 0,
            rawA: p1 ? p1.adr : '-',
            rawB: p2 ? p2.adr : '-',
            fullMark: 100
        },
        {
            subject: 'HS%',
            A: p1 ? p1.hs_percentage : 0, // Already %
            B: p2 ? p2.hs_percentage : 0,
            rawA: p1 ? p1.hs_percentage + '%' : '-',
            rawB: p2 ? p2.hs_percentage + '%' : '-',
            fullMark: 100
        },
    ];

    return (
        <ResponsiveContainer width="100%" height={450}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#333" strokeDasharray="2 2" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#ff3300', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                    name={p1?.player_name || "Player 1"}
                    dataKey="A"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fill="#2563EB"
                    fillOpacity={0.3}
                />
                <Radar
                    name={p2?.player_name || "Player 2"}
                    dataKey="B"
                    stroke="#EAB308"
                    strokeWidth={3}
                    fill="#EAB308"
                    fillOpacity={0.3}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
