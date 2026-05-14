// components/OrderHistory.tsx
export default function OrderHistory({ orders }: { orders: any[] }) {
    return (
        <section className="mt-16 max-w-5xl mx-auto">
            <div className="flex justify-between items-baseline mb-12">
                <h2 className="font-serif text-3xl text-primary">Order History</h2>
                <div className="h-[1px] flex-grow mx-8 bg-outline-variant/20"></div>
                <button className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left border-b border-outline-variant/20 text-outline uppercase text-[10px] tracking-[0.2em]">
                            <th className="pb-6 font-medium">Order ID</th>
                            <th className="pb-6 font-medium">Items</th>
                            <th className="pb-6 font-medium text-right px-4">Total Price</th>
                            <th className="pb-6 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {orders.length > 0 ? orders.map((order: any) => (
                            // Map real data here
                            <OrderRow key={order.id} order={order} />
                        )) : (
                            <OrderRow key="placeholder" order={{ id: 'RN-1024', price: '0', status: 'Completed' }} />
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function OrderRow({ order }: any) {
    return (
        <tr className="group hover:bg-surface-container-low transition-colors duration-300">
            <td className="py-8 font-body text-sm font-semibold text-primary">#{order.id}</td>
            <td className="py-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-container flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-lg">opacity</span>
                    </div>
                    <span className="font-body text-sm text-on-surface">Sample Order</span>
                </div>
            </td>
            <td className="py-8 font-body text-sm text-right px-4">NPR {order.price}</td>
            <td className="py-8 text-right">
                <span className="bg-[#e7f3e8] text-[#1e4620] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                    {order.status}
                </span>
            </td>
        </tr>
    );
}