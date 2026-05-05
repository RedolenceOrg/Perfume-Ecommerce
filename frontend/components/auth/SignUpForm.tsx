"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); router.push("/login"); }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">Full Name</label>
                <input name="name" type="text" required className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all" />
            </div>
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">Email Address</label>
                <input name="email" type="email" required className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all" />
            </div>
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">Choose Password</label>
                <input name="password" type="password" required className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 hover:bg-[#1a1a1a] transition-all active:scale-[0.98]">
                {loading ? "Creating Profile..." : "Create Profile"}
            </button>
        </form>
    );
}