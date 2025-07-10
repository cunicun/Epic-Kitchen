"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import Link from "next/link"
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Plus,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import { useOrders } from "@/lib/orders-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { products } from "@/lib/products"

export default function AdminDashboard() {
  const { isAuthenticated } = useAdmin()
  const { orders } = useOrders()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Calculate statistics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = products.length

  // Get unique customers
  const uniqueCustomers = new Set(orders.map((order) => order.customerEmail)).size

  // Order status breakdown
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const processingOrders = orders.filter((order) => order.status === "processing").length
  const shippedOrders = orders.filter((order) => order.status === "shipped").length
  const completedOrders = orders.filter((order) => order.status === "completed").length

  // Calculate performance metrics
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  // Recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-orange-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu"
      case "processing":
        return "Diproses"
      case "shipped":
        return "Dikirim"
      case "completed":
        return "Selesai"
      default:
        return "Unknown"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">Selamat datang di panel admin Prada Epic Kitchen</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/orders">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Pesanan
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {completedOrders} selesai dari {totalOrders} pesanan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Rata-rata {formatCurrency(averageOrderValue)} per pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Produk aktif di katalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">Pelanggan unik yang berbelanja</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Status Pesanan</CardTitle>
              <CardDescription>Breakdown status pesanan saat ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Menunggu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{pendingOrders}</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Diproses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{processingOrders}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {totalOrders > 0 ? Math.round((processingOrders / totalOrders) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Dikirim</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{shippedOrders}</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {totalOrders > 0 ? Math.round((shippedOrders / totalOrders) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Selesai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{completedOrders}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Performa</CardTitle>
              <CardDescription>Metrik kinerja bisnis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Rata-rata Nilai Pesanan</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(averageOrderValue)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Tingkat Penyelesaian</span>
                </div>
                <span className="text-sm font-medium">{completionRate.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Pesanan per Pelanggan</span>
                </div>
                <span className="text-sm font-medium">
                  {uniqueCustomers > 0 ? (totalOrders / uniqueCustomers).toFixed(1) : 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Produk Terjual</span>
                </div>
                <span className="text-sm font-medium">
                  {orders.reduce(
                    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
                    0,
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>5 pesanan terakhir yang masuk</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">#{order.id}</p>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} item</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses cepat ke fitur admin utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/orders">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  Kelola Pesanan
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/products">
                  <Package className="h-6 w-6 mb-2" />
                  Kelola Produk
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/products/add">
                  <Plus className="h-6 w-6 mb-2" />
                  Tambah Produk
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/dashboard">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Lihat Statistik
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
