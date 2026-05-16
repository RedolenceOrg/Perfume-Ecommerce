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
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">
                        First Name
                    </label>
                    <input
                        name="first_name"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all"
                    />
                </div>
                <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">
                        Last Name
                    </label>
                    <input
                        name="last_name"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all"
                    />
                </div>
            </div>

            {/* Username */}
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">
                    Username
                </label>
                <input
                    name="username"
                    type="text"
                    required
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all"
                />
            </div>

            {/* Email */}
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">
                    Email Address
                </label>
                <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all"
                />
            </div>

            {/* Password */}
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 block group-focus-within:text-[#775a19]">
                    Choose Password
                </label>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full bg-transparent border-b border-gray-200 py-3 pr-10 focus:outline-none focus:border-black transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-0 bottom-3 text-gray-400 hover:text-black transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 hover:bg-[#1a1a1a] transition-all active:scale-[0.98]"
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>

        </form>
    );
}