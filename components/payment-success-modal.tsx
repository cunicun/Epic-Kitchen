"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, Copy, Share, ShoppingCart, Receipt } from "lucide-react"
import { toast } from "sonner"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    id: string
    total: number
    paymentMethod: string
    customerName: string
    customerEmail: string
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
    }>
  }
}

export function PaymentSuccessModal({ isOpen, onClose, orderData }: PaymentSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      console.log("🎉 Payment success modal opened with data:", orderData)
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, orderData])

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderData.id)
      toast.success("Order ID berhasil disalin!")
    } catch (err) {
      toast.error("Gagal menyalin Order ID")
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "Pesanan Prada Epic Kitchen",
      text: `Pesanan #${orderData.id} berhasil dibuat dengan total ${formatCurrency(orderData.total)}`,
      url: window.location.origin + `/payment/${orderData.id}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success("Link pesanan berhasil disalin!")
      }
    } catch (err) {
      console.log("Share failed:", err)
    }
  }

  const handleViewPaymentInstructions = () => {
    console.log("🧾 Viewing payment instructions for order:", orderData.id)
    onClose() // This will trigger the redirect in checkout page
  }

  const handleContinueShopping = () => {
    console.log("🛒 Continue shopping clicked")
    window.location.href = "/products"
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Transfer Bank":
        return "🏦"
      case "E-Wallet":
        return "📱"
      case "Bayar di Tempat":
        return "🚚"
      default:
        return "💳"
    }
  }

  const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
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
                className="w-2 h-2 rotate-45"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-600">Pesanan Berhasil Dibuat!</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order ID</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded">{orderData.id}</code>
                  <Button size="sm" variant="ghost" onClick={handleCopyOrderId}>
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
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>{getPaymentMethodIcon(orderData.paymentMethod)}</span>
                  {orderData.paymentMethod}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jumlah Item</span>
                <span className="font-medium">{totalItems} item</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Langkah Selanjutnya:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Lihat instruksi pembayaran di halaman berikutnya</li>
                <li>• Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>• Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                <li>• Estimasi pengiriman: 2-5 hari kerja</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={handleViewPaymentInstructions} className="w-full" size="lg">
                <Receipt className="w-4 h-4 mr-2" />
                Lihat Instruksi Pembayaran
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleContinueShopping}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Belanja Lagi
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="text-center text-sm text-gray-500 pt-2 border-t">
              <p>Terima kasih, {orderData.customerName}!</p>
              <p>Konfirmasi telah dikirim ke {orderData.customerEmail}</p>
            </div>
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
