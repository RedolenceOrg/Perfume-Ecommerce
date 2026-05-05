import { ComparisonTable } from "./components/ComparisonTable";
import { AscensionSection } from "./components/HowToBecome";
import { MemberHero, } from "./components/MemberHero";
import { TiersSection } from "./components/Tiers";
export default function MembersPage() {
    return (
        <div>
            <MemberHero />
            <TiersSection />
            <AscensionSection />
            <ComparisonTable />
        </div>
    );
}