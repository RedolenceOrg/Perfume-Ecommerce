"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/context/api";

export default function SignupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        apiGet('/authenticate/csrf/')
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
        };

        try {
            const res = await apiPost('/authenticate/signup/', payload);

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data?.email?.[0] ||
                    data?.username?.[0] ||
                    data?.detail ||
                    "Registration failed"
                );
                setLoading(false);
                return;
            }

            // success → redirect
            router.push("/login");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        finally {

            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

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
                <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all"
                />
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