'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Perfumes', href: '/shop?type=Perfume' },
    { label: 'Attars', href: '/shop?type=Attar' },
    { label: 'Atomizer', href: '/atomizer' },
    { label: 'Thrift', href: '/thrift' },
    { label: 'About Us', href: '/about' },
];

function NavLink({ link, pathname, currentType }: {
    link: { label: string; href: string };
    pathname: string;
    currentType: string | null;
}) {
    const isActive = () => {
        if (link.href.includes('?')) {
            const [basePath, query] = link.href.split('?');
            const typeParam = new URLSearchParams(query).get('type');
            return pathname === basePath && currentType === typeParam;
        }
        return pathname === link.href;
    };

    return (
        <Link
            href={link.href}
            className={`transition-all duration-300 ease-out border-b-2 pb-1
        ${isActive()
                    ? 'text-secondary border-secondary'
                    : 'text-primary/70 border-transparent hover:text-primary hover:border-primary/30'
                }`}
        >
            {link.label}
        </Link>
    );
}

export default function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentType = searchParams.get('type');
    const { user, loading, logout, refreshUser } = useAuth();
    const router = useRouter()

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
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
                <div className="flex items-center gap-2 md:gap-6">

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
                        <Link href={"/profile"}>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                                    person
                                </span>
                                <span className="text-sm font-medium text-primary">
                                    {user.first_name}
                                </span>
                                <button onClick={async () => {
                                    await logout()
                                    router.push('/')
                                }}>Logout</button>

                            </div>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-1 transition-all duration-300 ease-out hover:opacity-80 group"
                        >
                            <span className="material-symbols-outlined text-primary group-hover:text-secondary">
                                person
                            </span>
                            <span className="text-xs uppercase tracking-widest text-primary/70">
                                Login
                            </span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button aria-label="Menu" className="md:hidden p-2 text-primary">
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                </div>
            </nav>
        </header>
    );
}