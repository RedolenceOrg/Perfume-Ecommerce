import Arrivals from "@/components/Arrivals"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"
import { apiGet } from "@/context/api"

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const res = await apiGet(`/api/perfume/${slug}/`)
        if (!res.ok) return <div>Perfume not found</div>

        const { perfume, related } = await res.json()

        return (
            <main className="max-w-screen-2xl mx-auto pt-[66px]">
                <HeroSection perfume={perfume} />
                <Performance longevity={perfume.longevity?.level} sillage={perfume.sillage?.level} />
                <Arrivals heading="You might also like" perfumes={related} />
            </main>
        )
    } catch {
        return <div>Perfume not found</div>
    }
}