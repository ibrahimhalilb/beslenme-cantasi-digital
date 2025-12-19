'use client'

import { useState, useEffect } from 'react'
import { supabase, getTurkishDayName, formatTime } from '@/lib/supabase'
import { Reminder } from '@/types/database'

export default function ReminderCard() {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newReminder, setNewReminder] = useState({
        target_day: 'monday',
        reminder_time: '22:00',
        message: ''
    })

    useEffect(() => {
        loadReminders()
    }, [])

    async function loadReminders() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', user.id)
            .order('reminder_time', { ascending: true })

        if (data) {
            setReminders(data)
        }
        setLoading(false)
    }

    async function addReminder() {
        if (!newReminder.message.trim()) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('reminders')
            .insert({
                user_id: user.id,
                target_day: newReminder.target_day,
                reminder_time: newReminder.reminder_time,
                message: newReminder.message
            })
            .select()
            .single()

        if (data) {
            setReminders([...reminders, data])
            setNewReminder({ target_day: 'monday', reminder_time: '22:00', message: '' })
            setShowForm(false)
        }
    }

    async function toggleReminder(id: string, currentState: boolean) {
        await supabase
            .from('reminders')
            .update({ is_active: !currentState })
            .eq('id', id)

        setReminders(reminders.map(r =>
            r.id === id ? { ...r, is_active: !currentState } : r
        ))
    }

    async function deleteReminder(id: string) {
        await supabase
            .from('reminders')
            .delete()
            .eq('id', id)

        setReminders(reminders.filter(r => r.id !== id))
    }

    const dayOptions = [
        { value: 'monday', label: 'Pazartesi' },
        { value: 'tuesday', label: 'Salı' },
        { value: 'wednesday', label: 'Çarşamba' },
        { value: 'thursday', label: 'Perşembe' },
        { value: 'friday', label: 'Cuma' },
        { value: 'saturday', label: 'Cumartesi' },
        { value: 'sunday', label: 'Pazar' }
    ]

    const getDayLabel = (day: string) => {
        const option = dayOptions.find(opt => opt.value === day)
        return option?.label || day
    }

    return (
        <div className="card fade-in" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                    ⏰ Hatırlatıcılar
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: 'white',
                        color: 'var(--color-purple)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}
                >
                    {showForm ? 'İptal' : '+ Ekle'}
                </button>
            </div>

            {showForm && (
                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select
                            value={newReminder.target_day}
                            onChange={(e) => setNewReminder({ ...newReminder, target_day: e.target.value })}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.95rem',
                                color: 'var(--text-dark)'
                            }}
                        >
                            {dayOptions.map(day => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>

                        <input
                            type="time"
                            value={newReminder.reminder_time}
                            onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.95rem'
                            }}
                        />

                        <input
                            type="text"
                            value={newReminder.message}
                            onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                            placeholder="Hatırlatma mesajı..."
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.95rem'
                            }}
                        />

                        <button
                            onClick={addReminder}
                            style={{
                                background: 'white',
                                color: 'var(--color-purple)',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reminders.length === 0 ? (
                        <p style={{ textAlign: 'center', opacity: 0.8, padding: '2rem' }}>
                            Henüz hatırlatıcı eklenmemiş
                        </p>
                    ) : (
                        reminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                style={{
                                    background: 'rgba(255,255,255,0.9)',
                                    color: 'var(--text-dark)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    opacity: reminder.is_active ? 1 : 0.5
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                        {getDayLabel(reminder.target_day)} - {formatTime(reminder.reminder_time)}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                        {reminder.message}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleReminder(reminder.id, reminder.is_active)}
                                        style={{
                                            background: reminder.is_active ? 'var(--color-green)' : 'var(--text-gray)',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {reminder.is_active ? '✓' : '○'}
                                    </button>
                                    <button
                                        onClick={() => deleteReminder(reminder.id)}
                                        style={{
                                            background: '#FF6B6B',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
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
