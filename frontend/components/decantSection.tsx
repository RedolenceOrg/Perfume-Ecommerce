import Link from "next/link";

export default function DecantsHighlight() {
    return (
        <section className="bg-surface py-12 md:py-20 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12 md:mb-16 text-center">
                <h2 className="font-headline text-4xl md:text-5xl text-primary mb-3 italic">The Decant Edit</h2>
                <p className="font-body text-[#775a19] tracking-[0.4em] uppercase text-[9px] md:text-[10px] font-bold">
                    Travel Size for your needs
                </p>
            </div>

            {/* Clean 2-Column Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

                {/* Card 1: Premium Metal Version */}
                <Link href="/atomizer?variant=premium" className="group block space-y-4">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://i.pinimg.com/1200x/44/83/cd/4483cd7f51155cab403beb9241c525ed.jpg"
                            alt="Premium Metal Atomizers"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-background px-3 py-1.5 shadow-md">
                            <p className="font-mono text-[8px] uppercase tracking-widest font-bold">Premium Edit</p>
                        </div>
                    </div>

                    <div className="px-1">
                        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#775a19]">Multicolor Aluminum Shell</span>
                        <h3 className="font-headline text-xl md:text-2xl text-primary mt-1">The Luxury Metal Atomizer</h3>
                        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed max-w-md">
                            Precision engineered with a durable aluminum casing. Available in an array of finishes to complement your style on the move.
                        </p>
                        <button className="mt-4 text-[9px] uppercase tracking-[0.3em] font-bold text-[#775a19] border-b-2 border-[#775a19]/20 pb-1 group-hover:border-[#775a19] transition-all">
                            View Colors
                        </button>
                    </div>
                </Link>

                {/* Card 2: Glass Non-Premium Version */}
                {/* Subtle top margin shift on desktop creates an elegant asymmetric look */}
                <Link href="/atomizer?variant=essential" className="group block space-y-4 md:mt-12">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative shadow-xl">
                        <img
                            src="https://i.pinimg.com/1200x/bb/3e/b4/bb3eb42021ab810584abbb7d95e83a49.jpg"
                            alt="Essential Glass Decants"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md border border-outline-variant/30">
                            <p className="font-mono text-[8px] uppercase tracking-widest text-primary font-bold">Classic</p>
                        </div>
                    </div>

                    <div className="px-1">
                        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-outline">Minimalist Design</span>
                        <h3 className="font-headline text-xl md:text-2xl text-primary mt-1">The Essential Glass Vial</h3>
                        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed max-w-md">
                            Pure, unadorned thick-cut glass. Designed purely to let the color and character of your favorite fragrance shine through cleanly.
                        </p>
                        <button className="mt-4 text-[9px] uppercase tracking-[0.3em] font-bold text-primary border-b-2 border-primary/20 pb-1 group-hover:border-primary transition-all">
                            Explore Sizes
                        </button>
                    </div>
                </Link>

            </div>
        </section>
    );
}