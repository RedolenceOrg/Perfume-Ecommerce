'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
    return useContext(LenisContext)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null)
    const lenisRef = useRef<Lenis | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        const lenisInstance = new Lenis({ duration: 1.5 })
        lenisRef.current = lenisInstance
        setLenis(lenisInstance)

        const raf = (time: number) => { lenisInstance.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)

        return () => lenisInstance.destroy()
    }, [])

    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true })
    }, [pathname])

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    )
}