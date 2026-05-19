// components/ProfileHeader.tsx
export default function ProfileHeader({ profile }: { profile: any }) {
    const getLoyaltyClass = (spend: number) => {
        if (spend > 100000) return "The Aficionado";
        if (spend > 50000) return "The Connoisseur";
        return "The Enthusiast";
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
            <div className="lg:col-span-7">
                <span className="font-label text-secondary text-sm tracking-[0.2em] uppercase block mb-4">Member Profile</span>
                <h1 className="font-display text-5xl md:text-6xl text-primary font-bold mb-6 tracking-tight">
                    {profile.user.username}
                </h1>
                <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0 text-outline">
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <span className="font-body text-sm tracking-wide">{profile.user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">call</span>
                        <span className="font-body text-sm tracking-wide">{profile.phone_number}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-sm">house</span>
                        <span className="font-body text-sm tracking-wide">{profile.place},{profile.district}</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <MetricCard label="Loyalty Class" value={getLoyaltyClass(profile.total_spend)} isItalic />
                <MetricCard label="Total Expenditure" value={`NPR ${profile.total_spend.toLocaleString()}`} subLabel="Lifetime Value" />
            </div>
        </section>
    );
}

function MetricCard({ label, value, subLabel, isItalic }: any) {
    return (
        <div className="bg-surface-container-lowest p-8 border-l-2 border-secondary/20">
            <p className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">{label}</p>
            <div className="flex flex-col">
                <span className={`text-primary ${isItalic ? 'font-serif text-xl italic' : 'font-body text-2xl font-light tracking-tight'}`}>
                    {value}
                </span>
                {subLabel && <span className="text-[10px] uppercase text-secondary font-bold tracking-widest mt-4">{subLabel}</span>}
            </div>
        </div>
    );
}