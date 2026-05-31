"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authapiGet, authapiPost } from "@/context/api";

export default function SignupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        authapiGet('/authenticate/csrf/')
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const payload = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            first_name: formData.get("first_name"),
            last_name: formData.get("last_name"),
        };

        try {
            const res = await authapiPost('/authenticate/signup/', payload);
            const data = await res.json();

            if (!res.ok) {
                setError(
                    data?.email?.[0] ||
                    data?.username?.[0] ||
                    data?.first_name?.[0] ||
                    data?.last_name?.[0] ||
                    data?.detail ||
                    "Registration failed"
                );
                return;
            }

            router.push("/login");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Row 1: First + Last */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1 block group-focus-within:text-[#775a19]">
                        First Name
                    </label>
                    <input
                        name="first_name"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-sm"
                    />
                </div>
                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1 block group-focus-within:text-[#775a19]">
                        Last Name
                    </label>
                    <input
                        name="last_name"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-sm"
                    />
                </div>
            </div>

            {/* Row 2: Username + Email */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1 block group-focus-within:text-[#775a19]">
                        Username
                    </label>
                    <input
                        name="username"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-sm"
                    />
                </div>
                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1 block group-focus-within:text-[#775a19]">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-sm"
                    />
                </div>
            </div>

            {/* Row 3: Password (full width) */}
            <div className="relative group">
                <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1 block group-focus-within:text-[#775a19]">
                    Choose Password
                </label>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full bg-transparent border-b border-gray-200 py-2 pr-10 focus:outline-none focus:border-black transition-all text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-0 bottom-2 text-gray-400 hover:text-black transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <span className="material-symbols-outlined text-base">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest font-bold">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 text-[10>px] uppercase tracking-[0.2em] font-bold hover:bg-[#333] transition-all active:scale-[0.98]"
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    );
}