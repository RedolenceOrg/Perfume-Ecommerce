'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiGet, apiPost } from './api'

interface User {
    id: number
    username: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    refreshUser: async () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                await apiGet('/authenticate/csrf/')
                const res = await apiGet('/authenticate/me/')
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                } else {
                    setUser(null)
                }
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    const logout = async () => {
        try {
            await apiPost('/authenticate/logout/')
        } finally {
            setUser(null)
        }
    }

    const refreshUser = async () => {
        try {
            const res = await apiGet('/authenticate/me/')
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            }
        } catch {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)