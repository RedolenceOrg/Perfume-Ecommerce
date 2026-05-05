export const TiersSection = () => {
    return (
        <section className="bg-surface-container-low px-8 py-32 md:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-24 space-y-4 text-center">
                    <h2 className="font-headline text-primary text-4xl md:text-5xl">Distinguished Tiers</h2>
                    <p className="font-body text-outline">Annual investments unlock extraordinary olfactory access.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Tier 1 */}
                    <div className="bg-surface-container-lowest group flex flex-col justify-between rounded-md border border-outline-variant/10 p-12 transition-all duration-500 hover:-translate-y-2">
                        <div>
                            <div className="mb-12">
                                <span className="font-label text-secondary text-xs uppercase tracking-widest">Level 01</span>
                                <h3 className="font-headline text-primary mt-2 text-3xl">The Enthusiast</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">5% off all decants</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">Quarterly discovery sets</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">Early access to new arrivals</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-outline-variant/20 mt-16 border-t pt-8">
                            <p className="font-label text-outline mb-2 text-xs uppercase tracking-widest">Requirement</p>
                            <p className="font-headline text-primary text-2xl italic">NPR 25,000+</p>
                        </div>
                    </div>

                    {/* Tier 2 - Featured */}
                    <div className="bg-primary group relative flex flex-col justify-between overflow-hidden rounded-md p-12 shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-secondary-container material-symbols-outlined text-4xl opacity-40" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        </div>
                        <div>
                            <div className="mb-12">
                                <span className="text-secondary-container font-label text-xs uppercase tracking-widest">Level 02</span>
                                <h3 className="font-headline mt-2 text-3xl text-white">The Connoisseur</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-secondary-container material-symbols-outlined">check_circle</span>
                                    <p className="font-body text-surface-container-low text-sm">10% off all decants</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-secondary-container material-symbols-outlined">check_circle</span>
                                    <p className="font-body text-surface-container-low text-sm">Semi-annual private consultations</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-secondary-container material-symbols-outlined">check_circle</span>
                                    <p className="font-body text-surface-container-low text-sm">Exclusive in-store event invitations</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-secondary-container material-symbols-outlined">check_circle</span>
                                    <p className="font-body text-surface-container-low text-sm">Priority waitlist for rare attars</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 border-t border-white/10 pt-8">
                            <p className="font-label mb-2 text-xs uppercase tracking-widest text-white/60">Requirement</p>
                            <p className="text-secondary-container font-headline text-2xl italic">NPR 75,000+</p>
                        </div>
                    </div>

                    {/* Tier 3 */}
                    <div className="bg-surface-container-lowest group flex flex-col justify-between rounded-md border border-outline-variant/10 p-12 transition-all duration-500 hover:-translate-y-2">
                        <div>
                            <div className="mb-12">
                                <span className="font-label text-secondary text-xs uppercase tracking-widest">Level 03</span>
                                <h3 className="font-headline text-primary mt-2 text-3xl">The Patron</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">15% off all decants</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">Personal fragrance curator</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">Unlimited 5ml standard decants</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                                    <p className="font-body text-outline text-sm">First priority for vault releases</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-outline-variant/20 mt-16 border-t pt-8">
                            <p className="font-label text-outline mb-2 text-xs uppercase tracking-widest">Requirement</p>
                            <p className="font-headline text-primary text-2xl italic">NPR 200,000+</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};