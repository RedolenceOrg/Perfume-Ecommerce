
import Arrivals from "@/components/Arrivals";
import Hero from "@/components/Hero";
import SeasonalPick from "@/components/SeasonalPick";
import BestSellers from "@/components/BestSellers";
import DecantsHighlight from "@/components/decantSection";
import MembersSection from "@/components/MembersSection";
import ThriftSection from "@/components/ThriftSection";
import { apiGet } from "@/context/api";
import FAQ from "@/components/faq";
import PerfumeRecommender from "@/components/PerfumeRecommender.tsx/PerfumeRecommender";



export default async function Home() {
  try {
    const res = await apiGet('/api/getperfumeHome/')
    if (!res.ok) return <div>NO DATA FOUND at HOME</div>
    const perfumes = await res.json()


    return (
      <div>
        <Hero />
        <PerfumeRecommender />
        <Arrivals heading="Recent Arrivals" perfumes={perfumes.new_arrivals} />
        <SeasonalPick />
        <Arrivals heading="Seasonal Picks" perfumes={perfumes.seasonal} />
        <BestSellers perfumes={perfumes.restocked} />
        <MembersSection />
        <DecantsHighlight />
        <ThriftSection />
        <FAQ />
      </div>
    );
  }
  catch {
    return (
      <div>NO DATA FOUND</div>
    );
  }
}
