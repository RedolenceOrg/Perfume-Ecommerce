import ThriftGrid from "./components/ThriftGrid";
import ThriftHeader from "./components/ThriftHeader";

export default async function ThriftPage() {
    const BASEURL = process.env.NEXT_PUBLIC_API_URL
    const thriftResponse = await fetch(`${BASEURL}/api/thrifts/`);

    const thriftData = await thriftResponse.json();

    return (
        <div>
            <ThriftHeader />
            <ThriftGrid data={thriftData} />
        </div>
    );
}