'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface ShopSidebarProps {
    brands: string[];
    notes: string[];
    families: string[];
}

const GENDER_OPTIONS = ['Male', 'Female', 'Unisex'];

export default function ShopSidebar({ brands, notes, families }: ShopSidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [Filternotes, setNotes] = useState('');
    const [Filterbrand, setBrand] = useState('');
    const [activeType, setActiveType] = useState('Perfume');
    const [priceRange, setPriceRange] = useState(50000);

    const handlePriceCommit = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('price_max', priceRange.toString());
        router.push(`/shop?${params.toString()}`);
    }

    const toggleFilter = (item: string, list: string[], setList: (l: string[]) => void) => {
        setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-12 pr-8 border-r border-outline-variant/10">

            {/* Category */}

            {/* Brand & Notes Search */}
            <section className="space-y-6">
                {[
                    { label: 'Search Brand', id: 'brand-list', data: brands, placeholder: 'Type to search...' },
                    { label: 'Search Notes', id: 'notes-list', data: notes, placeholder: 'e.g. Vanilla, Oud...' },
                ].map(({ label, id, data, placeholder }) => (
                    <div key={id}>
                        <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4">{label}</h3>
                        <input
                            type="text"
                            list={id}
                            onChange={(e) => {
                                if (id === 'notes-list') {
                                    setNotes(e.target.value);
                                } else {
                                    setBrand(e.target.value);
                                }
                            }}
                            value={id === 'notes-list' ? Filternotes : Filterbrand}
                            placeholder={placeholder}
                            className="w-full bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button onClick={() => {
                            const key = id === 'notes-list' ? 'note' : 'brand'
                            const value = id === 'notes-list' ? Filternotes : Filterbrand
                            if (!value) return  // don't add empty
                            const params = new URLSearchParams(searchParams.toString())
                            params.append(key, value)  // append allows multiple values
                            router.push(`/shop?${params.toString()}`)
                            // Reset input after adding filter
                            if (id === 'notes-list') {
                                setNotes('');
                            } else {
                                setBrand('');
                            }
                        }} className="my-2 px-3 py-2 bg-primary text-white transition-all text-sm hover:bg-surface-container-highest">
                            Add
                        </button>
                        <datalist id={id}>
                            {data.map((item) => <option key={item} value={item} />)}
                        </datalist>
                    </div>
                ))}
            </section>

            {/* Scent Family */}
            <section>
                <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-6">Scent Family</h3>
                <div className="flex flex-wrap gap-2">
                    {families.map((f) => (
                        <button
                            key={f}
                            onClick={() =>
                                toggleFilter(f, searchParams.getAll('family'), (vals) => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('family');
                                    vals.forEach(v => params.append('family', v));
                                    router.push(`/shop?${params.toString()}`);
                                })
                            }
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border ${searchParams.getAll('family').includes(f)
                                ? 'bg-black text-white border-black'
                                : 'bg-surface-container-high border-transparent hover:border-outline-variant'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            {/* Gender */}
            <section>
                <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-6">Gender</h3>
                <div className="flex flex-wrap gap-2">
                    {GENDER_OPTIONS.map((g) => (
                        <button
                            key={g}
                            onClick={() => toggleFilter(g, searchParams.getAll('gender'), (vals) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('gender');
                                vals.forEach(v => params.append('gender', v));
                                router.push(`/shop?${params.toString()}`);
                            })}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border ${searchParams.getAll('gender').includes(g)
                                ? 'bg-black text-white border-black'
                                : 'bg-surface-container-high border-transparent hover:border-outline-variant'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </section>

            {/* Price Range */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold">Price Range</h3>
                    <span className="text-xs font-bold">Rs. {priceRange.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    min="1000"
                    max="100000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    onMouseUp={handlePriceCommit}
                    onTouchEnd={handlePriceCommit}
                    className="w-full accent-black h-1 cursor-pointer p-2 color-primary"
                />
            </section>

        </aside>
    );
}