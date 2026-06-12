import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-[calc(100vh-33px)] w-full overflow-hidden">

            {/* Full Bleed Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"

                    // src='https://res.cloudinary.com/drcy1j8v9/image/upload/v1780587145/herosomething_qzvlbp.jpg'
                    src='https://images.unsplash.com/photo-1588514912908-8f5891714f8d?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt="Redolence Nepal"
                    width={1920}
                    height={1080}
                    priority
                />
                <div className="absolute inset-0" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center text-center px-6 md:px-12 py-16">

                <p className="font-headline text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-6">
                    Kathmandu · Est. 2024
                </p>

                <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-white leading-none tracking-tighter mb-4 drop-shadow-2xl">
                    Redolence
                </h1>

                <p className="font-headline text-xl sm:text-2xl md:text-3xl text-white/80 italic font-normal mb-6">
                    Where every drop tells a story.
                </p>

            </div>

            {/* Bottom fade */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf9f5] to-transparent pointer-events-none" /> */}

        </section>
    )
}