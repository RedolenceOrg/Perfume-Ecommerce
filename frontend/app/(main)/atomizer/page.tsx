import AtomizerCard from "./components/atomizerCard";
import AtomizerHero from "./components/atomizerHero";


export default async function Atomizer() {
    const BASEURL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${BASEURL}/api/atomizers/`);
    const products = await res.json();

    return (
        <section className="w-full min-h-screen bg-background">
            <AtomizerHero />
            <AtomizerCard atomizers={products} />
        </section>
    );
}