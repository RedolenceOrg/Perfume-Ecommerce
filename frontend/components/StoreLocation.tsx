
const STORE = {
  name: "Your Store Name",
  addressLines: ["Street Address, Area", "Kathmandu, Nepal"],
  hours: [
    { days: "Sun - Fri", time: "10am - 7pm" },
    { days: "Saturday", time: "11am - 5pm" },
  ],
  phone: "+977-XXXXXXXXXX",
  email: "hello@yourstore.com",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5293.150661175265!2d85.33642202452795!3d27.693988547193086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ff916e7afd%3A0x1b5ad7f323124ad3!2sRedolence%20Nepal!5e0!3m2!1sen!2snp!4v1786805479123!5m2!1sen!2snp",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Redolence+Nepal",
};

export default function StoreLocation() {
  return (
    <section
      className={`font-body py-8 md:py-[120px] px-6 w-full bg-background text-primary`}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-secondary block mb-4">
            Find Us
          </span>
          <h2 className="font-headline text-[32px] md:text-[48px] leading-[1.15] tracking-[-0.01em] font-semibold text-primary mb-4">
            Visit Us In Store
          </h2>
          <p className="font-body text-lg text-primary/70 max-w-2xl">
            Come see the collection in person. Our team is on hand to help
            you find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Bento Layout for Map & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map */}
          <div className="lg:col-span-8 order-2 lg:order-1 relative h-[400px] lg:h-auto w-full rounded overflow-hidden shadow-[0_32px_64px_-12px_rgba(39,19,16,0.18)] border border-outline-variant bg-surface-container">
            <iframe
              src={STORE.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Map to ${STORE.name}`}
            />
          </div>

          {/* Store Details Card */}
          <div className="lg:col-span-4 order-1 lg:order-2 bg-surface-container-lowest rounded border border-outline-variant p-8 md:p-10 shadow-[0_16px_48px_-12px_rgba(39,19,16,0.08)]">
            <div className="mb-10">
              <h3 className="font-headline text-[28px] leading-[1.2] font-semibold text-primary mb-2">
                Our Flagship Store
              </h3>
              <div className="w-12 h-1 bg-secondary rounded-full mb-6" />
            </div>

            <div className="space-y-8">
              {/* Address */}
              <div>
                <span className="font-body text-xs font-semibold text-secondary uppercase tracking-[0.1em] block mb-2">
                  Address
                </span>
                <p className="font-body text-base text-primary">
                  {STORE.name}
                  <br />
                  {STORE.addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>

              {/* Hours */}
              <div>
                <span className="font-body text-xs font-semibold text-secondary uppercase tracking-[0.1em] block mb-2">
                  Hours
                </span>
                <ul className="font-body text-base text-primary space-y-1">
                  {STORE.hours.map((h) => (
                    <li key={h.days} className="flex justify-between">
                      <span className="text-primary/70">{h.days}</span>
                      <span className="font-semibold">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <span className="font-body text-xs font-semibold text-secondary uppercase tracking-[0.1em] block mb-2">
                  Contact
                </span>
                <p className="font-body text-base text-primary mb-1">
                  {STORE.phone}
                </p>
                <p className="font-body text-base text-primary">
                  {STORE.email}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="mt-10 pt-8 border-t border-outline-variant">
              <a
                href={STORE.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-white font-body text-base font-semibold py-4 px-6 rounded hover:bg-primary-container transition-colors duration-300 flex items-center justify-center group"
              >
                Get Directions
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}