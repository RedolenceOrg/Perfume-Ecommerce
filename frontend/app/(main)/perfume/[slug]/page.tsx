import Arrivals from "@/components/Arrivals"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"
import { apiGet } from "@/context/api"



export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const res = await apiGet(`/api/perfume/${slug}/`)
        if (!res.ok) return <div>Perfume not found</div>
        const perfume = await res.json()

        const allNotes = [
            ...perfume.notes.top,
            ...perfume.notes.middle,
            ...perfume.notes.base
        ]

        const noteParams = allNotes.map((n: string) => `note=${n}`).join('&')

        const relatedRes = await apiGet(`/api/related/?${noteParams}&exclude=${slug}`)
        if (!relatedRes.ok) return <div>Perfume not found</div>
        const relatedPerfumes = await relatedRes.json()

        return (
            <main className="max-w-screen-2xl mx-auto pt-[66px]">
                <HeroSection perfume={perfume} />
                <Performance longevity={perfume.longevity?.level} sillage={perfume.sillage?.level} />
                <Arrivals heading="You might also like" perfumes={relatedPerfumes} />
            </main>
        )
    } catch {
        return <div>Perfume not found</div>
    }
}