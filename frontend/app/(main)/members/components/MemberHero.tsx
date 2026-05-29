'use client'

// components/MemberHero.tsx
export const MemberHero = () => {
    return (
        <section className="relative bg-surface overflow-hidden">

            {/* Subtle background texture lines */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute top-0 left-0 w-full h-px bg-outline-variant/20" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-outline-variant/20" />
                <div className="absolute top-0 left-[33%] w-px h-full bg-outline-variant/10" />
                <div className="absolute top-0 left-[66%] w-px h-full bg-outline-variant/10" />
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 min-h-[88vh]">

                {/* Left — Text */}
                <div className="flex flex-col justify-center py-24 pr-0 lg:pr-20 z-10">

                    {/* Eyebrow */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px w-8 bg-secondary" />
                        <span className="font-label text-secondary text-[10px] uppercase tracking-[0.35em]">
                            Members Exclusive
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-headline text-primary leading-[1.05] mb-8">
                        <span className="block text-5xl md:text-7xl">The</span>
                        <span className="block text-6xl md:text-8xl italic text-secondary">Inner</span>
                        <span className="block text-5xl md:text-7xl">Circle</span>
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-px bg-outline-variant mb-8" />

                    {/* Body */}
                    <p className="font-body text-outline text-base md:text-lg leading-relaxed max-w-md mb-12">
                        A curated journey for the olfactory enthusiast. Four tiers of privilege — each unlocking a deeper layer of the Redolence experience.
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-6">
                        <button className="group flex items-center gap-3 bg-primary text-surface px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]">
                            Explore Benefits
                            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </button>
                        <span className="font-label text-[10px] uppercase tracking-widest text-outline/60">
                            From NPR 5,500
                        </span>
                    </div>

                    {/* Tier strip */}
                    <div className="flex items-center gap-6 mt-16 pt-10 border-t border-outline-variant/20">
                        {[
                            { name: "Top Note", tier: "Entry" },
                            { name: "Heart Note", tier: "Silver" },
                            { name: "Base Note", tier: "Gold" },
                            { name: "The Sillage", tier: "Elite" },
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="font-label text-[8px] uppercase tracking-widest text-secondary">{t.tier}</span>
                                <span className="font-headline text-primary text-xs italic">{t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — Image */}
                <div className="relative hidden lg:flex items-center justify-end py-16">

                    {/* Background accent block */}
                    <div className="absolute right-0 top-12 bottom-12 w-[88%] bg-surface-container-low" />

                    {/* Offset decorative frame */}
                    <div className="absolute right-6 top-20 bottom-20 w-[80%] border border-secondary/20" />

                    {/* Main image */}
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIY1sCvpjr6CAlmeaXIuDU7VyplSjsE21YmtgXqGIagcdU8oEkv2k1DkAXpYXpLkFdgRqkDKMdBW0ItpYYAia4IvmwmPaCWEA5gvVvNzIJ1ZsOS-lTYaEZ7SkL8eR-7kspCeceltcGYKhMuDWw9V6UrfaYANGRiixVZOnQBezs8_Y9SJnTt98EpP949oYaY-9dY2JGMPlbKmQ40Xaux47vFo2MsIy2I5OQtyDk9m9VSCcqtEONjhyjGsDEKp_NcykDyacUZ_YnOAvh"
                        alt="Redolence Nepal Aesthetic"
                        className="relative z-10 w-[78%] h-[72vh] object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.01]"
                    />

                    {/* Floating label */}
                    <div className="absolute bottom-28 left-8 z-20 bg-surface px-5 py-4 border border-outline-variant/30 shadow-lg">
                        <p className="font-label text-[9px] uppercase tracking-[0.25em] text-secondary mb-1">Est. in</p>
                        <p className="font-headline text-primary text-xl italic">Kathmandu</p>
                    </div>
                </div>

            </div>
        </section>
    );
};