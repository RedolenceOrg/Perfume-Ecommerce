'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PerfumeCard from '@/components/perfumeCard';
import { PerfumeSummary as Perfume } from '@/types/perfumes';
import { apiGet } from '@/context/api';

export default function ProductGrid() {
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    const pageRef = useRef(1);
    const fetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    const fetchPerfumes = useCallback(async (isReset = false) => {
        if (fetchingRef.current) return;
        if (!isReset && !hasMoreRef.current) return;

        fetchingRef.current = true;
        setLoading(true);

        const targetPage = isReset ? 1 : pageRef.current + 1;

        try {
            const params = new URLSearchParams();
            params.set('page', targetPage.toString());
            params.set('limit', '12');
            searchParams.forEach((value, key) => {
                params.append(key, value);
            });

            const res = await apiGet(`/api/shop/?${params}`);
            const data = await res.json();

            setPerfumes(prev => isReset ? data.perfumes : [...prev, ...data.perfumes]);
            setHasMore(data.has_more);


            pageRef.current = targetPage;
        } catch (error) {
            console.error('Failed to fetch perfumes:', error);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [searchParams]);

    useEffect(() => {
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
        setPerfumes([]);

        fetchPerfumes(true);
    }, [searchParams, fetchPerfumes]);

    // Intersection Observer callback
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreRef.current && !fetchingRef.current) {
                fetchPerfumes(false);
            }
        });

        if (node) observer.current.observe(node);
    }, [fetchPerfumes]);

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