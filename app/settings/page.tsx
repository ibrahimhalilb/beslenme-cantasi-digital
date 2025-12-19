'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [studentName, setStudentName] = useState('')
    const [nameMessage, setNameMessage] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordError, setPasswordError] = useState('')
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
            loadProfile(user.id)
        }
        setLoading(false)
    }

    async function loadProfile(userId: string) {
        const { data } = await supabase
            .from('user_profiles')
            .select('student_name')
            .eq('user_id', userId)
            .single()

        if (data?.student_name) {
            setStudentName(data.student_name)
        }
    }

    async function handleSaveStudentName() {
        if (!user || !studentName.trim()) return

        setNameMessage('')

        // Try to update existing profile or insert new one
        const { data: existing } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (existing) {
            await supabase
                .from('user_profiles')
                .update({ student_name: studentName, updated_at: new Date().toISOString() })
                .eq('user_id', user.id)
        } else {
            await supabase
                .from('user_profiles')
                .insert({ user_id: user.id, student_name: studentName })
        }

        setNameMessage('✅ İsim kaydedildi! Sidebar güncellenecek.')

        // Reload page to update sidebar
        setTimeout(() => window.location.reload(), 1000)
    }

    async function handlePasswordChange() {
        setPasswordMessage('')
        setPasswordError('')

        if (!newPassword || !confirmPassword) {
            setPasswordError('Tüm alanları doldurun')
            return
        }

        if (newPassword.length < 6) {
            setPasswordError('Yeni şifre en az 6 karakter olmalı')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor')
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            setPasswordMessage('✅ Şifre başarıyla değiştirildi!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            setPasswordError(err.message || 'Şifre değiştirilemedi')
        }
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

    if (!user) return null

    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">⚙️ Ayarlar</h1>
                <p className="page-subtitle">Hesap bilgilerinizi yönetin 🔧</p>
            </header>

            {/* Student Name Section */}
            <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(255, 230, 109, 0.2), rgba(255, 158, 100, 0.2))' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    👧 Öğrenci İsmi
                </h2>
                <p style={{ marginBottom: '1rem', color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                    Sidebar'da gösterilecek ismi girin (örn: Ayşe, Mehmet, vb.)
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Öğrenci ismi girin..."
                        style={{
                            flex: 1,
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '2px solid #FFD93D',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    />
                    <button
                        onClick={handleSaveStudentName}
                        style={{
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            background: 'var(--color-yellow)',
                            color: 'var(--text-dark)',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        Kaydet
                    </button>
                </div>
                {nameMessage && (
                    <div style={{
                        marginTop: '1rem',
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                    }}>
                        {nameMessage}
                    </div>
                )}
            </div>

            {/* Profile Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    👤 Profil Bilgileri
                </h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-gray)' }}>
                        E-posta Adresi
                    </label>
                    <div style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        background: '#F5F7FA',
                        fontSize: '1rem',
                        color: 'var(--text-dark)'
                    }}>
                        {user.email}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-gray)' }}>
                        Kayıt Tarihi
                    </label>
                    <div style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        background: '#F5F7FA',
                        fontSize: '1rem',
                        color: 'var(--text-dark)'
                    }}>
                        {new Date(user.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔐 Şifre Değiştir
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Yeni Şifre
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="En az 6 karakter"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: '2px solid #E5E9F0',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Yeni Şifre (Tekrar)
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Şifreyi tekrar girin"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: '2px solid #E5E9F0',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {passwordError && (
                        <div style={{
                            background: '#FFE5E5',
                            color: '#D32F2F',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem'
                        }}>
                            {passwordError}
                        </div>
                    )}

                    {passwordMessage && (
                        <div style={{
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem'
                        }}>
                            {passwordMessage}
                        </div>
                    )}

                    <button
                        onClick={handlePasswordChange}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'var(--color-purple)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        Şifreyi Değiştir
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔧 Hesap İşlemleri
                </h2>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--color-orange)',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    👋 Çıkış Yap
                </button>
            </div>

            {/* Footer Message */}
            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, var(--color-pink), var(--color-purple))',
                borderRadius: '16px',
                color: 'white'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Teşekkürler {studentName || 'Öğrenci'}! 💖
                </h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                    Günlerini planlamak için bu uygulamayı kullandığın için çok mutluyuz!
                </p>
            </div>
        </div>
    )
}
