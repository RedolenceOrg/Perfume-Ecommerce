import Arrivals from "@/components/Arrivals"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"

export const revalidate = 60

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const BASEURL = process.env.NEXT_PUBLIC_API_URL

    try {
        const res = await fetch(`${BASEURL}/api/perfume/${slug}/`)
        if (!res.ok) return <div>Perfume not found</div>
        const perfume = await res.json()

        const allNotes = [
            ...perfume.notes.top,
            ...perfume.notes.middle,
            ...perfume.notes.base
        ]

        const noteParams = allNotes.map((n: string) => `note=${n}`).join('&')

        const relatedRes = await fetch(`${BASEURL}/api/related/?${noteParams}&exclude=${slug}`)
        if (!relatedRes.ok) return <div>Perfume not found</div>
        const relatedPerfumes = await relatedRes.json()

        return (
            <main className="max-w-screen-2xl">
                <HeroSection perfume={perfume} />
                <Performance longevity={perfume.longevity?.level} sillage={perfume.sillage?.level} />
                <Arrivals heading="You might also like" perfumes={relatedPerfumes} />
            </main>
        )
    } catch {
        return <div>Perfume not found</div>
    }
}