"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2, Users } from "lucide-react"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function FacultyDashboard() {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get("welcome")) {
            toast.success("Welcome! You have successfully logged in.")
            router.replace("/faculty")
        }

        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem("token")
                // In this demo, the backend returns all submissions for faculty
                const res = await axios.get("http://localhost:8000/api/submissions/", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setSubmissions(res.data)
            } catch (error) {
                console.error("Failed to fetch submissions", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSubmissions()
    }, [searchParams, router])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
                <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" /> Manage Students
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{submissions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'completed').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Integrity Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84.2</div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mt-8">Recent Student Submissions</h2>

            {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <div className="border rounded-lg bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Score</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[200px]">{sub.title}</td>
                                    <td className="px-6 py-4">Student ID: {sub.owner_id}</td>
                                    <td className="px-6 py-4">{new Date(sub.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={sub.status === 'completed' ? 'success' : 'secondary'}>{sub.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {sub.report ? sub.report.integrity_score : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/report/${sub.id}`}>
                                            <Button size="sm" variant="outline">View Report</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
