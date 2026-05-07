'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';




const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Perfumes', href: '/shop?type=Perfume' },
    { label: 'Attars', href: '/shop?type=Attar' },
    { label: 'Atomizer', href: '/atomizer' },
    { label: 'Thrift', href: '/thrift' },
    { label: 'About Us', href: '/about' },
];

export default function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentType = searchParams.get('type');

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Optimized scroll logic: Throttled/Debounced feel via RequestAnimationFrame
    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            // 1. Logic to show/hide navbar on scroll
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    return (
        <header
            className={`sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10 transition-transform duration-500 ease-in-out
                ${isVisible ? 'translate-y-0' : '-translate-y-full'}
            `}
        >
            <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto">

                {/* Logo */}
                <Link href="/" className="text-2xl font-headline tracking-widest uppercase text-primary hover:opacity-90 transition-opacity">
                    Redolence Nepal
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10 font-headline text-lg tracking-tight">
                    {navLinks.map((link) => {
                        // Check if the link is active based on pathname AND query params
                        const isActive = useMemo(() => {
                            if (link.href.includes('?')) {
                                const [basePath, query] = link.href.split('?');
                                const typeParam = new URLSearchParams(query).get('type');
                                return pathname === basePath && currentType === typeParam;
                            }
                            return pathname === link.href;
                        }, [pathname, currentType, link.href]);

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`transition-all duration-300 ease-out border-b-2 pb-1
                                    ${isActive
                                        ? 'text-secondary border-secondary'
                                        : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2 md:gap-6">
                    <button aria-label="Cart" className="p-2 transition-all duration-300 ease-out hover:opacity-80 group">
                        <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                            cart
                        </span>
                    </button>
                    <button aria-label="Account" className="p-2 transition-all duration-300 ease-out hover:opacity-80 group">
                        <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                            person
                        </span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button aria-label="Menu" className="md:hidden p-2 text-primary">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

            </nav>
        </header>
    );
}