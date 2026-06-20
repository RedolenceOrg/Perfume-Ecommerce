'use client'
import Script from 'next/script'
const getpaybundle = process.env.NEXT_PUBLIC_GETPAY_BUNDLE
export default function GetPayPaymentPage() {
    return (
        <main className="min-h-screen bg-surface-container-low font-body">
            <Script
                src={getpaybundle}
                strategy="afterInteractive"
            />
            <div id="checkout"></div>
        </main>
    )
}