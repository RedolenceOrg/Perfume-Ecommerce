'use client'

import { useEffect, useState } from "react"
import { authapiGet } from "@/context/api"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileEditForm from "@/components/profile/ProfileEditForm"
import OrderHistory from "@/components/profile/OrderHistory"
import LoyaltyMilestones from "@/components/profile/LoyaltyMilestones"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authapiGet("/authenticate/profile/")
                if (!res.ok) {
                    setError("You must login to view your profile")
                    return
                }
                const data = await res.json()
                setProfile(data)
            } catch (err) {
                setError("Failed to fetch profile")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) return <div className="min-h-screen flex items-center justify-center font-body text-outline">Loading...</div>
    if (error) return <div className="min-h-screen flex items-center justify-center font-body text-error">{error}</div>

    return (
        <main className="bg-surface-container-high">
            <div className="pt-[88px] pb-24 px-8 max-w-7xl mx-auto min-h-screen bg-background">
                <ProfileHeader profile={profile} />

                <ProfileEditForm
                    initialPhone={profile.phone_number}
                    initialAddress={profile.address}
                />
                <LoyaltyMilestones totalSpend={profile.total_spend} />

                <OrderHistory orders={profile.orders || []} />
            </div>
        </main>
    )
}