import { useRouter } from 'next/navigation'

export default function CartEmpty() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <h1 className="text-5xl font-headline text-primary mb-6">Your bag is empty</h1>
            <p className="text-outline font-body mb-10 text-center max-w-sm leading-relaxed">
                The finest fragrances from Nepal and beyond are waiting to be discovered.
            </p>
            <button
                onClick={() => router.push('/shop')}
                className="bg-primary text-surface-container-lowest px-10 py-4 rounded-xl uppercase text-[11px] tracking-[0.25em] hover:opacity-90 transition-all shadow-sm"
            >
                View Collections
            </button>
        </div>
    )
}