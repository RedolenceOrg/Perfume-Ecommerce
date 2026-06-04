'use client';

import { Suspense } from 'react';
import NavbarInner from './NavbarInner'; // Adjust paths based on your folder structure

function NavbarFallback() {
    return (
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10 h-[65px] w-full">
            <div className="flex justify-between items-center px-4 sm:px-6 md:px-12 py-3.5 max-w-screen-2xl mx-auto">
                <div className="text-xl sm:text-2xl font-headline tracking-widest uppercase text-primary opacity-50">
                    Redolence Nepal
                </div>
                <div className="w-10 h-10" />
            </div>
        </header>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<NavbarFallback />}>
            <NavbarInner />
        </Suspense>
    );
}