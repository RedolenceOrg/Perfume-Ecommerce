import ShopCard from "@/components/wellbeing/ShopCard";
import ProductInfo from "@/components/wellbeing/ProductInfo";
import { apiGet } from "@/context/api";

export default async function Page() {
    const productsresponse = await apiGet("/api/wellbeing/");
    if (!productsresponse.ok) return <div>Products unavailable</div>

    const nasalStripData = await productsresponse.json()
    const nasalStrip = nasalStripData[0]

    if (!nasalStrip) {
        return (
            <main className="max-w-screen-2xl mx-auto pt-[88px] px-6 lg:px-16 py-24 text-center">
                <p className="font-body text-outline">
                    Nasal strips are coming soon — check back shortly.
                </p>
            </main>
        )
    }

    return (
        <main>
            <ShopCard nasalStrip={nasalStrip} />
            <ProductInfo />
        </main>
    );
}