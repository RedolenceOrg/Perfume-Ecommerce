// components/ThriftGrid.tsx
import ThriftProductCard from './ThriftProductCard';
import { Thrift } from '@/types/perfumes';

export default function ThriftGrid({ data }: { data: Thrift[] }) {
    return (
        <div className="bg-background w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-collapse">
                {data.map((thrift) => (
                    <div key={thrift.id} className="sm:-ml-[1px] sm:-mt-[1px]">
                        <ThriftProductCard thrift={thrift} />
                    </div>
                ))}
            </div>
        </div>
    );
}