'use client';
import { useState, useEffect } from 'react';
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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const urlMin = searchParams.get('price_min');
        const urlMax = searchParams.get('price_max');
        if (urlMin) setMinPrice(urlMin);
        if (urlMax) setMaxPrice(urlMax);
    }, [searchParams]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handlePriceCommit = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('price_min', minPrice);
        else params.delete('price_min');
        if (maxPrice) params.set('price_max', maxPrice);
        else params.delete('price_max');
        router.push(`/shop?${params.toString()}`);
    };

    const toggleFilter = (item: string, list: string[], setList: (l: string[]) => void) => {
        setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
    };

    // Gender — single select only
    const handleGenderSelect = (g: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = searchParams.get('gender');
        if (current === g) {
            params.delete('gender');
        } else {
            params.set('gender', g);
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <>
            {/* Mobile Filter Sticky Trigger Bar */}
            <div className="lg:hidden w-full flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 border border-primary px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] font-bold font-label hover:bg-primary hover:text-background transition-colors duration-300"
                >
                    <span className="material-symbols-outlined text-sm">tune</span>
                    Filter Collection
                </button>
                <span className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                    {searchParams.toString() ? 'Filters Applied' : 'All Products'}
                </span>
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-primary/20 backdrop-blur-sm transition-opacity duration-500 lg:hidden
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Shell */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-full max-w-[320px] bg-background p-6 overflow-y-auto shadow-2xl transition-transform duration-500 ease-out
                lg:static lg:w-72 lg:max-w-none lg:p-0 lg:z-auto lg:shadow-none lg:bg-transparent lg:translate-x-0 lg:overflow-y-visible lg:border-r lg:border-outline-variant/10 lg:pr-8 space-y-10
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* Mobile Header */}
                <div className="flex items-center justify-between lg:hidden pb-4 mb-2 border-b border-outline-variant/20">
                    <h2 className="font-headline text-sm uppercase tracking-widest text-primary font-bold">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-primary hover:text-secondary transition-colors"
                        aria-label="Close filters"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Brand & Notes */}
                <section className="space-y-6">
                    {[
                        { label: 'Search Brand', id: 'brand-list', data: brands, placeholder: 'Type to search...' },
                        { label: 'Search Notes', id: 'notes-list', data: notes, placeholder: 'e.g. Vanilla, Oud...' },
                    ].map(({ label, id, data, placeholder }) => (
                        <div key={id}>
                            <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4">{label}</h3>
                            <div className="flex gap-2 items-end">
                                <input
                                    type="text"
                                    list={id}
                                    onChange={(e) => {
                                        if (id === 'notes-list') setNotes(e.target.value);
                                        else setBrand(e.target.value);
                                    }}
                                    value={id === 'notes-list' ? Filternotes : Filterbrand}
                                    placeholder={placeholder}
                                    className="flex-1 bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                                />
                                <button onClick={() => {
                                    const key = id === 'notes-list' ? 'note' : 'brand';
                                    const value = id === 'notes-list' ? Filternotes : Filterbrand;
                                    if (!value) return;
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.append(key, value);
                                    router.push(`/shop?${params.toString()}`);
                                    if (id === 'notes-list') setNotes('');
                                    else setBrand('');
                                }} className="px-4 py-2 bg-primary text-background border border-primary text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-transparent hover:text-primary">
                                    Add
                                </button>
                            </div>
                            <datalist id={id}>
                                {data.map((item) => <option key={item} value={item} />)}
                            </datalist>
                        </div>
                    ))}
                </section>

                {/* Scent Family */}
                <section>
                    <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4">Scent Family</h3>
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
                                className={`px-3.5 py-2 text-[9px] font-bold uppercase tracking-widest transition-all rounded-full border ${searchParams.getAll('family').includes(f)
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-container-high border-transparent hover:border-outline-variant text-primary/80'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Gender — single select */}
                <section>
                    <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4">Gender</h3>
                    <div className="flex flex-wrap gap-2">
                        {GENDER_OPTIONS.map((g) => (
                            <button
                                key={g}
                                onClick={() => handleGenderSelect(g)}
                                className={`px-3.5 py-2 text-[9px] font-bold uppercase tracking-widest transition-all rounded-full border ${searchParams.get('gender') === g
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-container-high border-transparent hover:border-outline-variant text-primary/80'
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Price Min - Max */}
                <section>
                    <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4">Price Range</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-widest text-outline mb-1.5">Min</p>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                            />
                        </div>
                        <div className="w-3 h-px bg-outline-variant mt-4" />
                        <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-widest text-outline mb-1.5">Max</p>
                            <input
                                type="number"
                                placeholder="100,000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handlePriceCommit}
                        className="mt-4 w-full py-2.5 bg-primary text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Apply
                    </button>
                </section>

            </aside>
        </>
    );
}