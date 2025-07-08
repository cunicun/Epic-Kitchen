"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

interface User {
  id: string
  name: string
  email: string
  password?: string
  phone: string
  address: string
  city: string
  postalCode: string
  createdAt: string
}

interface UserContextProps {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateProfile: async () => false,
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const userSession = localStorage.getItem("user-session")
    if (userSession) {
      const userData = JSON.parse(userSession)
      setUser(userData)
      setIsAuthenticated(true)
    }

    // Initialize demo user if not exists
    const users = JSON.parse(localStorage.getItem("registered-users") || "[]")
    if (users.length === 0) {
      const demoUser = {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@email.com",
        password: "demo123",
        phone: "+62 812 3456 7890",
        address: "Jl. Demo No. 123",
        city: "Jakarta",
        postalCode: "12345",
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("registered-users", JSON.stringify([demoUser]))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem("registered-users") || "[]")

    // Find user by email and password
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password

      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem("user-session", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const register = async (data: Omit<User, "id" | "createdAt"> & { password: string }): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem("registered-users") || "[]")

    // Check for duplicate email
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return false
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      postalCode: data.postalCode || "",
      createdAt: new Date().toISOString(),
      password: data.password,
    }

    localStorage.setItem("registered-users", JSON.stringify([...users, newUser]))

    // Auto login after registration
    await login(data.email, data.password)
    return true
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    const users: User[] = JSON.parse(localStorage.getItem("registered-users") || "[]")
    const userIndex = users.findIndex((u) => u.id === user.id)

    if (userIndex === -1) return false

    const updatedUser = { ...users[userIndex], ...data }
    users[userIndex] = updatedUser

    localStorage.setItem("registered-users", JSON.stringify(users))

    const userWithoutPassword = { ...updatedUser }
    delete userWithoutPassword.password

    setUser(userWithoutPassword)
    localStorage.setItem("user-session", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user-session")
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, login, logout, register, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
