
import Link from "next/link";

export default function MembersSection() {
    return (
        <section className="relative w-full h-screen overflow-hidden">

            {/* Full Bleed Background */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1761546475596-f38c958e7a37?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Membership"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full w-full flex flex-col items-center justify-start text-center px-8 md:px-20 pt-32">

                <p className="font-headline text-[24px] md:text-sm uppercase tracking-[0.5em] text-white/70 mb-4">
                    Redolence Nepal — The Inner Circle
                </p>

                <h2 className="font-headline text-5xl md:text-[10rem] lg:text-[13rem] text-white tracking-tighter leading-none mb-2 opacity-90 drop-shadow-2xl">
                    Members
                </h2>

                <p className="font-headline text-[10px] md:text-sm uppercase tracking-[0.5em] text-white/70 mb-6">
                    Exclusive Access · Priority Releases · VIP Privileges
                </p>

                <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed mb-12">
                    Join our membership program and unlock tiers of luxury. Early access to vault releases, bespoke fragrance consultations, and up to 15% off every order.
                </p>

                <Link href="/members">
                    <button className="border border-white text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-sm active:scale-95">
                        Become a Member
                    </button>
                </Link>

            </div>

        </section>
    )
}