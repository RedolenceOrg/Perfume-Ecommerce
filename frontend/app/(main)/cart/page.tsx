'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authapiDelete, authapiGet, authApiUpdate } from '@/context/api'
import { CartItem } from '@/types/perfumes'
import { toast } from 'react-toastify'
import CartLoading from '@/components/cart/CartLoading'
import CartEmpty from '@/components/cart/CartEmpty'
import CartHeader from '@/components/cart/Cartheader'
import CartList from '@/components/cart/Cartlist'
import OrderSummary from '@/components/cart/Ordersummary'

export default function CartPage() {
    const [cartData, setCartData] = useState<{ items: CartItem[], grand_total: number } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await authapiGet('/cart/view/')
                if (res.status === 401 || res.status === 403) {
                    router.push('/login')
                    return
                }
                if (res.ok) {
                    const data = await res.json()
                    setCartData(data)
                }
            } catch (err) {
                console.error("Failed to fetch cart", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [router])

    const handleRemoveItem = async (id: number) => {
        const res = await authapiDelete('/cart/delete/', { item_id: id })
        if (res.ok) {
            const data = await res.json()
            toast.success("Deleted Item Successfully")
            setCartData(prev => prev ? {
                items: prev.items.filter(item => item.id !== id),
                grand_total: data.grand_total
            } : null)
        } else {
            toast.error("Something went wrong")
        }
    }

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        const res = await authApiUpdate('/cart/update/', { item_id: id, quantity })
        const data = await res.json()
        if (res.ok) {
            toast.info("Updated Item Successfully")
            setCartData(prev => prev ? {
                items: prev.items.map(item =>
                    item.id === data.item_id
                        ? { ...item, quantity: data.quantity, total_price: data.total_price }
                        : item
                ),
                grand_total: data.grand_total
            } : null)
        } else {
            toast.error(data.detail || "Failed to update cart")
        }
    }

    if (loading) return <CartLoading />
    if (!cartData || cartData.items.length === 0) return <CartEmpty />

    return (
        <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-background text-primary">
            <CartHeader />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <CartList
                    items={cartData.items}
                    baseUrl={BASE_URL ?? ''}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                />
                <OrderSummary grandTotal={cartData.grand_total} />
            </div>
        </main>
    )
}