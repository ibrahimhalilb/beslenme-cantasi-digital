'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleAuth() {
        setLoading(true)
        setError('')

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin
                    }
                })
                if (error) throw error

                // Auto login after signup
                if (data.user) {
                    router.push('/')
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) throw error
                router.push('/')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div className="card" style={{
                maxWidth: '450px',
                width: '100%',
                background: 'white'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        🎒
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--text-dark)',
                        marginBottom: '0.5rem'
                    }}>
                        Beslenme Çantası Digital
                    </h1>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                        Günlük planlayıcına hoş geldin! 💖
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '2px solid #E8E8E8',
                            fontSize: '0.95rem'
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '2px solid #E8E8E8',
                            fontSize: '0.95rem'
                        }}
                    />

                    {error && (
                        <div style={{
                            background: '#FFE5E5',
                            color: '#D32F2F',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        style={{
                            background: 'var(--color-pink)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Yükleniyor...' : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
                    </button>

                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-gray)',
                            padding: '0.5rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        {isSignUp ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol'}
                    </button>
                </div>
            </div>
        </div>
    )
}
