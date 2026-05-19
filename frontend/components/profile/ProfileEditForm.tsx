import { authapiPost, authApiUpdate } from "@/context/api";
import { useState } from "react";
import { toast } from 'react-toastify'
const NEPAL_DISTRICTS = [
    "Kathmandu", "Bhaktapur", "Lalitpur", "Achham", "Arghakhanchi",
    "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara",
    "Bardiya", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang",
    "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", "Dolpa",
    "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam",
    "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur",
    "Kapilvastu", "Kaski", "Kavrepalanchok", "Khotang",
    "Lamjung", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu",
    "Mustang", "Myagdi", "Nawalpur", "Nuwakot", "Okhaldhunga", "Palpa",
    "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa",
    "Rautahat", "Rolpa", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari",
    "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu",
    "Sunsari", "Surkhet", "Syangja", "Taplejung", "Tehrathum",
    "Udayapur", "Western Rukum"
];

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
        <section className="max-w-5xl mx-auto mb-20 bg-surface-container-low p-8 md:p-12 border border-outline-variant/10">
            <div className="flex items-center space-x-4 mb-10">
                <div>{form.phone} {form.district}</div>
                <h2 className="font-serif text-2xl text-primary">
                    Information Settings
                </h2>
                <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-outline focus:ring-0 focus:border-primary transition-colors font-body text-primary"
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-outline focus:ring-0 focus:border-primary transition-colors font-body text-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        District
                    </label>
                    <select
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-outline focus:ring-0 focus:border-primary transition-colors font-body text-primary"
                    >
                        <option value="" disabled>Select district</option>
                        {NEPAL_DISTRICTS.map((d) => (
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
        </section>
    );
}