import AtomizerCard from "./components/atomizerCard";
import AtomizerHero from "./components/atomizerHero";


export default async function Atomizer() {
    const res = await fetch("http://127.0.0.1:8000/api/atomizers/");
    const products = await res.json();

    return (
        <section className="w-full min-h-screen bg-background">
            <AtomizerHero />
            <AtomizerCard atomizers={products} />
        </section>
    );
}