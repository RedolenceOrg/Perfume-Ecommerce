import Arrivals from "@/components/Arrivals"
import Description from "@/components/perfume/Description"
import HeroSection from "@/components/perfume/HeroSection"
import Performance from "@/components/perfume/Performance"
import Breadcrumbs from "@/components/perfume/Breadcrumbs"
import { collections } from "@/types/perfumes"
import { apiGet } from "@/context/api"
import SearchBar from "@/components/searchBar"

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
                <div className="px-6 lg:px-16 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <Breadcrumbs items={breadcrumbItems} />
                    <div className="w-full lg:w-1/2 lg:flex lg:justify-end">
                        <SearchBar className="w-full lg:max-w-md" />
                    </div>
                </div>
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