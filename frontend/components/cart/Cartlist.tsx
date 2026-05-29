import { CartItem } from '@/types/perfumes'
import CartItemCard from './Cartitemcard'

interface CartListProps {
    items: CartItem[]
    baseUrl: string
    onRemove: (id: number) => void
    onUpdateQuantity: (id: number, quantity: number) => void
}

export default function CartList({ items, baseUrl, onRemove, onUpdateQuantity }: CartListProps) {
    return (
        <section className="lg:col-span-8 space-y-6 sm:space-y-10 px-4 sm:px-0">
            <div className="flex items-baseline justify-between border-b border-outline-variant pb-6">
                <h2 className="font-headline text-2xl sm:text-3xl">My Cart</h2>
                <span className="font-body text-secondary text-[10px] sm:text-xs uppercase tracking-widest">
                    ({items.length.toString().padStart(2, '0')} Items)
                </span>
            </div>

            <div className="divide-y divide-outline-variant/30">
                {items.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        baseUrl={baseUrl}
                        onRemove={onRemove}
                        onUpdateQuantity={onUpdateQuantity}
                    />
                ))}
            </div>
        </section>
    )
}