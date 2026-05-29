import { ComparisonTable } from "./components/ComparisonTable";
import { AscensionSection } from "./components/HowToBecome";
import { MemberHero, } from "./components/MemberHero";
import { TiersSection } from "./components/Tiers";
export default function MembersPage() {
    return (
        <div className="">
            <MemberHero />
            <TiersSection />
            <AscensionSection />
            <ComparisonTable />
        </div>
    );
}