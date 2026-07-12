const steps = [
    {
        number: "01",
        title: "Cleanse & Dry",
        description:
            "Wash the bridge and sides of your nose, then pat completely dry. Any trace of oil or moisture will weaken the hold.",
    },
    {
        number: "02",
        title: "Apply & Smooth",
        description:
            "Bend the strip along its centre line and press it across your nose, smoothing outward from the middle to the edges.",
    },
    {
        number: "03",
        title: "Wear & Remove",
        description:
            "Leave in place for up to 12 hours. To remove, peel slowly from the outside in, never against the grain of the skin.",
    },
];

const features = [
    {
        icon: "airwave",
        title: "Precision Tension",
        description:
            "Dual parallel bands provide consistent, reliable lift throughout the night or during intense physical activity.",
    },
    {
        icon: "eco",
        title: "Skin-Safe Bond",
        description:
            "Hypoallergenic adhesive specifically formulated for sensitive skin. Secure hold, effortless removal.",
    },
    {
        icon: "visibility_off",
        title: "Minimalist Form",
        description:
            "Tonal layering ensures a discreet profile. Designed to blend seamlessly into your evening ritual.",
    },
];

export default function ProductInfo() {
    return (
        <>
            {/* How to Use / The Ritual */}
            <section className="bg-surface-container-low px-8 py-24 md:px-20">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-16 space-y-3 text-center">
                        <span className="font-label text-secondary text-xs uppercase tracking-[0.25em]">
                            The Ritual
                        </span>
                        <h2 className="font-headline text-primary text-3xl md:text-4xl">
                            How to Use Aurora Breath
                        </h2>
                    </div>

                    {/* Step Cards */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="bg-surface-container-lowest border-outline-variant/20 flex flex-col justify-between rounded-md border p-8 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="space-y-4">
                                    <span className="font-headline text-outline text-4xl opacity-50 block">
                                        {step.number}
                                    </span>
                                    <h3 className="font-headline text-primary text-xl">{step.title}</h3>
                                    <p className="font-body text-outline text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="bg-surface-container-low px-8 py-24 md:px-20 border-t border-outline-variant/20">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-16 space-y-3 text-center max-w-xl mx-auto">
                        <h2 className="font-headline text-primary text-3xl md:text-4xl">
                            Designed for Depth
                        </h2>
                        <p className="font-body text-outline text-sm leading-relaxed">
                            Science meets minimalism. Our nasal strips are crafted for those who refuse to
                            compromise on quality or aesthetics.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-surface-container-lowest border-outline-variant/20 group flex flex-col justify-between rounded-md border p-8 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div>
                                    <span className="material-symbols-outlined text-secondary text-3xl mb-6 block group-hover:text-primary transition-colors">
                                        {feature.icon}
                                    </span>
                                    <h3 className="font-headline text-primary text-xl mb-3">{feature.title}</h3>
                                    <p className="font-body text-outline text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifestyle Image Section */}
            <section className="bg-surface-container-low px-8 py-24 md:px-20 border-t border-outline-variant/20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Image Frame Container */}
                        <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-md border border-outline-variant/20 bg-surface-container-lowest p-2">
                            <div
                                className="w-full h-full bg-cover bg-center rounded-sm transition-transform duration-1000 hover:scale-102"
                                role="img"
                                aria-label="A minimalist bedroom scene in soft morning light, conveying calm and wellness."
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBU6lPHBhP19iolmir1XYkRYGH9yv8gGEPAyaPQgej2epNWOCu2WoZxSgF7xPTSk1sLwiAszHm9G6nwwyNouIn0Q8SsdZQRgwWmq6Zhsur1WvCEgaxKawdYvfe9M1ttmfv8vAyXuaR58vcg8W2ZILsTfb2ISs-gZJ4BKVyzxk7QqR3Uvc7ux1CaHHsBX4P4TvAeDoGvoVQIqLIswPItBuZqzeXBZF-Y0VyxQAikhZC4OakfhA1PR_eWCehCoMbiEarcJDadrjr85uY')",
                                }}
                            />
                        </div>
                        {/* Text Details Container */}
                        <div className="lg:col-span-5 space-y-6 lg:pl-6">
                            <h2 className="font-headline text-primary text-3xl md:text-4xl">The Invisible Ritual</h2>
                            <p className="font-headline text-secondary text-lg italic leading-relaxed">
                                "A breath of clarity is the foundation of a refined life."
                            </p>
                            <p className="font-body text-outline text-sm leading-relaxed">
                                Incorporating Aurora into your nightly routine transforms sleep into a
                                restorative journey. By optimizing your natural respiratory flow, you unlock
                                deeper REM cycles and wake with heightened cognitive clarity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}