'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PerfumeCard from '@/components/perfumeCard';
import { PerfumeSummary as Perfume } from '@/types/perfumes';
import { apiGet } from '@/context/api';

export default function ProductGrid() {
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);
    const fetchingRef = useRef(false);

    // Track the exact page we are currently fetching or have successfully fetched
    const lastFetchedPageRef = useRef<number>(0);

    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    const fetchPerfumes = useCallback(async (currentPage: number, isReset: boolean) => {
        if (fetchingRef.current && !isReset) return;
        if (!isReset && currentPage <= lastFetchedPageRef.current) return;

        fetchingRef.current = true;
        lastFetchedPageRef.current = currentPage;
        setLoading(true);

        try {
            // ✅ replace Object.fromEntries with this
            const params = new URLSearchParams();
            params.set('page', currentPage.toString());
            params.set('limit', '12');
            searchParams.forEach((value, key) => {
                params.append(key, value);
            });

            const res = await apiGet(`/api/shop/?${params}`);
            const data = await res.json();

            setPerfumes(prev => isReset ? data.perfumes : [...prev, ...data.perfumes]);
            setHasMore(data.has_more);
        } catch (error) {
            console.error('Failed to fetch perfumes:', error);
            lastFetchedPageRef.current = currentPage - 1;
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [searchParams]);

    // Handle Search Parameter changes (Reset Everything)
    useEffect(() => {
        lastFetchedPageRef.current = 0; // Reset network tracker
        setHasMore(true);
        setPerfumes([]);
        setPage(1);

        // Fetch page 1 immediately for the new filters
        fetchPerfumes(1, true);
    }, [searchParams, fetchPerfumes]);

    // Handle Infinite Scroll Page Increments
    useEffect(() => {
        // Skip firing if it's the initial page 1 setup (handled by the searchParams effect)
        if (page === 1 && lastFetchedPageRef.current === 1) return;

        if (page > 1) {
            fetchPerfumes(page, false);
        }
    }, [page, fetchPerfumes]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingRef.current) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            // Only increment page if we aren't currently loading and there is more data
            if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, []);

    return (
        <div className="flex-1">
            {loading && perfumes.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-50">
                    <p className="col-span-full text-center py-20">Searching the vault...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {perfumes.map((perfume, index) => (
                        <PerfumeCard
                            key={`grid-${perfume.id}-${index}`}
                            {...perfume}
                        />
                    ))}
                </div>
            )}

            {!loading && perfumes.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-secondary uppercase tracking-tighter">No items found in this collection.</p>
                </div>
            )}

            <div ref={lastElementRef} className="h-20 flex items-center justify-center mt-8">
                {loading && (
                    <span className="text-sm text-secondary uppercase tracking-widest animate-pulse">
                        Loading...
                    </span>
                )}
                {!hasMore && perfumes.length > 0 && (
                    <span className="text-sm text-secondary uppercase tracking-widest">
                        End of Collection
                    </span>
                )}
            </div>
        </div>
    );
}