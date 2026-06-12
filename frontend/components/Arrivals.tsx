'use client';

import PerfumeCard from "./perfumeCard";
import { useRef, useEffect } from 'react';
import { PerfumeSummary } from "@/types/perfumes";
type ArrivalsProps = {
    heading: string;
    perfumes: PerfumeSummary[]
}

export default function Arrivals({ heading, perfumes }: ArrivalsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            const cards = scrollRef.current?.querySelectorAll('.perfume-card')
            if (!cards) return

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Array.from(cards).indexOf(entry.target as HTMLElement)
                        setTimeout(() => {
                            entry.target.classList.remove('card-hidden')
                            entry.target.classList.add('card-visible')
                        }, index * 80)
                        observer.unobserve(entry.target)
                    }
                })
            }, {
                root: null,        // 👈 observe against the viewport
                threshold: 0.15
            })

            cards.forEach(card => observer.observe(card))
            return () => observer.disconnect()
        }, 100)

        return () => clearTimeout(timer)
    }, [perfumes])

    return (
        <section ref={sectionRef} className="py-8 bg-[#f4f4f0]">
            <div className="px-3 lg:px-24">

                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h3 className="font-headline text-3xl mt-4 tracking-tight text-[#1b1c1a]">{heading}</h3>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 flex items-center justify-center border border-[#c4c7c7] hover:border-black transition-all"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 flex items-center justify-center border border-[#c4c7c7] hover:border-black transition-all"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {perfumes.map((perfume) => (
                        <div key={perfume.id} className="flex-none w-[240px] md:w-[260px] lg:w-[280px] snap-start perfume-card card-hidden">
                            <PerfumeCard key={perfume.id}{...perfume} />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
