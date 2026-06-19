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
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
            <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-label text-secondary text-sm tracking-[0.2em] uppercase block">Member Profile</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-outline hover:text-primary border border-outline-variant px-4 py-2 hover:border-primary transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                    </button>
                </div>
                <h1 className="font-display text-5xl md:text-6xl text-primary font-bold mb-6 tracking-tight">
                    {profile.user.username}
                </h1>
                <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0 text-outline">
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <span className="font-body text-sm tracking-wide">{profile.user.email}</span>
                        {isVerified && (
                            <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">call</span>
                        <span className="font-body text-sm tracking-wide">{profile.phone_number}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">house</span>
                        <span className="font-body text-sm tracking-wide">{profile.place},{profile.district}</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {!isVerified ? (
                    <div
                        onClick={() => setVerifyModalOpen(true)}
                        className="col-span-2 bg-surface-container-lowest p-8 border-l-2 border-secondary/20 cursor-pointer hover:border-primary transition-all group"
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
        </section>
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