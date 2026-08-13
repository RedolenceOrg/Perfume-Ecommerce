'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, ChevronRight, ShoppingCart, User as UserIcon, Menu, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────
interface SimpleItem {
    label: string;
    href: string;
}

interface DropdownGroup {
    heading: string;
    items: SimpleItem[];
}

// A gender entry that, when hovered/tapped, reveals its own list of
// collection links (each link already has BOTH gender + collection baked in).
interface NestedGenderGroup {
    label: string;      // e.g. "Male"
    href: string;        // gender-only link (used if they click the gender label itself)
    children: SimpleItem[]; // collection links, each combining gender + collection
}

interface NavLinkData {
    label: string;
    href: string;
    highlight?: boolean;
    dropdown?: SimpleItem[];            // flat dropdown
    megaDropdown?: DropdownGroup[];     // grouped, independent dropdown (unused now, kept for reuse)
    nestedDropdown?: NestedGenderGroup[]; // Gender -> Collection dependent dropdown
}

const DECANT_SIZES = ['3', '5', '10', '20'];
const decantSizeQuery = DECANT_SIZES.map((s) => `decant_size=${s}`).join('&');
const ALL_DECANTS_HREF = `/shop?${decantSizeQuery}`;

const GENDERS = ['Male', 'Female', 'Unisex'] as const;
const COLLECTIONS: { label: string; value: string }[] = [
    { label: 'Niche', value: 'niche' },
    { label: 'Designer', value: 'designer' },
    { label: 'Middle Eastern', value: 'middle_eastern' },
    { label: 'In House', value: 'in_house' },
];

// Helper: build a /shop URL from arbitrary filters
function buildHref(params: Record<string, string>): string {
    const paramString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    return `/shop?${paramString}`;
}

// Helper: build a /shop URL that combines arbitrary filters with ALL decant sizes
function buildDecantHref(params: Record<string, string>): string {
    const paramString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    return `/shop?${paramString}&${decantSizeQuery}`;
}

// Builds the Gender -> Collection nested structure for Perfumes (no decant size constraint)
function buildPerfumeNestedDropdown(): NestedGenderGroup[] {
    return GENDERS.map((gender) => ({
        label: gender,
        href: buildHref({ type: 'Perfume', gender }),
        children: COLLECTIONS.map((c) => ({
            label: c.label,
            href: buildHref({ type: 'Perfume', gender, collection: c.value }),
        })),
    }));
}

// Builds the Gender -> Collection nested structure for Travel Size Decants (all decant sizes applied)
function buildDecantNestedDropdown(): NestedGenderGroup[] {
    return GENDERS.map((gender) => ({
        label: gender,
        href: buildDecantHref({ type: 'Perfume', gender }),
        children: COLLECTIONS.map((c) => ({
            label: c.label,
            href: buildDecantHref({ type: 'Perfume', gender, collection: c.value }),
        })),
    }));
}

const navLinks: NavLinkData[] = [
    { label: 'Home', href: '/' },
    {
        label: 'Perfumes',
        href: '/shop?type=Perfume',
        nestedDropdown: buildPerfumeNestedDropdown(),
    },
    {
        label: 'Travel Size Decants',
        href: ALL_DECANTS_HREF,
        nestedDropdown: buildDecantNestedDropdown(),
    },
    { label: 'Attars', href: '/shop?type=Attar' },
    { label: 'Atomizer', href: '/atomizer' },
    { label: 'Thrift', href: '/thrift' },
    { label: 'Wellbeing', href: '/wellbeing' },
    { label: 'Members', href: '/members', highlight: true },
];

