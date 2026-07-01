const BrandLogos = [
    '/brands/armaf.png',
    '/brands/lattafa.webp',
    '/brands/mancera.jpg',
    '/brands/rayhaan.webp',
    '/brands/Chanel.png',
    '/brands/Gucci.png',
    '/brands/Dior.png',
    '/brands/Azzaro.png',
    '/brands/Armani.png',
    '/brands/Boss.png',
    '/brands/Burberry.png',
    '/brands/Calvin.png',
    '/brands/Carolina.png',
    '/brands/Davidoff.png',
    '/brands/Dolce.png',
    '/brands/Givenchy.png',
    '/brands/Guerlain.png',
    '/brands/Hermes.png',
    '/brands/JPG.png',
    '/brands/Maison.png',
    '/brands/mfk.png',
    '/brands/Montblanc.png',
    '/brands/Prada.png',
    '/brands/Ralph.png',
    '/brands/Swiss.png',
    '/brands/TomFord.png',
    '/brands/Versace.png',
    '/brands/Victorias.png',
    '/brands/YSL.png',
    '/brands/Khadlaj.png'
]

export default function BrandScroll() {
    const doubled = [...BrandLogos, ...BrandLogos]

    return (
        <div className="overflow-hidden">
            <div className="flex w-max animate-brand-scroll">
                {doubled.map((src, i) => (
                    <img key={i} src={src} alt={`Brand ${i}`} className="p-8 h-64 w-64 object-contain mx-8" />
                ))}
            </div>
        </div>
    )
}