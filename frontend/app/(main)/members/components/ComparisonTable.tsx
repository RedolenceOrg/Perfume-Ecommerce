export const ComparisonTable = () => {
    const tiers = [
        { name: "The Top Note", subtitle: "Entry", className: "text-outline" },
        { name: "The Heart Note", subtitle: "Silver", className: "text-outline" },
        { name: "The Base Note", subtitle: "Gold", className: "text-secondary" },
        { name: "The Sillage", subtitle: "Elite", className: "text-primary" },
    ];

    const Check = () => (
        <span
            className="material-symbols-outlined text-secondary text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
        >
            check_circle
        </span>
    );

    const Dash = () => <span className="text-outline-variant/60 text-lg">—</span>;

    const rows: { privilege: string; cells: React.ReactNode[] }[] = [
        {
            privilege: "Flat Discount",
            cells: [
                <span className="font-semibold text-outline">5%</span>,
                <span className="font-semibold text-outline">10%</span>,
                <span className="font-semibold text-secondary">12%</span>,
                <span className="font-bold text-primary">15%</span>,
            ],
        },
        {
            privilege: "Early Access — New Drops",
            cells: [<Check />, <Check />, <Check />, <Check />],
        },
        {
            privilege: "Free Shipping",
            cells: [<Dash />, <Check />, <Check />, <Check />],
        },
        {
            privilege: "Birthday Gift (3ml Decant)",
            cells: [<Dash />, <Check />, <Check />, <Check />],
        },
        {
            privilege: "Personal Fragrance Consultation",
            cells: [<Dash />, <Dash />, <Check />, <Check />],
        },
        {
            privilege: "Exclusive Thrift Batch Access",
            cells: [<Dash />, <Dash />, <Check />, <Check />],
        },
        {
            privilege: "Vault Access — Rare Perfumes",
            cells: [<Dash />, <Dash />, <Dash />, <Check />],
        },
        {
            privilege: "Complimentary 5ml Decant Gift",
            cells: [<Dash />, <Dash />, <Dash />, <Check />],
        },
        {
            privilege: "Premium Atomizer Gift",
            cells: [<Dash />, <Dash />, <Dash />, <Check />],
        },
        {
            privilege: "Spend Threshold",
            cells: [
                <span className="font-headline italic text-outline text-lg">NPR 5,500</span>,
                <span className="font-headline italic text-outline text-lg">NPR 12,000</span>,
                <span className="font-headline italic text-secondary text-lg">NPR 24,000</span>,
                <span className="font-headline italic text-primary text-lg">NPR 40,000</span>,
            ],
        },
    ];

    return (
        <section className="bg-surface-container-low px-8 py-32 md:px-20">
            <div className="mx-auto max-w-5xl">
                <div className="mb-16 text-center space-y-3">
                    <span className="font-label text-secondary text-xs uppercase tracking-[0.25em]">Side by Side</span>
                    <h2 className="font-headline text-primary text-4xl">Benefits Comparison</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b-2 border-outline-variant/30">
                                <th className="font-headline text-primary py-8 pr-8 text-xl font-normal italic w-[36%]">
                                    Privilege
                                </th>
                                {tiers.map((tier) => (
                                    <th key={tier.name} className="py-8 text-center align-top">
                                        <span className={`font-label text-[10px] uppercase tracking-[0.2em] block mb-1 ${tier.className}`}>
                                            {tier.subtitle}
                                        </span>
                                        <span className={`font-headline text-sm font-normal block leading-tight ${tier.className}`}>
                                            {tier.name}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-body text-outline">
                            {rows.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`border-b border-outline-variant/10 transition-colors hover:bg-surface-container-low/60 ${i === rows.length - 1 ? "border-b-0 bg-surface-container-low/40" : ""
                                        }`}
                                >
                                    <td className={`py-5 pr-8 text-sm font-medium ${i === rows.length - 1 ? "font-label text-[10px] uppercase tracking-widest text-outline" : ""}`}>
                                        {row.privilege}
                                    </td>
                                    {row.cells.map((cell, j) => (
                                        <td key={j} className="py-5 text-center">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="font-body text-outline text-center text-xs mt-10 tracking-wide">
                    All benefits are cumulative — higher tiers include every privilege from tiers below.
                </p>
            </div>
        </section>
    );
};