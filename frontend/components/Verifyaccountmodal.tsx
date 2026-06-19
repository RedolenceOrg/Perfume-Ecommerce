'use client'
import { useRef, useState } from "react"
import { authapiPost } from "@/context/api"

type Step = "request" | "otp" | "success"

export default function VerifyAccountModal({
    email,
    onClose,
    onVerified,
}: {
    email: string
    onClose: () => void
    onVerified: () => void
}) {
    const [step, setStep] = useState<Step>("request")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const requestOTP = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await authapiPost("/authenticate/request-verify/", { email })
            if (!res.ok) {
                const data = await res.json()
                setError(data.detail || "Failed to send OTP")
                return
            }
            setStep("otp")
            setTimeout(() => inputRefs.current[0]?.focus(), 100)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const verifyOTP = async () => {
        const code = otp.join("")
        if (code.length < 6) {
            setError("Please enter all 6 digits")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await authapiPost("/authenticate/verify-account/", { email, otp: code })
            if (!res.ok) {
                const data = await res.json()
                setError(data.detail || "Invalid OTP")
                return
            }
            setStep("success")
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return
        const updated = [...otp]
        updated[index] = value
        setOtp(updated)
        if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const resendOTP = async () => {
        setOtp(["", "", "", "", "", ""])
        setError("")
        await requestOTP()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-background border border-outline-variant w-full max-w-md p-8 relative">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Step 1 — Request OTP */}
                {step === "request" && (
                    <div>
                        <span className="font-label text-secondary text-[10px] tracking-[0.2em] uppercase block mb-2">
                            Account Verification
                        </span>
                        <h2 className="font-display text-2xl text-primary font-bold mb-4">
                            Verify your email
                        </h2>
                        <p className="font-body text-sm text-outline mb-6 leading-relaxed">
                            We'll send a one-time code to{" "}
                            <span className="text-primary font-medium">{email}</span>.
                            Verify to unlock member discounts and loyalty perks.
                        </p>

                        {error && (
                            <p className="font-body text-sm text-error mb-4">{error}</p>
                        )}

                        <button
                            onClick={requestOTP}
                            disabled={loading}
                            className="w-full bg-primary text-white font-label text-sm tracking-widest uppercase py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send verification code"}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-2 border border-outline-variant text-outline font-label text-sm tracking-widest uppercase py-3 hover:border-primary hover:text-primary transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Step 2 — Enter OTP */}
                {step === "otp" && (
                    <div>
                        <span className="font-label text-secondary text-[10px] tracking-[0.2em] uppercase block mb-2">
                            Step 2 of 2
                        </span>
                        <h2 className="font-display text-2xl text-primary font-bold mb-4">
                            Enter the code
                        </h2>
                        <p className="font-body text-sm text-outline mb-6 leading-relaxed">
                            Check your inbox at{" "}
                            <span className="text-primary font-medium">{email}</span> and
                            enter the 6-digit code below.
                        </p>

                        {/* OTP inputs */}
                        <div className="flex gap-2 justify-center mb-6">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className="w-12 h-14 text-center text-xl font-bold border border-outline-variant bg-surface-container text-primary focus:outline-none focus:border-primary transition-colors"
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="font-body text-sm text-error mb-4 text-center">{error}</p>
                        )}

                        <button
                            onClick={verifyOTP}
                            disabled={loading}
                            className="w-full bg-primary text-white font-label text-sm tracking-widest uppercase py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify account"}
                        </button>

                        <div className="mt-4 text-center">
                            <button
                                onClick={resendOTP}
                                className="font-body text-sm text-outline hover:text-primary transition-colors underline"
                            >
                                Didn't get it? Resend code
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Success */}
                {step === "success" && (
                    <div className="text-center py-4">
                        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-success text-3xl">
                                verified
                            </span>
                        </div>
                        <h2 className="font-display text-2xl text-primary font-bold mb-2">
                            Account verified
                        </h2>
                        <p className="font-body text-sm text-outline mb-6 leading-relaxed">
                            You now have access to member discounts and loyalty perks.
                        </p>
                        <button
                            onClick={onVerified}
                            className="w-full bg-primary text-white font-label text-sm tracking-widest uppercase py-3 hover:opacity-90 transition-opacity"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}