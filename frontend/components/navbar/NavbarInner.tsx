'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { label: 'Home', href: '/' },
    {
        label: 'Perfumes', href: '/shop?type=Perfume', dropdown: [
            { label: 'Niche', href: '/shop?type=Perfume&collection=niche' },
            { label: 'Designer', href: '/shop?type=Perfume&collection=designer' },
            { label: 'Middle Eastern', href: '/shop?type=Perfume&collection=middle_eastern' },
            { label: 'In house', href: '/shop?type=Perfume&collection=in_house' },
        ]
    },
    { label: 'Attars', href: '/shop?type=Attar' },
    { label: 'Atomizer', href: '/atomizer' },
    { label: 'Thrift', href: '/thrift' },
    { label: 'Members', href: '/members', highlight: true },
];

function NavLink({ link, pathname, currentType, onClick, mobile = false }: {
    link: { label: string; href: string; highlight?: boolean; dropdown?: { label: string; href: string }[] };
    pathname: string;
    currentType: string | null;
    onClick?: () => void;
    mobile?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        timeoutRef.current = setTimeout(() => setIsHovered(false), 150);
    };

    if (link.dropdown) {
        // MOBILE: accordion — chevron toggles, label still navigates
        if (mobile) {
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
                            <span
                                className={`material-symbols-outlined text-2xl transition-transform duration-300 ease-out ${isOpenMobile ? 'rotate-180' : 'rotate-0'}`}
                            >
                                expand_more
                            </span>
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-out
                            ${isOpenMobile ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <div className="flex flex-col gap-3 pl-4 border-l border-outline-variant/20">
                            {link.dropdown.map((item) => (
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
                </div>
            );
        }

        // DESKTOP: hover dropdown
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

                {/* Dropdown */}
                <div className={`absolute top-full left-0 mt-3 w-44 bg-background border border-outline-variant/30 rounded-lg shadow-xl overflow-hidden transition-all duration-150 origin-top
    ${isHovered ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
`}>
                    {link.dropdown.map((item, i) => (
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
                    <div className="hidden md:flex items-center gap-10 font-headline text-lg tracking-tight">
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
                            <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                                shopping_bag
                            </span>
                        </Link>

                        {/* Account */}
                        {loading ? (
                            <div className="w-6 h-6" />
                        ) : user ? (
                            <Link href="/profile" className="p-2 group">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                                        person
                                    </span>
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
                                <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                                    person
                                </span>
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary/70 hidden sm:inline-block">
                                    Login
                                </span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                            className="md:hidden p-2 text-primary hover:text-secondary transition-colors duration-200"
                        >
                            <span className="material-symbols-outlined">
                                {isMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>

                    </div>
                </nav>
            </header>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-[#271310]/20 backdrop-blur-sm transition-opacity duration-500 md:hidden
                    ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Side Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-40 w-full max-w-[280px] bg-background border-l border-outline-variant/20 p-8 pt-24 shadow-2xl transition-transform duration-500 ease-out md:hidden overflow-y-auto
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