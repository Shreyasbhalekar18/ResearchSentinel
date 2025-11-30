"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, Download, Share2, FileText, Activity, BookOpen, GitBranch, Brain } from "lucide-react"

export default function ReportPage() {
    const { id } = useParams()
    const [submission, setSubmission] = useState<any>(null)
    const [report, setReport] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(`http://localhost:8000/api/submissions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setSubmission(res.data)
                if (res.data.report && res.data.report.json_content) {
                    setReport(JSON.parse(res.data.report.json_content))
                }
            } catch (error) {
                console.error("Error fetching report", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [id])

    if (loading) return <div className="p-12 text-center">Loading audit report...</div>
    if (!submission) return <div className="p-12 text-center">Submission not found</div>

    if (submission.status === "processing" || submission.status === "pending") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Activity className="h-16 w-16 text-indigo-600 animate-pulse" />
                <h2 className="text-2xl font-bold">Audit In Progress</h2>
                <p className="text-slate-500">Our AI agents are reading your paper, checking citations, and analyzing methodology.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Refresh Status</Button>
            </div>
        )
    }

    if (!report) return <div className="p-12 text-center">Report generation failed.</div>

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{submission.title}</h1>
                    <p className="text-slate-500">Audited on {new Date(submission.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Integrity Score</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getScoreColor(report.summary.integrity_score)}`}>
                            {report.summary.integrity_score}/100
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Risk Level: <span className="font-medium text-foreground">{report.summary.risk_level}</span>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citations</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{report.citations.score}/100</div>
                        <p className="text-xs text-muted-foreground">
                            {report.citations.broken_count} broken links found
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Probability</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{report.ai_content.probability}%</div>
                        <p className="text-xs text-muted-foreground">
                            Estimated AI content
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novelty</CardTitle>
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{report.novelty.score}/100</div>
                        <p className="text-xs text-muted-foreground">
                            Compared to open literature
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Sections */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Methodology */}
                <Card>
                    <CardHeader>
                        <CardTitle>Methodology & Statistics</CardTitle>
                        <CardDescription>Analysis of experimental design and statistical validity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Methodology Score</span>
                            <span className="font-bold">{report.methodology.score}/100</span>
                        </div>
                        <Progress value={report.methodology.score} className="h-2" />

                        <div className="space-y-2 mt-4">
                            {report.methodology.issues.map((issue: any, idx: number) => (
                                <div key={idx} className="flex items-start space-x-2 p-2 rounded bg-slate-50">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">{issue.type}</p>
                                        <p className="text-xs text-slate-500">{issue.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Reproducibility */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reproducibility Check</CardTitle>
                        <CardDescription>Availability of code, data, and clear steps.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reproducibility Score</span>
                            <span className="font-bold">{report.reproducibility.score}/100</span>
                        </div>
                        <Progress value={report.reproducibility.score} className="h-2" />

                        <div className="space-y-2 mt-4">
                            {report.reproducibility.checklist.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-2 border-b last:border-0">
                                    <div className="flex items-center space-x-2">
                                        {item.status === "Provided" ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm">{item.item}</span>
                                    </div>
                                    <Badge variant={item.status === "Provided" ? "success" : "destructive"}>
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle>AI Suggestions for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                        {report.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx} className="text-sm text-slate-700">{suggestion}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
