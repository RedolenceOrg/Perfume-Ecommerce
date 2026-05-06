'use client'
import { Perfume, Decant } from '@/types/perfumes'
import NotePyramid from './NotePyramid'
import { useState } from 'react'

interface HeroProps {
    perfume: Perfume
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function HeroSection({ perfume }: HeroProps) {
    const primaryImage = perfume.images.find(img => img.is_primary) || perfume.images[0]
    const fullPrice = perfume.price

    const [selectedSize, setSelectedSize] = useState<Decant | 'full' | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(primaryImage)

    const selectedPrice = selectedSize === 'full'
        ? fullPrice
        : selectedSize
            ? selectedSize.price
            : 0

    const totalPrice = selectedPrice * quantity

    const handleSelect = (size: Decant | 'full') => {
        if (selectedSize === size) {
            setSelectedSize(null)
            setQuantity(1)
        } else {
            setSelectedSize(size)
            setQuantity(1)
        }
    }

    const isSelected = (size: Decant | 'full') => {
        if (size === 'full') return selectedSize === 'full'
        return selectedSize !== 'full' && selectedSize?.size === (size as Decant).size
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 px-6 lg:px-16 items-start pt-3 lg:pt-6">

            {/* Left - Image */}
            <div className="flex gap-4 top-10 self-start">

                {/* Thumbnails */}
                <div className="flex flex-col gap-3 w-28 flex-shrink-0">
                    {perfume.images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`aspect-square overflow-hidden cursor-pointer border transition-all duration-300 
                            ${selectedImage?.image === img.image
                                    ? 'border-secondary shadow-md scale-105'
                                    : 'border-transparent hover:border-outline/40 hover:scale-105'
                                }`}
                        >
                            <img
                                src={`${BASE_URL}${img.image}`}
                                alt={perfume.name}
                                className="w-full h-full object-contain bg-surface-container-high"
                            />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 aspect-square overflow-hidden bg-surface-container-high  shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img
                        src={`${BASE_URL}${selectedImage?.image || primaryImage.image}`}
                        alt={perfume.name}
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* Right - Details */}
            <div className="flex flex-col space-y-6 py-4 px-6">

                {/* Title */}
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold">
                        {perfume.brand}
                    </p>
                    <h1 className="font-headline text-4xl text-primary leading-tight">
                        {perfume.name}
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-outline">
                        {perfume.gender} · {perfume.family?.join(', ')}
                    </p>
                </div>

                {/* Description */}
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-md">
                    {perfume.description}
                </p>

                {/* Size Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {perfume.decant.map((decant) => (
                        <div
                            key={decant.size}
                            onClick={() => handleSelect(decant)}
                            className={`border p-4 text-center cursor-pointer transition-all duration-300 rounded-xl
                            ${isSelected(decant)
                                    ? 'border-secondary bg-secondary/10 shadow-sm scale-[1.02]'
                                    : 'border-outline/20 hover:border-secondary hover:shadow-sm'
                                }`}
                        >
                            <p className="text-[11px] uppercase tracking-widest text-outline mb-1">
                                {Math.round(decant.size)}ml
                            </p>
                            <p className="font-headline text-sm font-semibold text-primary">
                                NRS {Math.round(decant.price)}
                            </p>
                        </div>
                    ))}

                    {/* Full Bottle */}
                    <div
                        onClick={() => handleSelect('full')}
                        className={`col-span-3 border p-4 text-center cursor-pointer transition-all duration-300 rounded-xl
                        ${isSelected('full')
                                ? 'border-secondary bg-secondary/10 shadow-sm scale-[1.02]'
                                : 'border-outline/20 hover:border-secondary hover:shadow-sm'
                            }`}
                    >
                        <p className="text-[11px] uppercase tracking-widest text-outline mb-1">
                            Full Bottle
                        </p>
                        <p className="font-headline text-sm font-semibold text-primary">
                            NRS {Math.round(fullPrice).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Quantity + Total */}
                {selectedSize && (
                    <div className="flex items-center justify-between border-t border-outline/10 pt-4 animate-fadeIn">

                        {/* Counter */}
                        <div className="flex items-center gap-6 border border-outline/20 px-5 py-2 rounded-full">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="text-lg hover:text-secondary transition"
                            >
                                −
                            </button>
                            <span className="font-headline text-lg w-6 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="text-lg hover:text-secondary transition"
                            >
                                +
                            </button>
                        </div>

                        {/* Price */}
                        <div className="font-headline text-xl font-semibold text-secondary">
                            NRS {Math.round(totalPrice)}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        disabled={!selectedSize}
                        className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-full transition-all duration-300
                        ${!selectedSize
                                ? 'bg-primary/30 cursor-not-allowed'
                                : 'bg-primary hover:opacity-90 shadow-sm hover:shadow-md'
                            } text-white`}
                    >
                        Add to Cart
                    </button>

                    <button className="material-symbols-outlined border border-outline/20 p-3 rounded-full hover:bg-surface-container-high transition">
                        share
                    </button>
                </div>

                {/* Notes */}
                <div className="border-t border-outline/10 pt-6">
                    <NotePyramid perfume={perfume} />
                </div>
            </div>
        </section>
    )
}