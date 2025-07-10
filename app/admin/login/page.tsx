"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdmin } from "@/lib/admin-context"
import { Shield, AlertCircle, Eye, EyeOff, User, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdmin()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = login(username, password)
    if (success) {
      router.push("/admin/dashboard")
    } else {
      setError("Username atau password salah")
    }
    setIsLoading(false)
  }

  const fillDemoCredentials = () => {
    setUsername("admin")
    setPassword("admin123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <p className="text-gray-600 mt-2">Prada Epic Kitchen Dashboard</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Masuk...
                </div>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Demo Account</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={fillDemoCredentials}>
              Gunakan Akun Demo
            </Button>

            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-blue-800">Demo Credentials:</p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <span className="font-medium">Username:</span> <code className="bg-blue-100 px-1 rounded">admin</code>
                </p>
                <p>
                  <span className="font-medium">Password:</span>{" "}
                  <code className="bg-blue-100 px-1 rounded">admin123</code>
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Fitur Admin Dashboard:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Kelola pesanan dan status pengiriman</li>
              <li>• Manajemen produk dan inventori</li>
              <li>• Analitik penjualan dan laporan</li>
              <li>• Manajemen pelanggan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
