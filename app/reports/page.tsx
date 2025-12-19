'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        totalNotes: 0,
        completionRate: 0
    })
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
            loadStats(user.id)
        }
        setLoading(false)
    }

    async function loadStats(userId: string) {
        // Get tasks stats
        const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)

        const { data: notes } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)

        const totalTasks = tasks?.length || 0
        const completedTasks = tasks?.filter(t => t.completed).length || 0
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        setStats({
            totalTasks,
            completedTasks,
            totalNotes: notes?.length || 0,
            completionRate
        })
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
                <h1 className="page-title">📊 Raporlar</h1>
                <p className="page-subtitle">İlerlemenizi takip edin! 📈</p>
            </header>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {/* Total Tasks */}
                <div className="card" style={{ background: 'var(--color-blue)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                        {stats.totalTasks}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                        Toplam Görev
                    </p>
                </div>

                {/* Completed Tasks */}
                <div className="card" style={{ background: 'var(--color-green)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                        {stats.completedTasks}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                        Tamamlanan
                    </p>
                </div>

                {/* Total Notes */}
                <div className="card" style={{ background: 'var(--color-yellow)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                        {stats.totalNotes}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                        Toplam Not
                    </p>
                </div>

                {/* Completion Rate */}
                <div className="card" style={{ background: 'var(--color-pink)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                        %{stats.completionRate}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                        Tamamlama Oranı
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card">
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                    📈 Genel İlerleme
                </h2>
                <div style={{
                    background: '#E5E9F0',
                    borderRadius: '12px',
                    height: '40px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        background: 'linear-gradient(90deg, var(--color-purple), var(--color-pink))',
                        height: '100%',
                        width: `${stats.completionRate}%`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        transition: 'width 0.5s ease'
                    }}>
                        {stats.completionRate > 10 && `%${stats.completionRate}`}
                    </div>
                </div>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-gray)' }}>
                    {stats.completedTasks} / {stats.totalTasks} görev tamamlandı
                </p>
            </div>

            {/* Motivational Messages */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, var(--color-purple), var(--color-pink))',
                textAlign: 'center',
                marginTop: '2rem'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {stats.completionRate >= 80 ? '🌟' : stats.completionRate >= 50 ? '💪' : '🚀'}
                </div>
                <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {stats.completionRate >= 80 && 'Harikasın! Çok iyi gidiyorsun! 🎉'}
                    {stats.completionRate >= 50 && stats.completionRate < 80 && 'Güzel ilerliyorsun! Devam et! 💪'}
                    {stats.completionRate < 50 && 'Başlangıç yapmak harika! İlerleyip gelişeceğiz! 🚀'}
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
                    Her gün biraz daha iyiye gidiyoruz! 💖
                </p>
            </div>
        </div>
    )
}
