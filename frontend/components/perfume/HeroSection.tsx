'use client'
import Image from 'next/image'
import { Perfume, Decant } from '@/types/perfumes'
import NotePyramid from './NotePyramid'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { authapiPost, apiPost } from '@/context/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'

interface HeroProps {
    perfume: Perfume
}

const NOTIFY_ENDPOINT = '/authenticate/notificationrequest/'

export default function HeroSection({ perfume }: HeroProps) {
    const searchParams = useSearchParams()
    const { user } = useAuth()

    const primaryImage = useMemo(() =>
        perfume.images.find(img => img.is_primary) || perfume.images[0]
        , [perfume.images])

    const [selectedSize, setSelectedSize] = useState<Decant | 'full' | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(primaryImage)
    const [copied, setCopied] = useState(false) // State for clipboard feedback

    // Notify-me state — set when the user clicks an out-of-stock size
    const [notifyTarget, setNotifyTarget] = useState<Decant | 'full' | null>(null)
    const [notifyEmail, setNotifyEmail] = useState('')
    const [notifyPhone, setNotifyPhone] = useState('')
    const [notifySubmitting, setNotifySubmitting] = useState(false)
    const [notifySubmitted, setNotifySubmitted] = useState(false)

    const currentMaxStock = useMemo(() =>
        selectedSize === 'full'
            ? perfume.available_stock
            : selectedSize?.available_stock || 0
        , [selectedSize, perfume.available_stock])

    const selectedPrice = useMemo(() =>
        selectedSize === 'full' ? perfume.price : selectedSize?.price ?? 0
        , [selectedSize, perfume.price])

    const totalPrice = useMemo(() =>
        Number(selectedPrice) * quantity
        , [selectedPrice, quantity])

    const isDisabled = !selectedSize || currentMaxStock <= 0

    // Auto-select the size the user filtered/searched for, e.g. coming from
    // /shop?decant_size=10 -> product link /perfume/slug?size=10.
    // Only auto-selects if that size exists AND is currently in stock —
    // an out-of-stock size shouldn't get silently selected on page load.
    useEffect(() => {
        const sizeParam = searchParams.get('size')
        if (!sizeParam) return
        const match = perfume.decant.find(
            (d) => Math.round(Number(d.size)) === Math.round(Number(sizeParam))
        )
        if (match && match.available_stock > 0) {
            setSelectedSize(match)
            setQuantity(1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Out-of-stock tiles open the notify-me modal instead of doing nothing
    const handleSelect = useCallback((variant: Decant | 'full') => {
        const stock = variant === 'full' ? perfume.available_stock : variant.available_stock
        if (stock <= 0) {
            setNotifyTarget(variant)
            setNotifySubmitted(false)
            return
        }
        setSelectedSize(prev => prev === variant ? null : variant)
        setQuantity(1)
    }, [perfume.available_stock])

    const isSelected = useCallback((size: Decant | 'full') => {
        if (size === 'full') return selectedSize === 'full'
        return selectedSize !== 'full' && selectedSize?.size === (size as Decant).size
    }, [selectedSize])

    const handleAddToCartSubmit = useCallback(async () => {
        const product_type = selectedSize === 'full' ? 'perfume' : 'decant'
        const product_id = selectedSize === 'full' ? perfume.id : (selectedSize as Decant)?.id
        try {
            const res = await authapiPost('/cart/add-to-cart/', { product_type, product_id, quantity })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error || 'Failed to add to cart'); return }
            toast[data.already_in_cart ? 'info' : 'success'](
                data.already_in_cart ? 'Cart quantity updated' : 'Added to cart'
            )
        } catch {
            toast.error('You must log in to add to cart')
        }
    }, [selectedSize, perfume.id, quantity])

    // Share Handler
    const handleShare = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Failed to copy link')
        }
    }, [])

    const closeNotifyModal = useCallback(() => {
        if (notifySubmitting) return
        setNotifyTarget(null)
        setNotifyEmail('')
        setNotifyPhone('')
        setNotifySubmitted(false)
    }, [notifySubmitting])

    // Logged-in users: server attaches their account email/phone automatically,
    // so we send the request WITH credentials and no manual contact fields.
    // Guests: plain POST, contact info collected in the form below.
    const handleNotifySubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!notifyTarget) return

        const decant_id = notifyTarget === 'full' ? null : notifyTarget.id

        if (!user && !notifyEmail && !notifyPhone) {
            toast.error('Please provide an email or phone number')
            return
        }

        setNotifySubmitting(true)
        try {
            const payload = user
                ? { perfume: perfume.slug, decant_id }
                : { perfume: perfume.slug, decant_id, email: notifyEmail, phone: notifyPhone }

            const res = user
                ? await authapiPost(NOTIFY_ENDPOINT, payload)
                : await apiPost(NOTIFY_ENDPOINT, payload)

            const data = await res.json()
            if (!res.ok) {
                const firstError = typeof data === 'object' ? Object.values(data)[0] : null
                const message = Array.isArray(firstError) ? firstError[0] : data?.message
                toast.error(message || 'Failed to submit request')
                return
            }
            setNotifySubmitted(true)
            toast.success("We'll notify you when it's back in stock!")
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setNotifySubmitting(false)
        }
    }, [notifyTarget, notifyEmail, notifyPhone, perfume.slug, user])

    const notifyTargetLabel = notifyTarget === 'full'
        ? `Full Bottle · ${perfume.full_bottle_size}ml`
        : notifyTarget
            ? `${Math.round(Number(notifyTarget.size))}ml Decant`
            : ''

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 px-6 lg:px-16 items-start pt-3 lg:pt-6">
            {/* Left - Images */}
            <div className="flex gap-4 top-10 self-start">
                <div className="flex flex-col gap-3 w-28 flex-shrink-0">
                    {perfume.images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`aspect-square overflow-hidden cursor-pointer border transition-all duration-300
                                ${selectedImage?.image === img.image
                                    ? 'border-secondary shadow-md scale-105'
                                    : 'border-transparent hover:border-outline/40 hover:scale-105'
                                }`}
                        >
                            <Image
                                src={img.image}
                                alt={`${perfume.name} view ${index + 1}`}
                                width={112}
                                height={112}
                                className="w-full h-full object-contain bg-surface-container-high"
                            />
                        </div>
                    ))}
                </div>

                {/* ✅ fill + priority on the LCP image */}
                <div className="flex-1 aspect-square overflow-hidden bg-surface-container-high shadow-sm relative">
                    <Image
                        src={selectedImage?.image || primaryImage.image}
                        alt={perfume.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 45vw"
                        className="object-contain transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* Right - Details */}
            <div className="flex flex-col space-y-6 py-4 px-6">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold">
                        {perfume.brand}
                    </p>
                    <h1 className="font-headline text-4xl text-primary leading-tight">
                        {perfume.name}
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-outline">
                        {perfume.gender} · {perfume.family?.join(', ')}
                    </p>
                </div>
                {perfume.collection && (() => {
                    const collections: Record<string, { label: string; className: string }> = {
                        niche: {
                            label: 'Niche',
                            className: 'bg-primary-container text-inverse-primary',
                        },
                        designer: {
                            label: 'Designer',
                            className: 'bg-secondary-container text-secondary',
                        },
                        middle_eastern: {
                            label: 'Middle Eastern',
                            className: 'bg-tertiary-container text-inverse-primary',
                        },
                    }

                    const config = collections[perfume.collection]
                    if (!config) return null

                    return (
                        <div className={`inline-flex items-center self-start px-4 py-1.5 ${config.className}`}>
                            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                                {config.label}
                            </span>
                        </div>
                    )
                })()}
                {/* Size Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {perfume.decant.map((decant) => {
                        const isOutOfStock = decant.available_stock <= 0
                        return (
                            <div
                                key={decant.size}
                                onClick={() => handleSelect(decant)}
                                className={`border p-4 text-center transition-all duration-300 rounded-xl relative cursor-pointer
                                    ${isOutOfStock ? 'opacity-50 bg-surface-container-low' : ''}
                                    ${isSelected(decant)
                                        ? 'border-secondary bg-secondary/10 shadow-sm scale-[1.02]'
                                        : !isOutOfStock ? 'border-outline/20 hover:border-secondary hover:shadow-sm' : 'border-outline/10 hover:border-secondary/40'
                                    }`}
                            >
                                <p className="text-[11px] uppercase tracking-widest text-outline mb-1">
                                    {Math.round(Number(decant.size))}ml
                                </p>
                                <p className="font-headline text-sm font-semibold text-primary">
                                    {isOutOfStock ? 'OUT OF STOCK' : `NRS ${Math.round(Number(decant.price))}`}
                                </p>
                                {isOutOfStock && (
                                    <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mt-1">
                                        Notify Me
                                    </p>
                                )}
                            </div>
                        )
                    })}

                    <div
                        onClick={() => handleSelect('full')}
                        className={`col-span-3 border p-4 text-center transition-all duration-300 rounded-xl cursor-pointer
        ${perfume.available_stock <= 0 ? 'opacity-50 bg-surface-container-low' : ''}
        ${isSelected('full')
                                ? 'border-secondary bg-secondary/10 shadow-sm scale-[1.02]'
                                : perfume.available_stock > 0 ? 'border-outline/20 hover:border-secondary hover:shadow-sm' : 'border-outline/10 hover:border-secondary/40'
                            }`}
                    >
                        <p className="text-[11px] uppercase tracking-widest text-outline mb-1">
                            Full Bottle · {perfume.full_bottle_size}ml
                        </p>
                        <p className="font-headline text-sm font-semibold text-primary">
                            {perfume.available_stock <= 0
                                ? 'OUT OF STOCK'
                                : `NRS ${Math.round(Number(perfume.price)).toLocaleString()}`
                            }
                        </p>
                        {perfume.available_stock <= 0 && (
                            <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mt-1">
                                Notify Me
                            </p>
                        )}
                    </div>
                </div>

                {/* Quantity + Total */}
                {selectedSize && (
                    <div className="flex items-center justify-between border-t border-outline/10 pt-4 animate-fadeIn">
                        <div className="flex items-center gap-6 border border-outline/20 px-5 py-2 rounded-full">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="text-lg hover:text-secondary transition"
                            >−</button>
                            <span className="font-headline text-lg w-6 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(currentMaxStock, q + 1))}
                                className="text-lg hover:text-secondary transition disabled:opacity-30"
                                disabled={quantity >= currentMaxStock}
                            >+</button>
                        </div>
                        <div className="font-headline text-xl font-semibold text-secondary">
                            NRS {Math.round(totalPrice).toLocaleString()}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        disabled={isDisabled}
                        onClick={handleAddToCartSubmit}
                        className={`flex-1 py-3 text-xs uppercase tracking-widest transition-all duration-300
                            ${isDisabled
                                ? 'bg-outline/20 text-outline cursor-not-allowed'
                                : 'bg-primary hover:opacity-90 shadow-sm hover:shadow-md text-white'
                            }`}
                    >
                        {!selectedSize ? 'Select a size' : currentMaxStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    {/* Share Button with Clipboard and Tooltip */}
                    <div className="relative inline-block">
                        <button
                            onClick={handleShare}
                            title="Share Link"
                            className={`material-symbols-outlined border p-3 transition-all duration-300 ${copied
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-600 scale-105'
                                : 'border-outline/20 hover:bg-surface-container-high'
                                }`}
                        >
                            {copied ? 'check' : 'share'}
                        </button>

                        {/* Tooltip Popup */}
                        {copied && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-semibold text-white bg-primary rounded shadow-md whitespace-nowrap animate-fadeIn">
                                Link Copied!
                            </span>
                        )}
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="border-t border-outline/10 pt-4 space-y-1.5">
                    <p className="text-[11px] uppercase tracking-widest text-outline font-semibold">
                        Shipping
                    </p>
                    <p className="text-xs text-outline leading-relaxed">
                        Shipping charges are calculated at checkout.
                    </p>
                    <ul className="text-xs text-outline leading-relaxed list-disc list-inside">
                        <li>Inside Valley: NRS 100</li>
                        <li>Outside Valley: NRS 150</li>
                    </ul>
                </div>

                {/* Payment Gateways */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    <p className="text-[11px] uppercase tracking-widest text-outline font-semibold sm:mr-1">
                        We Accept
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="h-10 w-24 sm:h-12 sm:w-32 relative bg-white flex items-center justify-center p-1.5">
                            <Image
                                src="/brands/esewa.png"
                                alt="eSewa"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="h-10 w-24 sm:h-12 sm:w-32 relative bg-white flex items-center justify-center p-1.5">
                            <Image
                                src="/brands/khalti.png"
                                alt="Khalti"
                                fill
                                className="object-contain p-2"
                            />
                        </div>
                        <p className="text-xs text-outline">
                            Cash On Delivery
                        </p>
                    </div>
                </div>

                <div className="border-t border-outline/10 pt-6">
                    <NotePyramid perfume={perfume} />
                </div>
            </div>

            {/* Notify Me Modal */}
            {notifyTarget && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/20 backdrop-blur-sm px-4"
                    onClick={closeNotifyModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm bg-background rounded-xl shadow-2xl p-6 space-y-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-headline text-lg text-primary">Notify Me</h3>
                                <p className="text-xs text-outline mt-1">
                                    {perfume.name} — {notifyTargetLabel}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeNotifyModal}
                                aria-label="Close"
                                className="material-symbols-outlined text-outline hover:text-primary transition-colors"
                            >
                                close
                            </button>
                        </div>

                        {notifySubmitted ? (
                            <div className="py-4 text-center space-y-2">
                                <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                                <p className="text-sm text-primary font-medium">You're on the list!</p>
                                <p className="text-xs text-outline">
                                    We'll reach out as soon as this is back in stock.
                                </p>
                                <button
                                    type="button"
                                    onClick={closeNotifyModal}
                                    className="mt-2 w-full py-2.5 bg-primary text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleNotifySubmit} className="space-y-4">
                                {user ? (
                                    // Logged-in: contact info is attached server-side from the account,
                                    // so there's nothing to fill in — just confirm and submit.
                                    <p className="text-xs text-outline leading-relaxed">
                                        We'll notify you at the email and phone number on your account
                                        as soon as this is back in stock.
                                    </p>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-outline mb-1.5 block">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={notifyEmail}
                                                onChange={(e) => setNotifyEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-outline mb-1.5 block">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={notifyPhone}
                                                onChange={(e) => setNotifyPhone(e.target.value)}
                                                placeholder="98XXXXXXXX"
                                                className="w-full bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                                            />
                                        </div>
                                        <p className="text-[10px] text-outline">
                                            Provide at least one — we'll reach out as soon as this is back in stock.
                                        </p>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={notifySubmitting}
                                    className="w-full py-3 bg-primary text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {notifySubmitting ? 'Submitting...' : 'Notify Me'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}