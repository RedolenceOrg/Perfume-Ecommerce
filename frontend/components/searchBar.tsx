'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet } from '@/context/api';

interface Perfume {
    id: number;
    name: string;
    brand: string;
    price: string;
    collection: string | null;
    primary_image: string | null;
    secondary_image: string | null;
    slug: string;
}

interface SearchBarProps {
    endpoint?: string;
    placeholder?: string;
    minChars?: number;
    debounceMs?: number;
    className?: string;
}

export default function SearchBar({
    endpoint = '/api/search/',
    placeholder = 'Search perfumes, brands...',
    minChars = 2,
    debounceMs = 300,
    className = 'max-w-xl',
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Perfume[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const runSearch = useCallback(
        async (q: string) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setIsLoading(true);
            setError(null);

            try {
                const res = await apiGet(`${endpoint}?q=${encodeURIComponent(q)}`);
                if (!res.ok) throw new Error('Search request failed');
                const data: Perfume[] = await res.json();
                setResults(Array.isArray(data) ? data : []);
                setIsOpen(true);
                setActiveIndex(-1);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError('Something went wrong. Try again.');
                    setResults([]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [endpoint]
    );

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < minChars) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            abortRef.current?.abort();
            return;
        }

        debounceRef.current = setTimeout(() => {
            runSearch(query.trim());
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, minChars, debounceMs, runSearch]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function closeAndReset() {
        setIsOpen(false);
        setQuery('');
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                e.preventDefault();
                window.location.href = `/perfume/${results[activeIndex].slug}`;
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }

    function formatPrice(price: string) {
        const n = Number(price);
        if (Number.isNaN(n)) return price;
        return `NRS ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }

    const showDropdown = isOpen && query.trim().length >= minChars;

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <div className="relative flex items-center">
                <svg
                    className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= minChars && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-2.5 pl-9 pr-9 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
                    aria-controls="search-results-listbox"
                />
                {isLoading && (
                    <div
                        className="absolute right-3 h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"
                        aria-label="Loading"
                    />
                )}
            </div>

            {showDropdown && (
                <div
                    id="search-results-listbox"
                    role="listbox"
                    data-lenis-prevent
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[420px] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
                >
                    {error && <div className="px-3 py-3.5 text-center text-sm text-gray-500">{error}</div>}

                    {!error && !isLoading && results.length === 0 && (
                        <div className="px-3 py-3.5 text-center text-sm text-gray-500">
                            No results for &quot;{query}&quot;
                        </div>
                    )}

                    {!error &&
                        results.map((item, index) => {
                            const isActive = index === activeIndex;
                            const image = item.primary_image || item.secondary_image;

                            return (
                                <Link
                                    key={item.id}
                                    href={`/perfume/${item.slug}`}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={closeAndReset}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`flex items-center gap-3 rounded-lg p-2 no-underline transition-colors ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
                                        {image ? (
                                            <Image src={image} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 leading-tight">
                                        <div className="truncate text-sm font-medium text-gray-900">{item.name}</div>
                                        <div className="truncate text-xs text-gray-500 mt-0.5">
                                            <span>{item.brand}</span>
                                            {item.collection && (
                                                <>
                                                    <span className="mx-1">·</span>
                                                    <span>{item.collection}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 mt-1">
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            )}
        </div>
    );
}