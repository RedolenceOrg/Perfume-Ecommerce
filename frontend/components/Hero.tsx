export default function Hero() {
    return (
        <section className="relative h-[calc(100vh-88px)] w-full overflow-hidden">

            {/* Full Bleed Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
                    src='https://res.cloudinary.com/drcy1j8v9/image/upload/v1780587145/herosomething_qzvlbp.jpg'
                    alt="Redolence Nepal"
                />
                <div className="absolute inset-0" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-12">

                <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-6">
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
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf9f5] to-transparent pointer-events-none" />

        </section>
    )
}