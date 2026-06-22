'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authapiGet, authapiPost } from '@/context/api'
import { useAuth } from '@/context/AuthContext'
import { CartItem } from '@/types/perfumes'
import { toast } from 'react-toastify'
import Script from 'next/script'
import { initiateEsewaPayment, initiateGetPayPayment } from '@/lib/gateway'
import { VALLEY_DISTRICTS } from '../../types/perfumes'
import ShippingForm from '../../components/checkout/Shippingform'
import OrderSummary from '../../components/checkout/Ordersummary'
import PaymentMethod from '../../components/checkout/Paymentmethod'
import { buildOrderInformationUI } from '@/types/getpay'

interface CartData {
    items: CartItem[]
    grand_total: number
    discount_percent: number
    discount_amount: number
}

const getpaybundle = process.env.NEXT_PUBLIC_GETPAY_BUNDLE

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()

    const [cartData, setCartData] = useState<CartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [place, setPlace] = useState('')
    const [district, setDistrict] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cod')

    const shippingCharge = district
        ? VALLEY_DISTRICTS.includes(district) ? 100 : 150
        : 0

    const subtotal = cartData
        ? cartData.items.reduce((acc, item) => acc + item.total_price, 0)
        : 0

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
            setError('Please enter a valid 10-digit phone number.')
            return
        }

        const payload = {
            place: place.trim(),
            district,
            phone_number: phoneNumber.trim(),
            payment_method: paymentMethod,
        }

        setPlacing(true)

        try {
            const res = await authapiPost('/cart/checkout/', payload)
            const data = await res.json()

            if (res.ok) {
                if (paymentMethod === 'cod') {
                    router.push(`/payment/${data.purchase_order_id}`)
                }

                else if (paymentMethod === 'khalti') {
                    const khaltiRes = await authapiPost('/cart/payment/khalti/initiate/', data)
                    const khaltiData = await khaltiRes.json()
                    if (khaltiRes.ok) {
                        window.location.href = khaltiData.payment_url
                    }
                }

                else if (paymentMethod === 'esewa') {
                    initiateEsewaPayment(data)
                }


                else if (paymentMethod === 'getpay') {
                    initiateGetPayPayment({
                        ...data,
                        userInfo: {
                            name: user?.first_name,
                            email: user?.email,
                            state: "",
                            country: "Nepal",
                            zipcode: "44600",
                            city: district,
                            address: place,
                        },
                        prefill: {
                            name: false,
                            email: true,
                            state: false,
                            city: true,
                            address: true,
                            zipcode: true,
                            country: true
                        },
                        orderInformationUI: buildOrderInformationUI({
                            items: cartData?.items ?? [],
                            subtotal,
                            total,
                            shippingCharge,
                            district,
                            discount_percent: cartData?.discount_percent ?? 0,
                            discount_amount: cartData?.discount_amount ?? 0,
                            valleyDistricts: VALLEY_DISTRICTS,
                        }),
                        onSuccess: () => { console.log("GetPay initialized") },
                        onError: (error: any) => {
                            setLoading(false)
                            toast.error(error?.error)
                        }
                    })
                }
            } else {
                toast.error(data.detail || 'Failed to place order. Please try again.')
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong. Please try again.')
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

    return (
        <>
            <Script
                src={getpaybundle}
                strategy="afterInteractive"
            />
            <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-body">


                <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
                    <OrderSummary
                        cartData={cartData}
                        subtotal={subtotal}
                        total={total}
                        shippingCharge={shippingCharge}
                        district={district}
                    />
                </div>

                <div id="checkout" hidden></div>

                <section className="bg-surface-container-low p-8 md:p-16">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">Almost there</p>
                    <h2 className="font-headline text-4xl text-primary mb-10">Shipping & Payment</h2>

                    <ShippingForm
                        place={place} setPlace={setPlace}
                        district={district} setDistrict={setDistrict}
                        phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                        firstName={user?.first_name}
                    />

                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

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
        </>
    )
}