import { apiGet } from "@/context/api";
import ThriftGrid from "./components/ThriftGrid";
import ThriftHeader from "./components/ThriftHeader";

export const revalidate = 60

export default async function ThriftPage() {
    try {
        const thriftResponse = await apiGet('/api/thrifts/')
        if (!thriftResponse.ok) return <div>Products unavailable</div>
        const thriftData = await thriftResponse.json()

        return (
            <div>
                <ThriftHeader />
                <ThriftGrid data={thriftData} />
            </div>
        )
    } catch {
        return <div>Products unavailable</div>
    }
}