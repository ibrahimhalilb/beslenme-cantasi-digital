'use client'

import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Don't show sidebar on login page
    const isLoginPage = pathname === '/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}
