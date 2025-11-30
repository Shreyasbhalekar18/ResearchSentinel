"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Upload, FileText, Database, Github } from "lucide-react"

export default function SubmitPage() {
    const [title, setTitle] = useState("")
    const [domain, setDomain] = useState("Computer Science")
    const [degree, setDegree] = useState("PhD")
    const [githubUrl, setGithubUrl] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [dataset, setDataset] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            alert("Please upload a research paper.")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("title", title)
        formData.append("domain", domain)
        formData.append("degree_level", degree)
        if (githubUrl) formData.append("github_url", githubUrl)
        formData.append("file", file)
        if (dataset) formData.append("dataset", dataset)

        try {
            const token = localStorage.getItem("token")
            await axios.post("http://localhost:8000/api/submissions/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            router.push("/student")
        } catch (error) {
            console.error("Submission failed", error)
            alert("Failed to submit paper.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Submission</h1>
                <p className="text-slate-500">Upload your research for an autonomous AI audit.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Paper Details</CardTitle>
                    <CardDescription>Provide metadata about your research.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Research Title</label>
                            <Input
                                placeholder="e.g. Attention Is All You Need"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Domain</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                >
                                    <option>Computer Science</option>
                                    <option>Biology</option>
                                    <option>Physics</option>
                                    <option>Management</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Degree Level</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                >
                                    <option>Undergraduate</option>
                                    <option>Masters</option>
                                    <option>PhD</option>
                                    <option>Faculty Research</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub / Code URL (Optional)</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    className="pl-9"
                                    placeholder="https://github.com/username/repo"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Research Paper (PDF/DOCX)</label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf,.docx"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <FileText className="h-8 w-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-600 font-medium">
                                        {file ? file.name : "Click to upload paper"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dataset (CSV) - Optional</label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".csv"
                                        onChange={(e) => setDataset(e.target.files?.[0] || null)}
                                    />
                                    <Database className="h-8 w-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-600 font-medium">
                                        {dataset ? dataset.name : "Click to upload dataset"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                            {loading ? (
                                <>
                                    <Upload className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" /> Run Audit
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
