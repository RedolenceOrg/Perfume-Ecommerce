import ThriftGrid from "./components/ThriftGrid";
import ThriftHeader from "./components/ThriftHeader";

export const revalidate = 60

export default async function ThriftPage() {
    const BASEURL = process.env.NEXT_PUBLIC_API_URL

    try {
        const thriftResponse = await fetch(`${BASEURL}/api/thrifts/`)
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