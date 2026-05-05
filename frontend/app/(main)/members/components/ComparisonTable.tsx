export const ComparisonTable = () => {
    return (
        <section className="bg-surface px-8 py-32 md:px-20">
            <div className="mx-auto max-w-5xl">
                <div className="mb-16 text-center">
                    <h2 className="font-headline text-primary text-4xl">Benefits Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant/30">
                                <th className="font-headline text-primary py-8 text-xl font-normal italic">Privilege</th>
                                <th className="font-label text-outline py-8 text-center text-sm uppercase tracking-widest">Enthusiast</th>
                                <th className="font-label text-secondary py-8 text-center text-sm uppercase tracking-widest">Connoisseur</th>
                                <th className="font-label text-primary py-8 text-center text-sm uppercase tracking-widest">Patron</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-outline">
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Decant Discount</td>
                                <td className="py-6 text-center">5%</td>
                                <td className="text-secondary py-6 text-center font-semibold">10%</td>
                                <td className="text-primary py-6 text-center font-bold">15%</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Discovery Sets</td>
                                <td className="py-6 text-center">Quarterly</td>
                                <td className="py-6 text-center">Quarterly</td>
                                <td className="text-primary py-6 text-center font-medium">Monthly</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Curator Access</td>
                                <td className="py-6 text-center">—</td>
                                <td className="py-6 text-center">Semi-Annual</td>
                                <td className="text-primary py-6 text-center font-medium">Unlimited</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Event Access</td>
                                <td className="py-6 text-center text-sm">Digital Only</td>
                                <td className="py-6 text-center text-sm">In-Store</td>
                                <td className="text-primary py-6 text-center text-sm font-medium">VIP Front Row</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Complimentary 5ml</td>
                                <td className="py-6 text-center">—</td>
                                <td className="py-6 text-center">—</td>
                                <td className="text-primary py-6 text-center font-medium">Unlimited</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10">
                                <td className="py-6 font-medium">Rare Attar Waitlist</td>
                                <td className="py-6 text-center">Standard</td>
                                <td className="text-secondary py-6 text-center font-medium">Priority</td>
                                <td className="text-primary py-6 text-center font-bold">First Call</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};