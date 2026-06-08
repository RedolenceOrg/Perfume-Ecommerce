'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { authapiGet } from '@/context/api'

export default function GetPayPaymentPage() {
    const [cartData, setCartData] = useState<any>(null)

    useEffect(() => {
        const fetchCart = async () => {
            const res = await authapiGet('/cart/view/')
            if (res.ok) {
                const data = await res.json()
                setCartData(data)
            }
        }
        fetchCart()
    }, [])

    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-body">
            <section className="bg-primary p-8 md:p-16 text-surface-container-lowest">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">Your Order</p>
                <h2 className="font-headline text-4xl mb-10">Order Summary</h2>
                <div className="flex flex-col gap-4">
                    {cartData?.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                                <p className="text-sm">{item.name}</p>
                                <p className="text-xs opacity-60">NPR {item.total_price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {cartData?.grand_total && (
                    <div className="mt-8 pt-4 border-t border-white/20 flex justify-between">
                        <span className="text-sm uppercase tracking-widest">Total</span>
                        <span className="font-bold">NPR {Math.round(cartData.grand_total).toLocaleString()}</span>
                    </div>
                )}
            </section>

            <section className="bg-surface-container-low p-8 md:p-16 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-outline mb-1">Secure Payment</p>
                <h2 className="font-headline text-4xl text-primary mb-8">Card Details</h2>
                <div id="checkout"></div>
            </section>

            <Script
                src="https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js"
                strategy="afterInteractive"
            />
        </main>
    )
}