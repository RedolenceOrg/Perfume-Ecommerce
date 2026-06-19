// components/LoyaltyMilestones.tsx
export default function LoyaltyMilestones({ totalSpend, isVerified }: { totalSpend: number, isVerified: boolean }) {
    // Define your tiers
    const tiers = [
        { name: "Top", threshold: 5500 },
        { name: "Heart", threshold: 12000 },
        { name: "Base", threshold: 24000 },
        { name: "Sillage", threshold: 40000 },
    ];

    // Find current and next tier
    const currentTier = [...tiers].reverse().find(t => totalSpend >= t.threshold) || tiers[0];
    const nextTier = tiers.find(t => totalSpend < t.threshold);

    // Calculate progress percentage
    const progress = nextTier
        ? ((totalSpend - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
        : 100;

    const remaining = nextTier ? nextTier.threshold - totalSpend : 0;


    return (

        <section className="w-full bg-surface-container-low p-8 md:p-12 border border-outline-variant/10 relative overflow-hidden">
            {!isVerified && (
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-2xl">lock</span>
                    <p className="font-label text-[10px] uppercase tracking-widest text-outline text-center">
                        Verify your account to unlock loyalty milestones
                    </p>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold block mb-2">
                        Next Milestone
                    </span>
                    <h2 className="font-serif text-3xl text-primary">
                        {nextTier ? `Pathway to ${nextTier.name}` : "Highest Tier Reached"}
                    </h2>
                </div>
                {nextTier && (
                    <p className="font-body text-sm text-outline">
                        Spend <span className="text-primary font-semibold font-sans">NPR {remaining.toLocaleString()}</span> more to unlock exclusive benefits.
                    </p>
                )}
            </div>

            {/* Progress Bar Container */}
            <div className="relative pt-4">
                {/* Track */}
                <div className="h-[2px] w-full bg-outline-variant/30 relative">
                    {/* Progress Fill */}
                    <div
                        className="absolute h-full bg-secondary transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Tier Labels */}
                <div className="flex justify-between mt-6">
                    <div className="flex flex-col">
                        <span className="font-serif text-sm italic text-primary">{currentTier.name}</span>
                        <span className="font-sans text-[10px] text-outline mt-1">NPR {currentTier.threshold.toLocaleString()}</span>
                    </div>
                    {nextTier && (
                        <div className="flex flex-col items-end">
                            <span className="font-serif text-sm italic text-outline/60">{nextTier.name}</span>
                            <span className="font-sans text-[10px] text-outline mt-1">NPR {nextTier.threshold.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Micro-Benefits Placeholder */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-outline-variant/10">
                <div className="flex items-start space-x-4">
                    <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
                    <p className="text-[11px] uppercase tracking-widest text-outline leading-loose">Priority <br />Express Shipping</p>
                </div>
                <div className="flex items-start space-x-4">
                    <span className="material-symbols-outlined text-secondary text-lg">workspace_premium</span>
                    <p className="text-[11px] uppercase tracking-widest text-outline leading-loose">Early Access <br />to Vault Releases</p>
                </div>
                <div className="flex items-start space-x-4">
                    <span className="material-symbols-outlined text-secondary text-lg">event</span>
                    <p className="text-[11px] uppercase tracking-widest text-outline leading-loose">Private <br />Bespoke Sessions</p>
                </div>
            </div>
        </section>
    );
}