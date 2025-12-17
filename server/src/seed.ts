import { getDb } from './db';

async function seed() {
    const db = await getDb();

    // Sample data - You can add more or read from CSV here
    const players = [
        { player_name: 'Virat Kohli', country: 'IN', current_team: 'RCB', matches: 200, runs: 6000, wickets: 4 },
        { player_name: 'Rohit Sharma', country: 'IN', current_team: 'MI', matches: 190, runs: 5500, wickets: 15 },
        { player_name: 'MS Dhoni', country: 'IN', current_team: 'CSK', matches: 210, runs: 4500, wickets: 0 },
        { player_name: 'Ben Stokes', country: 'UK', current_team: 'CSK', matches: 40, runs: 900, wickets: 25 },
        { player_name: 'Steve Smith', country: 'AU', current_team: 'DC', matches: 100, runs: 2400, wickets: 0 }
    ];

    for (const p of players) {
        try {
            await db.run(
                `INSERT OR IGNORE INTO profiles (player_name, country, current_team, matches, runs, wickets) VALUES (?, ?, ?, ?, ?, ?)`,
                [p.player_name, p.country, p.current_team, p.matches, p.runs, p.wickets]
            );
            console.log(`Inserted ${p.player_name}`);
        } catch (e) {
            console.error(`Error inserting ${p.player_name}:`, e);
        }
    }

    console.log('Seeding complete');
}

seed();
