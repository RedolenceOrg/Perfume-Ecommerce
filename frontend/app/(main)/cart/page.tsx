'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authapiDelete, authapiGet, authApiUpdate } from '@/context/api'
import { CartItem } from '@/types/perfumes'
import { toast } from 'react-toastify'

export default function CartPage() {
    const [cartData, setCartData] = useState<{ items: CartItem[], grand_total: number } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    console.log(cartData)
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await authapiGet('/cart/view/')
                if (res.status === 401 || res.status === 403) {
                    router.push('/login')
                    return
                }
                if (res.ok) {
                    const data = await res.json()
                    setCartData(data)
                }
            } catch (err) {
                console.error("Failed to fetch cart", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [router])

    // Placeholders for your actions
    const handleRemoveItem = async (id: number) => {
        const payload = {
            item_id: id
        }
        const res = await authapiDelete('/cart/delete/', payload)
        if (res.ok) {
            const data = await res.json()
            toast.success("Deleted Item Successfully")
            setCartData(prev => prev ? {
                items: prev.items.filter(item => item.id !== id),
                grand_total: data.grand_total
            } : null)
        }
        else
            toast.error("Something went wrong")


    }
    const handleUpdateQuantity = async (id: number, quantity: number) => {
        const payload = {
            item_id: id,
            quantity: quantity,
        }

        const res = await authApiUpdate('/cart/update/', payload)
        const data = await res.json()
        if (res.ok) {

            toast.info("Updated Item Successfully")
            setCartData(prev => prev ? {
                items: prev.items.map(item =>
                    item.id === data.item_id
                        ? { ...item, quantity: data.quantity, total_price: data.total_price }
                        : item
                ),
                grand_total: data.grand_total
            } : null)
        }
        else
            toast.error(data.detail || "Failed to update cart")


    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <p className="font-headline text-2xl text-primary animate-pulse">Refining your selection...</p>
        </div>
    )

    if (!cartData || cartData.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
                <h1 className="text-5xl font-headline text-primary mb-6">Your bag is empty</h1>
                <p className="text-outline font-body mb-10 text-center max-w-sm leading-relaxed">
                    The finest fragrances from Nepal and beyond are waiting to be discovered.
                </p>
                <button
                    onClick={() => router.push('/shop')}
                    className="bg-primary text-surface-container-lowest px-10 py-4 rounded-xl uppercase text-[11px] tracking-[0.25em] hover:opacity-90 transition-all shadow-sm"
                >
                    View Collections
                </button>
            </div>
        )
    }

    return (
        <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-background text-primary">
            <header className="mb-20">
                <h1 className="font-headline text-5xl md:text-7xl tracking-tight mb-4">
                    Your Selection
                </h1>
                <p className="text-outline font-body max-w-2xl text-sm md:text-base leading-relaxed">
                    A curated archive of your olfactory preferences. Review your selection before finalizing your order.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Cart Items */}
                <section className="lg:col-span-8 space-y-10">
                    <div className="flex items-baseline justify-between border-b border-outline-variant pb-6">
                        <h2 className="font-headline text-3xl">My Cart</h2>
                        <span className="font-body text-secondary text-xs uppercase tracking-widest">
                            ({cartData.items.length.toString().padStart(2, '0')} Items)
                        </span>
                    </div>

                    <div className="divide-y divide-outline-variant/30">
                        {cartData.items.map((item) => (
                            <div key={item.id} className="py-8 flex gap-8 group transition-all duration-500">
                                {/* Image Box */}
                                <div className="w-32 h-44 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/20">
                                    <img
                                        className="w-full h-full object-contain p-2"
                                        src={`${BASE_URL}${item.images}`}
                                        alt={item.perfume_name}
                                    />
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-headline text-2xl">{item.perfume_name}</h3>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
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
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="hover:text-secondary transition-colors font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm font-label tabular-nums">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
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
                        ))}
                    </div>
                </section>

                {/* Summary Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="bg-surface-container-low p-10 rounded-xl space-y-8 sticky top-32 border border-outline-variant/10">
                        <h3 className="font-headline text-2xl border-b border-outline-variant/30 pb-4">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between font-body text-sm">
                                <span className="text-outline">Subtotal</span>
                                <span className="font-semibold text-primary">NRS {Math.round(cartData.grand_total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-body text-sm">
                                <span className="text-outline">Estimated Delivery</span>
                                <span className="text-secondary text-[10px] uppercase tracking-tighter font-bold">Free Shipping</span>
                            </div>

                            <div className="pt-6 flex justify-between items-baseline font-headline text-3xl border-t border-outline-variant">
                                <span className="text-lg font-body uppercase tracking-widest text-outline">Total</span>
                                <span className="text-primary">NRS {Math.round(cartData.grand_total).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/checkout')}
                            className="group flex items-center justify-between px-8 py-5 w-full bg-primary text-surface-container-lowest rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
                        >
                            <span className="text-[11px] font-label font-bold uppercase tracking-[0.25em]">
                                Proceed to Checkout
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
            </div>
        </main>
    )
}