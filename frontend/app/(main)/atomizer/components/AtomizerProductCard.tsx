// components/AtomizerProductCard.tsx
'use client';
import { useState } from 'react';
import { Atomizer, AtomizerVariant } from '@/types/perfumes';
import { authapiPost } from '@/context/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import AtomizerQuickViewModal from './Atomizerquickviewmodal';

interface AtomizerProductCardProps {
    atomizer: Atomizer;
    variant: AtomizerVariant;
}

export default function AtomizerProductCard({ atomizer, variant }: AtomizerProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const displayImage = variant.images?.[0]?.image ?? '/placeholder.png';
    const outOfStock = Number(variant.available_stock) <= 0;

    const handleAddToCart = async () => {
        const payload = {
            product_type: 'atomizer',
            quantity: 1,
            product_id: variant.id,
        };

        try {
            const res = await authapiPost('/cart/add-to-cart/', payload);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to add to cart');
                return;
            }

            if (data.already_in_cart) {
                toast.info('Cart quantity updated');
            } else {
                toast.success('Added to cart');
            }
        } catch (err) {
            toast.error('You must log in to add to cart');
        }
    };

    return (
        <>
            <div className="relative border border-outline-variant border-2 bg-surface p-4 flex flex-col group transition-all duration-200 hover:border-outline h-full">
                {atomizer.is_premium && (
                    <span className="bg-primary text-white text-[10px] font-bold font-body uppercase tracking-widest px-3 py-1 absolute top-2 left-0 z-10 border border-outline rounded-r-xl">
                        Premium
                    </span>
                )}

                <div className="aspect-[4/5] w-full relative mb-6 overflow-hidden rounded-lg bg-background">
                    <Image
                        src={displayImage}
                        alt={atomizer.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />

                    {outOfStock && (
                        <span className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                            Sold Out
                        </span>
                    )}

                    {/* Desktop only: hover-triggered overlay */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="hidden md:block absolute bottom-0 left-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                    >
                        View
                    </button>
                </div>

                <div className="flex flex-col flex-grow gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-headline text-lg text-primary leading-tight mt-1">
                                {atomizer.name}
                            </h3>
                            <span className="font-label text-[14px] text-secondary font-bold uppercase tracking-widest">
                                {variant.size}ml
                            </span>
                            {variant.colors && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span
                                        className="w-3 h-3 rounded-full border border-outline-variant"
                                        style={{ backgroundColor: variant.colors.toLowerCase() }}
                                    />
                                    <span className="font-body text-[11px] text-outline capitalize">
                                        {variant.colors}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="font-label text-sm font-extrabold text-tertiary pt-1">
                            Rs. {Number(variant.price).toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="md:hidden mt-auto pt-4 w-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded"
                    >
                        View
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <AtomizerQuickViewModal
                    atomizer={atomizer}
                    variant={variant}
                    onClose={() => setIsModalOpen(false)}
                    onAddToCart={handleAddToCart}
                />
            )}
        </>
    );
}