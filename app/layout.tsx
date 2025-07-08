import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { CartProvider } from "@/lib/cart-context"
import { UserProvider } from "@/lib/user-context"
import { AdminProvider } from "@/lib/admin-context"
import { OrdersProvider } from "@/lib/orders-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prada Epic Kitchen - Peralatan Dapur Berkualitas",
  description: "Toko online peralatan dapur terlengkap dengan kualitas terbaik dan harga terjangkau",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProvider>
            <AdminProvider>
              <OrdersProvider>
                <CartProvider>
                  <Header />
                  <main className="min-h-screen">{children}</main>
                  <Toaster />
                </CartProvider>
              </OrdersProvider>
            </AdminProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
