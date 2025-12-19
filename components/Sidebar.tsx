'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: '🏠' },
    { path: '/tasks', label: 'Görevlerim', icon: '✅' },
    { path: '/notes', label: 'Notlarım', icon: '📝' },
    { path: '/reminders', label: 'Hatırlatıcılar', icon: '⏰' },
    { path: '/reports', label: 'Raporlar', icon: '📊' },
    { path: '/settings', label: 'Ayarlar', icon: '⚙️' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [studentName, setStudentName] = useState('Öğrenci')

    useEffect(() => {
        loadStudentName()
    }, [])

    async function loadStudentName() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('user_profiles')
            .select('student_name')
            .eq('user_id', user.id)
            .single()

        if (data?.student_name) {
            setStudentName(data.student_name)
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <aside className="sidebar">
            {/* Logo/Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">🎒</div>
                <h2 className="sidebar-title" style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                }}>
                    {studentName}'nin<br />
                    Beslenme Çantası
                </h2>
                <p className="sidebar-subtitle">Günlük Planlayıcı 💖</p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">👋</span>
                    <span className="nav-label">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    )
}

