import { ProfileProvider } from '@/lib/ProfileContext'
import AdminShell from '@/components/admin/AdminShell'


export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProfileProvider>
            <AdminShell>{children}</AdminShell>
        </ProfileProvider>
    )
}
