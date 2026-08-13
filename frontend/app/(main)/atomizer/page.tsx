import { apiGet } from "@/context/api";
import AtomizerGrid from "./components/AtomizerGrid";
import AtomizerHero from "./components/AtomizerHero";

export default async function Atomizer() {

    try {
        const res = await apiGet(`/api/atomizers/`, { next: { revalidate: 60 } });
        if (!res.ok) return <div>Product not found</div>
        const products = await res.json();

        return (
            <section className="w-full min-h-screen bg-background">
                <AtomizerHero />
                <AtomizerGrid data={products} />
            </section>
        );
    }
    catch {
        return (
            <div>No Products Found</div>
        );
    }
}