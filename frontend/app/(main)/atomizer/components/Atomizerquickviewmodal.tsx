// components/AtomizerQuickViewModal.tsx
'use client';
import { useState } from 'react';
import { Atomizer, AtomizerVariant } from '@/types/perfumes';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AtomizerQuickViewModalProps {
    atomizer: Atomizer;
    variant: AtomizerVariant;
    onClose: () => void;
    onAddToCart: () => void;
}

export default function AtomizerQuickViewModal({
    atomizer,
    variant,
    onClose,
    onAddToCart,
}: AtomizerQuickViewModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = variant.images?.length ? variant.images : [{ id: 0, image: '/placeholder.png', order: 0 }];
    const outOfStock = Number(variant.available_stock) <= 0;

    const showNextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const showPrevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-surface border-2 border-outline-variant rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-black text-white rounded-full p-1.5 hover:opacity-80 transition-opacity"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Carousel */}
                <div className="relative w-full md:w-1/2 aspect-[4/5] bg-background flex-shrink-0">
                    <Image
                        src={images[activeImageIndex].image}
                        alt={`${atomizer.name} - image ${activeImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-4"
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={showPrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={showNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight size={18} />
                            </button>

                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === activeImageIndex ? 'w-4 bg-black' : 'w-1.5 bg-black/30'
                                            }`}
                                        aria-label={`Go to image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {atomizer.is_premium && (
                        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                            Premium
                        </span>
                    )}
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
                    <div>
                        <span className="font-label text-[10px] text-secondary font-bold uppercase tracking-widest">
                            {variant.size}ml
                        </span>
                        <h2 className="font-headline text-2xl text-primary leading-tight mt-1">
                            {atomizer.name}
                        </h2>
                    </div>

                    <p className="font-body text-sm text-outline leading-relaxed">
                        {atomizer.description}
                    </p>

                    <span className="font-label text-lg font-extrabold text-tertiary">
                        Rs. {Number(variant.price).toLocaleString()}
                    </span>

                    {variant.colors && (
                        <div className="flex justify-between items-center text-sm font-body text-primary border-t border-outline-variant pt-4">
                            <span className="text-secondary">Color</span>
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-4 h-4 rounded-full border border-outline-variant"
                                    style={{ backgroundColor: variant.colors.toLowerCase() }}
                                />
                                <span className="font-bold capitalize">{variant.colors}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}
                        >
                            {outOfStock ? 'Out of Stock' : 'Available'}
                        </span>
                    </div>

                    <button
                        onClick={onAddToCart}
                        disabled={outOfStock}
                        className="mt-auto w-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {outOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}