import express, { Request, Response } from 'express';
import { getDb } from './db';

const router = express.Router();

// Search endpoint
router.get('/search', async (req: Request, res: Response) => {
    try {
        const term = req.query.term || req.query.q;

        if (!term) {
            res.status(400).json({ error: 'Missing term parameter' });
            return;
        }

        const db = await getDb();
        // Use SQL LIKE for simple text search
        const profiles = await db.all(
            `SELECT player_name, country, current_team FROM profiles WHERE player_name LIKE ? LIMIT 10`,
            [`%${term}%`]
        );

        const results = profiles.map(profile => ({
            id: profile.player_name,
            name: profile.player_name,
            team: profile.current_team,
            country: profile.country
        }));

        res.json({ results });
    } catch (error: any) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stats endpoint
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const name = req.query.name;

        if (!name) {
            res.status(400).json({ error: 'Missing name parameter' });
            return;
        }

        const db = await getDb();
        const profile = await db.get(
            `SELECT * FROM profiles WHERE player_name = ?`,
            [name]
        );

        res.json({ data: profile });
    } catch (error: any) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
