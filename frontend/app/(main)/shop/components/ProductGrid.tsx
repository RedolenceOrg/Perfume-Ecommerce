'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PerfumeCard from '@/components/perfumeCard';
import { PerfumeSummary as Perfume } from '@/types/perfumes';

export default function ProductGrid() {
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    // Combined fetch logic
    const fetchPerfumes = useCallback(async (currentPage: number, isReset: boolean) => {
        if (loading && !isReset) return; // Prevent double fetching on scroll

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '12',
                ...Object.fromEntries(searchParams.entries())
            });

            const res = await fetch(`http://127.0.0.1:8000/api/shop/?${params}`);
            const data = await res.json();

            setPerfumes(prev => isReset ? data.perfumes : [...prev, ...data.perfumes]);
            setHasMore(data.has_more);
        } catch (error) {
            console.error("Failed to fetch perfumes:", error);
        } finally {
            setLoading(false);
        }
    }, [searchParams]); // removed loading from deps to avoid infinite loops

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

    // IntersectionObserver
    useEffect(() => {
        const currentObserver = observerRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                // Only trigger if we aren't already loading and there's more to fetch
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (currentObserver) observer.observe(currentObserver);

        return () => {
            if (currentObserver) observer.unobserve(currentObserver);
        };
    }, [hasMore, loading]);

    return (
        <div className="flex-1">
            {/* Show a skeleton or message if initial load is empty */}
            {loading && perfumes.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-50">
                    {/* You can map actual skeletons here */}
                    <p className="col-span-full text-center py-20">Searching the vault...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {perfumes.map((perfume) => (
                        <PerfumeCard key={`${perfume.id}-${searchParams.get('type')}`} {...perfume} />
                    ))}
                </div>
            )}

            {/* If not loading and no perfumes found after a fetch */}
            {!loading && perfumes.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-secondary uppercase tracking-tighter">No items found in this collection.</p>
                </div>
            )}

            <div ref={observerRef} className="h-20 flex items-center justify-center mt-8">
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