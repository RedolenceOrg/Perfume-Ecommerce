
import Arrivals from "@/components/Arrivals";
import Hero from "@/components/Hero";
import SeasonalPick from "@/components/SeasonalPick";
import BestSellers from "@/components/BestSellers";
import DecantsHighlight from "@/components/decantSection";
import MembersSection from "@/components/MembersSection";
import ThriftSection from "@/components/ThriftSection";


export default async function Home() {
  const BASEURL = process.env.NEXT_PUBLIC_API_URL
  try {
    const res = await fetch(`${BASEURL}/api/getperfumeHome/`)
    if (!res.ok) return <div>NO DATA FOUND at HOME</div>
    const perfumes = await res.json()


    return (
      <div>
        <Hero />
        <Arrivals heading="Recent Arrivals" perfumes={perfumes.new_arrivals} />
        <SeasonalPick />
        <Arrivals heading="Seasonal Picks" perfumes={perfumes.seasonal} />
        <BestSellers perfumes={perfumes.restocked} />
        <MembersSection />
        <DecantsHighlight />
        <ThriftSection />
      </div>
    );
  }
  catch {
    return (
      <div>NO DATA FOUND</div>
    );
  }
}
