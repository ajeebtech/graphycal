'use client';

import { useState, useEffect, useRef } from "react";
import styles from "../app/page.module.css";
import { Search, Loader2 } from "lucide-react";
import emoji from 'country-code-emoji';

interface SearchResult {
    id: string;
    name: string;
    team?: string;
    country?: string;
}

interface SearchAutocompleteProps {
    placeholder?: string;
    onSelect?: (player: SearchResult) => void;
}

export default function SearchAutocomplete({ placeholder, onSelect }: SearchAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (!query || query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

                if (!res.ok) {
                    console.error(`API Error: ${res.status} ${res.statusText}`);
                    const text = await res.text();
                    console.error('Response body:', text);
                    return;
                }

                const data = await res.json();
                if (data.results) {
                    setResults(data.results);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [query]);

    const handleSelect = (player: SearchResult) => {
        setQuery(player.name);
        setShowDropdown(false);
        if (onSelect) onSelect(player);
    };

    const getFlagEmoji = (countryCode?: string) => {
        if (!countryCode) return '';
        try {
            // Handle known VLR/Liquipedia country names or codes if needed
            // Assuming Supabase stores standard codes or names we might need to map
            // For now, try strict code. If fails, return empty.
            return emoji(countryCode) + ' ';
        } catch {
            return '';
        }
    };

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder={placeholder || "Search player..."}
                    className={styles.searchInput}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <div className={styles.inputIcon}>
                    {loading ? (
                        <Loader2 size={18} className={styles.spinner} />
                    ) : (
                        <Search size={18} style={{ opacity: 0.5, color: 'var(--accent-primary)' }} />
                    )}
                </div>
            </div>

            {showDropdown && results.length > 0 && (
                <div className={styles.dropdown}>
                    {results.map((player) => (
                        <div
                            key={player.id}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(player)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    {getFlagEmoji(player.country)}
                                    {player.name}
                                </span>
                                {player.team && (
                                    <span style={{
                                        fontSize: '0.7em',
                                        opacity: 0.6,
                                        marginLeft: '8px',
                                        textTransform: 'uppercase',
                                        color: '#ff3300'
                                    }}>
                                        {player.team}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
