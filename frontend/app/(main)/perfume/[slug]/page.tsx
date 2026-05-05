import Arrivals from "@/components/Arrivals"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const res = await fetch(`http://127.0.0.1:8000/api/perfume/${slug}/`)
    const perfume = await res.json()

    const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
    ]
    const noteParams = allNotes.map((n: string) => `note=${n}`).join('&')

    const relatedRes = await fetch(`http://127.0.0.1:8000/api/related/?${noteParams}&exclude=${slug}`)
    const relatedPerfumes = await relatedRes.json()


    return (
        <main className="max-w-screen-2xl">
            <HeroSection perfume={perfume} />
            <Performance longevity={perfume.longevity?.level} sillage={perfume.sillage?.level} />
            <Arrivals heading="You might also like" perfumes={relatedPerfumes} />
        </main>
    )
}