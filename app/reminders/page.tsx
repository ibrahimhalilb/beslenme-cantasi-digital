'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReminderCard from '@/components/ReminderCard'

export default function RemindersPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
        } else {
            setUser(user)
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">⏰ Hatırlatıcılar</h1>
                <p className="page-subtitle">Günlük hatırlatmalarını yönet 🔔</p>
            </header>

            <ReminderCard />
        </div>
    )
}
