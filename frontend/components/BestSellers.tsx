'use client';

import { PerfumeSummary } from "@/types/perfumes";
import Link from "next/link";

export default function BestSellers({ perfumes }: { perfumes: PerfumeSummary[] }) {

    const getImg = (perfume: PerfumeSummary) => {
        const secondary =
            perfume.images?.find(img => !img.is_primary)?.image ||
            perfume.images?.[0]?.image;

        return secondary ? `${secondary}` : '';
    };

    const mainFeature = perfumes[0];
    const sideTop = perfumes[1];
    const sideMiddle = perfumes[2];
    const bottomWide = perfumes[3];

    return (
        <section className="py-20 bg-surface">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-24">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="font-headline text-4xl text-[#271310] mb-3">
                        The Hall of Fame
                    </h2>
                    <p className="text-[#504442] tracking-[0.3em] uppercase text-[10px] font-bold">
                        Most desired fragrances this month
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px] lg:max-h-[75vh]">

                    {/* Main Feature */}
                    {mainFeature && (
                        <Link
                            href={`/perfume/${mainFeature.slug}`}
                            className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-[#e4e2de] aspect-[3/4] md:aspect-auto"
                        >
                            <img
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                src={getImg(mainFeature)}
                                alt={mainFeature.name}
                            />

                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

                            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                                <div className="bg-[#775a19] px-3 py-1 text-white text-[9px] uppercase tracking-[0.3em] font-bold mb-3 inline-block">
                                    Seasonal Pick #1
                                </div>

                                <h3 className="font-headline text-2xl md:text-3xl text-white mb-1">
                                    {mainFeature.name}
                                </h3>

                                <p className="text-white/80 mb-3 md:mb-4 italic font-headline text-xs md:text-sm">
                                    {mainFeature.brand}
                                </p>

                                <button className="text-white border-b border-white/40 pb-1 text-[10px] tracking-widest uppercase hover:border-white transition-colors">
                                    Details
                                </button>
                            </div>
                        </Link>
                    )}

                    {/* Side Item 1 */}
                    {sideTop && (
                        <Link
                            href={`/perfume/${sideTop.slug}`}
                            className="relative group overflow-hidden bg-[#e4e2de] aspect-[4/3] md:aspect-auto"
                        >
                            <img
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                src={getImg(sideTop)}
                                alt={sideTop.name}
                            />

                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>

                            <div className="absolute bottom-4 left-5">
                                <h4 className="font-headline text-base md:text-lg text-white">
                                    {sideTop.name}
                                </h4>
                            </div>
                        </Link>
                    )}

                    {/* Side Item 2 */}
                    {sideMiddle && (
                        <Link
                            href={`/perfume/${sideMiddle.slug}`}
                            className="relative group overflow-hidden bg-[#e4e2de] aspect-[4/3] md:aspect-auto"
                        >
                            <img
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                src={getImg(sideMiddle)}
                                alt={sideMiddle.name}
                            />

                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>

                            <div className="absolute bottom-4 left-5">
                                <h4 className="font-headline text-base md:text-lg text-white">
                                    {sideMiddle.name}
                                </h4>
                            </div>
                        </Link>
                    )}

                    {/* Bottom Wide */}
                    {bottomWide && (
                        <Link
                            href={`/perfume/${bottomWide.slug}`}
                            className="md:col-span-2 relative group overflow-hidden bg-[#e4e2de] aspect-[5/2] md:aspect-auto"
                        >
                            <img
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                src={getImg(bottomWide)}
                                alt={bottomWide.name}
                            />

                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>

                            <div className="absolute bottom-4 left-5">
                                <h4 className="font-headline text-base md:text-lg text-white uppercase tracking-widest">
                                    {bottomWide.name}
                                </h4>

                                <p className="text-white/80 text-[10px] italic">
                                    {bottomWide.brand}
                                </p>
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
}