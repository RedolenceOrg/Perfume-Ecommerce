export const TiersSection = () => {
    const tiers = [
        {
            level: "01",
            name: "The Top Note",
            subtitle: "Entry Club",
            requirement: "NPR 5,500+",
            featured: false,
            benefits: [
                { icon: "sell", text: "5% flat discount on all orders" },
                { icon: "new_releases", text: "Early access to new drops" },
            ],
        },
        {
            level: "02",
            name: "The Middle Note",
            subtitle: "Silver Tier",
            requirement: "NPR 20,000+",
            featured: false,
            benefits: [
                { icon: "sell", text: "10% flat discount on all orders" },
                { icon: "local_shipping", text: "Free shipping on every order" },
                { icon: "cake", text: "Birthday gift — 3ml signature decant" },
            ],
        },
        {
            level: "03",
            name: "The Base Note",
            subtitle: "Gold Tier",
            requirement: "NPR 35,000+",
            featured: true,
            benefits: [
                { icon: "sell", text: "12% flat discount on all orders" },
                { icon: "person_search", text: "Personal fragrance consultation" },
                { icon: "inventory_2", text: "Exclusive access to limited Thrift Batches" },
            ],
        },
        {
            level: "04",
            name: "The Sillage",
            subtitle: "Elite Tier",
            requirement: "NPR 55,000+",
            featured: false,
            benefits: [
                { icon: "sell", text: "15% flat discount on all orders" },
                { icon: "lock_open", text: "Vault access — rare & archived perfumes" },
                { icon: "science", text: "Complimentary 5ml decant gift" },
                { icon: "water_drop", text: "One premium atomizer gifted per cycle" },
            ],
        },
    ];

    return (
        <section className="bg-surface-container-low px-8 py-32 md:px-20">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 space-y-4 text-center">
                    <span className="font-label text-secondary text-xs uppercase tracking-[0.25em]">Club Members Only</span>
                    <h2 className="font-headline text-primary text-4xl md:text-5xl">Distinguished Tiers</h2>
                    <p className="font-body text-outline max-w-xl mx-auto text-sm leading-relaxed">
                        Each tier unlocks as your cumulative spend grows. Benefits stack — every level carries the privileges of those before it.
                        Reaching a new tier resets your spend.
                    </p>
                </div>

                {/* Entry requirement notice */}
                <div className="mb-20 flex justify-center">
                    <div className="inline-flex items-center gap-3 border border-secondary/30 bg-secondary-container/20 px-6 py-3">
                        <span className="material-symbols-outlined text-secondary text-sm">info</span>
                        <p className="font-label text-secondary text-[11px] uppercase tracking-widest">
                            Membership unlocks after your first purchase of NPR 5,500 or more along with email verification of account.
                        </p>
                    </div>
                </div>

                {/* Tier Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {tiers.map((tier) =>
                        tier.featured ? (
                            /* Featured card — Gold tier */
                            <div
                                key={tier.level}
                                className="bg-primary group relative flex flex-col justify-between overflow-hidden rounded-md p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:scale-[1.03]"
                            >
                                {/* Decorative icon */}
                                <div className="absolute top-0 right-0 p-4">
                                    <span
                                        className="material-symbols-outlined text-secondary-container text-5xl opacity-30"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        workspace_premium
                                    </span>
                                </div>

                                <div>
                                    <div className="mb-10">
                                        <span className="font-label text-secondary-container text-[10px] uppercase tracking-[0.25em] opacity-80">
                                            Level {tier.level} · {tier.subtitle}
                                        </span>
                                        <h3 className="font-headline mt-2 text-3xl text-white">{tier.name}</h3>
                                    </div>
                                    <div className="space-y-5">
                                        {tier.benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <span
                                                    className="material-symbols-outlined text-secondary-container text-base mt-0.5"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    {b.icon}
                                                </span>
                                                <p className="font-body text-surface-container-low text-sm leading-snug">{b.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-14 border-t border-white/10 pt-7">
                                    <p className="font-label mb-1 text-[10px] uppercase tracking-widest text-white/50">Spend Threshold</p>
                                    <p className="font-headline text-secondary-container text-2xl italic">{tier.requirement}</p>
                                </div>
                            </div>
                        ) : (
                            /* Standard card */
                            <div
                                key={tier.level}
                                className="bg-surface-container-lowest group flex flex-col justify-between rounded-md border border-outline-variant/20 p-10 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div>
                                    <div className="mb-10">
                                        <span className="font-label text-secondary text-[10px] uppercase tracking-[0.25em]">
                                            Level {tier.level} · {tier.subtitle}
                                        </span>
                                        <h3 className="font-headline text-primary mt-2 text-3xl">{tier.name}</h3>
                                    </div>
                                    <div className="space-y-5">
                                        {tier.benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <span
                                                    className="material-symbols-outlined text-secondary text-base mt-0.5"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    {b.icon}
                                                </span>
                                                <p className="font-body text-outline text-sm leading-snug">{b.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-outline-variant/20 mt-14 border-t pt-7">
                                    <p className="font-label text-outline mb-1 text-[10px] uppercase tracking-widest">Spend Threshold</p>
                                    <p className="font-headline text-primary text-2xl italic">{tier.requirement}</p>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Footer note */}
                <p className="font-body text-outline text-center text-xs mt-12 tracking-wide">
                    Thresholds reflect cumulative lifetime spend. Tier upgrades apply automatically at the next billing cycle.
                </p>
            </div>
        </section>
    );
};