'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PerfumeCard from '@/components/perfumeCard';
import { PerfumeSummary as Perfume } from '@/types/perfumes';
import { apiGet } from '@/context/api';

const PAGE_SIZE = 12;

export default function ProductGrid() {
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    const fetchPerfumes = useCallback(async (isReset = false) => {
        if (!isReset && !hasMoreRef.current) return;

        // Cancel any in-flight request instead of silently dropping this one —
        // otherwise a stale response can overwrite results for the current filters.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        loadingRef.current = true;
        setLoading(true);

        const targetPage = isReset ? 1 : pageRef.current + 1;

        try {
            const params = new URLSearchParams();
            params.set('page', targetPage.toString());
            params.set('limit', PAGE_SIZE.toString());
            searchParams.forEach((value, key) => {
                params.append(key, value);
            });

            const res = await apiGet(`/api/shop/?${params}`, { signal: controller.signal });
            const data = await res.json();

            setPerfumes(prev => isReset ? data.perfumes : [...prev, ...data.perfumes]);
            setHasMore(data.has_more);
            pageRef.current = targetPage;
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Failed to fetch perfumes:', error);
            }
        } finally {
            // Only clear loading state if this request is still the most recent one —
            // a stale, already-superseded request finishing shouldn't stop the spinner
            // for the newer request that replaced it.
            if (abortRef.current === controller) {
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
        setPerfumes([]);

        fetchPerfumes(true);

        return () => {
            abortRef.current?.abort();
        };
    }, [searchParams, fetchPerfumes]);

    // Intersection Observer callback
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
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
                        <div
                            key={`grid-${perfume.id}-${index}`}
                            className="product-fade-in"
                            style={{ animationDelay: `${(index % PAGE_SIZE) * 45}ms` }}
                        >
                            <PerfumeCard {...perfume} />
                        </div>
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

            <style jsx global>{`
                @keyframes productFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(14px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .product-fade-in {
                    animation: productFadeIn 0.5s ease-out both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .product-fade-in {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}