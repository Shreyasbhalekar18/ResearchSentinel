import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8 bg-slate-50/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
