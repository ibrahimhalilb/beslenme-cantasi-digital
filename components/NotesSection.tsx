'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Note {
    id: string
    title: string
    content: string
    color: string
    created_at: string
}

export default function NotesSection() {
    const [notes, setNotes] = useState<Note[]>([])
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotes()
    }, [])

    async function loadNotes() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5) // Show only latest 5 notes

        if (data) {
            setNotes(data)
        }
        setLoading(false)
    }

    async function addNote() {
        if (!newTitle.trim()) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('notes')
            .insert({
                user_id: user.id,
                title: newTitle,
                content: newContent || '',
                color: 'var(--color-yellow)' // Default color
            })
            .select()
            .single()

        if (data) {
            setNotes([data, ...notes.slice(0, 4)]) // Keep only 5 latest
            setNewTitle('')
            setNewContent('')
        }
    }

    async function deleteNote(id: string) {
        await supabase
            .from('notes')
            .delete()
            .eq('id', id)

        setNotes(notes.filter(note => note.id !== id))
    }

    return (
        <div className="card fade-in" style={{
            background: '#FFF8DC',
            minHeight: '300px',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E8DCC0 31px, #E8DCC0 32px)',
            paddingTop: '8px'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--text-dark)',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                📝 Hızlı Notlar
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNote()}
                        placeholder="Not başlığı..."
                        style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '2px solid #E8DCC0',
                            fontSize: '0.95rem',
                            background: 'white',
                            fontWeight: '600'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addNote()}
                            placeholder="Not içeriği (opsiyonel)..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: '2px solid #E8DCC0',
                                fontSize: '0.95rem',
                                background: 'white'
                            }}
                        />
                        <button
                            onClick={addNote}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                background: 'var(--color-pink)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.95rem'
                            }}
                        >
                            Ekle
                        </button>
                    </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Tüm notları görmek için Notlarım sayfasına gidin
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <div className="spinner" style={{ borderTopColor: 'var(--text-dark)' }}></div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notes.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-gray)', padding: '2rem' }}>
                            Henüz not yok
                        </p>
                    ) : (
                        notes.map((note, index) => (
                            <div
                                key={note.id}
                                style={{
                                    background: 'white',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #E8DCC0',
                                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                                            {note.title}
                                        </div>
                                        {note.content && (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                                                {note.content.length > 50 ? note.content.substring(0, 50) + '...' : note.content}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        style={{
                                            background: '#FF6B6B',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            marginLeft: '0.5rem'
                                        }}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
