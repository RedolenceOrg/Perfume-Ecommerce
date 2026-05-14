import { apiGet } from "@/context/api";
import AtomizerCard from "./components/atomizerCard";
import AtomizerHero from "./components/atomizerHero";

export const revalidate = 60


export default async function Atomizer() {

    try {
        const res = await apiGet(`/api/atomizers/`);
        if (!res.ok) return <div>Product not found</div>
        const products = await res.json();

        return (
            <section className="w-full min-h-screen bg-background">
                <AtomizerHero />
                <AtomizerCard atomizers={products} />
            </section>
        );
    }
    catch {
        return (
            <div>No Products Found</div>
        );
    }
}