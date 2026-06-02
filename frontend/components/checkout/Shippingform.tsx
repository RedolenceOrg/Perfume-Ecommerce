import { NEPAL_DISTRICTS, VALLEY_DISTRICTS } from '../../types/perfumes'

interface ShippingFormProps {
    place: string
    setPlace: (val: string) => void
    district: string
    setDistrict: (val: string) => void
    phoneNumber: string
    setPhoneNumber: (val: string) => void
    firstName?: string
}

export default function ShippingForm({
    place, setPlace,
    district, setDistrict,
    phoneNumber, setPhoneNumber,
    firstName
}: ShippingFormProps) {
    return (
        <div>
            {firstName && (
                <p className="text-sm text-outline mb-6">
                    Delivering to <span className="text-primary font-semibold">{firstName}</span>
                </p>
            )}

            {/* Place */}
            <div className="mb-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                    Place / City <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Thamel, Sanepa, Banepa..."
                    className="w-full bg-background border-b border-outline-variant p-3 text-sm text-primary placeholder:text-outline/40 focus:outline-none focus:border-primary transition-all"
                />
            </div>

            {/* District */}
            <div className="mb-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                    District <span className="text-red-500">*</span>
                </label>
                <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-background border-b border-outline-variant p-3 text-sm text-primary focus:outline-none focus:border-primary transition-all"
                >
                    <option value="" disabled>Select district</option>
                    {NEPAL_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                {district && (
                    <p className="text-[10px] uppercase tracking-widest mt-2 font-bold text-secondary">
                        {VALLEY_DISTRICTS.includes(district)
                            ? '✓ Inside valley — NPR 100 delivery'
                            : '✓ Outside valley — NPR 150 delivery'}
                    </p>
                )}
            </div>

            {/* Phone */}
            <div className="mb-8">
                <label className="text-[10px] uppercase tracking-[0.2em] text-outline block mb-2">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full bg-transparent border-b border-outline-variant p-3 text-sm text-primary placeholder:text-outline/40 focus:outline-none focus:border-primary transition-all"
                />
            </div>
        </div>
    )
}