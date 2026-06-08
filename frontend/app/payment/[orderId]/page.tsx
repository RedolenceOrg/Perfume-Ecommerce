'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authapiPost, authapiGet } from '@/context/api'

export default function PaymentPage() {
    const { orderId } = useParams()
    const searchParams = useSearchParams()
    const pidx = searchParams.get('pidx')
    const esewaStatus = searchParams.get('status')
    const token = searchParams.get('token')
    const method = pidx ? 'khalti' : esewaStatus ? 'esewa' : token ? 'getpay' : 'cod'

    const [status, setStatus] = useState<'loading' | 'Completed' | 'User canceled' | 'failed'>('loading')

    useEffect(() => {
        const confirm = async () => {
            if (method === 'cod') {
                setStatus('Completed')
                return
            }

            if (method === 'esewa') {
                const res = await authapiGet(
                    `/cart/payment/esewa/verify/${orderId}/?status=${esewaStatus}`
                )
                const data = await res.json()
                if (data.status === 'success') setStatus('Completed')
                else if (data.status === 'cancelled') setStatus('User canceled')
                else setStatus('failed')
                return
            }

            if (method === 'khalti') {
                try {
                    const res = await authapiPost('/cart/payments/khalti/confirm/', {
                        pidx,
                        purchase_order_id: orderId,
                    })
                    const data = await res.json()
                    console.log(data)
                    if (data.status === 'success') setStatus('Completed')
                    else setStatus('failed')
                } catch {
                    setStatus('failed')
                }
                return
            }
            if (method === 'getpay') {
                try {
                    const res = await authapiPost('/cart/payment/getpay/verify/', {
                        token,
                        orderId,
                    })
                    const data = await res.json()
                    if (data.status === 'success') setStatus('Completed')
                    else setStatus('failed')
                } catch {
                    setStatus('failed')
                }
                return
            }

            setStatus('failed')
        }

        confirm()
    }, [method, pidx, orderId, esewaStatus, token])

    // --- STATE 1: LOADING / VERIFYING ---
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#fbf9f5] text-[#271310] flex flex-col items-center justify-center px-6 selection:bg-[#fed488] selection:text-[#785a1a]">
                <div className="max-w-xl w-full text-center space-y-6 animate-pulse">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#504442]">Verification Gateway</p>
                    <h1 className="font-serif text-3xl md:text-4xl italic font-bold tracking-tight text-[#271310]">
                        Verifying Payment...
                    </h1>
                    <p className="font-sans text-sm text-[#504442]/70 tracking-wide max-w-xs mx-auto">
                        Securing your authentic scent profile. Please do not refresh or close this window.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <div className="w-12 h-[1px] bg-[#827472]/30 animate-scale-x"></div>
                    </div>
                </div>
            </div>
        )
    }

    // --- STATE 2: SUCCESSFUL COMPLETED ORDER ---
    if (status === 'Completed') {
        return (
            <div className="min-h-screen bg-[#fbf9f5] text-[#271310] selection:bg-[#fed488] selection:text-[#785a1a]">
                <main className="min-h-screen pb-24 flex items-center justify-center px-6 py-20">
                    <section className="max-w-xl w-full text-center space-y-12 animate-[fadeInUp_1.2s_ease-out_forwards]">
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <div className="bg-[#775a19]/10 w-24 h-24 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-[#775a19]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-serif text-4xl md:text-5xl text-[#271310] tracking-tight italic font-bold">Order Received</h1>
                                <p className="font-serif text-lg text-[#504442]/90">Your scent journey has officially begun.</p>
                            </div>
                        </div>

                        <div className="py-12 border-y border-[#d3c3c0]/30 space-y-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#504442] mb-2">Order Reference</p>
                                <h3 className="font-serif text-2xl text-[#271310] font-bold tracking-widest">#{orderId}</h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <Link href="/profile" className="w-full px-10 py-5 bg-[#271310] text-white font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:opacity-90 shadow-lg">
                                Track Your Order
                            </Link>
                            <Link href="/shop" className="group w-full px-10 py-5 bg-transparent border border-[#827472]/30 text-[#271310] font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:border-[#271310]">
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="pt-8">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#504442]/60">A confirmation email is on its way to your inbox.</p>
                        </div>
                    </section>
                </main>
            </div>
        )
    }

    // --- STATE 3: USER CANCELED ORDER ---
    if (status === 'User canceled') {
        return (
            <div className="min-h-screen bg-[#fbf9f5] text-[#271310] selection:bg-[#fed488] selection:text-[#785a1a]">
                <main className="min-h-screen pb-24 flex items-center justify-center px-6 py-20">
                    <section className="max-w-xl w-full text-center space-y-12 animate-[fadeInUp_1.2s_ease-out_forwards]">
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <div className="bg-[#ba1a1a]/10 w-24 h-24 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        cancel
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-serif text-4xl md:text-5xl text-[#271310] tracking-tight italic font-bold">Order Cancelled</h1>
                                <p className="font-serif text-lg text-[#504442]/90">You opted out of the checkout procedure.</p>
                            </div>
                        </div>

                        <div className="py-8 border-y border-[#d3c3c0]/30 max-w-sm mx-auto">
                            <p className="font-sans text-sm text-[#504442]/80 leading-relaxed">
                                The temporary hold on your items has dropped. No transaction fees were executed.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <Link href="/checkout" className="w-full px-10 py-5 bg-[#271310] text-white font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:opacity-90 shadow-lg">
                                Try Rechecking Out
                            </Link>
                            <Link href="/shop" className="group w-full px-10 py-5 bg-transparent border border-[#827472]/30 text-[#271310] font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:border-[#271310]">
                                Return to Gallery
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        )
    }

    // --- STATE 4: TRANSACTION FAILED ---
    return (
        <div className="min-h-screen bg-[#fbf9f5] text-[#271310] selection:bg-[#fed488] selection:text-[#785a1a]">
            <main className="min-h-screen pb-24 flex items-center justify-center px-6 py-20">
                <section className="max-w-xl w-full text-center space-y-12 animate-[fadeInUp_1.2s_ease-out_forwards]">
                    <div className="space-y-8">
                        <div className="flex justify-center">
                            <div className="bg-[#ba1a1a]/10 w-24 h-24 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    error
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="font-serif text-4xl md:text-5xl text-[#271310] tracking-tight italic font-bold">Payment Failed</h1>
                            <p className="font-serif text-lg text-[#504442]/90">The financial institution declined the parameters.</p>
                        </div>
                    </div>

                    <div className="py-8 border-y border-[#d3c3c0]/30 max-w-sm mx-auto">
                        <p className="font-sans text-sm text-[#504442]/80 leading-relaxed">
                            Something structural disrupted the handshake. Please inspect your balance logs or connect via alternative lines.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Link href="/checkout" className="w-full px-10 py-5 bg-[#271310] text-white font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:opacity-90 shadow-lg">
                            Try Again
                        </Link>
                        <Link href="/shop" className="group w-full px-10 py-5 bg-transparent border border-[#827472]/30 text-[#271310] font-medium uppercase text-xs tracking-[0.3em] font-semibold text-center transition-all duration-300 hover:border-[#271310]">
                            Back to Collection
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}