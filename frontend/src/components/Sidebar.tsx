"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Upload, Settings, LogOut, ShieldCheck, Users, BarChart } from "lucide-react"

export function Sidebar() {
    const pathname = usePathname()

    // Mock role check - in real app use context/auth hook
    const role = pathname.includes("admin") ? "admin" : pathname.includes("faculty") ? "faculty" : "student"

    return (
        <div className="pb-12 w-64 border-r min-h-screen bg-slate-50 hidden md:block">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-6">
                        <ShieldCheck className="h-6 w-6 text-indigo-600 mr-2" />
                        <h2 className="text-lg font-semibold tracking-tight">
                            ResearchSentinel
                        </h2>
                    </div>

                    <div className="space-y-1">
                        {role === "student" && (
                            <>
                                <Link href="/student">
                                    <Button variant={pathname === "/student" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/student/submit">
                                    <Button variant={pathname === "/student/submit" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <Upload className="mr-2 h-4 w-4" />
                                        New Submission
                                    </Button>
                                </Link>
                            </>
                        )}

                        {role === "faculty" && (
                            <>
                                <Link href="/faculty">
                                    <Button variant={pathname === "/faculty" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/faculty/students">
                                    <Button variant={pathname === "/faculty/students" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <Users className="mr-2 h-4 w-4" />
                                        Students
                                    </Button>
                                </Link>
                            </>
                        )}

                        {role === "admin" && (
                            <>
                                <Link href="/admin">
                                    <Button variant={pathname === "/admin" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <BarChart className="mr-2 h-4 w-4" />
                                        Analytics
                                    </Button>
                                </Link>
                                <Link href="/admin/users">
                                    <Button variant={pathname === "/admin/users" ? "secondary" : "ghost"} className="w-full justify-start">
                                        <Users className="mr-2 h-4 w-4" />
                                        User Management
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Settings
                    </h2>
                    <div className="space-y-1">
                        <Link href="/settings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
