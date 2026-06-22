'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import VerifyAccountModal from '../Verifyaccountmodal'

export default function ProfileHeader({ profile }: { profile: any }) {
    const { logout } = useAuth()
    const router = useRouter()
    const [verifyModalOpen, setVerifyModalOpen] = useState(false)
    const [isVerified, setIsVerified] = useState(profile.user.isVerified)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    const getLoyaltyClass = (spend: number) => {
        if (spend > 5500) return "Top";
        if (spend > 12000) return "Heart";
        if (spend > 24000) return "Base";
        if (spend > 40000) return "Sillage";
        return "New";
    };

    return (
        <div className="mb-12">
            {/* Top row — label + sign out */}
            <div className="flex items-center justify-between mb-6">
                <span className="font-label text-secondary text-sm tracking-[0.2em] uppercase block">Member Profile</span>
                <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-outline hover:text-primary border border-outline-variant px-4 py-2 hover:border-primary transition-all active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                </button>
            </div>

            {/* Username */}
            <h1 className="font-display text-5xl md:text-6xl text-primary font-bold mb-8 tracking-tight">
                {profile.user.username}
            </h1>

            {/* Contact details — stacked in column */}
            <div className="flex flex-col space-y-4 text-outline mb-10">
                <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">mail</span>
                    <span className="font-body text-sm tracking-wide">{profile.user.email}</span>
                    {isVerified && (
                        <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">call</span>
                    <span className="font-body text-sm tracking-wide">{profile.phone_number || "No phone number added"}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">house</span>
                    <span className="font-body text-sm tracking-wide">
                        {profile.place && profile.district
                            ? `${profile.place}, ${profile.district}`
                            : "No address added"}
                    </span>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!isVerified ? (
                    <div
                        onClick={() => setVerifyModalOpen(true)}
                        className="sm:col-span-2 bg-surface-container-lowest p-8 border-l-2 border-secondary/20 cursor-pointer hover:border-primary transition-all group"
                    >
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary block mb-4">
                            Member Benefits
                        </span>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-outline">workspace_premium</span>
                                <span className="font-body text-sm text-outline">
                                    Loyalty Class — <span className="text-primary italic font-serif">verify to unlock</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-outline">savings</span>
                                <span className="font-body text-sm text-outline">
                                    Member Discounts — <span className="text-primary italic font-serif">verify to unlock</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-outline">local_shipping</span>
                                <span className="font-body text-sm text-outline">
                                    Tier Perks — <span className="text-primary italic font-serif">verify to unlock</span>
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-error border border-error px-4 py-1.5">
                                VERIFY NOW
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <MetricCard label="Loyalty Class" value={getLoyaltyClass(profile.total_spend)} isItalic />
                        <MetricCard label="Total Expenditure" value={`NPR ${profile.total_spend.toLocaleString()}`} subLabel="Lifetime Value" />
                    </>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {logoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-background border border-outline-variant w-full max-w-sm p-8 relative">
                        <button
                            onClick={() => setLogoutModalOpen(false)}
                            className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary block mb-2">
                            Confirm Action
                        </span>
                        <h2 className="font-display text-2xl text-primary font-bold mb-2">
                            Sign Out
                        </h2>
                        <p className="font-body text-sm text-outline mb-8 leading-relaxed">
                            Are you sure you want to sign out of your account?
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-primary text-white font-label text-sm tracking-widest uppercase py-3 hover:bg-secondary transition-colors"
                            >
                                Yes, Sign Out
                            </button>
                            <button
                                onClick={() => setLogoutModalOpen(false)}
                                className="w-full border border-outline-variant text-outline font-label text-sm tracking-widest uppercase py-3 hover:border-primary hover:text-primary transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {verifyModalOpen && (
                <VerifyAccountModal
                    email={profile.user.email}
                    onClose={() => setVerifyModalOpen(false)}
                    onVerified={() => {
                        setIsVerified(true)
                        setVerifyModalOpen(false)
                    }}
                />
            )}
        </div>
    );
}

function MetricCard({ label, value, subLabel, isItalic }: any) {
    return (
        <div className="bg-surface-container-lowest p-8 border-l-2 border-secondary/20">
            <p className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">{label}</p>
            <div className="flex flex-col">
                <span className={`text-primary ${isItalic ? 'font-serif text-xl italic' : 'font-body text-2xl font-light tracking-tight'}`}>
                    {value}
                </span>
                {subLabel && <span className="text-[10px] uppercase text-secondary font-bold tracking-widest mt-4">{subLabel}</span>}
            </div>
        </div>
    );
}