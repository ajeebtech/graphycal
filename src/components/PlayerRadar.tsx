'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
    { subject: 'Touches in box', A: 120, B: 110, fullMark: 150 },
    { subject: 'Off duels', A: 98, B: 130, fullMark: 150 },
    { subject: 'NPG', A: 86, B: 130, fullMark: 150 },
    { subject: 'npxG', A: 99, B: 100, fullMark: 150 },
    { subject: 'Conversion%', A: 85, B: 90, fullMark: 150 },
    { subject: 'Aerial%', A: 65, B: 85, fullMark: 150 },
];

export default function PlayerRadar() {
    return (
        <ResponsiveContainer width="100%" height={450}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#333" strokeDasharray="2 2" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#ff3300', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                    name="Player 1"
                    dataKey="A"
                    stroke="#ff3300"
                    strokeWidth={2}
                    fill="#ff3300"
                    fillOpacity={0.4}
                />
                <Radar
                    name="Player 2"
                    dataKey="B"
                    stroke="#ffffff"
                    strokeWidth={2}
                    fill="#ffffff"
                    fillOpacity={0}
                    strokeDasharray="4 4"
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
