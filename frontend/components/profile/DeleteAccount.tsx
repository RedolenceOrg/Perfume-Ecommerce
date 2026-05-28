'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authapiDelete, authapiPost } from '@/context/api'
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
            <div className="border-t border-red-100 pt-8 mt-8">
                <h3 className="font-headline text-lg text-primary mb-1">
                    Delete Account
                </h3>
                <p className="text-xs text-outline mb-4 leading-relaxed">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="text-[11px] uppercase tracking-widest font-bold text-red-500 border border-red-200 px-6 py-3 hover:bg-red-50 transition-all"
                >
                    Delete Account
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-background w-full max-w-md mx-4 p-8 shadow-xl">

                        <h2 className="font-headline text-2xl text-primary mb-3">
                            Delete Account
                        </h2>
                        <p className="text-sm text-outline leading-relaxed mb-2">
                            Are you sure you want to delete your account?
                        </p>
                        <p className="text-xs text-red-500 font-semibold uppercase tracking-widest mb-8">
                            This action is permanent and cannot be undone.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setError(null)
                                }}
                                disabled={loading}
                                className="flex-1 py-4 text-[11px] uppercase tracking-widest font-bold border border-outline-variant text-primary hover:bg-surface-container-low transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex-1 py-4 text-[11px] uppercase tracking-widest font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}