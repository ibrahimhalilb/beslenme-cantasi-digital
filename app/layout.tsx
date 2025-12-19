import './globals.css'
import type { Metadata } from 'next'
import DashboardLayout from '@/components/DashboardLayout'

export const metadata: Metadata = {
    title: 'Beslenme Çantası Digital - Günlük Planlayıcı',
    description: 'Çocuklar için özel hazırlanmış çocuksu ve eğlenceli günlük planlayıcı',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="tr">
            <body>
                <DashboardLayout>{children}</DashboardLayout>
            </body>
        </html>
    )
}
