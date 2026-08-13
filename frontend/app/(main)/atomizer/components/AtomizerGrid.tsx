// components/AtomizerGrid.tsx
import AtomizerProductCard from './AtomizerProductCard';
import { Atomizer, AtomizerVariant } from '@/types/perfumes';

interface AtomizerCardData {
    atomizer: Atomizer;
    variant: AtomizerVariant;
}

export default function AtomizerGrid({ data }: { data: Atomizer[] }) {
    // Flatten so every size/color variant renders as its own product card,
    // same way each Thrift bottle is its own card.
    const cards: AtomizerCardData[] = data.flatMap((atomizer) =>
        atomizer.variants.map((variant) => ({ atomizer, variant }))
    );

    return (
        <div className="bg-background w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-collapse">
                {cards.map(({ atomizer, variant }) => (
                    <div key={variant.id} className="sm:-ml-[1px] sm:-mt-[1px]">
                        <AtomizerProductCard atomizer={atomizer} variant={variant} />
                    </div>
                ))}
            </div>
        </div>
    );
}