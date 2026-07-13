import { Perfume } from '@/types/perfumes'
export default function Description({ description }: { description: Perfume['description'] }) {
    return (
        <section className="mb-24 py-16 bg-surface-container-low rounded-xl px-12">
            <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="font-headline text-3xl text-primary text-center">
                    About this fragrance
                </h2>
                <p className="font-body text-on-surface-variant leading-relaxed text-base md:text-xl sm:text-sm font-light italic tracking-wide text-justify">
                    {description}
                </p>
            </div>
        </section>
    )
}