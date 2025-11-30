"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new URLSearchParams()
            formData.append('username', email) // OAuth2 expects username
            formData.append('password', password)

            // In a real app, use environment variable for API URL
            // For this demo, we assume localhost:8000
            // Note: The backend expects JSON for the custom login endpoint I wrote, 
            // BUT standard OAuth2 expects form data. 
            // Let's check my backend implementation:
            // @router.post("/login", response_model=schemas.Token)
            // def login(form_data: schemas.UserCreate...
            // It expects JSON body matching UserCreate (email, password, etc).

            const res = await axios.post("http://localhost:8000/api/auth/login", {
                email,
                password
            })

            localStorage.setItem("token", res.data.access_token)

            // User role is now returned in the login response
            const role = res.data.user.role

            if (role === "admin") router.push("/admin?welcome=true")
            else if (role === "faculty") router.push("/faculty?welcome=true")
            else router.push("/student?welcome=true")

        } catch (error) {
            console.error("Login failed", error)
            alert("Login failed. Please check your credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-sm text-center text-slate-500">
                            Don't have an account? <Link href="/register" className="text-indigo-600 hover:underline">Sign up</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
