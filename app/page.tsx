'use client'

import { useEffect, useState } from 'react'
import { supabase, getTurkishDayName } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DayCard from '@/components/DayCard'
import NotesSection from '@/components/NotesSection'
import ReminderCard from '@/components/ReminderCard'

export default function HomePage() {
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

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
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

    if (!user) {
        return null
    }

    const days = [0, 1, 2, 3, 4, 5, 6] // Monday to Sunday
    const dayColors = [
        'day-monday',
        'day-tuesday',
        'day-wednesday',
        'day-thursday',
        'day-friday',
        'day-saturday',
        'day-sunday'
    ]

    // Get today's day index (0 = Monday, 6 = Sunday)
    const today = new Date()
    const todayDayIndex = (today.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0  system

    // Turkish date formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
    }
    const currentDate = today.toLocaleDateString('tr-TR', dateOptions)
    const currentTime = today.toLocaleTimeString('tr-TR', timeOptions)

    return (
        <div className="container">
            {/* Header */}
            <header className="page-header">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <h1 className="page-title">
                    ✨ Haftalık Planlayıcım ✨
                </h1>
                <p className="page-subtitle">
                    Merhaba {user.email?.split('@')[0]}! 💖
                </p>
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    display: 'inline-block',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '1rem', color: 'white', fontWeight: '600' }}>
                        {currentDate}
                    </div>
                    <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: '700', marginTop: '0.25rem' }}>
                        🕐 {currentTime}
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {days.map((dayIndex) => (
                    <div key={dayIndex} style={{ position: 'relative' }}>
                        {dayIndex === todayDayIndex && (
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'white',
                                color: 'var(--color-pink)',
                                padding: '0.25rem 1rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 10
                            }}>
                                BUGÜN ⭐
                            </div>
                        )}
                        <DayCard
                            dayIndex={dayIndex}
                            dayName={getTurkishDayName(dayIndex)}
                            colorClass={dayColors[dayIndex]}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <NotesSection />
                <ReminderCard />
            </div>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                paddingBottom: '2rem'
            }}>
                <p>Made with 💖 for amazing moms</p>
            </footer>
        </div>
    )
}
