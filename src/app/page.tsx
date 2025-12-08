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

  const handleSearch = async () => {
    if (!p1 && !p2) return;
    setLoading(true);

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

  return (
    <div className={styles.page}>
      <IntroSplash />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <SearchAutocomplete
            placeholder="Enter name of player..."
            onSelect={(p) => setP1(p)}
          />
          <div className={styles.vsLabel}>
            VS.
          </div>
          <SearchAutocomplete
            placeholder="Enter comparison player..."
            onSelect={(p) => setP2(p)}
          />
          <button className={styles.actionButton} onClick={handleSearch}>
            SEARCH
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <PlayerRadar p1={statsP1} p2={statsP2} />
          </div>
          <p className={styles.disclaimer}>* Data Last 90 Days</p>

        </div>
      </main>
    </div>
  );
}
