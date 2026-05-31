"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authapiPost } from "@/context/api";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
    const router = useRouter();

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


    // Step 1 — Request OTP
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = { email: email };
            const res = await authapiPost("/authenticate/request-password-reset/", payload);
            const data = await res.json();
            toast.info(data.detail);
            if (res.ok) {
                setStep(2);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — Confirm OTP + new password
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await authapiPost("/authenticate/reset-password/", {
                email,
                otp,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.detail || "Something went wrong");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-black">check_circle</span>
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
                        Password updated successfully
                    </p>
                    <p className="text-xs text-gray-400">Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Step indicator */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${step === 1 ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}>
                        1
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold transition-all ${step === 1 ? "text-black" : "text-gray-300"}`}>
                        Verify Email
                    </span>
                </div>
                <div className="h-[1px] flex-1 bg-gray-100" />
                <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${step === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}>
                        2
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold transition-all ${step === 2 ? "text-black" : "text-gray-300"}`}>
                        Reset Password
                    </span>
                </div>
            </div>

            {/* Step 1 — Email */}
            {step === 1 && (
                <form onSubmit={handleRequestOTP} className="space-y-8">
                    <div className="relative group">
                        <label
                            htmlFor="email"
                            className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1 transition-all group-focus-within:text-[#775a19]"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-transparent border-b border-gray-200 py-3 px-1 text-sm transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-widest font-bold">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                        {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                    </button>
                </form>
            )}

            {/* Step 2 — OTP + New Password */}
            {step === 2 && (
                <form onSubmit={handleConfirm} className="space-y-8">

                    {/* Hint message */}
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">
                        If an account exists, an OTP has been sent to{" "}
                        <span className="text-black">{email}</span>
                    </p>

                    {/* OTP */}
                    <div className="relative group">
                        <label
                            htmlFor="otp"
                            className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1 transition-all group-focus-within:text-[#775a19]"
                        >
                            One-Time Password
                        </label>
                        <input
                            id="otp"
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="······"
                            className="w-full bg-transparent border-b border-gray-200 py-3 px-1 text-sm tracking-[0.4em] transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                        />
                    </div>

                    {/* New Password */}
                    <div className="relative group">
                        <label
                            htmlFor="new_password"
                            className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1 transition-all group-focus-within:text-[#775a19]"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="new_password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent border-b border-gray-200 py-3 px-1 pr-8 text-sm transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-1 bottom-3 text-gray-400 hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm select-none">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <label
                            htmlFor="confirm_password"
                            className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1 transition-all group-focus-within:text-[#775a19]"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm_password"
                                type={showConfirm ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent border-b border-gray-200 py-3 px-1 pr-8 text-sm transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-1 bottom-3 text-gray-400 hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm select-none">
                                    {showConfirm ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-widest font-bold">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                            {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                        </button>

                        {/* Back to step 1 */}
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(null); }}
                            className="w-full text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold py-2"
                        >
                            ← Use a different email
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPasswordForm;