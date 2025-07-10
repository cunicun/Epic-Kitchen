import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD${timestamp.slice(-6)}${random}`
}

export function generateVirtualAccount(orderId: string): string {
  // Generate 4-digit virtual account based on order ID
  // Take last 4 characters from order ID and ensure they're alphanumeric
  const orderSuffix = orderId
    .slice(-4)
    .replace(/[^0-9A-Z]/g, "")
    .padEnd(4, "0")
    .substring(0, 4)

  const virtualAccount = `8808${orderSuffix}`

  // Log for testing
  console.log("🏦 Virtual Account Generated:")
  console.log("Order ID:", orderId)
  console.log("Order Suffix:", orderSuffix)
  console.log("Virtual Account:", virtualAccount)

  return virtualAccount
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}

export function calculateShippingCost(items: any[], destination = "default"): number {
  // Simple shipping calculation
  const baseShipping = 15000
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (itemCount > 5) {
    return baseShipping + (itemCount - 5) * 2000
  }

  return baseShipping
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function getRandomColor(): string {
  const colors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "processing":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "shipped":
      return "bg-indigo-100 text-indigo-800 border-indigo-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getOrderStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Menunggu Pembayaran"
    case "confirmed":
      return "Pembayaran Dikonfirmasi"
    case "processing":
      return "Sedang Diproses"
    case "shipped":
      return "Dalam Pengiriman"
    case "delivered":
      return "Sudah Diterima"
    case "cancelled":
      return "Dibatalkan"
    default:
      return status
  }
}
