import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb() {
    if (db) return db;

    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT UNIQUE,
      country TEXT,
      current_team TEXT,
      matches INTEGER DEFAULT 0,
      runs INTEGER DEFAULT 0,
      wickets INTEGER DEFAULT 0,
      average REAL DEFAULT 0.0
    )
  `);

    return db;
}
