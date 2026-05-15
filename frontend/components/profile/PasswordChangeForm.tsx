import { authApiUpdate } from "@/context/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-toastify'
import { useAuth } from "@/context/AuthContext";

export default function PasswordChangeForm() {

    const router = useRouter()
    const { refreshUser, logout } = useAuth();
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const [visibility, setVisibility] = useState({
        current_password: false,
        new_password: false,
        confirm_new_password: false,
    });

    const toggleVisibility = (field: keyof typeof visibility) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleUpdate = async () => {

        if (form.new_password !== form.confirm_new_password) {
            toast.error("New passwords do not match")
            return
        }
        try {
            const payload = {
                current_password: form.current_password,
                new_password: form.new_password,
                confirm_new_password: form.confirm_new_password,
            }
            const res = await authApiUpdate('/authenticate/updatepassword/', payload)
            const data = await res.json()
            if (res.ok) {
                toast.success("Password updated successfully")
                await logout()

                setForm({ current_password: "", new_password: "", confirm_new_password: "" })
                router.push('/')

            } else {
                toast.error(data.detail || "Failed to update password")
            }
        } catch (error) {
            console.error("Password change error:", error);
        }
    };

    const fields = [
        { key: "current_password", label: "Current Password" },
        { key: "new_password", label: "New Password" },
        { key: "confirm_new_password", label: "Confirm New Password" },
    ] as const;

    return (
        <section className="max-w-5xl mx-auto mb-20 bg-surface-container-low p-8 md:p-12 border border-outline-variant/10">
            <div className="flex items-center space-x-4 mb-10">
                <h2 className="font-serif text-2xl text-primary">
                    Password Settings
                </h2>
                <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {fields.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                        <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                            {label}
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={visibility[key] ? "text" : "password"}
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 pr-8 focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body text-primary"
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility(key)}
                                className="absolute right-0 text-outline hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">
                                    {visibility[key] ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="bg-primary text-white px-10 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-secondary transition-all duration-300"
                >
                    Update Password
                </button>
            </div>
        </section>
    );
}