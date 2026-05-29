import { useState } from "react";

// Updated to map beautifully to your existing design system palette
const statusStyles: Record<string, string> = {
    pending: "bg-secondary-container/30 text-secondary border border-secondary/20",
    processing: "bg-surface-container-highest text-primary border border-outline-variant/30",
    shipped: "bg-tertiary-container/30 text-outline border border-outline/20",
    delivered: "bg-green-100 text-green-800", // Fallback color standard pairs
    cancelled: "bg-error-container/40 text-error border border-error/20",
    returned: "bg-orange-100 text-orange-800",
};

export default function OrderHistory({ orders }: { orders: any[] }) {
    return (
        <section className="mt-12 md:mt-16 max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-baseline mb-8 md:mb-12">
                <h2 className="font-headline text-2xl md:text-3xl text-primary">Order History</h2>
                <div className="hidden sm:block h-[1px] flex-grow mx-8 bg-outline-variant/20"></div>
                <button className="font-label text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors">View All</button>
            </div>

            {/* Desktop Table View - Hidden on Mobile, Visible from sm breakpoint upwards */}
            <div className="hidden sm:block overflow-x-auto">
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
                                <DesktopOrderRow key={order.id} order={order} />
                            ))
                        ) : (
                            <DesktopOrderRow key="placeholder" order={{ id: 'RN-1024', total_amount: '0.00', status: 'pending', items: ["No items found 0 0"] }} />
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Stack View - Visible on Phone Screens only */}
            <div className="sm:hidden space-y-4">
                {orders && orders.length > 0 ? (
                    orders.map((order: any) => (
                        <MobileOrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <MobileOrderCard order={{ id: 'RN-1024', total_amount: '0.00', status: 'pending', items: ["No items found 0 0"] }} />
                )}
            </div>
        </section>
    );
}

// Helper utility to clean up input string splits consistently
const parseItemString = (itemString: string) => {
    const parts = itemString.trim().split(" ");
    if (parts.length < 3) return { name: itemString, qty: "", price: "" };

    const price = parts.pop();
    const qty = parts.pop();
    const name = parts.join(" ");
    return { name, qty, price };
};

/* ==========================================================================
   1. DESKTOP ROW COMPONENT
   ========================================================================== */
function DesktopOrderRow({ order }: { order: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
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
                    <span className="font-body text-xs text-primary bg-surface-container-high px-2.5 py-1 rounded-sm border border-outline-variant/20">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                    </span>
                </td>
                <td className="py-8 font-body text-sm text-right px-4 font-semibold text-primary">NPR {order.total_amount}</td>
                <td className="py-8 text-right">
                    <span className={`${statusStyles[order.status.toLowerCase()] || "bg-surface-container text-primary"} text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm`}>
                        {order.status}
                    </span>
                </td>
            </tr>

            {isOpen && (
                <tr className="bg-surface-container-lowest/50">
                    <td colSpan={5} className="p-0 border-b border-outline-variant/10">
                        <div className="px-12 py-6 bg-surface-container-low/30 space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-outline mb-2">Items Detail</h4>
                            <div className="divide-y divide-outline-variant/10 border-t border-b border-outline-variant/10">
                                {order.items?.map((itemStr: string, idx: number) => {
                                    const { name, qty, price } = parseItemString(itemStr);
                                    return (
                                        <div key={idx} className="flex justify-between items-center py-4 font-body text-sm">
                                            <div className="flex-1 pr-4">
                                                <span className="font-medium text-primary capitalize">{name}</span>
                                            </div>
                                            <div className="w-24 text-center text-outline text-xs">
                                                Qty: <span className="font-medium text-primary">{qty}</span>
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

/* ==========================================================================
   2. MOBILE RESPONSIVE CARD STACK (Brings elements downwards vertically)
   ========================================================================== */
function MobileOrderCard({ order }: { order: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-outline-variant/30 bg-surface-container-lowest p-5 rounded-sm space-y-4 overflow-hidden">

            {/* Clickable Card Header info - Fixed using explicit columns */}
            <div className="grid grid-cols-[1fr_auto] gap-4 items-start cursor-pointer" onClick={() => setIsOpen(!isOpen)}>

                {/* Left Side: Dynamic IDs & Prices */}
                <div className="space-y-2 min-w-0"> {/* min-w-0 lets text-wrapping engines work perfectly */}
                    <p className="font-body text-sm font-bold text-primary break-all pr-2 leading-relaxed">
                        Order #{order.id}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body text-[11px] text-outline">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="inline-block w-1 h-1 bg-outline-variant/50 rounded-full" />
                        <p className="font-body text-sm font-semibold text-secondary">NPR {order.total_amount}</p>
                    </div>
                </div>

                {/* Right Side: Status Badges & Action Chevrons */}
                <div className="flex flex-col items-end gap-4 flex-shrink-0">
                    <span className={`${statusStyles[order.status.toLowerCase()] || "bg-surface-container text-primary"} text-[8px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-sm whitespace-nowrap`}>
                        {order.status}
                    </span>
                    <svg
                        className={`w-4 h-4 text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} mr-1`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Collapsed Items Detail List */}
            {isOpen && (
                <div className="pt-4 border-t border-outline-variant/20 space-y-3 bg-surface-container-low/20 -mx-5 -mb-5 p-5">
                    <h4 className="text-[9px] uppercase tracking-widest font-bold text-outline">Items Detail</h4>
                    <div className="divide-y divide-outline-variant/15">
                        {order.items?.map((itemStr: string, idx: number) => {
                            const { name, qty, price } = parseItemString(itemStr);
                            return (
                                <div key={idx} className="py-3 font-body flex flex-col gap-1 text-xs">
                                    <p className="font-medium text-primary capitalize leading-snug">{name}</p>
                                    <div className="flex justify-between items-center text-outline mt-0.5">
                                        <span>Quantity: <strong className="text-primary font-medium">{qty}</strong></span>
                                        <span className="font-semibold text-primary text-xs">NPR {price}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}