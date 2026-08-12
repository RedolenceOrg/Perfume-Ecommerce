'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { apiPost } from '@/context/api'

const links = ['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact Us']

export default function Footer() {
    const [suggestion, setSuggestion] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!suggestion.trim()) {
            toast.error('Please write a suggestion first')
            return
        }
        setSubmitting(true)
        try {
            const res = await apiPost('/authenticate/suggestions/', { suggestion })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.suggestion?.[0] || data.error || 'Failed to send suggestion')
                return
            }
            toast.success('Thanks for the suggestion!')
            setSuggestion('')
        } catch {
            toast.error('Something went wrong, please try again')
        } finally {
            setSubmitting(false)
        }
    }, [suggestion])

    return (
        <footer className="w-full bg-surface-container-low px-6 sm:px-12 py-16 border-t border-outline-variant/40">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-0">

                {/* Left — Brand, Links, Copyright */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:pr-16">
                    <div className="font-headline text-xl font-normal tracking-widest text-primary mb-8">
                        Redolence Nepal
                    </div>

                    <nav className="flex flex-col items-center md:items-start gap-4 mb-10">
                        {links.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="font-body text-sm font-light tracking-[0.15em] uppercase text-outline hover:text-secondary transition-colors duration-500 ease-in-out"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    <div className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-outline/80">
                        © 2026 Redolence Nepal. All rights reserved.
                    </div>
                    <div className="font-body text-sm font-light text-outline/80 mt-3">
                        Website built by <span className="font-medium text-outline">Anwesh Atreya</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-outline-variant/40" />

                {/* Right — Suggestion Box */}
                <div className="flex-1 flex flex-col items-center md:pl-16">
                    <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-8 sm:p-10 flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-body text-[11px] font-medium tracking-[0.25em] uppercase text-secondary">
                                Suggestion Box
                            </h3>
                            <p className="font-body text-xs font-light text-outline text-center">
                                Tell us what you'd love to see next.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                            <div className="w-full flex flex-col items-center gap-1">
                                <textarea
                                    value={suggestion}
                                    onChange={(e) => setSuggestion(e.target.value.slice(0, 200))}
                                    placeholder="Leave a suggestion..."
                                    rows={3}
                                    maxLength={200}
                                    className="w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 text-center font-body text-sm font-light text-primary placeholder:text-outline/60 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none"
                                />
                                <span className="font-body text-[10px] tracking-widest text-outline/60">
                                    {suggestion.length}/200
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-secondary-container text-primary rounded font-body text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-50 transition-opacity duration-300"
                            >
                                {submitting ? 'Sending...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </footer>
    )
}