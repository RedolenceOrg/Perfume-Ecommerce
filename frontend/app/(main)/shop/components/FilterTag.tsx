'use client'
import { useSearchParams, useRouter } from "next/navigation"

export default function FilterTag() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const filterProps = Array.from(searchParams.entries()).map(([key, value]) => `${key}: ${value}`);

    const removeFilter = (filter: string) => {
        const [key, value] = filter.split(': ').map(s => s.trim());
        const params = new URLSearchParams(searchParams.toString());

        // Get all values for this key
        const allValues = params.getAll(key);

        // Remove just this specific valued
        params.delete(key);
        allValues.filter(v => v !== value).forEach(v => params.append(key, v));

        router.push(`/shop?${params.toString()}`);
    }

    const clearAll = () => {
        router.push('/shop')
    }

    return (
        <div className="flex flex-wrap items-center gap-4 mb-12 py-4 border-b border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">Active Selection</span>
            <div className="flex flex-wrap gap-2">
                {filterProps.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => removeFilter(filter)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm transition-all"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{filter}</span>
                        <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                ))}
                {filterProps.length > 0 && (
                    <button onClick={clearAll} className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-surface-container-highest transition-all">
                        Clear All
                    </button>
                )}
            </div>
        </div>
    )
}