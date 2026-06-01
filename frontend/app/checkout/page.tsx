'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authapiGet, authapiPost } from '@/context/api'
import { useAuth } from '@/context/AuthContext'
import { CartItem } from '@/types/perfumes'
import { toast } from 'react-toastify'
import { initiateEsewaPayment } from '@/lib/gateway'

interface CartData {
    items: CartItem[]
    grand_total: number
    discount_percent: number
    discount_amount: number
}

const VALLEY_DISTRICTS = ["Kathmandu", "Bhaktapur", "Lalitpur"]

const NEPAL_DISTRICTS = [
    "Kathmandu", "Bhaktapur", "Lalitpur", "Achham", "Arghakhanchi",
    "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara",
    "Bardiya", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang",
    "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", "Dolpa",
    "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam",
    "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur",
    "Kapilvastu", "Kaski", "Kavrepalanchok", "Khotang",
    "Lamjung", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu",
    "Mustang", "Myagdi", "Nawalpur", "Nuwakot", "Okhaldhunga", "Palpa",
    "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa",
    "Rautahat", "Rolpa", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari",
    "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu",
    "Sunsari", "Surkhet", "Syangja", "Taplejung", "Tehrathum",
    "Udayapur", "Western Rukum"
]

const EsewaEnabled = process.env.NEXT_PUBLIC_ESEWA_ENABLED === 'true'
const KhaltiEnabled = process.env.NEXT_PUBLIC_KHALTI_ENABLED === 'true'

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    const [cartData, setCartData] = useState<CartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [place, setPlace] = useState('')
    const [district, setDistrict] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cod')

    // Dynamically calculate shipping charge based on district
    const shippingCharge = district
        ? VALLEY_DISTRICTS.includes(district) ? 100 : 150
        : 0

    // Item subtotal prior to backend discount subtractions
    const subtotal = cartData ? cartData.items.reduce((acc, item) => acc + item.total_price, 0) : 0

    // grand_total comes from backend with discount applied. Add shipping on top.
    const total = cartData ? cartData.grand_total + shippingCharge : 0

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

        if (!place.trim()) {
            setError('Place / City is required.')
            return
        }
        if (!district) {
            setError('Please select a district.')
            return
        }
        if (!phoneNumber.trim()) {
            setError('Phone number is required.')
            return
        }
        if (phoneNumber.trim().length !== 10) {
            setError('Please enter a valid phone number.')
            return
        }

        const payload = {
            place: place.trim(),
            district: district,
            phone_number: phoneNumber.trim(),
            payment_method: paymentMethod,
        }

        setPlacing(true)
        const res = await authapiPost('/cart/checkout/', payload)
        const data = await res.json()
        if (res.ok) {
            try {
                if (paymentMethod === 'cod') {
                    router.push(`/payment/${data.purchase_order_id}`)
                }
                else if (paymentMethod === 'khalti') {
                    const res = await authapiPost('/cart/payment/khalti/initiate/', data)
                    const khaltiData = await res.json()
                    if (res.ok) {
                        window.location.href = khaltiData.payment_url
                    }
                }
                else if (paymentMethod === 'esewa') {
                    initiateEsewaPayment(data)

                }
            } catch {
                toast.error('Something went wrong. Please try again.')
            } finally {
                setPlacing(false)
            }
        }
        else {
            toast.error(data.detail || 'Failed to place order. Please try again.')
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

    const totalItemsCount = cartData.items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-body md:h-screen md:overflow-hidden">

            {/* Left — Order Summary */}
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
                                    src={`${BASE_URL}${item.images}`}
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

                {/* Totals Breakdown */}
                <div className="flex flex-col gap-4 pt-6 border-t border-outline-variant/20">
                    <div className="flex justify-between text-base text-outline">
                        <span>Subtotal</span>
                        <span>NPR {Math.round(subtotal).toLocaleString()}</span>
                    </div>

                    {/* Conditional Discount Block */}
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

            {/* Right — Shipping & Payment */}
            <section className="bg-surface-container-low p-8 md:p-16 md:h-full md:overflow-y-auto">
                <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">Almost there</p>
                <h2 className="font-headline text-4xl text-primary mb-10">Shipping & Payment</h2>

                {user?.first_name && (
                    <p className="text-sm text-outline mb-6">
                        Delivering to <span className="text-primary font-semibold">{user.first_name}</span>
                    </p>
                )}

                {/* Place */}
                <div className="mb-6">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                        Place / City <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        placeholder="Thamel, Sanepa, Banepa..."
                        className="w-full bg-background border-b border-outline-variant p-3 text-sm text-primary placeholder:text-outline/40 focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                {/* District */}
                <div className="mb-6">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                        District <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-background border-b border-outline-variant p-3 text-sm text-primary focus:outline-none focus:border-primary transition-all"
                    >
                        <option value="" disabled>Select district</option>
                        {NEPAL_DISTRICTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    {/* Shipping charge hint */}
                    {district && (
                        <p className="text-[10px] uppercase tracking-widest mt-2 font-bold text-secondary">
                            {VALLEY_DISTRICTS.includes(district)
                                ? '✓ Inside valley — NPR 100 delivery'
                                : '✓ Outside valley — NPR 150 delivery'}
                        </p>
                    )}
                </div>

                {/* Phone */}
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
                        Payment Method (other payment methods are being added soon, stay tuned!) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col gap-3">
                        {EsewaEnabled && (
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'esewa' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                                <input type="radio" name="payment" value="esewa" checked={paymentMethod === 'esewa'} onChange={() => setPaymentMethod('esewa')} className="accent-secondary" />
                                <div className="w-7 h-7 rounded bg-[#60BB46] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-white">eS</span>
                                </div>
                                <span className="text-sm text-primary">eSewa</span>
                            </label>
                        )}

                        {KhaltiEnabled && (
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'khalti' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                                <input type="radio" name="payment" value="khalti" checked={paymentMethod === 'khalti'} onChange={() => setPaymentMethod('khalti')} className="accent-secondary" />
                                <div className="w-7 h-7 rounded bg-[#5C2D91] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-white">Kh</span>
                                </div>
                                <span className="text-sm text-primary">Khalti</span>
                            </label>
                        )}

                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-secondary" />
                            <span className="material-symbols-outlined text-outline text-xl">local_shipping</span>
                            <span className="text-sm text-primary">Cash on Delivery</span>
                            <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-secondary">Recommended</span>
                        </label>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full py-5 bg-primary text-surface-container-lowest text-[11px] font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {placing ? 'Placing Order...' : `Place Order — NPR ${Math.round(total).toLocaleString()}`}
                </button>

                <p className="text-center text-[10px] uppercase tracking-widest text-outline mt-4">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">lock</span>
                    Secure checkout • Redolence Nepal
                </p>
            </section>
        </main>
    )
}