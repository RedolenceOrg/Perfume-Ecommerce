// components/ThriftProductCard.tsx
'use client';
import { Thrift } from '@/types/perfumes';
import { authapiPost } from '@/context/api';
import { toast } from 'react-toastify'

export default function ThriftProductCard({ thrift }: { thrift: Thrift }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    const primaryImage = thrift.image?.find((img) => img.is_primary)?.image
        || thrift.image?.[0]?.image
        || '/placeholder.png';

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
            <div className='bg-black text-white text-[10px] font-bold font-bodyuppercase tracking-widest px-2 py-1 absolute top-2 left-0 z-10 border border-outline rounded-r-xl'
                style={{ width: `${Number(thrift.remaining_juice)}%` }}>
                Remaining: {Number(thrift.remaining_juice)}%
            </div>

            <div className="aspect-square w-full relative mb-6 overflow-hidden rounded-lg bg-background">
                <img
                    src={`${BASE_URL}${primaryImage}`}
                    alt={thrift.perfume_name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Add to Cart overlay — appears on hover */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-0 left-0 right-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                >
                    Add to Cart
                </button>
            </div>

            <div className="flex flex-col flex-grow">
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
                        Rs. {thrift.thrift_price}
                    </span>
                </div>
            </div>
        </div>
    );
}