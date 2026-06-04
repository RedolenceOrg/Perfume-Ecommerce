'use client';
import { useState, useMemo, useEffect } from 'react';
import { Atomizer, AtomizerVariant } from '@/types/perfumes';
import { authapiPost } from '@/context/api';
import { toast } from 'react-toastify'

export default function AtomizerCard({ atomizers }: { atomizers: Atomizer[] }) {
    if (!atomizers?.length) return null;

    return (
        /* responsive padding and centering */
        <section className="w-full p-6 md:p-16 bg-surface flex flex-col items-center gap-8 md:gap-16">
            {atomizers.map((atomizer) => (
                <AtomizerItem key={atomizer.id} atomizer={atomizer} />
            ))}
        </section>
    );
}

function AtomizerItem({ atomizer }: { atomizer: Atomizer }) {
    // 1. Get unique sizes
    const sizes = useMemo(() => {
        return Array.from(new Set(atomizer.variants.map((v) => Number(v.size)))).sort((a, b) => a - b);
    }, [atomizer.variants]);

    const [selectedSize, setSelectedSize] = useState<number>(sizes[0]);

    // 2. Filter variants by size
    const availableVariantsForSize = useMemo(() => {
        return atomizer.variants.filter((v) => Number(v.size) === selectedSize);
    }, [atomizer.variants, selectedSize]);

    // 3. Current selected variant state
    const [selectedVariant, setSelectedVariant] = useState<AtomizerVariant>(availableVariantsForSize[0]);

    // Sync variant when size changes - useEffect is more appropriate for state updates
    useEffect(() => {
        const match = availableVariantsForSize.find(v => v.colors === selectedVariant?.colors)
            || availableVariantsForSize[0];
        setSelectedVariant(match);
    }, [selectedSize, availableVariantsForSize]);

    const handleAddToCart = async () => {
        const payload = {
            product_type: 'atomizer',
            product_id: selectedVariant.id,
            quantity: 1
        }
        try {
            const res = await authapiPost('/cart/add-to-cart/', payload)
            if (!res.ok) {
                toast.error('Failed to add to cart')
            }
            else {
                toast.success('Added to cart')
            }
        }
        catch (err) {
            toast.error("Failed you must log in to add to cart")
        }
    }

    return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-6 max-w-sm md:max-w-2xl w-full border border-secondary/10 rounded-2xl shadow-xl bg-white overflow-hidden">

            {/* Image Section - Fixed aspect ratio for mobile */}
            <div className="relative w-full aspect-square md:aspect-auto">
                <img
                    src={`${selectedVariant.image}`}
                    alt={atomizer.name}
                    className="w-full h-full object-cover rounded-xl"
                />
                {atomizer.is_premium && (
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Premium Edition
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
                <div className="mb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-secondary">{atomizer.name}</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-2 line-clamp-2 md:line-clamp-none">
                        {atomizer.description}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Size Selection */}
                    <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Available Sizes</span>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 text-xs font-bold border transition-all rounded-lg
                                        ${selectedSize === size
                                            ? 'bg-secondary text-white border-secondary shadow-md scale-105'
                                            : 'border-gray-200 text-gray-500 hover:border-secondary/50'}`}
                                >
                                    {size}ml
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    {availableVariantsForSize.some(v => v.colors !== '') && (
                        <div>
                            <span className="text-[10px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Select Color</span>
                            <div className="flex flex-wrap gap-4">
                                {availableVariantsForSize.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        title={variant.colors}
                                        className={`w-8 h-8 rounded-full border-2 transition-all relative
                                            ${selectedVariant.id === variant.id
                                                ? 'border-secondary scale-110 shadow-lg'
                                                : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: variant.colors.toLowerCase() }}
                                    >

                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section - Sticks to bottom on desktop */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Price</span>
                        <span className="text-2xl font-body text-secondary">
                            ${Number(selectedVariant?.price || 0).toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 md:flex-none bg-secondary px-8 py-3 text-white text-sm font-body rounded-xl hover:bg-secondary/90 transition-all shadow-lg active:scale-95 uppercase tracking-tight"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}