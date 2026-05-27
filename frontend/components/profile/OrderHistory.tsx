// components/OrderHistory.tsx
import { useState } from "react";
const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-orange-100 text-orange-800",
};

export default function OrderHistory({ orders }: { orders: any[] }) {
    return (
        <section className="mt-16 max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-baseline mb-12">
                <h2 className="font-serif text-3xl text-primary">Order History</h2>
                <div className="h-[1px] flex-grow mx-8 bg-outline-variant/20"></div>
                <button className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left border-b border-outline-variant/20 text-outline uppercase text-[10px] tracking-[0.2em]">
                            <th className="pb-6 font-medium w-8"></th>
                            <th className="pb-6 font-medium">Order ID</th>
                            <th className="pb-6 font-medium">Items Count</th>
                            <th className="pb-6 font-medium text-right px-4">Total Price</th>
                            <th className="pb-6 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {orders && orders.length > 0 ? (
                            orders.map((order: any) => (
                                <OrderRow key={order.id} order={order} />
                            ))
                        ) : (
                            <OrderRow key="placeholder" order={{ id: 'RN-1024', total_amount: '0.00', status: 'Completed', items: ["No items found 0 0"] }} />
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function OrderRow({ order }: { order: any }) {
    const [isOpen, setIsOpen] = useState(false);

    const parseItemString = (itemString: string) => {
        const parts = itemString.trim().split(" ");
        if (parts.length < 3) return { name: itemString, qty: "", price: "" };

        const price = parts.pop();
        const qty = parts.pop();
        const name = parts.join(" ");
        return { name, qty, price };
    };

    return (
        <>
            {/* Main Order Info Row */}
            <tr
                className="group hover:bg-surface-container-low transition-colors duration-300 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <td className="py-8 pl-2">
                    <svg
                        className={`w-4 h-4 text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
                <td className="py-8 font-body text-sm font-semibold text-primary">#{order.id}</td>
                <td className="py-8">
                    <span className="font-body text-sm text-on-surface bg-surface-variant/40 px-2.5 py-1 rounded-md border border-outline-variant/10">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                    </span>
                </td>
                <td className="py-8 font-body text-sm text-right px-4 font-semibold text-primary">NPR {order.total_amount}</td>
                <td className="py-8 text-right">
                    <span className={`${statusStyles[order.status] || "bg-gray-100 text-gray-800"} text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full`}>
                        {order.status}
                    </span>
                </td>
            </tr>

            {/* Structurally Clean Collapsible Row */}
            {isOpen && (
                <tr className="bg-surface-container-lowest/50">
                    <td colSpan={5} className="p-0 border-b border-outline-variant/10">
                        {/* Wrapper element safe inside td container */}
                        <div className="px-12 py-6 bg-surface-container-low/30 space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-outline mb-2">Items Detail</h4>
                            <div className="divide-y divide-outline-variant/10 border-t border-b border-outline-variant/10">
                                {order.items?.map((itemStr: string, idx: number) => {
                                    const { name, qty, price } = parseItemString(itemStr);
                                    return (
                                        <div key={idx} className="flex justify-between items-center py-4 font-body text-sm text-on-surface">
                                            <div className="flex-1 pr-4">
                                                <span className="font-medium text-primary capitalize">{name}</span>
                                            </div>
                                            <div className="w-24 text-center text-outline">
                                                Qty: <span className="font-medium text-on-surface">{qty}</span>
                                            </div>
                                            <div className="w-32 text-right font-medium text-primary">
                                                NPR {price}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}