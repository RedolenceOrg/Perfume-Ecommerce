
import { authapiPost, authApiUpdate } from "@/context/api";
import { useState } from "react";
import { toast } from 'react-toastify'

export default function ProfileEditForm({
    initialPhone,
    initialAddress,
}: any) {
    const [form, setForm] = useState({
        phone: initialPhone || "",
        address: initialAddress || "",
    });

    const handleUpdate = async () => {
        try {
            const payload = {
                phone_number: form.phone,
                address: form.address
            }
            const res = await authApiUpdate('/authenticate/updateprofile/', payload)
            const data = await res.json()
            console.log(payload)
            if (!res.ok) {
                toast.error(data)
            }

        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <section className="max-w-5xl mx-auto mb-20 bg-surface-container-low p-8 md:p-12 border border-outline-variant/10">
            <div className="flex items-center space-x-4 mb-10">
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
                        onChange={(e) =>
                            setForm({
                                ...form,
                                phone: e.target.value,
                            })
                        }
                        className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 px-0 focus:outline-none focus:border-outline focus:ring-0 focus:border-primary transition-colors font-body text-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
                        Shipping Address
                    </label>

                    <input
                        type="text"
                        value={form.address}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                address: e.target.value,
                            })
                        }
                        className="w-full bg-transparent border-0 border-b focus:outline-none focus:border-outline border-outline-variant/50 py-3 px-0 focus:ring-0 focus:border-secondary transition-colors font-body text-primary"
                    />
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