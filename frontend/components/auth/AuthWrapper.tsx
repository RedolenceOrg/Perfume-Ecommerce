import React from "react";
import Link from "next/link";

interface AuthWrapperProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    type: "login" | "signup";
}

const AuthWrapper = ({ children, title, subtitle, type }: AuthWrapperProps) => {
    return (
        <div className="relative min-h-screen w-full font-manrope">

            {/* 1. Immersive Background Layer */}
            <div className="fixed inset-0 z-0 bg-[#f8f6f2]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_#ffdea5_0%,_transparent_50%)] opacity-30"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#d9e7d2_0%,_transparent_50%)] opacity-40"></div>
            </div>

            {/* 2. The Horizontal Gallery Card */}
            <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
                <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white shadow-[0_40px_100px_rgba(0,0,0,0.07)] rounded-sm overflow-x-hidden border border-white">

                    {/* Left Side: Editorial Image Section (Visible on MD and up) */}
                    <section className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-neutral-100">
                        <img
                            alt="Editorial Fragrance"
                            className="w-full h-full object-cover grayscale-[10%] hover:scale-105 transition-transform duration-1000"
                            src="https://images.unsplash.com/photo-1580445206726-c6eace8e02e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZyYWdyYW50fGVufDB8fDB8fHww"
                        />
                        {/* Tonal Overlay */}
                        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>

                        {/* Minimal Brand Badge */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                            <span className="text-[10px] tracking-[0.6em] uppercase font-bold mb-4 opacity-80">Collection Privée</span>
                            <h2 className="font-headline italic text-3xl md:text-4xl">Redolence Nepal</h2>
                            <div className="mt-6 w-10 h-[1px] bg-white/40"></div>
                        </div>
                    </section>

                    {/* Right Side: The Form Section */}
                    <section className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
                        <header className="mb-10">
                            <h2 className="font-headline text-3xl tracking-tight text-gray-900 mb-2">
                                {title}
                            </h2>
                            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold">
                                {subtitle}
                            </p>
                        </header>

                        <div className="w-full">
                            {children}
                        </div>

                        <footer className="mt-12 pt-8 border-t border-gray-50">
                            <p className="text-[11px] text-gray-400 uppercase tracking-widest text-center">
                                {type === "login" ? (
                                    <>
                                        New to the House?
                                        <Link href="/signup" className="text-black font-bold border-b border-black ml-2 pb-1 hover:text-[#775a19] hover:border-[#775a19] transition-all">
                                            Create Account
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Already a Member?
                                        <Link href="/login" className="text-black font-bold border-b border-black ml-2 pb-1 hover:text-[#775a19] hover:border-[#775a19] transition-all">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </p>
                        </footer>
                    </section>

                </div>
            </div>

            {/* Floating Close Button */}
            <Link href="/" className="fixed top-10 right-10 z-50 text-black/30 hover:text-black transition-colors">
                <span className="material-symbols-outlined text-3xl font-light">close</span>
            </Link>
        </div>
    );
};

export default AuthWrapper;