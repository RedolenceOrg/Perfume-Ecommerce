import Image from "next/image";
import Arrivals from "@/components/Arrivals";
import Hero from "@/components/Hero";
import SeasonalPick from "@/components/SeasonalPick";
import BestSellers from "@/components/BestSellers";
import DecantsHighlight from "@/components/decantSection";
import MembersSection from "@/components/MembersSection";
import ThriftSection from "@/components/ThriftSection";


export default async function Home() {
  const res = await fetch('http://127.0.0.1:8000/api/getperfumeHome/')
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
