'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authapiDelete } from '@/context/api'
import { useRouter } from 'next/navigation'

export default function DeleteAccount() {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { logout } = useAuth()
    const router = useRouter()

    const handleDeleteAccount = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await authapiDelete('/authenticate/deleteaccount/')
            const data = await res.json()
            if (!res.ok) {
                setError(data.detail || 'Failed to delete account.')
                return
            }
            await logout()
            router.push('/')
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Delete Account Section */}
            <div className="border-t border-[var(--color-outline-variant)] pt-8 mt-8 flex flex-col items-center text-center max-w-sm mx-auto">

                <h3 className="font-headline text-lg text-[var(--color-primary)] mb-2 text-bold">
                    Delete Account
                </h3>
                <p className="text-xs text-[var(--color-outline)] mb-6 leading-relaxed">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="text-[11px] uppercase tracking-widest font-bold text-[var(--color-error)] border border-[#f5b8b3] bg-[#fff5f5] px-8 py-3 hover:bg-[#ffdad6] transition-all active:scale-[0.98]"
                >
                    Delete Account
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[var(--color-background)] w-full max-w-md mx-4 shadow-2xl overflow-hidden">

                        {/* Caution header strip */}
                        <div className="bg-[var(--color-secondary-container)] px-8 py-4 flex items-center gap-3 border-b border-[var(--color-outline-variant)]">
                            <span className="material-symbols-outlined text-[var(--color-secondary)] text-base">warning</span>
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-secondary)]">
                                Proceed with caution
                            </span>
                        </div>

                        <div className="p-8">
                            <h2 className="font-headline text-2xl text-[var(--color-primary)] mb-3">
                                Delete Account
                            </h2>
                            <p className="text-sm text-[var(--color-outline)] leading-relaxed mb-3">
                                Are you sure you want to delete your account?
                            </p>

                            {/* Danger callout */}
                            <div className="bg-[#ffdad6] border border-[#f5b8b3] px-4 py-3 mb-8 flex items-start gap-2">
                                <span className="material-symbols-outlined text-[var(--color-error)] text-sm mt-0.5">error</span>
                                <p className="text-[11px] text-[var(--color-error)] font-bold uppercase tracking-widest leading-snug">
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>

                            {error && (
                                <p className="text-[var(--color-error)] text-xs font-semibold mb-4 uppercase tracking-widest">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setError(null)
                                    }}
                                    disabled={loading}
                                    className="flex-1 py-4 text-[11px] uppercase tracking-widest font-bold border border-[var(--color-outline-variant)] text-[var(--color-primary)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="flex-1 py-4 text-[11px] uppercase tracking-widest font-bold bg-[var(--color-error)] text-white hover:bg-[#9b1515] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}