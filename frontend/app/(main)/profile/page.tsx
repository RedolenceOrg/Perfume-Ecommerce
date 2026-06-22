'use client'
import { useEffect, useState, useRef } from "react"
import { authapiGet } from "@/context/api"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileEditForm from "@/components/profile/ProfileEditForm"
import OrderHistory from "@/components/profile/OrderHistory"
import LoyaltyMilestones from "@/components/profile/LoyaltyMilestones"
import PasswordChangeForm from "@/components/profile/PasswordChangeForm"
import DeleteAccount from "@/components/profile/DeleteAccount"

const NAV_ITEMS = [
    { id: "profile", label: "Profile" },
    { id: "address", label: "Shipping Address" },
    { id: "credentials", label: "Credential Settings" },
    { id: "loyalty", label: "Loyalty & Milestones" },
    { id: "orders", label: "Order History" },
    { id: "delete", label: "Delete Account", danger: true },
]

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeSection, setActiveSection] = useState("profile")

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

    // Track active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: "-40% 0px -55% 0px" }
        )

        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [profile])

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-body text-outline">
            Loading...
        </div>
    )
    if (error) return (
        <div className="min-h-screen flex items-center justify-center font-body text-error">
            {error}
        </div>
    )

    return (
        <main className="bg-background pt-[66px]">
            <div className="pt-[44px] pb-24 px-8 max-w-7xl mx-auto min-h-screen">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-40">
                            <h2 className="font-label text-[10px] uppercase tracking-[0.3em] text-outline mb-10">
                                Account Management
                            </h2>
                            <nav className="flex flex-col space-y-1">
                                {NAV_ITEMS.map(({ id, label, danger }) => (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id)}
                                        className={`text-left py-3 px-0 text-sm tracking-wide transition-colors border-r-2 pr-4 ${activeSection === id
                                                ? danger
                                                    ? "text-error border-error font-semibold"
                                                    : "text-primary border-secondary font-semibold"
                                                : danger
                                                    ? "text-error/60 border-transparent hover:text-error"
                                                    : "text-outline border-transparent hover:text-primary"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow space-y-24 min-w-0">

                        {/* Profile Section */}
                        <section id="profile" className="scroll-mt-40">
                            <ProfileHeader profile={profile} />
                        </section>

                        {/* Shipping Address */}
                        <section id="address" className="scroll-mt-40">
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl text-primary mb-2">Shipping Address</h2>
                                <p className="text-sm text-outline">Your primary address for deliveries.</p>
                            </div>
                            <ProfileEditForm
                                initialPhone={profile.phone_number}
                                initialPlace={profile.place}
                                initialDistrict={profile.district}
                            />
                        </section>

                        {/* Credential Settings */}
                        <section id="credentials" className="scroll-mt-40">
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl text-primary mb-2">Credential Settings</h2>
                                <p className="text-sm text-outline">Manage your secure access and privacy controls.</p>
                            </div>
                            <PasswordChangeForm />
                        </section>

                        {/* Loyalty & Milestones */}
                        <section id="loyalty" className="scroll-mt-40">
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl text-primary mb-2">Loyalty & Milestones</h2>
                                <p className="text-sm text-outline">Your tier progression and member benefits.</p>
                            </div>
                            <LoyaltyMilestones
                                totalSpend={profile.total_spend}
                                isVerified={profile.user.isVerified}
                            />
                        </section>

                        {/* Order History */}
                        <section id="orders" className="scroll-mt-40">
                            <OrderHistory orders={profile.orders || []} />
                        </section>

                        {/* Delete Account */}
                        <section id="delete" className="scroll-mt-40 border-t border-outline-variant/20 pt-16">
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl text-error/80 mb-2">Danger Zone</h2>
                                <p className="text-sm text-outline">
                                    Permanently remove your profile and all associated data from Redolence Nepal.
                                </p>
                            </div>
                            <div className="p-8 border border-error/20 bg-error/5 max-w-xl">
                                <p className="font-body text-sm text-outline mb-6 leading-relaxed">
                                    Once deleted, your account cannot be recovered. This includes your loyalty tier, order history, and all member benefits.
                                </p>
                                <DeleteAccount />
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    )
}