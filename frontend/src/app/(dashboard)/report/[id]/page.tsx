"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, Download, Share2, Activity, BookOpen, GitBranch, Brain, Lightbulb, BookMarked, Loader2 } from "lucide-react"
import { apiClient, handleApiError } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/config"
import { toast } from "sonner"

export default function ReportPage() {
    const { id } = useParams()
    const [submission, setSubmission] = useState<any>(null)
    const [report, setReport] = useState<any>(null)
    const [corrections, setCorrections] = useState<any>(null)
    const [references, setReferences] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [loadingCorrections, setLoadingCorrections] = useState(false)
    const [loadingReferences, setLoadingReferences] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'corrections' | 'references'>('overview')

    useEffect(() => {
        fetchReport()
    }, [id])

    const fetchReport = async () => {
        try {
            const res = await apiClient.get(API_ENDPOINTS.SUBMISSION_DETAIL(id as string))
            setSubmission(res.data)
            if (res.data.report && res.data.report.json_content) {
                setReport(JSON.parse(res.data.report.json_content))
            }
        } catch (error) {
            toast.error(handleApiError(error))
        } finally {
            setLoading(false)
        }
    }

    const fetchCorrections = async () => {
        setLoadingCorrections(true)
        try {
            const res = await apiClient.get(API_ENDPOINTS.SUGGEST_CORRECTIONS(id as string))
            setCorrections(res.data)
            setActiveTab('corrections')
            toast.success("AI corrections loaded successfully!")
        } catch (error) {
            toast.error(handleApiError(error))
        } finally {
            setLoadingCorrections(false)
        }
    }

    const fetchReferences = async () => {
        setLoadingReferences(true)
        try {
            const res = await apiClient.get(API_ENDPOINTS.RECOMMEND_REFERENCES(id as string))
            setReferences(res.data)
            setActiveTab('references')
            toast.success("Reference recommendations loaded!")
        } catch (error) {
            toast.error(handleApiError(error))
        } finally {
            setLoadingReferences(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="p-12 text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Submission not found</h2>
            </div>
        )
    }

    if (submission.status === "processing" || submission.status === "pending") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Activity className="h-16 w-16 text-indigo-600 animate-pulse" />
                <h2 className="text-2xl font-bold">Audit In Progress</h2>
                <p className="text-slate-500">Our AI agents are analyzing your research paper...</p>
                <Button variant="outline" onClick={fetchReport}>Refresh Status</Button>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="p-12 text-center">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Report generation failed</h2>
            </div>
        )
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    const getSeverityColor = (severity: string) => {
        if (severity === "high") return "bg-red-100 text-red-800 border-red-200"
        if (severity === "medium") return "bg-yellow-100 text-yellow-800 border-yellow-200"
        return "bg-blue-100 text-blue-800 border-blue-200"
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {submission.title}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Audited on {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'overview'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <Activity className="inline-block mr-2 h-4 w-4" />
                    Overview
                </button>
                <button
                    onClick={() => corrections ? setActiveTab('corrections') : fetchCorrections()}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'corrections'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                    disabled={loadingCorrections}
                >
                    {loadingCorrections ? (
                        <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Lightbulb className="inline-block mr-2 h-4 w-4" />
                    )}
                    AI Corrections
                </button>
                <button
                    onClick={() => references ? setActiveTab('references') : fetchReferences()}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'references'
                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                    disabled={loadingReferences}
                >
                    {loadingReferences ? (
                        <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <BookMarked className="inline-block mr-2 h-4 w-4" />
                    )}
                    Recommended References
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    {/* Top Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Integrity Score</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${getScoreColor(report.summary.integrity_score)}`}>
                                    {report.summary.integrity_score}/100
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Risk Level: <span className="font-medium text-foreground">{report.summary.risk_level}</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Citations</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{report.citations.score}/100</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {report.citations.broken_count} broken links found
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">AI Probability</CardTitle>
                                <Brain className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{report.ai_content.probability}%</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Estimated AI content
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Novelty</CardTitle>
                                <GitBranch className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{report.novelty.score}/100</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Compared to open literature
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Sections */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Methodology */}
                        <Card className="hover:shadow-lg transition-shadow">
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
                                        <div key={idx} className="flex items-start space-x-2 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                                            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{issue.type}</p>
                                                <p className="text-xs text-slate-600 mt-1">{issue.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reproducibility */}
                        <Card className="hover:shadow-lg transition-shadow">
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
                                        <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
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
                    <Card className="border-t-4 border-t-indigo-500 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Lightbulb className="mr-2 h-5 w-5 text-indigo-600" />
                                AI Suggestions for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {report.suggestions.map((suggestion: string, idx: number) => (
                                    <li key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm text-slate-700">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Corrections Tab */}
            {activeTab === 'corrections' && corrections && (
                <div className="space-y-6">
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                        <CardHeader>
                            <CardTitle>Correction Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-red-600">{corrections.summary.high_priority}</div>
                                    <div className="text-sm text-slate-600">High Priority</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-yellow-600">{corrections.summary.medium_priority}</div>
                                    <div className="text-sm text-slate-600">Medium Priority</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-3xl font-bold text-blue-600">{corrections.summary.low_priority}</div>
                                    <div className="text-sm text-slate-600">Low Priority</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {corrections.corrections.map((correction: any, idx: number) => (
                            <Card key={idx} className={`border-l-4 ${getSeverityColor(correction.severity)} hover:shadow-lg transition-shadow`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg capitalize">{correction.type.replace(/_/g, ' ')}</CardTitle>
                                            <CardDescription>{correction.location}</CardDescription>
                                        </div>
                                        <Badge className={getSeverityColor(correction.severity)}>
                                            {correction.severity}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {correction.context && (
                                        <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                            <p className="text-xs font-medium text-slate-600 mb-1">Context:</p>
                                            <p className="text-sm text-slate-700 italic">...{correction.context}...</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 mb-1">Issue:</p>
                                        <p className="text-sm text-slate-700">{correction.issue}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded border border-green-200">
                                        <p className="text-sm font-medium text-green-900 mb-1">💡 Suggestion:</p>
                                        <p className="text-sm text-green-800">{correction.suggestion}</p>
                                    </div>
                                    <div className="text-xs text-slate-600 italic">
                                        {correction.explanation}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* References Tab */}
            {activeTab === 'references' && references && (
                <div className="space-y-6">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                            <CardTitle>Recommended References</CardTitle>
                            <CardDescription>
                                Found {references.total_recommendations} relevant papers based on your research topic
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="space-y-4">
                        {references.recommendations.map((ref: any, idx: number) => (
                            <Card key={idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg text-indigo-900">{ref.title}</CardTitle>
                                            <CardDescription className="mt-2">
                                                {ref.authors.join(', ')} ({ref.year})
                                            </CardDescription>
                                        </div>
                                        {ref.relevance_score && (
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {Math.round(ref.relevance_score * 100)}% relevant
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Journal:</p>
                                        <p className="text-sm text-slate-900">{ref.journal}</p>
                                    </div>
                                    {ref.citation_format && (
                                        <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                            <p className="text-xs font-medium text-slate-600 mb-1">Citation:</p>
                                            <p className="text-sm text-slate-700 font-mono">{ref.citation_format}</p>
                                        </div>
                                    )}
                                    {ref.reason && (
                                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                            <p className="text-sm text-blue-900">
                                                <strong>Why this paper:</strong> {ref.reason}
                                            </p>
                                        </div>
                                    )}
                                    {ref.url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(ref.url, '_blank')}
                                            className="w-full"
                                        >
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            View Paper (DOI: {ref.doi})
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
