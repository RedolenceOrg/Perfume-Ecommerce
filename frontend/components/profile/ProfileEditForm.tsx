import { authApiUpdate } from "@/context/api";
import { useState } from "react";
import { toast } from 'react-toastify'
import { NEPAL_DISTRICTS } from "../../types/perfumes" // update this path to wherever your districts file is

const nepalDistricts = NEPAL_DISTRICTS

export default function ProfileEditForm({
    initialPhone,
    initialPlace,
    initialDistrict,
}: any) {
    const [form, setForm] = useState({
        phone: initialPhone || "",
        place: initialPlace || "",
        district: initialDistrict || "",
    });

    const handleUpdate = async () => {
        try {
            const payload = {
                phone_number: form.phone,
                place: form.place,
                district: form.district,
            }
            const res = await authApiUpdate('/authenticate/updateprofile/', payload)
            const data = await res.json()
            if (!res.ok) {
                toast.error(data)
            } else {
                toast.success("Profile updated successfully")
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body text-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        Place / City
                    </label>
                    <input
                        type="text"
                        value={form.place}
                        onChange={(e) => setForm({ ...form, place: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body text-primary"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        District
                    </label>
                    <select
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body text-primary"
                    >
                        <option value="" disabled>Select district</option>
                        {nepalDistricts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-12 flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="bg-primary text-white px-10 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-secondary transition-all duration-300"
                >
                    Update Records
                </button>
            </div>
        </div>
    );
}