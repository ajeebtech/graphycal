'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';


interface PlayerRadarProps {
    p1?: any;
    p2?: any;
}

const COLORS = [
    '#2563EB', // Blue
    '#EAB308', // Yellow
    '#39FF14', // Neon Green
    '#FF073A', // Neon Red
    '#B026FF', // Neon Purple
    '#00FFFF', // Cyan
];

interface PlayerRadarProps {
    stats?: any[];
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
                        {entry.payload[`raw${index}`]}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PlayerRadar({ stats = [] }: PlayerRadarProps) {
    // Normalization Helpers
    const norm = (val: number, max: number) => (val / max) * 100;

    const subjects = [
        { key: 'rating', label: 'RATING', max: 1.5 },
        { key: 'acs', label: 'ACS', max: 300 },
        { key: 'kd_ratio', label: 'K/D', max: 1.5 },
        { key: 'kast_percentage', label: 'KAST', max: 100, isPerc: true },
        { key: 'adr', label: 'ADR', max: 200 },
        { key: 'hs_percentage', label: 'HS%', max: 100, isPerc: true },
    ];

    const data = subjects.map(subj => {
        const entry: any = { subject: subj.label, fullMark: 100 };
        stats.forEach((p, idx) => {
            if (p) {
                const val = p[subj.key];
                entry[`val${idx}`] = norm(val, subj.max);
                entry[`raw${idx}`] = subj.isPerc ? val + '%' : val;
            } else {
                entry[`val${idx}`] = 0;
                entry[`raw${idx}`] = '-';
            }
        });
        return entry;
    });

    return (
        <ResponsiveContainer width="100%" height={450}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#444" strokeDasharray="2 2" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#ff3300', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {stats.map((p, idx) => (
                    <Radar
                        key={idx}
                        name={p?.player_name || `Player ${idx + 1}`}
                        dataKey={`val${idx}`}
                        stroke={COLORS[idx % COLORS.length]}
                        strokeWidth={3}
                        fill={COLORS[idx % COLORS.length]}
                        fillOpacity={0.3}
                        animationDuration={500}
                    />
                ))}
            </RadarChart>
        </ResponsiveContainer>
    );
}
