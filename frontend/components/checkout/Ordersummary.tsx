import Link from 'next/link'
import { CartItem } from '@/types/perfumes'
import { VALLEY_DISTRICTS } from '../../types/perfumes'

interface OrderSummaryProps {
    cartData: {
        items: CartItem[]
        grand_total: number
        discount_percent: number
        discount_amount: number
    }
    subtotal: number
    total: number
    shippingCharge: number
    district: string
}

export default function OrderSummary({ cartData, subtotal, total, shippingCharge, district }: OrderSummaryProps) {
    const totalItemsCount = cartData.items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <section className="bg-background p-4 md:p-8 border-r border-outline-variant/20 md:h-full md:overflow-y-auto relative">
            <div className="mb-8">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-outline hover:text-primary transition-colors group"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span>
                    Back to Cart
                </Link>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">Your Selection</p>
            <h1 className="font-headline text-4xl text-primary mb-10 flex flex-wrap items-baseline gap-3">
                <span>Order Summary</span>
                <span className="font-body text-sm font-normal text-outline/70 lowercase tracking-normal">
                    ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                </span>
            </h1>

            <div className="flex flex-col divide-y divide-outline-variant/20 mb-10">
                {cartData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 py-6">
                        <div className="w-24 h-24 rounded-lg bg-surface-container-low flex-shrink-0 overflow-hidden border border-outline-variant/10">
                            <img
                                src={`${item.images}`}
                                alt={item.variant_name}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-body font-bold text-base text-primary truncate">{item.variant_name}</p>
                            <p className="text-xs uppercase tracking-widest text-outline mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-base font-bold text-primary whitespace-nowrap">
                            NPR {Math.round(item.total_price).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between text-base text-outline">
                    <span>Subtotal</span>
                    <span>NPR {Math.round(subtotal).toLocaleString()}</span>
                </div>

                {cartData.discount_percent > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400">
                        <span>Discount ({cartData.discount_percent}%)</span>
                        <span className="font-medium">- NPR {Math.round(cartData.discount_amount).toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-between text-base text-outline">
                    <span>Delivery</span>
                    {district ? (
                        <span className="text-sm font-bold text-primary">
                            NPR {shippingCharge}
                            <span className="text-[10px] text-outline font-normal ml-1">
                                ({VALLEY_DISTRICTS.includes(district) ? 'inside valley' : 'outside valley'})
                            </span>
                        </span>
                    ) : (
                        <span className="text-xs uppercase tracking-widest font-bold text-outline/50">
                            Select district
                        </span>
                    )}
                </div>

                <div className="flex justify-between text-xl font-bold text-primary pt-4 border-t border-outline-variant/20">
                    <span>Total</span>
                    <span>NPR {Math.round(total).toLocaleString()}</span>
                </div>
            </div>
        </section>
    )
}