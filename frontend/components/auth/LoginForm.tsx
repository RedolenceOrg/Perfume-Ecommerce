"use client";

import React, { useState } from "react";
import Link from "next/link"

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Attempting login for:", email);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="relative group">
                <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1 transition-all group-focus-within:text-[#775a19]"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent border-b border-gray-200 py-3 px-1 text-sm transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                />
            </div>

            {/* Password Field */}
            <div className="relative group">
                <div className="flex justify-between items-end mb-1 ml-1">
                    <label
                        htmlFor="password"
                        className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold transition-all group-focus-within:text-[#775a19]"
                    >
                        Password
                    </label>
                </div>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-gray-200 py-3 px-1 text-sm transition-all focus:border-black focus:outline-none placeholder:text-gray-300"
                />
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
                <button
                    type="submit"
                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Access The Gallery
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-300">Or</span>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>
                <Link href="/">
                    <button
                        type="button"
                        className="w-full bg-[#f6f3ee] border border-gray-100 text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#ebe8e3] transition-all active:scale-[0.98]"
                    >
                        Continue as Guest
                    </button>
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;