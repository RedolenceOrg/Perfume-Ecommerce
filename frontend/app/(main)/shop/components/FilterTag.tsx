'use client'
import { useSearchParams, useRouter } from "next/navigation"

export default function FilterTag() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Ignore configuration states like tracking infinite scroll pagination pages inside your active tags layout
    const filterProps = Array.from(searchParams.entries())
        .filter(([key]) => key !== 'page')
        .map(([key, value]) => `${key}: ${value}`);

    const removeFilter = (filter: string) => {
        const [key, value] = filter.split(': ').map(s => s.trim());
        const params = new URLSearchParams(searchParams.toString());

        const allValues = params.getAll(key);
        params.delete(key);
        allValues.filter(v => v !== value).forEach(v => params.append(key, v));

        router.push(`/shop?${params.toString()}`);
    }

    const clearAll = () => {
        router.push('/shop')
    }

    if (filterProps.length === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 py-3 border-b border-outline-variant/10">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-secondary whitespace-nowrap pt-1">
                Active Selection
            </span>
            <div className="flex flex-wrap items-center gap-2">
                {filterProps.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => removeFilter(filter)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-background transition-opacity hover:opacity-90"
                    >
                        <span className="text-[9px] font-bold uppercase tracking-widest font-label">{filter}</span>
                        <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>
                ))}

                <button
                    onClick={clearAll}
                    className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-primary hover:bg-surface-container-highest transition-colors font-label"
                >
                    Clear All
                </button>
            </div>
        </div>
    )
}