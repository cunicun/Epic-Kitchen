"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentInstructions, CustomerSupport } from "@/components/payment-instructions"
import { useOrders } from "@/lib/orders-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, CheckCircle, Clock, Package, AlertCircle } from "lucide-react"

interface PaymentPageProps {
  params: {
    orderId: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter()
  const { orders } = useOrders()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundOrder = orders.find((o) => o.id === params.orderId)
    if (foundOrder) {
      setOrder(foundOrder)
      console.log("🔍 Found Order for Payment:", foundOrder)
    }
    setLoading(false)
  }, [params.orderId, orders])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">
              Pesanan dengan ID {params.orderId} tidak ditemukan atau sudah tidak valid.
            </p>
            <Button onClick={() => router.push("/account")}>Lihat Semua Pesanan</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
      case "processing":
      case "shipped":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instruksi Pembayaran</h1>
              <p className="text-gray-600 mt-1">Pesanan #{order.orderNumber || order.id}</p>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <PaymentInstructions
              orderData={{
                id: order.id,
                total: order.total,
                paymentMethod: order.paymentMethod,
                customerName: order.customerName,
              }}
            />

            <CustomerSupport />
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.svg?height=48&width=48"}
                        alt={item.productName || item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName || item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>{formatCurrency(order.shippingCost || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <p className="text-sm text-gray-600">{order.email}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">{order.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.city}, {order.postalCode}
                  </p>
                  {order.notes && <p className="text-sm text-gray-500 italic mt-1">Catatan: {order.notes}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Pesanan Dibuat</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {order.status !== "pending" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Pembayaran Dikonfirmasi</p>
                        <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {order.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Menunggu Pembayaran</p>
                        <p className="text-xs text-gray-500">Segera lakukan pembayaran</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
