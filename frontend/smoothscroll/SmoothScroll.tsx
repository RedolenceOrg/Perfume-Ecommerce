
'use client'
import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
    return useContext(LenisContext)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        const lenis = new Lenis({ duration: 1.5 })
        lenisRef.current = lenis
        const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
        return () => lenis.destroy()
    }, [])

    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true })
    }, [pathname])

    return (
        <LenisContext.Provider value={lenisRef.current}>
            {children}
        </LenisContext.Provider>
    )
}