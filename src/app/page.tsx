'use client';

import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import PlayerRadar from "@/components/PlayerRadar";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import IntroSplash from "@/components/IntroSplash";
import { useState } from "react";

const COLORS = [
  '#2563EB', // Blue
  '#EAB308', // Yellow
  '#39FF14', // Neon Green
  '#FF073A', // Neon Red
  '#B026FF', // Neon Purple
  '#00FFFF', // Cyan
];

export default function Home() {
  const [players, setPlayers] = useState<any[]>([null, null]); // Start with 2 slots
  const [stats, setStats] = useState<any[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchKey, setSearchKey] = useState(0); // Used to force-reset child components
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    // Validate at least 2 players are selected
    const selectedPlayers = players.filter(p => p !== null);
    if (selectedPlayers.length < 2) {
      setError("you need at least 2 players to do a comparision");
      return;
    }
    setError(null);
    setLoading(true);
    setHasSearched(true);

    try {
      const fetchData = async (player: any) => {
        if (!player) return null;
        const res = await fetch(`/api/stats?name=${encodeURIComponent(player.name)}`);
        const result = await res.json();
        return result.data;
      };

      const results = await Promise.all(players.map(p => fetchData(p)));
      setStats(results);
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStats(prev => prev.map(() => null)); // Animate all graphs to 0
    setTimeout(() => {
      setPlayers([null, null]);
      setStats([null, null]);
      setHasSearched(false);
      setError(null);
      setSearchKey(prev => prev + 1); // Force reset of Autocompletes
    }, 500);
  };

  const updatePlayer = (index: number, player: any) => {
    const newPlayers = [...players];
    newPlayers[index] = player;
    setPlayers(newPlayers);
    setError(null);
  };

  const addPlayerSlot = () => {
    if (players.length < 5) {
      setPlayers([...players, null]);
      setStats([...stats, null]);
    }
  };

  return (
    <div className={styles.page}>
      <IntroSplash />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          {players.map((p, idx) => (
            <div key={`slot-${idx}-${searchKey}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SearchAutocomplete
                placeholder={`Player ${idx + 1}`}
                onSelect={(player) => updatePlayer(idx, player)}
                activeColor={hasSearched ? COLORS[idx] : undefined}
              />
              {idx < players.length - 1 && (
                <div className={styles.vsLabel}>
                  VS.
                </div>
              )}
            </div>
          ))}

          {players.length < 5 && (
            <button
              onClick={addPlayerSlot}
              style={{
                background: 'transparent',
                border: '1px dashed #333',
                color: '#666',
                padding: '0.5rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                width: '100%'
              }}
              title="Add another player"
            >
              +
            </button>
          )}

          <button className={styles.actionButton} onClick={handleSearch}>
            COMPARE
          </button>

          {error && (
            <div style={{
              color: '#ff3300',
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {error}
            </div>
          )}

          {hasSearched && (
            <button className={styles.resetButton} onClick={handleReset}>
              RESET
            </button>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <PlayerRadar stats={stats} />
          </div>
        </div>
        <p className={styles.disclaimer}>* Data Last 90 Days</p>

      </main>

      <div className={styles.footer}>
        made by
        <a href="https://x.com/ajeebtech" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          ajeebtech
        </a>
      </div>
    </div >
  );
}
