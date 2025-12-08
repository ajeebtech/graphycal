'use client';

import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import PlayerRadar from "@/components/PlayerRadar";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import IntroSplash from "@/components/IntroSplash";
import { useState } from "react";

export default function Home() {
  const [p1, setP1] = useState<any>(null);
  const [p2, setP2] = useState<any>(null);
  const [statsP1, setStatsP1] = useState<any>(null);
  const [statsP2, setStatsP2] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchKey, setSearchKey] = useState(0); // Used to force-reset child components

  const handleSearch = async () => {
    if (!p1 && !p2) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const fetchData = async (player: any) => {
        if (!player) return null;
        const res = await fetch(`/api/stats?name=${encodeURIComponent(player.name)}`);
        const result = await res.json();
        return result.data;
      };

      const [d1, d2] = await Promise.all([fetchData(p1), fetchData(p2)]);
      setStatsP1(d1);
      setStatsP2(d2);
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setP1(null);
    setP2(null);
    setStatsP1(null);
    setStatsP2(null);
    setHasSearched(false);
    setSearchKey(prev => prev + 1); // Force reset of Autocompletes
  };

  return (
    <div className={styles.page}>
      <IntroSplash />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <SearchAutocomplete
            key={`p1-${searchKey}`}
            placeholder="Enter name of player..."
            onSelect={(p) => setP1(p)}
            activeColor={hasSearched ? '#2563EB' : undefined} // Blue for P1
          />
          <div className={styles.vsLabel}>
            VS.
          </div>
          <SearchAutocomplete
            key={`p2-${searchKey}`}
            placeholder="Enter comparison player..."
            onSelect={(p) => setP2(p)}
            activeColor={hasSearched ? '#EAB308' : undefined} // Yellow for P2
          />
          <button className={styles.actionButton} onClick={handleSearch}>
            SEARCH
          </button>

          {hasSearched && (
            <button className={styles.resetButton} onClick={handleReset}>
              RESET
            </button>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <PlayerRadar p1={statsP1} p2={statsP2} />
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
