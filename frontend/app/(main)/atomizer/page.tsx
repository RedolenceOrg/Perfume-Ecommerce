import AtomizerCard from "./components/atomizerCard";
import AtomizerHero from "./components/atomizerHero";

export const revalidate = 60


export default async function Atomizer() {
    const BASEURL = process.env.NEXT_PUBLIC_API_URL

    try {
        const res = await fetch(`${BASEURL}/api/atomizers/`);
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