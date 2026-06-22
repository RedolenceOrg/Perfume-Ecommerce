import Image from 'next/image'
export default function SeasonalPick() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#efeeea]">
            {/* Full-Bleed Image Container */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="https://res.cloudinary.com/dzj95e0iv/image/upload/q_auto/f_auto/v1782015326/lelaboHeroForWebsite_edwmt8.webp"
                    alt="Spring Collection"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>
            {/* 3. Text Content Container - Changed to justify-start */}
            <div className="relative h-full w-full flex flex-col items-center justify-start text-center px-6 pt-16 md:pt-48">

                {/* Large "SPRING" Heading - Added this back as it's the core of the request */}
                <h2 className="font-serif text-7xl md:text-[10rem] lg:text-[13rem] text-white tracking-tighter leading-none mb-2 opacity-90 drop-shadow-2xl">
                    Spring
                </h2>

                {/* Sub-label - Moved closer to the heading */}
                <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.5em] text-white/90 mb-12">
                    Collection — 2026
                </p>

                {/* Minimalist CTA Button */}
                <div className="mt-4">
                    <button className="border border-white text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-sm active:scale-95">
                        Shop the Season
                    </button>
                </div>
            </div>
        </section>
    );
}