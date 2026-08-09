import { Suspense } from 'react'
import { apiGet } from "@/context/api";
import FilterTag from "./components/FilterTag";
import ProductGrid from "./components/ProductGrid";
import ShopSidebar from "./components/Sidebar";
import SearchBar from "@/components/searchBar";

export default async function Shop() {
    try {
        const res = await apiGet(`/api/filter/`);
        if (!res.ok) return <div className="min-h-screen flex items-center justify-center font-body text-sm text-outline">No data found</div>;
        const filters = await res.json();

        return (
            <main className="min-h-screen px-4 sm:px-6 md:px-12 py-8 bg-background pt-[80px]">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1920px] mx-auto">
                    <div className="lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar lg:w-72 flex-shrink-0">
                        <Suspense fallback={null}>
                            <ShopSidebar brands={filters.brands} notes={filters.notes} families={filters.families} />
                        </Suspense>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                            <h1 className="font-headline text-3xl md:text-4xl text-primary">The Collection</h1>
                            <SearchBar className="w-full sm:max-w-sm" />
                        </div>
                        <Suspense fallback={null}>
                            <FilterTag />
                        </Suspense>
                        <Suspense fallback={
                            <div className="py-20 text-center font-body text-sm text-outline uppercase tracking-widest">
                                Loading...
                            </div>
                        }>
                            <ProductGrid />
                        </Suspense>
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center font-body text-sm text-error">
                Data Not Found
            </div>
        );
    }
}