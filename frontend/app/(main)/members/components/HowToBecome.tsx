export const AscensionSection = () => {
    return (
        <section className="bg-surface px-8 py-32 md:px-20 overflow-hidden">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 md:flex-row">
                <div className="w-full md:w-1/2">
                    <img
                        className="h-[700px] w-full rounded-md object-cover grayscale transition-all duration-1000 hover:grayscale-0 shadow-xl"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-zYqZZU4uOl-T4weg0SJhe9bqjz9zG4t-oPXpecQXWo4vVxHDxsnsBf_Y02W6I5PojfdA6yq77PZByYQSyWWehRyysHxE17wc2dTKAEXAf6_iCFDlBbyHr4WXjWNmZ7MeC_K26U80i_dh3MZ7XylMubG8U_ippU-8fR1IoEYkZAlH44K3DFXwjLAK7uNFL2Mze9MyxZk_bAKXaeVN5X5nZGbhvYhcGg1Pl84w2Kwt95A-n95L1cbHTzXfloKh6ljwCnXZL3s_Fbpi"
                        alt="The Olfactory Experience"
                    />
                </div>
                <div className="w-full space-y-16 md:w-1/2">
                    <div>
                        <h2 className="font-headline text-primary mb-6 text-5xl">How to Ascend</h2>
                        <p className="font-body text-outline text-lg font-light leading-relaxed">
                            The transition is seamless. Your passion for curating fine fragrances naturally leads to your progression within The Inner Circle.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className="group flex gap-8">
                            <div className="border-secondary text-secondary group-hover:bg-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-headline text-xl italic transition-all group-hover:text-white">1</div>
                            <div>
                                <h4 className="font-headline text-primary mb-2 text-xl">Curate</h4>
                                <p className="font-body text-outline leading-relaxed">Browse our extensive collection of artisanal decants and rare extraits in our digital gallery or private studio.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="group flex gap-8">
                            <div className="border-secondary text-secondary group-hover:bg-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-headline text-xl italic transition-all group-hover:text-white">2</div>
                            <div>
                                <h4 className="font-headline text-primary mb-2 text-xl">Invest</h4>
                                <p className="font-body text-outline leading-relaxed">Purchase your favorites. Every investment is automatically tracked within your personal olfactory profile.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="group flex gap-8">
                            <div className="border-secondary text-secondary group-hover:bg-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-headline text-xl italic transition-all group-hover:text-white">3</div>
                            <div>
                                <h4 className="font-headline text-primary mb-2 text-xl">Ascend</h4>
                                <p className="font-body text-outline leading-relaxed">Automatically unlock new tiers as your annual spending reaches the thresholds. Your benefits begin instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};