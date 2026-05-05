// components/MemberHero.tsx
export const MemberHero = () => {
    return (
        <section className="relative min-h-[716px] flex items-center px-8 md:px-20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                <div className="z-10 space-y-8">
                    <span className="text-secondary font-headline tracking-[0.2em] uppercase text-sm">
                        Members Exclusive
                    </span>
                    <h1 className="text-6xl md:text-8xl leading-tight font-headline text-primary">
                        The Inner Circle
                    </h1>
                    <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl font-label leading-relaxed">
                        A curated journey for the olfactory enthusiast. Elevate your experience through our tiered membership program.
                    </p>
                    <div className="pt-4">
                        <button className="bg-primary text-primary px-10 py-5 rounded-md hover:opacity-90 transition-all duration-300 tracking-wide font-medium">
                            EXPLORE BENEFITS
                        </button>
                    </div>
                </div>
                <div className="relative h-[600px] w-full">
                    <div className="absolute inset-0 bg-surface-container-low rounded-xl overflow-hidden shadow-sm rotate-2 translate-x-8 translate-y-8" />
                    <img
                        className="absolute inset-0 w-full h-full object-cover rounded-md shadow-2xl -rotate-1 transition-transform hover:rotate-0 duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIY1sCvpjr6CAlmeaXIuDU7VyplSjsE21YmtgXqGIagcdU8oEkv2k1DkAXpYXpLkFdgRqkDKMdBW0ItpYYAia4IvmwmPaCWEA5gvVvNzIJ1ZsOS-lTYaEZ7SkL8eR-7kspCeceltcGYKhMuDWw9V6UrfaYANGRiixVZOnQBezs8_Y9SJnTt98EpP949oYaY-9dY2JGMPlbKmQ40Xaux47vFo2MsIy2I5OQtyDk9m9VSCcqtEONjhyjGsDEKp_NcykDyacUZ_YnOAvh"
                        alt="Redolence Nepal Aesthetic"
                    />
                </div>
            </div>
        </section>
    );
};