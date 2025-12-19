'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Task {
    id: string
    title: string
    completed: boolean
    category: string
    priority: string
    due_date?: string
}

export default function TasksPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('personal')
    const [selectedPriority, setSelectedPriority] = useState('medium')
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
            loadTasks(user.id)
        }
        setLoading(false)
    }

    async function loadTasks(userId: string) {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (data) setTasks(data)
    }

    async function addTask() {
        if (!newTask.trim() || !user) return

        const task = {
            title: newTask,
            completed: false,
            category: selectedCategory,
            priority: selectedPriority,
            user_id: user.id
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([task])
            .select()

        if (data) {
            setTasks([data[0], ...tasks])
            setNewTask('')
        }
    }

    async function toggleTask(taskId: string, completed: boolean) {
        await supabase
            .from('tasks')
            .update({ completed: !completed })
            .eq('id', taskId)

        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !completed } : t
        ))
    }

    async function deleteTask(taskId: string) {
        await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)

        setTasks(tasks.filter(t => t.id !== taskId))
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

    const categories = [
        { value: 'personal', label: 'Kişisel', icon: '👤' },
        { value: 'family', label: 'Aile', icon: '👨‍👩‍👧' },
        { value: 'home', label: 'Ev İşleri', icon: '🏠' },
        { value: 'shopping', label: 'Alışveriş', icon: '🛒' },
    ]

    const priorities = [
        { value: 'high', label: 'Yüksek', color: '#FF6B9D' },
        { value: 'medium', label: 'Orta', color: '#FF9E64' },
        { value: 'low', label: 'Düşük', color: '#81C784' },
    ]

    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">✅ Görevlerim</h1>
                <p className="page-subtitle">Yapılacaklar listeni yönet! 🎯</p>
            </header>

            {/* Add Task Form */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                    ➕ Yeni Görev Ekle
                </h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Görev ne olacak?"
                        style={{
                            flex: '1',
                            minWidth: '200px',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            background: '#F5F7FA',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            background: '#F5F7FA',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        style={{
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            background: '#F5F7FA',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {priorities.map(pri => (
                            <option key={pri.value} value={pri.value}>
                                {pri.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={addTask}
                        style={{
                            padding: '0.875rem 2rem',
                            borderRadius: '12px',
                            background: 'var(--color-pink)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        Ekle
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {tasks.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)' }}>
                            Henüz görev yok! Yukarıdan yeni görev ekle.
                        </p>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const category = categories.find(c => c.value === task.category)
                        const priority = priorities.find(p => p.value === task.priority)

                        return (
                            <div
                                key={task.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    opacity: task.completed ? 0.6 : 1,
                                    borderLeft: `4px solid ${priority?.color || '#ccc'}`
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id, task.completed)}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {task.title}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                        {category?.icon} {category?.label} • {priority?.label}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        background: '#FFE5EC',
                                        color: 'var(--color-pink)',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Sil
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
