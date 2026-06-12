'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Perfumes', href: '/shop?type=Perfume' },
    { label: 'Attars', href: '/shop?type=Attar' },
    { label: 'Atomizer', href: '/atomizer' },
    { label: 'Thrift', href: '/thrift' },
    { label: 'Members', href: '/members', highlight: true },
];

function NavLink({ link, pathname, currentType, onClick }: {
    link: { label: string; href: string; highlight?: boolean };
    pathname: string;
    currentType: string | null;
    onClick?: () => void;
}) {
    const isActive = () => {
        if (link.href.includes('?')) {
            const [basePath, query] = link.href.split('?');
            const typeParam = new URLSearchParams(query).get('type');
            return pathname === basePath && currentType === typeParam;
        }
        return pathname === link.href;
    };

    const active = isActive();

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

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <header
                className={`sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10 transition-transform duration-500 ease-in-out
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                `}
            >
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
                className={`fixed top-0 right-0 bottom-0 z-40 w-full max-w-[280px] bg-background border-l border-outline-variant/20 p-8 pt-24 shadow-2xl transition-transform duration-500 ease-out md:hidden
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