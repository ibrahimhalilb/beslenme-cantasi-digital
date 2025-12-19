'use client'

import { useState, useEffect } from 'react'
import { supabase, getWeekStartDate, getDayName } from '@/lib/supabase'
import { DailyPlan } from '@/types/database'

interface DayCardProps {
    dayIndex: number
    dayName: string
    colorClass: string
}

export default function DayCard({ dayIndex, dayName, colorClass }: DayCardProps) {
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingTimeout, setSavingTimeout] = useState<NodeJS.Timeout | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Calculate the actual date for this day
    const getDateForDay = () => {
        const today = new Date()
        const todayDayIndex = (today.getDay() + 6) % 7 // Monday = 0
        const diff = dayIndex - todayDayIndex
        const date = new Date(today)
        date.setDate(today.getDate() + diff)
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    }

    useEffect(() => {
        loadNotes()
    }, [dayIndex])

    async function loadNotes() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const weekStart = getWeekStartDate()
        const dayOfWeek = getDayName(dayIndex)

        const { data, error } = await supabase
            .from('daily_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('day_of_week', dayOfWeek)
            .eq('week_start_date', weekStart)
            .single()

        if (data) {
            setNotes(data.notes || '')
        }
        setLoading(false)
    }

    async function saveNotes(newNotes: string) {
        setIsSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const weekStart = getWeekStartDate()
        const dayOfWeek = getDayName(dayIndex)

        // Check if record exists
        const { data: existing } = await supabase
            .from('daily_plans')
            .select('id')
            .eq('user_id', user.id)
            .eq('day_of_week', dayOfWeek)
            .eq('week_start_date', weekStart)
            .single()

        if (existing) {
            // Update existing
            await supabase
                .from('daily_plans')
                .update({
                    notes: newNotes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
        } else {
            // Insert new
            await supabase
                .from('daily_plans')
                .insert({
                    user_id: user.id,
                    day_of_week: dayOfWeek,
                    week_start_date: weekStart,
                    notes: newNotes
                })
        }

        setIsSaving(false)
    }

    function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newNotes = e.target.value
        setNotes(newNotes)

        // Debounce saving
        if (savingTimeout) {
            clearTimeout(savingTimeout)
        }

        const timeout = setTimeout(() => {
            saveNotes(newNotes)
        }, 1000)

        setSavingTimeout(timeout)
    }

    return (
        <div className={`card ${colorClass} fade-in`} style={{ minHeight: '200px', position: 'relative' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <div>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: 'var(--text-dark)'
                    }}>
                        {dayName}
                    </h3>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-dark)',
                        opacity: 0.7,
                        marginTop: '0.25rem'
                    }}>
                        {getDateForDay()}
                    </p>
                </div>
                {isSaving && (
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-gray)',
                        fontWeight: '400'
                    }}>
                        Kaydediliyor...
                    </span>
                )}
            </div>

            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '150px'
                }}>
                    <div className="spinner" style={{
                        borderTopColor: 'var(--text-dark)',
                        borderWidth: '2px',
                        width: '30px',
                        height: '30px'
                    }}></div>
                </div>
            ) : (
                <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Notlarınızı buraya yazın..."
                    style={{
                        width: '100%',
                        minHeight: '150px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'var(--text-dark)',
                        fontWeight: '400'
                    }}
                />
            )}
        </div>
    )
}
