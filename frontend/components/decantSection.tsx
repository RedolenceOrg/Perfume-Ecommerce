import Link from "next/link";
export default function DecantsHighlight() {
    return (
        <section className="bg-surface overflow-hidden py-10">
            {/* Header stays padded */}
            <div className="px-6 lg:px-16 mb-10 text-center">
                <h2 className="font-headline text-5xl text-primary mb-2 italic">The Decant Edit</h2>
                <p className="font-body text-[#775a19] tracking-[0.4em] uppercase text-[10px] font-bold">
                    Travel Size for your needs
                </p>
            </div>

            {/* Cards flush to screen edges, no container wrapper */}
            <Link href="/atomizer" className="flex items-start gap-5">

                {/* Card 1 — high */}
                <div className="flex-1 mt-0 group">
                    <div className="aspect-[3/4] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://i.pinimg.com/1200x/44/83/cd/4483cd7f51155cab403beb9241c525ed.jpg"
                            alt="Luxury Atomizers"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-md">
                            <p className="font-mono text-[8px] uppercase tracking-widest text-primary font-bold">Refillable Glass</p>
                        </div>
                    </div>
                    <div className="mt-4 px-1.5">
                        <h3 className="font-headline text-lg text-primary">The Essential Atomizer</h3>
                        <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                            Precision engineered for the perfect mist, wherever your journey takes you.
                        </p>
                    </div>
                </div>

                {/* Card 2 — low */}
                <div className="flex-1 mt-[72px] group">
                    <div className="aspect-[2/3] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://i.pinimg.com/1200x/bb/3e/b4/bb3eb42021ab810584abbb7d95e83a49.jpg"
                            alt="Travel Decants"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="mt-4 px-1.5">
                        <h3 className="font-headline text-lg text-primary">Discovery Vials</h3>
                        <p className="text-xs text-on-surface-variant mt-1.5 italic leading-relaxed">
                            Sample our collection before committing to a full flacon.
                        </p>
                        <button className="mt-4 text-[9px] uppercase tracking-[0.3em] font-bold text-[#775a19] border-b-2 border-[#775a19]/20 pb-1 hover:border-[#775a19] transition-all">
                            Explore Decants
                        </button>
                    </div>
                </div>

                {/* Card 3 — mid */}
                <div className="flex-1 mt-5 group">
                    <div className="aspect-[3/4] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://www.scento.com/_next/image?url=https%3A%2F%2Fassets.seobotai.com%2Fcdn-cgi%2Fimage%2Fquality%3D75%2Cw%3D1536%2Ch%3D1024%2Fscento.com%2F69434dd912e0ddc125dbfe6f-1766027562989.jpg&w=3840&q=75"
                            alt="Fragrance Collection"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-md">
                            <p className="font-mono text-[8px] uppercase tracking-widest text-primary font-bold">Best Seller</p>
                        </div>
                    </div>
                    <div className="mt-4 px-1.5">
                        <h3 className="font-headline text-lg text-primary">The Travel Set</h3>
                        <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                            Three icons, travel-ready. Your signature scent, anywhere.
                        </p>
                    </div>
                </div>

                {/* Card 4 — lowest */}
                <div className="flex-1 mt-[90px] group">
                    <div className="aspect-[2/3] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZqs0HQndBbN4UwHVMgl8XajqaelWpefGK1Q&s"
                            alt="Luxury Decants"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="mt-4 px-1.5">
                        <h3 className="font-headline text-lg text-primary">Collector's Edit</h3>
                        <p className="text-xs text-on-surface-variant mt-1.5 italic leading-relaxed">
                            Rare finds, bottled in miniature for the discerning nose.
                        </p>
                        <button className="mt-4 text-[9px] uppercase tracking-[0.3em] font-bold text-[#775a19] border-b-2 border-[#775a19]/20 pb-1 hover:border-[#775a19] transition-all">
                            Shop Now
                        </button>
                    </div>
                </div>

            </Link>
        </section>
    );
}