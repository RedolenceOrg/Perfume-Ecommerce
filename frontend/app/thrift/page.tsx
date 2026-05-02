import ThriftGrid from "./components/ThriftGrid";
import ThriftHeader from "./components/ThriftHeader";

export default async function ThriftPage() {

    const thriftResponse = await fetch('http://127.0.0.1:8000/api/thrifts/');

    const thriftData = await thriftResponse.json();

    return (
        <div>
            <ThriftHeader />
            <ThriftGrid data={thriftData} />
        </div>
    );
}