import { CartItem } from '@/types/perfumes'

interface CartItemCardProps {
    item: CartItem
    baseUrl: string
    onRemove: (id: number) => void
    onUpdateQuantity: (id: number, quantity: number) => void
}

export default function CartItemCard({ item, baseUrl, onRemove, onUpdateQuantity }: CartItemCardProps) {
    return (
        <div className="py-8 flex gap-8 group transition-all duration-500 relative">

            {/* Out of stock overlay */}
            {!item.in_stock && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-red-500">
                        Out of Stock
                    </p>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-all underline"
                    >
                        Remove Item
                    </button>
                </div>
            )}

            {/* Image Box */}
            <div className="w-44 h-46 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/20">
                <img
                    className="w-full h-full object-contain p-2"
                    src={`${baseUrl}${item.images}`}
                    alt={item.perfume_name}
                />
            </div>

            {/* Item Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-headline text-2xl">{item.perfume_name}</h3>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-outline hover:text-error transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                    <p className="text-secondary font-body text-xs uppercase tracking-widest font-semibold">
                        Redolence Nepal Exclusive
                    </p>
                    <div className="mt-4 inline-flex items-center gap-3 px-4 py-1.5 bg-surface-container-high rounded-full">
                        <span className="text-[9px] font-label tracking-widest uppercase text-outline">Selection:</span>
                        <span className="text-xs font-bold text-primary">{item.variant_name}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-5 px-3 py-1 border border-outline-variant rounded-full text-primary">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="hover:text-secondary transition-colors font-bold"
                        >
                            −
                        </button>
                        <span className="text-sm font-label tabular-nums">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="hover:text-secondary transition-colors font-bold"
                        >
                            +
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="font-headline text-xl">NRS {Math.round(item.total_price).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}