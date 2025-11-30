"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface Submission {
    id: number
    title: string
    status: string
    created_at: string
    report?: {
        integrity_score: number
    }
}

export default function StudentDashboard() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get("welcome")) {
            toast.success("Welcome! You have successfully logged in.")
            // Remove the query param
            router.replace("/student")
        }

        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem("token")
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return <Badge variant="success">Completed</Badge>
            case "processing": return <Badge variant="warning">Processing</Badge>
            case "failed": return <Badge variant="destructive">Failed</Badge>
            default: return <Badge variant="secondary">Pending</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
                <Link href="/student/submit">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" /> New Audit
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : submissions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-slate-100 p-4 mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold">No submissions yet</h3>
                        <p className="text-sm text-slate-500 mb-4">Upload your research paper to get an AI audit.</p>
                        <Link href="/student/submit">
                            <Button variant="outline">Start First Audit</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {submissions.map((sub) => (
                        <Link href={`/report/${sub.id}`} key={sub.id}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium truncate pr-4" title={sub.title}>
                                        {sub.title}
                                    </CardTitle>
                                    {getStatusBadge(sub.status)}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {sub.report ? `${sub.report.integrity_score}/100` : "--"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Integrity Score
                                    </p>
                                    <div className="mt-4 text-xs text-slate-500">
                                        Submitted on {new Date(sub.created_at).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
