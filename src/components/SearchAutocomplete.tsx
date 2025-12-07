'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import styles from '../app/page.module.css';

interface Player {
    id: string;
    name: string;
}

interface SearchAutocompleteProps {
    placeholder: string;
    onSelect?: (player: Player) => void;
}

export default function SearchAutocomplete({ placeholder, onSelect }: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results);
                setOpen(true);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (player: Player) => {
        setQuery(player.name);
        setOpen(false);
        if (onSelect) onSelect(player);
    };

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={styles.searchInput}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!open && e.target.value.length >= 2) setOpen(true);
                    }}
                />
                <div className={styles.inputIcon}>
                    {loading ? (
                        <Loader2 className={styles.spinner} size={18} />
                    ) : (
                        <Search size={18} color="#94a3b8" />
                    )}
                </div>
            </div>

            {open && results.length > 0 && (
                <div className={styles.dropdown}>
                    {results.map((player) => (
                        <div
                            key={player.id}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(player)}
                        >
                            {player.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
