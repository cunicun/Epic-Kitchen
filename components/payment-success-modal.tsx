"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, Copy, Share, Eye, ShoppingBag, CreditCard, Smartphone, Truck } from "lucide-react"
import { toast } from "sonner"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    id: string
    orderNumber: string
    total: number
    paymentMethod: string
    items: any[]
    customerName: string
  }
}

export function PaymentSuccessModal({ isOpen, onClose, orderData }: PaymentSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderData.orderNumber)
      toast.success("Nomor pesanan berhasil disalin!")
    } catch (err) {
      toast.error("Gagal menyalin nomor pesanan")
    }
  }

  const shareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pesanan Prada Epic Kitchen",
          text: `Pesanan ${orderData.orderNumber} berhasil dibuat dengan total ${formatCurrency(orderData.total)}`,
          url: window.location.origin + `/payment/${orderData.id}`,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Pesanan ${orderData.orderNumber} berhasil dibuat dengan total ${formatCurrency(orderData.total)}\n${window.location.origin}/payment/${orderData.id}`
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success("Link pesanan berhasil disalin!")
      } catch (err) {
        toast.error("Gagal membagikan pesanan")
      }
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Transfer Bank":
        return <CreditCard className="w-4 h-4" />
      case "E-Wallet":
        return <Smartphone className="w-4 h-4" />
      case "Bayar di Tempat":
        return <Truck className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Transfer Bank":
        return "bg-blue-100 text-blue-800"
      case "E-Wallet":
        return "bg-green-100 text-green-800"
      case "Bayar di Tempat":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 p-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
              <p className="text-gray-600">Terima kasih {orderData.customerName}, pesanan Anda telah berhasil dibuat</p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nomor Pesanan</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-bold">{orderData.orderNumber}</code>
                  <Button variant="ghost" size="sm" onClick={copyOrderId} className="h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Pembayaran</span>
                <span className="font-bold text-lg">{formatCurrency(orderData.total)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Metode Pembayaran</span>
                <Badge className={`${getPaymentMethodColor(orderData.paymentMethod)} flex items-center gap-1`}>
                  {getPaymentMethodIcon(orderData.paymentMethod)}
                  {orderData.paymentMethod}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jumlah Item</span>
                <span className="font-medium">
                  {orderData.items.reduce((sum, item) => sum + item.quantity, 0)} produk
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-blue-900 mb-2">Langkah Selanjutnya:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Lihat instruksi pembayaran di halaman berikutnya</li>
                <li>• Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>• Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                <li>• Estimasi pengiriman: 2-5 hari kerja</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={onClose} className="w-full" size="lg">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Instruksi Pembayaran
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={shareOrder} className="flex-1 bg-transparent">
                  <Share className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/products")} className="flex-1">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Belanja Lagi
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500">Kami akan mengirim konfirmasi pesanan ke email Anda</p>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </>
  )
}
