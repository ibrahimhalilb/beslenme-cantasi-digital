'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Note {
    id: string
    title: string
    content: string
    color: string
    created_at: string
}

const noteColors = [
    { name: 'Sarı', value: 'var(--color-yellow)' },
    { name: 'Turuncu', value: 'var(--color-orange)' },
    { name: 'Mavi', value: 'var(--color-blue)' },
    { name: 'Yeşil', value: 'var(--color-green)' },
    { name: 'Pembe', value: 'var(--color-pink)' },
    { name: 'Mor', value: 'var(--color-purple)' },
]

export default function NotesPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState<Note[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [selectedColor, setSelectedColor] = useState(noteColors[0].value)
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
            loadNotes(user.id)
        }
        setLoading(false)
    }

    async function loadNotes(userId: string) {
        const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (data) setNotes(data)
    }

    async function addNote() {
        if (!newTitle.trim() || !user) return

        const note = {
            title: newTitle,
            content: newContent,
            color: selectedColor,
            user_id: user.id
        }

        const { data } = await supabase
            .from('notes')
            .insert([note])
            .select()

        if (data) {
            setNotes([data[0], ...notes])
            setNewTitle('')
            setNewContent('')
            setShowAddForm(false)
        }
    }

    async function deleteNote(noteId: string) {
        await supabase
            .from('notes')
            .delete()
            .eq('id', noteId)

        setNotes(notes.filter(n => n.id !== noteId))
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
                <h1 className="page-title">📝 Notlarım</h1>
                <p className="page-subtitle">Fikirlerini ve hatırlatmalarını kaydet! ✍️</p>
            </header>

            {/* Add Note Button */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        background: 'var(--color-pink)',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    {showAddForm ? '❌ İptal' : '➕ Yeni Not Ekle'}
                </button>
            </div>

            {/* Add Note Form */}
            {showAddForm && (
                <div className="card fade-in" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                        Yeni Not
                    </h2>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Not başlığı..."
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            background: '#F5F7FA',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '1rem'
                        }}
                    />
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Not içeriği..."
                        rows={5}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            background: '#F5F7FA',
                            fontSize: '1rem',
                            marginBottom: '1rem',
                            fontFamily: "'Fredoka', sans-serif"
                        }}
                    />
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Renk Seç:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {noteColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: color.value,
                                        border: selectedColor === color.value ? '3px solid var(--text-dark)' : 'none',
                                        transform: selectedColor === color.value ? 'scale(1.1)' : 'scale(1)'
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={addNote}
                        style={{
                            padding: '0.875rem 2rem',
                            borderRadius: '12px',
                            background: 'var(--color-purple)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        Not Ekle
                    </button>
                </div>
            )}

            {/* Notes Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
            }}>
                {notes.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', gridColumn: '1 / -1' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)' }}>
                            Henüz not yok! Yukarıdan yeni not ekle.
                        </p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="card"
                            style={{
                                background: note.color,
                                minHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: 'var(--text-dark)'
                            }}>
                                {note.title}
                            </h3>
                            <p style={{
                                flex: 1,
                                color: 'var(--text-dark)',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {note.content}
                            </p>
                            <button
                                onClick={() => deleteNote(note.id)}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: 'rgba(0, 0, 0, 0.1)',
                                    color: 'var(--text-dark)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    alignSelf: 'flex-start'
                                }}
                            >
                                🗑️ Sil
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
