"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
  subtotal: number
  shippingCost: number
  total: number
  paymentMethod: "transfer" | "ewallet" | "cod"
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  transferCode?: string
  createdAt: string
  updatedAt: string
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getOrderById: (orderId: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("admin-orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      // Add some sample orders for demo
      const sampleOrders: Order[] = [
        {
          id: "1",
          orderNumber: "PEK-001234",
          customerName: "Sari Dewi",
          email: "sari@email.com",
          phone: "+62812345678",
          address: "Jl. Sudirman No. 123",
          city: "Jakarta",
          postalCode: "12345",
          items: [
            { productId: "8", productName: "Panci Anti Lengket 24cm", price: 185000, quantity: 1 },
            { productId: "13", productName: "Telenan Bambu Antibakteri", price: 45000, quantity: 2 },
          ],
          subtotal: 275000,
          shippingCost: 0,
          total: 275000,
          paymentMethod: "transfer",
          status: "pending",
          transferCode: "123456",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          orderNumber: "PEK-001235",
          customerName: "Budi Santoso",
          email: "budi@email.com",
          phone: "+62812345679",
          address: "Jl. Thamrin No. 456",
          city: "Surabaya",
          postalCode: "54321",
          items: [{ productId: "7", productName: "Mangkok Keramik Set 6pcs", price: 120000, quantity: 1 }],
          subtotal: 120000,
          shippingCost: 15000,
          total: 135000,
          paymentMethod: "cod",
          status: "confirmed",
          createdAt: "2024-01-14T15:20:00Z",
          updatedAt: "2024-01-14T16:00:00Z",
        },
      ]
      setOrders(sampleOrders)
      localStorage.setItem("admin-orders", JSON.stringify(sampleOrders))
    }
  }, [])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem("admin-orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order)),
    )
  }

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
