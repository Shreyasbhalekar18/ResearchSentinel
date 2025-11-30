"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            {children}
        </Suspense>
    )
}
