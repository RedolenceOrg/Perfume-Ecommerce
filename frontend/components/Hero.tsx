import Link from 'next/link'

export default function Hero() {
    return (
        <section className="group relative h-[calc(100vh)] w-full overflow-hidden">

            {/* Full Bleed Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="w-full h-full object-cover transition-all duration-700 "
                    src="https://res.cloudinary.com/dzj95e0iv/video/upload/f_auto,q_auto/v1786629929/hero-video_wqiw49.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Redolence Nepal"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center text-center px-6 md:px-12 justify-center">

                <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-white leading-none tracking-tighter mb-4 drop-shadow-2xl">
                    REDOLENCE
                </h1>

                <p className="font-headline text-xl sm:text-2xl md:text-3xl text-white/80 italic font-normal mb-8">
                    Test before you Buy
                </p>

                <Link
                    href="/shop"
                    className="
                        group/button
                        flex items-center justify-center
                        w-32 h-16
                        border border-white
                        bg-blur
                        text-white
                        uppercase
                        tracking-widest
                        text-sm
                        transition-all duration-500
                        hover:bg-white
                        hover:text-black
                        hover:scale-105
                    "
                >
                    Shop Now
                </Link>

            </div>
        </section>
    )
}