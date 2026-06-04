import Link from "next/link";
import { PerfumeSummary } from "@/types/perfumes";

export default function PerfumeCard({ id, name, brand, price, images, slug }: PerfumeSummary) {
    const imageObj = images?.find(img => img.is_primary) || images?.[0];
    const imagePath = imageObj?.image || '';

    return (
        <Link href={`/perfume/${slug}`} className="w-full group cursor-pointer block">
            {/* Image Container */}
            <div className="aspect-[3/4] bg-surface-container mb-4 overflow-hidden relative">
                {imagePath ? (
                    <img
                        src={`${imagePath}`}
                        alt={name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-label">No Image</span>
                    </div>
                )}

                {/* Smaller, More Elegant Slide-up Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <button className="w-full border border-primary text-primary bg-surface-container/60 backdrop-blur-sm px-4 py-2.5 text-[9px] uppercase tracking-[0.25em] font-bold font-label transition-all duration-500  active:scale-[0.98] flex items-center justify-center gap-1.5">
                        View
                        <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Content Details */}
            <div className="space-y-1 px-1">
                <p className="font-body text-[10px] text-secondary uppercase tracking-widest font-bold">
                    {brand}
                </p>
                <h4 className="font-body text-base font-normal tracking-tight text-primary group-hover:text-outline transition-colors duration-300">
                    {name}
                </h4>
                <div className="font-body font-bold text-sm text-primary pt-1">
                    {Math.round(parseFloat(price)) === 0 ? (
                        <span className="text-secondary text-[9px] uppercase tracking-widest font-bold bg-secondary-container/30 px-2 py-0.5 rounded-sm">
                            Decants Available
                        </span>
                    ) : (
                        <span className="text-sm font-semibold text-primary">
                            NRS {Math.round(parseFloat(price)).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}