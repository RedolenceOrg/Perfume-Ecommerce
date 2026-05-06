import Link from "next/link";

import { PerfumeSummary } from "@/types/perfumes";
export default function PerfumeCard({ id, name, brand, price, images, slug }: PerfumeSummary) {
    // Logic fix: Ensure we are accessing the array correctly
    const imageObj = images?.find(img => img.is_primary) || images?.[0];
    const imagePath = imageObj?.image || '';
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    return (
        <Link href={`/perfume/${slug}`} className="w-full group cursor-pointer">
            <div className="aspect-[3/4] bg-[#efeeea] mb-6 overflow-hidden relative">
                {imagePath ? (
                    <img
                        src={`${BASE_URL}${imagePath}`} // Ensure the URL is correct
                        alt={name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-xs uppercase tracking-widest text-gray-400">No Image</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h4 className="font-body text-xl tracking-tight text-[#1b1c1a]">
                    {name}
                </h4>
                <p className="font-body text-xs text-[#775a19] uppercase tracking-widest font-bold">
                    {brand}
                </p>
                <p className="font-body font-bold text-sm text-[#1b1c1a] pt-2">
                    NRS {Math.round(parseFloat(price)).toLocaleString()}
                </p>
            </div>
        </Link>
    );
}

