import { useRouter } from 'next/navigation'

interface OrderSummaryProps {
    grandTotal: number;
    hasoutofstock: boolean
}

export default function OrderSummary({ grandTotal, hasoutofstock }: OrderSummaryProps) {
    const router = useRouter()


    return (
        <aside className="lg:col-span-4">
            <div className="bg-surface-container-low p-10 rounded-xl space-y-8 sticky top-32 border border-outline-variant/10">
                <h3 className="font-headline text-2xl border-b border-outline-variant/30 pb-4">
                    Order Summary
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between font-body text-sm">
                        <span className="text-outline">Subtotal</span>
                        <span className="font-semibold text-primary">
                            NRS {Math.round(grandTotal).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                        <span className="text-outline">Estimated Delivery</span>
                        <span className="text-secondary text-[10px] uppercase tracking-tighter font-bold">
                            Free Shipping
                        </span>
                    </div>

                    <div className="pt-6 flex justify-between items-baseline font-headline text-3xl border-t border-outline-variant">
                        <span className="text-lg font-body uppercase tracking-widest text-outline">Total</span>
                        <span className="text-primary">NRS {Math.round(grandTotal).toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={() => !hasoutofstock && router.push('/checkout')}
                    disabled={hasoutofstock}
                    className={`group flex items-center justify-between px-8 py-5 w-full bg-primary text-surface-container-lowest rounded-xl transition-all duration-300 shadow-lg
    ${hasoutofstock
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:opacity-90'
                        }`}
                >
                    <span className="text-[11px] font-label font-bold uppercase tracking-[0.25em]">
                        {hasoutofstock ? 'Remove out of stock items' : 'Proceed to Checkout'}
                    </span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                    </span>
                </button>

                <div className="bg-surface-container-lowest/50 p-4 rounded-lg">
                    <p className="text-[10px] font-body text-outline leading-relaxed text-center italic">
                        "A fragrance is a story told in scent."
                        <br />Thank you for choosing Redolence Nepal.
                    </p>
                </div>
            </div>
        </aside>
    )
}