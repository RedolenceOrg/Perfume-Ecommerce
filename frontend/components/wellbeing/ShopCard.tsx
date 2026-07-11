"use client";

import { useState } from "react";
import { NasalStrip } from "@/types/perfumes";
import { authapiPost } from "@/context/api";
import { toast } from "react-toastify";

export default function ShopCard({ nasalStrip }: { nasalStrip: NasalStrip }) {
    const [quantity, setQuantity] = useState(1);

    // Caps the increment at available_stock
    const increment = () => {
        setQuantity((prev) => (prev < nasalStrip.available_stock ? prev + 1 : prev));
    };
    const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
    const inStock = nasalStrip.stock > 0;

    const currentTotalPrice = nasalStrip.price * quantity;
    const currentTotalStrips = 14 * quantity;

    const handleAddToCartNasal = async () => {
        const payload = {
            product_type: 'nasalstrip',
            product_id: nasalStrip.id,
            quantity: quantity
        };
        try {
            const res = await authapiPost('/cart/add-to-cart/', payload);
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail || "Failed to add to cart. Please try again.");
            } else {
                toast.success("Successfully added to cart.");
            }
        } catch (error) {
            toast.error("An error occurred while adding to cart.");
        }
    };

    return (
        <section className="bg-surface-container-low px-8 py-20 md:px-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-16">

                    {/* Product Image */}
                    <div className="bg-surface-container-lowest border-outline-variant/20 relative aspect-square overflow-hidden rounded-md border p-2 group">
                        <img
                            alt="Aurora Breath Nasal Strips Product Presentation"
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-103"
                            src={nasalStrip.image}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col space-y-6">
                        <div className="space-y-3">
                            <span className="font-label text-secondary text-xs uppercase tracking-[0.25em]">
                                Oxygen Recovery
                            </span>
                            <h1 className="font-headline text-primary text-4xl md:text-5xl">
                                Aurora Breath
                            </h1>
                            <div className="flex flex-col gap-0.5 pt-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-headline text-primary text-2xl transition-all duration-300">
                                        NRS {currentTotalPrice}
                                    </span>
                                    <span className="font-label text-outline text-xs uppercase tracking-wider">
                                        / {currentTotalStrips} Strips ({quantity} {quantity === 1 ? 'Packet' : 'Packets'})
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-outline-variant/20 border-t" />

                        <div className="space-y-4">
                            <p className="font-body text-outline text-sm leading-relaxed">
                                Experience the invisible luxury of effortless breath. Aurora Breath uses
                                medical-grade adhesion and a precision-engineered structural core to gently lift
                                the nasal passages, expanding your intake by up to 30%.
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {["Better Airflow", "Latex Free", "Clinical Grade"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="font-label border-outline-variant/30 text-secondary border px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-sm bg-surface-container-lowest/50"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Purchase Interaction */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                {/* Packet Quantity Selector Container */}
                                <div className="border-outline-variant/30 bg-surface-container-lowest flex h-12 items-center border rounded-sm">
                                    <button
                                        className="text-secondary hover:bg-surface-container-high h-full px-4 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        onClick={decrement}
                                        disabled={quantity <= 1}
                                        aria-label="Decrease packet count"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <input
                                        className="font-label text-primary w-10 border-none bg-transparent text-center text-sm focus:ring-0"
                                        readOnly
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={quantity}
                                    />
                                    <button
                                        className="text-secondary hover:bg-surface-container-high h-full px-4 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        onClick={increment}
                                        disabled={quantity >= nasalStrip.available_stock}
                                        aria-label="Increase packet count"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>

                                {/* Dynamic submission target */}
                                <button
                                    className="bg-primary text-white font-label h-12 flex-1 rounded-sm text-[14px] uppercase tracking-widest transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                                    disabled={!inStock}
                                    onClick={handleAddToCartNasal}
                                >
                                    {inStock ? `Add to Cart • NRS ${currentTotalPrice}` : "Out of Stock"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}