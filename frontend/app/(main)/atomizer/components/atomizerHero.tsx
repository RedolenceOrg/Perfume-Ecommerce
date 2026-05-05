export default function AtomizerHero() {
    return (
        <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden bg-surface">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1640900726922-d13d64b17efe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="heroArt"
                    className="w-full h-full object-cover will-change-transform"
                />
                {/* Simple Tint Overlay: Improves text legibility without the lag of complex gradients */}
                <div className="absolute inset-0 bg-primary/40"></div>
            </div>

            {/* Centered Content */}
            <div className="relative z-10 max-w-[1920px] px-12 mx-auto text-center">
                <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-white mb-8 block">
                    The Science of Scent
                </span>

                <h1 className="text-6xl md:text-9xl font-serif tracking-tighter text-white mb-8 leading-none">
                    The <span className="italic font-light">Vessels</span>
                </h1>

                <div className="w-24 h-[1px] bg-secondary/40 mx-auto mb-10"></div>

                <p className="text-lg md:text-xl font-body text-white/90 max-w-2xl mx-auto leading-relaxed tracking-wide">
                    Every drop is sacred. Our atomizers are engineered to produce a
                    <span className="text-white font-medium italic"> micro-fine mist  </span>
                    that captures the soul of every fragrance while preventing evaporation.
                </p>

                {/* Minimal Scroll Detail */}
                <div className="absolute left-1/2 bottom-12 -translate-x-1/2 flex flex-col items-center gap-4">
                    <div className="w-[1px] h-16 bg-white/20"></div>
                </div>
            </div>
        </section>
    );
}