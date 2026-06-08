interface PaymentMethodProps {
    paymentMethod: string
    setPaymentMethod: (val: string) => void
}

const KHALTI_ENABLED = process.env.NEXT_PUBLIC_KHALTI_ENABLED === 'true'
const ESEWA_ENABLED = process.env.NEXT_PUBLIC_ESEWA_ENABLED === 'true'
const GETPAY_ENABLED = process.env.NEXT_PUBLIC_GETPAY_ENABLED === 'true'

export default function PaymentMethod({ paymentMethod, setPaymentMethod }: PaymentMethodProps) {
    return (
        <div className="mb-8">
            <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-4">
                Payment Method
            </label>
            <div className="flex flex-col gap-3">

                {ESEWA_ENABLED && (
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
                )}

                {KHALTI_ENABLED && (
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
                )}
                {GETPAY_ENABLED && (
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'getpay' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="getpay"
                            checked={paymentMethod === 'getpay'}
                            onChange={() => setPaymentMethod('getpay')}
                            className="accent-secondary"
                        />
                        <div className="w-7 h-7 rounded bg-[#5662FF] flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-white">GP</span>
                        </div>
                        <span className="text-sm text-primary">GetPay</span>
                    </label>
                )}
                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary' : 'border-outline-variant/30 bg-background'}`}>
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-secondary"
                    />
                    <span className="material-symbols-outlined text-outline text-xl">local_shipping</span>
                    <span className="text-sm text-primary">Cash on Delivery</span>
                    <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-secondary">Recommended</span>
                </label>

            </div>
        </div>
    )
}