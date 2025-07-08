"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  createdAt: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone: string
    password: string
  }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize demo user and load session
  useEffect(() => {
    // Create demo user if not exists
    const existingUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")
    const demoUser = existingUsers.find((u: User) => u.email === "demo@email.com")

    if (!demoUser) {
      const newDemoUser = {
        id: "demo-user-id",
        name: "Demo User",
        email: "demo@email.com",
        password: "demo123",
        phone: "+62 812 3456 7890",
        address: "Jl. Demo No. 123",
        city: "Jakarta",
        postalCode: "12345",
        createdAt: new Date().toISOString(),
      }
      existingUsers.push(newDemoUser)
      localStorage.setItem("registered-users", JSON.stringify(existingUsers))
    }

    // Load existing session
    const savedSession = localStorage.getItem("user-session")
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error loading user session:", error)
        localStorage.removeItem("user-session")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")
      const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem("user-session", JSON.stringify(userWithoutPassword))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<boolean> => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")

      // Check if email already exists
      const existingUser = registeredUsers.find((u: any) => u.email === userData.email)
      if (existingUser) {
        return false // Email already exists
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        address: "",
        city: "",
        postalCode: "",
        createdAt: new Date().toISOString(),
      }

      registeredUsers.push(newUser)
      localStorage.setItem("registered-users", JSON.stringify(registeredUsers))

      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem("user-session", JSON.stringify(userWithoutPassword))

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user-session")
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user-session", JSON.stringify(updatedUser))

      // Update in registered users list
      const registeredUsers = JSON.parse(localStorage.getItem("registered-users") || "[]")
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...userData }
        localStorage.setItem("registered-users", JSON.stringify(registeredUsers))
      }

      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
