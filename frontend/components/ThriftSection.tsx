import Link from "next/link";
import Image from "next/image";

export default function ThriftSection() {
    return (
        <section className="w-full bg-background py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">

                {/* Image Column */}
                <div className="relative h-[520px] md:h-[680px] overflow-hidden">
                    <Image
                        src="https://i.pinimg.com/736x/42/11/f0/4211f0e4a0244a2bd5eb173ad2031e81.jpg"
                        alt="Curated vintage perfume bottles"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-7 left-7 flex items-center gap-3">
                        <span className="bg-[#faf8f4]/90 text-[#3a2a10] text-[9px] tracking-[0.22em] uppercase px-3 py-1.5">Pre-Loved</span>
                        <div className="w-1 h-1 rounded-full bg-white/50" />
                        <span className="bg-[#faf8f4]/90 text-[#3a2a10] text-[9px] tracking-[0.22em] uppercase px-3 py-1.5">Authenticated</span>
                    </div>

                    {/* Bottom stats */}
                    <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
                        {[["100%", "Authenticated"], ["70%+", "Full Bottles"], ["60%", "Off Retail"]].map(([num, lbl], i) => (
                            <div key={i} className="text-center">
                                <p className="font-serif text-3xl font-lg text-white leading-none">{num}</p>
                                <p className="text-[12px] tracking-[0.18em] uppercase text-white/60 mt-1">{lbl}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Text Column */}
                <div className="flex flex-col justify-center px-10 py-16 md:px-16 bg-[#faf8f4]">

                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[9px] tracking-[0.32em] uppercase text-[#a0845c]">Thrifted Fragrances</span>
                        <div className="flex-1 h-px bg-[#a0845c]/25" />
                    </div>

                    {/* Heading */}
                    <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.08] tracking-tight text-[#1e130a] mb-6">
                        Thrifted<br />Perfumes,<br />
                        <span className="italic text-[#6b4c24]">Untold Stories.</span>
                    </h2>

                    {/* Body */}
                    <p className="text-sm leading-relaxed text-[#6b6058] font-light max-w-sm mb-9">
                        Rare, discontinued, and gently-used fragrances rehomed with care.
                        Give beautiful scents a second life — at a fraction of retail.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mb-10">
                        <Link href="/thrift" className="bg-[#1e130a] text-[#faf8f4] text-[10px] tracking-[0.24em] uppercase py-4 px-8 hover:bg-[#3a2a10] transition-colors">
                            Shop Thrifted
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-col gap-2.5 pt-8 border-t border-[#1e130a]/08">
                        {[
                            "Every bottle independently verified before listing",
                            "Discontinued and rare finds, sourced globally",
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 rounded-full border border-[#6b4c24]/40 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#a0845c]" />
                                </div>
                                <span className="text-xs text-[#6b6058] tracking-wide">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}