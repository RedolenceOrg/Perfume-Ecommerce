import ShopCard from "@/components/wellbeing/ShopCard";
import ProductInfo from "@/components/wellbeing/ProductInfo";
import { apiGet } from "@/context/api";

export default async function Page() {
    const productsresponse = await apiGet("/api/wellbeing/");
    if (!productsresponse.ok) return <div>Products unavailable</div>
    const nasalStripData = await productsresponse.json()

    return (
        <main>
            <ShopCard nasalStrip={nasalStripData[0]} />
            <ProductInfo />
        </main>
    );
}