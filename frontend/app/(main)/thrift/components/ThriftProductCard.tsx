// components/ThriftProductCard.tsx
'use client';
import Image from 'next/image';
import { Thrift } from '@/types/perfumes';

export default function ThriftProductCard({ perfume }: { perfume: Thrift }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    const primaryImage = perfume.image.find((img) => img.is_primary)?.image || '/placeholder.png';
    console.log(BASE_URL + primaryImage);

    return (
        <div className="relative border border-outline-variant border-2 bg-surface p-4 flex flex-col group transition-all duration-200 hover:border-outline h-full">
            <div className='bg-black text-white text-[10px] font-bold font-bodyuppercase tracking-widest px-2 py-1 absolute top-2 left-0 z-10 border border-outline rounded-r-xl'>
                Remaining: {Number(perfume.remaining_juice)}%
            </div>
            <div className="aspect-square w-full relative mb-6 overflow-hidden rounded-lg bg-background">
                <img
                    src={`${BASE_URL}${primaryImage}`}
                    alt={perfume.perfume_name}

                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        {/* 2. Brand Mapping */}
                        <span className="font-label text-[10px] text-secondary font-bold uppercase tracking-widest">
                            {perfume.brand}
                        </span>
                        <h3 className="font-headline text-lg text-primary leading-tight mt-1">
                            {perfume.perfume_name}
                        </h3>
                    </div>
                    {/* 3. Price Mapping */}
                    <span className="font-label text-sm font-extrabold text-tertiary pt-1">
                        Rs. {perfume.thrift_price}
                    </span>
                </div>

            </div>
        </div>
    );
}