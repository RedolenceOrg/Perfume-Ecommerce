'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authapiGet, authapiPost } from '@/context/api'
import { useAuth } from '@/context/AuthContext'
import { CartItem } from '@/types/perfumes'
import { toast } from 'react-toastify'

interface CartData {
    items: CartItem[]
    grand_total: number
}

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    const [cartData, setCartData] = useState<CartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [shippingAddress, setShippingAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cod')

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
                    if (!data.items || data.items.length === 0) {
                        router.push('/cart')
                        return
                    }
                    setCartData(data)
                }
            } catch (err) {
                console.error('Failed to fetch cart', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [router])

    const handlePlaceOrder = async () => {
        setError(null)

        // validation
        if (!shippingAddress.trim()) {
            setError('Delivery address is required.')
            return
        }
        if (!phoneNumber.trim()) {
            setError('Phone number is required.')
            return
        }
        if (phoneNumber.trim().length < 10) {
            setError('Please enter a valid phone number.')
            return
        }

        const payload = {
            shipping_address: shippingAddress.trim(),
            phone_number: phoneNumber.trim(),
        }

        const res = await authapiPost('/cart/checkout/', payload)
        const data = res.json()

        if (!res.ok) {
            toast.error(data)
        }

        setPlacing(true)

        try {
            if (paymentMethod === 'cod') {
                // COD → place order directly
                // const res = await authapiPost('/orders/place/', payload)
                // const data = await res.json()
                // if (!res.ok) { setError(data.detail); return }
                // router.push(`/orders/${data.order_id}/`)
                console.log('COD payload:', payload)

            } else if (paymentMethod === 'khalti') {
                // Step 1 → initiate Khalti payment
                // const res = await authapiPost('/payments/khalti/initiate/', payload)
                // const data = await res.json()
                // if (!res.ok) { setError(data.detail); return }
                // window.location.href = data.payment_url  ← Khalti redirects user
                console.log('Khalti payload:', payload)

            } else if (paymentMethod === 'esewa') {
                // Step 1 → initiate eSewa payment
                // const res = await authapiPost('/payments/esewa/initiate/', payload)
                // const data = await res.json()
                // if (!res.ok) { setError(data.detail); return }
                // window.location.href = data.payment_url  ← eSewa redirects user
                console.log('eSewa payload:', payload)
            }

        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setPlacing(false)
        }




    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <p className="font-headline text-2xl text-primary animate-pulse">
                Preparing your order...
            </p>
        </div>
    )

    if (!cartData) return null

    // Calculate total item quantities safely
    const totalItemsCount = cartData.items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-body md:h-screen md:overflow-hidden">

            {/* Left — Order Summary */}
            <section className="bg-background p-4 md:p-8 border-r border-outline-variant/20 md:h-full md:overflow-y-auto relative">

                {/* Back to Cart Navigation Link */}
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-outline hover:text-primary transition-colors group"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">←</span>
                        Back to Cart
                    </Link>
                </div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">
                    Your Selection
                </p>

                {/* Header with Dynamic Item Count */}
                <h1 className="font-headline text-4xl text-primary mb-10 flex flex-wrap items-baseline gap-3">
                    <span>Order Summary</span>
                    <span className="font-body text-sm font-normal text-outline/70 lowercase tracking-normal">
                        ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                    </span>
                </h1>

                {/* Cart Items */}
                <div className="flex flex-col divide-y divide-outline-variant/20 mb-10">
                    {cartData.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-6 py-6">
                            <div className="w-24 h-24 rounded-lg bg-surface-container-low flex-shrink-0 overflow-hidden border border-outline-variant/10">
                                <img
                                    src={`${BASE_URL}${item.images}`}
                                    alt={item.perfume_name}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-body font-bold text-base text-primary truncate">
                                    {item.variant_name}
                                </p>
                                <p className="text-xs uppercase tracking-widest text-outline mt-1">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="text-base font-bold text-primary whitespace-nowrap">
                                NPR {Math.round(item.total_price).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-4 pt-6 border-t border-outline-variant/20">
                    <div className="flex justify-between text-base text-outline">
                        <span>Subtotal</span>
                        <span>NPR {Math.round(cartData.grand_total).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base text-outline">
                        <span>Delivery</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-secondary">
                            Free
                        </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary pt-4 border-t border-outline-variant/20">
                        <span>Total</span>
                        <span>NPR {Math.round(cartData.grand_total).toLocaleString()}</span>
                    </div>
                </div>
            </section>

            {/* Right — Shipping & Payment */}
            <section className="bg-surface-container-low p-8 md:p-16 md:h-full md:overflow-y-auto">
                <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">
                    Almost there
                </p>
                <h2 className="font-headline text-4xl text-primary mb-10">
                    Shipping & Payment
                </h2>

                {/* Greeting */}
                {user?.first_name && (
                    <p className="text-sm text-outline mb-6">
                        Delivering to{' '}
                        <span className="text-primary font-semibold">{user.first_name}</span>
                    </p>
                )}

                {/* Shipping Address */}
                <div className="mb-6">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                        Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Sanepa-2, Lalitpur, Kathmandu"
                        className="w-full bg-background border-b border-outline-variant p-3 text-sm text-primary placeholder:text-outline/40 focus:outline-none focus:border-primary resize-none transition-all"
                    />
                </div>

                {/* Phone Number */}
                <div className="mb-8">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                        className="w-full bg-transparent border-b border-outline-variant p-3 text-sm text-primary placeholder:text-outline/40 focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-4">
                        Payment Method
                    </label>
                    <div className="flex flex-col gap-3">

                        {/* eSewa */}
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'esewa' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="esewa"
                                checked={paymentMethod === 'esewa'}
                                onChange={() => setPaymentMethod('esewa')}
                                className="accent-secondary"
                            />
                            <div className="w-7 h-7 rounded bg-[#60BB46] flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-white">eS</span>
                            </div>
                            <span className="text-sm text-primary">eSewa</span>
                        </label>

                        {/* Khalti */}
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'khalti' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="khalti"
                                checked={paymentMethod === 'khalti'}
                                onChange={() => setPaymentMethod('khalti')}
                                className="accent-secondary"
                            />
                            <div className="w-7 h-7 rounded bg-[#5C2D91] flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-white">Kh</span>
                            </div>
                            <span className="text-sm text-primary">Khalti</span>
                        </label>

                        {/* COD */}
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="accent-secondary"
                            />
                            <span className="material-symbols-outlined text-outline text-xl">
                                local_shipping
                            </span>
                            <span className="text-sm text-primary">Cash on Delivery</span>
                            <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-secondary">
                                Recommended
                            </span>
                        </label>

                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                {/* Place Order Button */}
                <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full py-5 bg-primary text-surface-container-lowest text-[11px] font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {placing ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-center text-[10px] uppercase tracking-widest text-outline mt-4">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">lock</span>
                    Secure checkout • Redolence Nepal
                </p>

            </section>
        </main>
    )
}