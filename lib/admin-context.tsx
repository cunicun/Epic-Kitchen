"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AdminContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  adminUser: { username: string; name: string } | null
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<{ username: string; name: string } | null>(null)

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("admin-session")
    if (adminSession) {
      const user = JSON.parse(adminSession)
      setIsAuthenticated(true)
      setAdminUser(user)
    }
  }, [])

  const login = (username: string, password: string) => {
    // Simple authentication - in real app, this would be API call
    if (username === "admin" && password === "admin123") {
      const user = { username: "admin", name: "Administrator" }
      setIsAuthenticated(true)
      setAdminUser(user)
      localStorage.setItem("admin-session", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdminUser(null)
    localStorage.removeItem("admin-session")
  }

  return <AdminContext.Provider value={{ isAuthenticated, login, logout, adminUser }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
