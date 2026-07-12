import Arrivals from "@/components/Arrivals"
import Description from "@/components/perfume/Description"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"
import Breadcrumbs from "@/components/perfume/Breadcrumbs"
import { collections } from "@/types/perfumes"
import { apiGet } from "@/context/api"

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    try {
        const res = await apiGet(`/api/perfume/${slug}/`)
        if (!res.ok) return <div>Perfume not found</div>

        const { perfume, related } = await res.json()

        const collectionLabel = perfume.collection ? collections[perfume.collection]?.label : null
        const typeLabel = perfume.type
            ? perfume.type.charAt(0).toUpperCase() + perfume.type.slice(1)
            : null

        const breadcrumbItems = [
            { label: 'Shop', href: '/shop' },
            ...(typeLabel
                ? [{ label: typeLabel, href: `/shop?type=${perfume.type}` }]
                : []),
            ...(collectionLabel
                ? [{
                    label: collectionLabel,
                    href: `/shop?type=${perfume.type}&collection=${perfume.collection}`,
                }]
                : []),
            { label: perfume.name },
        ]

        return (
            <main className="max-w-screen-2xl mx-auto pt-[66px]">
                <Breadcrumbs items={breadcrumbItems} />
                <HeroSection perfume={perfume} />
                <Description description={perfume.description} />
                <Performance longevity={perfume.longevity?.level} sillage={perfume.sillage?.level} />
                <Arrivals heading="You might also like" perfumes={related} />
            </main>
        )
    } catch {
        return <div>Perfume not found</div>
    }
}