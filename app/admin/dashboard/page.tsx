"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/lib/admin-context"
import { useOrders } from "@/lib/orders-context"
import { Users, Package, ShoppingCart, TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAdmin()
  const { orders } = useOrders()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    recentOrders: [] as any[],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Calculate statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter((order) => order.status === "pending").length
    const completedOrders = orders.filter((order) => order.status === "completed").length

    // Get unique customers
    const uniqueCustomers = new Set(orders.map((order) => order.customerEmail)).size

    // Get recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalCustomers: uniqueCustomers,
      recentOrders,
    })
  }, [isAuthenticated, router, orders])

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di admin panel Prada Epic Kitchen</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} menunggu, {stats.completedOrders} selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground">Dari {stats.totalOrders} pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesanan Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Perlu diproses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Pelanggan unik</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rp {order.total.toLocaleString("id-ID")}</p>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "processing"
                              ? "secondary"
                              : "outline"
                        }
                        className="mt-1"
                      >
                        {order.status === "pending" && (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Menunggu
                          </>
                        )}
                        {order.status === "processing" && (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Diproses
                          </>
                        )}
                        {order.status === "completed" && (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selesai
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/admin/orders")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="w-5 h-5" />
                Kelola Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lihat dan kelola semua pesanan pelanggan</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/admin/products")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Kelola Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Tambah, edit, dan hapus produk</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Laporan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lihat statistik dan analisis penjualan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
