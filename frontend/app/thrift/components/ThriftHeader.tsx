// components/ThriftHeader.tsx
export default function ThriftHeader() {
    return (
        <header className="bg-surface border-b border-outline-variant px-6 py-12 md:py-20">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                {/* Decorative Badge */}
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4 bg-secondary-container/30 px-3 py-1 rounded-full">
                    Curated Fragrances
                </span>

                {/* Creative Title */}
                <h1 className="font-headline text-5xl md:text-7xl text-primary tracking-tighter lowercase">
                    The <span className="italic font-normal text-secondary">Scent</span> Archive.
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-xl font-body text-sm md:text-base text-outline leading-relaxed">
                    A meticulously sourced collection of pre-loved, high-end fragrances.
                    Giving luxury a second life, one note at a time.
                </p>

                {/* Stats / Filter Preview */}
                <div className="mt-10 flex gap-8 border-t border-outline-variant pt-8 w-full max-w-md justify-center">
                    <div className="flex flex-col">
                        <span className="font-headline text-2xl text-tertiary">100%</span>
                        <span className="font-label text-[10px] uppercase text-outline tracking-wider">Authentic</span>
                    </div>
                    <div className="w-[1px] h-10 bg-outline-variant" />
                    <div className="flex flex-col">
                        <span className="font-headline text-2xl text-tertiary">Vetted</span>
                        <span className="font-label text-[10px] uppercase text-outline tracking-wider">Juice Level</span>
                    </div>
                    <div className="w-[1px] h-10 bg-outline-variant" />
                    <div className="flex flex-col">
                        <span className="font-headline text-2xl text-tertiary">Daily</span>
                        <span className="font-label text-[10px] uppercase text-outline tracking-wider">Drops</span>
                    </div>
                </div>
            </div>
        </header>
    );
}