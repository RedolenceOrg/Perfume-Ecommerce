import FilterTag from "./components/FilterTag";
import ProductGrid from "./components/ProductGrid";
import ShopSidebar from "./components/Sidebar";
export default async function Shop() {
    const res = await fetch('http://127.0.0.1:8000/api/filter/');
    const filters = await res.json();

    return ( // <--- Add this return statement
        <main className="min-h-screen px-12 bg-background">
            <div className=" flex flex-col lg:flex-row gap-16 max-w-[1920px] mx-auto">


                <div className="sticky top-16 self-start h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
                    <ShopSidebar brands={filters.brands} notes={filters.notes} families={filters.families} />
                </div>

                <div className="flex-1">
                    <h1 className="font-headline text-4xl mb-8">The Collection</h1>
                    <FilterTag />
                    <ProductGrid />
                </div>
            </div>
        </main>
    ); // <--- Close the return
}