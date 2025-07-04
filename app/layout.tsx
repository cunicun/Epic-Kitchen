import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/lib/cart-context"
import { AdminProvider } from "@/lib/admin-context"
import { OrdersProvider } from "@/lib/orders-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prada Epic Kitchen - Peralatan Dapur Berkualitas",
  description: "Toko online peralatan dapur terlengkap dengan kualitas terbaik",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AdminProvider>
          <OrdersProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
            </CartProvider>
          </OrdersProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
