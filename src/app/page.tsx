'use client';

import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import PlayerRadar from "@/components/PlayerRadar";
import SearchAutocomplete from "@/components/SearchAutocomplete";

import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <div className={styles.page}>
      <IntroSplash />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <SearchAutocomplete
            placeholder="Enter name of striker..."
            onSelect={(p) => console.log('Selected P1', p)}
          />
          <div className={styles.vsLabel}>
            VS.
          </div>
          <SearchAutocomplete
            placeholder="Enter comparison player..."
            onSelect={(p) => console.log('Selected P2', p)}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <PlayerRadar />
          </div>

        </div>
      </main>
    </div>
  );
}
