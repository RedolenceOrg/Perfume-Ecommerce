// components/ThriftProductCard.tsx
'use client';
import { Thrift } from '@/types/perfumes';
import { authapiPost } from '@/context/api';
import { toast } from 'react-toastify'
import Image from 'next/image'

export default function ThriftProductCard({ thrift }: { thrift: Thrift }) {

    const handleAddToCart = async () => {
        const payload = {
            product_type: 'thrift',
            quantity: 1,
            product_id: thrift.id
        }

        try {
            const res = await authapiPost('/cart/add-to-cart/', payload)
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Failed to add to cart")
                return
            }

            if (data.already_in_cart) {
                toast.info("Cart quantity updated")
            } else {
                toast.success("Added to cart")
            }
        }
        catch (err) {
            toast.error('You must log in to add to cart')
        }
    }

    return (
        <div className="relative border border-outline-variant border-2 bg-surface p-4 flex flex-col group transition-all duration-200 hover:border-outline h-full">
            <div className='bg-black text-white text-[10px] font-bold font-body uppercase tracking-widest px-2 py-1 absolute top-2 left-0 z-10 border border-outline rounded-r-xl'
                style={{ width: `${Number(thrift.remaining_juice)}%` }}>
                Remaining: {Number(thrift.remaining_juice)}%
            </div>

            {/* aspect-[4/5] instead of aspect-square: less boxy, a bit taller */}
            <div className="aspect-[4/5] w-full relative mb-6 overflow-hidden rounded-lg bg-background">
                <Image
                    src={thrift.primary_image ?? '/placeholder.png'}
                    alt={thrift.perfume_name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Desktop only: hover-triggered overlay */}
                <button
                    onClick={handleAddToCart}
                    className="hidden md:block absolute bottom-0 left-0 right-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                >
                    Add to Cart
                </button>
            </div>

            <div className="flex flex-col flex-grow gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-label text-[10px] text-secondary font-bold uppercase tracking-widest">
                            {thrift.brand}
                        </span>
                        <h3 className="font-headline text-lg text-primary leading-tight mt-1">
                            {thrift.perfume_name}
                        </h3>
                    </div>
                    <span className="font-label text-sm font-extrabold text-tertiary pt-1">
                        Rs. {Number(thrift.thrift_price).toLocaleString()}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="md:hidden mt-auto pt-4 w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}