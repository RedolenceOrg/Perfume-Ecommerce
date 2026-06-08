'use client'
import Script from 'next/script'

export default function GetPayPaymentPage() {
    return (
        <main className="min-h-screen bg-surface-container-low font-body">
            <Script
                src="https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js"
                strategy="afterInteractive"
            />
            <div id="checkout"></div>
        </main>
    )
}