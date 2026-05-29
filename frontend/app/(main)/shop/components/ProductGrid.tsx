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

    // Use refs to always read the freshest state values inside the observer without triggering re-renders
    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    // Combined fetch logic
    const fetchPerfumes = useCallback(async (currentPage: number, isReset: boolean) => {
        // Guard against double fetching
        if (loadingRef.current && !isReset) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '12',
                ...Object.fromEntries(searchParams.entries())
            });

            const res = await apiGet(`/api/shop/?${params}`);
            const data = await res.json();

            setPerfumes(prev => isReset ? data.perfumes : [...prev, ...data.perfumes]);
            setHasMore(data.has_more);
        } catch (error) {
            console.error("Failed to fetch perfumes:", error);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    // Reset when URL parameters change (e.g., clicking Perfume vs Attar)
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPerfumes(1, true);
    }, [searchParams, fetchPerfumes]);

    // Load more when page increments
    useEffect(() => {
        if (page > 1) {
            fetchPerfumes(page, false);
        }
    }, [page, fetchPerfumes]);

    // Clean, dynamic Callback Ref for IntersectionObserver
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingRef.current) return;

        // Disconnect previous observer instance
        if (observer.current) observer.current.disconnect();

        // Connect new observer instance to the target element node
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreRef.current) {
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
                            key={`${perfume.id}-${perfume.slug || index}`}
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

            {/* Attach your cleaner callback ref directly here */}
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