// ─── NavLink ─────────────────────────────────────────────────────────────
function NavLink({ link, pathname, currentType, onClick, mobile = false }: {
    link: NavLinkData;
    pathname: string;
    currentType: string | null;
    onClick?: () => void;
    mobile?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [hoveredGender, setHoveredGender] = useState<string | null>(null);
    const [openMobileGender, setOpenMobileGender] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const genderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isActive = () => {
        if (link.href.includes('?')) {
            const [basePath, query] = link.href.split('?');
            const typeParam = new URLSearchParams(query).get('type');
            return pathname === basePath && currentType === typeParam;
        }
        return pathname === link.href;
    };

    const active = isActive();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            setHoveredGender(null);
        }, 150);
    };

    const handleGenderMouseEnter = (genderLabel: string) => {
        if (genderTimeoutRef.current) clearTimeout(genderTimeoutRef.current);
        setHoveredGender(genderLabel);
    };

    const handleGenderMouseLeave = () => {
        genderTimeoutRef.current = setTimeout(() => setHoveredGender(null), 150);
    };

    const hasDropdown = !!link.dropdown;
    const hasMegaDropdown = !!link.megaDropdown;
    const hasNestedDropdown = !!link.nestedDropdown;

    // ── MOBILE: two-level accordion (Gender -> Collection) ─────────────────
    if (hasNestedDropdown && mobile) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={link.href}
                        onClick={onClick}
                        className={`transition-all duration-300 ease-out border-b-2 pb-1 block
                            ${active
                                ? 'text-secondary border-secondary'
                                : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                            }
                        `}
                    >
                        {link.label}
                    </Link>
                    <button
                        type="button"
                        aria-label={`Toggle ${link.label} options`}
                        aria-expanded={isOpenMobile}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsOpenMobile((prev) => !prev);
                            if (isOpenMobile) setOpenMobileGender(null);
                        }}
                        className="p-2 -mr-2 text-primary/60 active:text-secondary transition-colors duration-150"
                    >
                        <ChevronDown
                            size={22}
                            strokeWidth={1.75}
                            className={`transition-transform duration-300 ease-out ${isOpenMobile ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-out
                        ${isOpenMobile ? 'max-h-[40rem] opacity-100 mt-3' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="flex flex-col gap-3 pl-4 border-l border-outline-variant/20">
                        {link.nestedDropdown!.map((gender) => {
                            const isGenderOpen = openMobileGender === gender.label;
                            return (
                                <div key={gender.label} className="flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={gender.href}
                                            onClick={onClick}
                                            className="text-base font-body text-primary/60 hover:text-primary active:text-secondary transition-colors duration-150"
                                        >
                                            {gender.label}
                                        </Link>
                                        <button
                                            type="button"
                                            aria-label={`Toggle ${gender.label} collections`}
                                            aria-expanded={isGenderOpen}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setOpenMobileGender((prev) => (prev === gender.label ? null : gender.label));
                                            }}
                                            className="p-1.5 -mr-1.5 text-primary/50 active:text-secondary transition-colors duration-150"
                                        >
                                            <ChevronDown
                                                size={16}
                                                strokeWidth={1.75}
                                                className={`transition-transform duration-300 ease-out ${isGenderOpen ? 'rotate-180' : 'rotate-0'}`}
                                            />
                                        </button>
                                    </div>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-out
                                            ${isGenderOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                                        `}
                                    >
                                        <div className="flex flex-col gap-2 pl-4 border-l border-outline-variant/10">
                                            {gender.children.map((collection) => (
                                                <Link
                                                    key={collection.label}
                                                    href={collection.href}
                                                    onClick={onClick}
                                                    className="text-sm font-body text-primary/50 hover:text-primary active:text-secondary transition-colors duration-150"
                                                >
                                                    {collection.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ── MOBILE: accordion (flat dropdown OR grouped megaDropdown) ──────────
    if ((hasDropdown || hasMegaDropdown) && mobile) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={link.href}
                        onClick={onClick}
                        className={`transition-all duration-300 ease-out border-b-2 pb-1 block
                            ${active
                                ? 'text-secondary border-secondary'
                                : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                            }
                        `}
                    >
                        {link.label}
                    </Link>
                    <button
                        type="button"
                        aria-label={`Toggle ${link.label} options`}
                        aria-expanded={isOpenMobile}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsOpenMobile((prev) => !prev);
                        }}
                        className="p-2 -mr-2 text-primary/60 active:text-secondary transition-colors duration-150"
                    >
                        <ChevronDown
                            size={22}
                            strokeWidth={1.75}
                            className={`transition-transform duration-300 ease-out ${isOpenMobile ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-out
                        ${isOpenMobile ? 'max-h-[32rem] opacity-100 mt-3' : 'max-h-0 opacity-0'}
                    `}
                >
                    {hasDropdown && (
                        <div className="flex flex-col gap-3 pl-4 border-l border-outline-variant/20">
                            {link.dropdown!.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onClick}
                                    className="text-base font-body text-primary/60 hover:text-primary active:text-secondary transition-colors duration-150"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {hasMegaDropdown && (
                        <div className="flex flex-col gap-5 pl-4 border-l border-outline-variant/20">
                            {link.megaDropdown!.map((group) => (
                                <div key={group.heading} className="flex flex-col gap-2.5">
                                    <p className="text-[11px] uppercase tracking-widest text-outline font-semibold">
                                        {group.heading}
                                    </p>
                                    <div className="flex flex-col gap-2.5 pl-3">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={onClick}
                                                className="text-base font-body text-primary/60 hover:text-primary active:text-secondary transition-colors duration-150"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── DESKTOP: nested hover dropdown (Gender -> flyout Collections) ──────
    if (hasNestedDropdown) {
        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    href={link.href}
                    onClick={onClick}
                    className={`transition-all duration-300 ease-out border-b-2 pb-1 block md:inline-block
                        ${active
                            ? 'text-secondary border-secondary'
                            : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                        }
                    `}
                >
                    {link.label}
                </Link>

                <div className={`absolute top-full left-0 mt-3 w-48 bg-background border border-outline-variant/30 rounded-lg shadow-xl overflow-visible transition-all duration-150 origin-top
                    ${isHovered ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
                `}>
                    {link.nestedDropdown!.map((gender, i) => {
                        const isGenderHovered = hoveredGender === gender.label;
                        return (
                            <div
                                key={gender.label}
                                className="relative"
                                onMouseEnter={() => handleGenderMouseEnter(gender.label)}
                                onMouseLeave={handleGenderMouseLeave}
                            >
                                <Link
                                    href={gender.href}
                                    onClick={onClick}
                                    className={`group flex items-center justify-between px-4 py-2.5 text-sm font-headline transition-all duration-150
                                        ${isGenderHovered ? 'text-primary bg-outline-variant/10' : 'text-primary/60 hover:text-primary hover:bg-outline-variant/10'}
                                        ${i !== link.nestedDropdown!.length - 1 ? 'border-b border-outline-variant/10' : ''}
                                    `}
                                >
                                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{gender.label}</span>
                                    <ChevronRight size={14} strokeWidth={1.75} className="text-secondary" />
                                </Link>

                                {/* Flyout: collections for this gender */}
                                <div className={`absolute top-0 left-full ml-1 w-48 bg-background border border-outline-variant/30 rounded-lg shadow-xl overflow-hidden transition-all duration-150 origin-top-left
                                    ${isGenderHovered ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-x-1 pointer-events-none'}
                                `}>
                                    {gender.children.map((collection, j) => (
                                        <Link
                                            key={collection.label}
                                            href={collection.href}
                                            onClick={onClick}
                                            className={`group flex items-center justify-between px-4 py-2.5 text-sm font-headline text-primary/60 hover:text-primary hover:bg-outline-variant/10 transition-all duration-150
                                                ${j !== gender.children.length - 1 ? 'border-b border-outline-variant/10' : ''}
                                            `}
                                        >
                                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">{collection.label}</span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-secondary text-xs">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── DESKTOP: flat hover dropdown ────────────────────────────────────────
    if (hasDropdown) {
        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    href={link.href}
                    onClick={onClick}
                    className={`transition-all duration-300 ease-out border-b-2 pb-1 block md:inline-block
                        ${active
                            ? 'text-secondary border-secondary'
                            : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                        }
                    `}
                >
                    {link.label}
                </Link>

                <div className={`absolute top-full left-0 mt-3 w-44 bg-background border border-outline-variant/30 rounded-lg shadow-xl overflow-hidden transition-all duration-150 origin-top
                    ${isHovered ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
                `}>
                    {link.dropdown!.map((item, i) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClick}
                            className={`group flex items-center justify-between px-4 py-2.5 text-sm font-headline text-primary/60 hover:text-primary hover:bg-outline-variant/10 transition-all duration-150
                                ${i !== link.dropdown!.length - 1 ? 'border-b border-outline-variant/10' : ''}
                            `}
                        >
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">{item.label}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-secondary text-xs">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // ── DESKTOP: mega (grouped, independent) hover dropdown ────────────────
    if (hasMegaDropdown) {
        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    href={link.href}
                    onClick={onClick}
                    className={`transition-all duration-300 ease-out border-b-2 pb-1 block md:inline-block
                        ${active
                            ? 'text-secondary border-secondary'
                            : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                        }
                    `}
                >
                    {link.label}
                </Link>

                <div className={`absolute top-full left-0 mt-3 w-[26rem] bg-background border border-outline-variant/30 rounded-lg shadow-xl overflow-hidden transition-all duration-150 origin-top
                    ${isHovered ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
                `}>
                    <div className="grid grid-cols-2 divide-x divide-outline-variant/10">
                        {link.megaDropdown!.map((group) => (
                            <div key={group.heading} className="py-4 px-4">
                                <p className="text-[11px] uppercase tracking-widest text-outline font-semibold px-2 mb-2">
                                    {group.heading}
                                </p>
                                <div className="flex flex-col">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={onClick}
                                            className="group flex items-center justify-between px-2 py-2 text-sm font-headline text-primary/60 hover:text-primary hover:bg-outline-variant/10 rounded transition-all duration-150"
                                        >
                                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">{item.label}</span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-secondary text-xs">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Plain link (no dropdown) ────────────────────────────────────────────
    return (
        <Link
            href={link.href}
            onClick={onClick}
            className={`transition-all duration-300 ease-out border-b-2 pb-1 block md:inline-block
                ${active
                    ? 'text-secondary border-secondary'
                    : link.highlight
                        ? 'text-secondary/70 border-secondary/30 hover:text-secondary hover:border-secondary/60'
                        : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                }
            `}
        >
            {link.label}
        </Link>
    );
}


export default function NavbarInner() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentType = searchParams.get('type');
    const { user, loading } = useAuth();
    const isHomePage = pathname === '/';
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);



    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            setIsAtTop(currentScrollY < 10);

            if (isMenuOpen) return;

            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY, isMenuOpen]);

    return (
        <>

            <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ease-in-out
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    ${isAtTop && isHomePage
                    ? 'bg-transparent border-transparent'
                    : 'bg-background/90 border-outline-variant/10 backdrop-blur-xl'
                }
`}>

                <nav className="flex justify-between items-center px-4 sm:px-6 md:px-12 py-3.5 max-w-screen-2xl mx-auto">

                    {/* Logo */}
                    <Link href="/" className="text-xl sm:text-2xl font-headline tracking-widest uppercase text-primary hover:opacity-90 transition-opacity whitespace-nowrap">
                        Redolence
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-6 xl:gap-8 font-headline text-base xl:text-lg tracking-tight">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.label}
                                link={link}
                                pathname={pathname}
                                currentType={currentType}
                            />
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-6">

                        {/* Cart */}
                        <Link
                            href={user ? '/cart' : '/login'}
                            aria-label="Cart"
                            className="p-2 transition-all duration-300 ease-out hover:opacity-80 group"
                        >
                            <ShoppingCart size={22} strokeWidth={1.75} className="text-primary group-hover:text-secondary" />
                        </Link>
                        {/* Account */}
                        {loading ? (
                            <div className="w-6 h-6" />
                        ) : user ? (
                            <Link href="/profile" className="p-2 group">
                                <div className="flex items-center gap-1.5">
                                    <UserIcon size={22} strokeWidth={1.75} className="text-primary group-hover:text-secondary" />
                                    <span className="text-xs sm:text-sm font-medium text-primary hidden sm:inline-block">
                                        {user.first_name}
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1 p-2 transition-all duration-300 ease-out hover:opacity-80 group"
                            >
                                <UserIcon size={22} strokeWidth={1.75} className="text-primary group-hover:text-secondary" />
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary/70 hidden sm:inline-block">
                                    Login
                                </span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                            className="xl:hidden p-2 text-primary hover:text-secondary transition-colors duration-200"
                        >
                            {isMenuOpen ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
                        </button>


                    </div>
                </nav>
            </header>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-[#271310]/20 backdrop-blur-sm transition-opacity duration-500 xl:hidden
                    ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Side Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-40 w-full max-w-[280px] bg-background border-l border-outline-variant/20 p-8 pt-24 shadow-2xl transition-transform duration-500 ease-out xl:hidden overflow-y-auto
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex flex-col gap-6 font-headline text-xl tracking-wide">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            link={link}
                            pathname={pathname}
                            currentType={currentType}
                            onClick={() => setIsMenuOpen(false)}
                            mobile
                        />
                    ))}

                    {user && (
                        <div className="mt-4 pt-6 border-t border-outline-variant/20 sm:hidden">
                            <p className="font-body text-xs text-primary/50 uppercase tracking-widest">Signed In As</p>
                            <p className="text-secondary font-medium text-base mt-1">{user.first_name}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}