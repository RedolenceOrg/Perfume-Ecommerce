'use client';
import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface ShopSidebarProps {
    brands: string[];
    notes: string[];
    families: string[];
}

const GENDER_OPTIONS = ['Male', 'Female', 'Unisex'];

const COLLECTION_OPTIONS = [
    { label: 'Niche', value: 'niche' },
    { label: 'Designer', value: 'designer' },
    { label: 'Middle Eastern', value: 'middle_eastern' },
    { label: 'In House', value: 'in_house' },
];
const PILL_BASE =
    'min-h-[38px] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border touch-manipulation select-none disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Accordion section wrapper ──────────────────────────────────────────────
function AccordionSection({
    label,
    hasSelection,
    expanded,
    onToggle,
    children,
}: {
    label: string;
    hasSelection: boolean;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    const forcedOpen = hasSelection || expanded;
    const rowClass = forcedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] group-hover:grid-rows-[1fr]';
    const opacityClass = forcedOpen
        ? 'opacity-100 delay-100'
        : 'opacity-0 group-hover:opacity-100 group-hover:delay-100';

    return (
        <section className="group">
            <div
                role="button"
                tabIndex={0}
                aria-expanded={forcedOpen}
                onClick={() => {
                    if (!hasSelection) onToggle();
                }}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !hasSelection) {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                className={`flex items-center justify-between border-b pb-3 transition-colors duration-300 ${hasSelection ? 'border-primary cursor-default' : 'border-outline-variant cursor-pointer'
                    }`}
            >
                <h3 className="font-headline text-xs uppercase tracking-[0.3em] text-secondary font-bold">
                    {label}
                </h3>
                <span
                    className={`material-symbols-outlined text-lg text-outline transition-transform duration-300 ${forcedOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                >
                    expand_more
                </span>
            </div>

            <div className={`grid transition-[grid-template-rows] duration-400 ease-out ${rowClass}`}>
                <div className="overflow-hidden">
                    <div className={`pt-5 transition-opacity duration-300 ${opacityClass}`}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function ShopSidebar({ brands, notes, families }: ShopSidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [Filternotes, setNotes] = useState('');
    const [Filterbrand, setBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    function toggleSection(key: string) {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    // Keeps the Min/Max inputs in sync with the URL in both directions:
    // fills them when params exist, and clears them when params are removed
    // (e.g. via the FilterTag "x" pill) — previously this only ever set values,
    // never cleared them, so removing a price filter left stale numbers behind.
    useEffect(() => {
        setMinPrice(searchParams.get('price_min') ?? '');
        setMaxPrice(searchParams.get('price_max') ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    function navigate(buildParams: (params: URLSearchParams) => void) {
        if (isPending) return;
        const params = new URLSearchParams(searchParams.toString());
        buildParams(params);
        startTransition(() => {
            router.push(`/shop?${params.toString()}`, { scroll: false });
        });
    }

    // If a max price is set without a min, default min to 0 — a max-only
    // filter isn't meaningful to the backend without a floor.
    const handlePriceCommit = () => {
        navigate((params) => {
            const effectiveMin = maxPrice ? (minPrice || '0') : minPrice;

            if (effectiveMin) params.set('price_min', effectiveMin);
            else params.delete('price_min');

            if (maxPrice) params.set('price_max', maxPrice);
            else params.delete('price_max');
        });

        if (maxPrice && !minPrice) setMinPrice('0');
    };

    const handleGenderSelect = (g: string) => {
        navigate((params) => {
            const current = searchParams.get('gender');
            if (current === g) params.delete('gender');
            else params.set('gender', g);
        });
    };

    const handleCollectionSelect = (value: string) => {
        navigate((params) => {
            const current = searchParams.getAll('collection');
            params.delete('collection');
            if (current.includes(value)) {
                current.filter((v) => v !== value).forEach((v) => params.append('collection', v));
            } else {
                current.forEach((v) => params.append('collection', v));
                params.append('collection', value);
            }
        });
    };

    const handleFamilySelect = (f: string) => {
        navigate((params) => {
            const current = searchParams.getAll('family');
            params.delete('family');
            if (current.includes(f)) {
                current.filter((v) => v !== f).forEach((v) => params.append('family', v));
            } else {
                current.forEach((v) => params.append('family', v));
                params.append('family', f);
            }
        });
    };

    const handleAddText = (kind: 'note' | 'brand') => {
        const value = kind === 'note' ? Filternotes : Filterbrand;
        if (!value) return;
        navigate((params) => {
            params.append(kind, value);
        });
        if (kind === 'note') setNotes('');
        else setBrand('');
    };

    const hasBrand = searchParams.getAll('brand').length > 0;
    const hasNote = searchParams.getAll('note').length > 0;
    const hasCollection = searchParams.getAll('collection').length > 0;
    const hasFamily = searchParams.getAll('family').length > 0;
    const hasGender = !!searchParams.get('gender');
    const hasPrice = !!searchParams.get('price_min') || !!searchParams.get('price_max');

    return (
        <>
            {/* Mobile Filter Sticky Trigger Bar */}
            <div className="lg:hidden w-full flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 border border-primary px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] font-bold font-label hover:bg-primary hover:text-background transition-colors duration-300 touch-manipulation"
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
            <aside
                data-lenis-prevent
                className={`
                fixed top-0 left-0 bottom-0 z-50 w-full max-w-[320px] bg-background p-6 overflow-y-auto shadow-2xl transition-transform duration-500 ease-out
                lg:sticky lg:top-6 lg:w-72 lg:max-w-none lg:p-0 lg:z-auto lg:shadow-none lg:bg-transparent lg:translate-x-0 lg:overflow-y-auto lg:max-h-[calc(100vh-3rem)] lg:border-r lg:border-outline-variant/10 lg:pr-8 space-y-8
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* Mobile Header */}
                <div className="flex items-center justify-between lg:hidden pb-4 mb-2 border-b border-outline-variant/20">
                    <h2 className="font-headline text-sm uppercase tracking-widest text-primary font-bold">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-primary hover:text-secondary transition-colors touch-manipulation"
                        aria-label="Close filters"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Brand & Notes */}
                {[
                    { label: 'Search Brand', id: 'brand-list', key: 'brand', data: brands, placeholder: 'Type to search...', kind: 'brand' as const, hasSelection: hasBrand, value: Filterbrand, setValue: setBrand },
                    { label: 'Search Notes', id: 'notes-list', key: 'notes', data: notes, placeholder: 'e.g. Vanilla, Oud...', kind: 'note' as const, hasSelection: hasNote, value: Filternotes, setValue: setNotes },
                ].map(({ label, id, key, data, placeholder, kind, hasSelection, value, setValue }) => (
                    <AccordionSection
                        key={key}
                        label={label}
                        hasSelection={hasSelection}
                        expanded={expandedSections.has(key)}
                        onToggle={() => toggleSection(key)}
                    >
                        <div className="flex gap-2 items-end">
                            <input
                                type="text"
                                list={id}
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                placeholder={placeholder}
                                className="bg-transparent border-b border-outline-variant py-2 px-1 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                            />
                            <button
                                onClick={() => handleAddText(kind)}
                                disabled={isPending}
                                className="px-4 py-2 bg-primary text-background border border-primary text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-transparent hover:text-primary touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                        <datalist id={id}>
                            {data.map((item) => <option key={item} value={item} />)}
                        </datalist>
                    </AccordionSection>
                ))}

                {/* Collection */}
                <AccordionSection
                    label="Collection"
                    hasSelection={hasCollection}
                    expanded={expandedSections.has('collection')}
                    onToggle={() => toggleSection('collection')}
                >
                    <div className="flex flex-wrap gap-2.5">
                        {COLLECTION_OPTIONS.map(({ label, value }) => (
                            <button
                                key={value}
                                onClick={() => handleCollectionSelect(value)}
                                disabled={isPending}
                                className={`${PILL_BASE} ${searchParams.getAll('collection').includes(value)
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-container-high border-transparent hover:border-outline-variant text-primary/80'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </AccordionSection>

                {/* Gender */}
                <AccordionSection
                    label="Gender"
                    hasSelection={hasGender}
                    expanded={expandedSections.has('gender')}
                    onToggle={() => toggleSection('gender')}
                >
                    <div className="flex flex-wrap gap-2.5">
                        {GENDER_OPTIONS.map((g) => (
                            <button
                                key={g}
                                onClick={() => handleGenderSelect(g)}
                                disabled={isPending}
                                className={`${PILL_BASE} ${searchParams.get('gender') === g
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-container-high border-transparent hover:border-outline-variant text-primary/80'
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </AccordionSection>

                {/* Price Range */}
                <AccordionSection
                    label="Price Range"
                    hasSelection={hasPrice}
                    expanded={expandedSections.has('price')}
                    onToggle={() => toggleSection('price')}
                >
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
                        disabled={isPending}
                        className="mt-4 w-full py-2.5 bg-primary text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply
                    </button>
                </AccordionSection>

                {/* Scent Family — last, since backend-driven length can vary and shouldn't push other filters around */}
                <AccordionSection
                    label="Scent Family"
                    hasSelection={hasFamily}
                    expanded={expandedSections.has('family')}
                    onToggle={() => toggleSection('family')}
                >
                    <div className="flex flex-wrap gap-2.5">
                        {families.map((f) => (
                            <button
                                key={f}
                                onClick={() => handleFamilySelect(f)}
                                disabled={isPending}
                                className={`${PILL_BASE} ${searchParams.getAll('family').includes(f)
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-container-high border-transparent hover:border-outline-variant text-primary/80'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </AccordionSection>

            </aside>
        </>
    );
}