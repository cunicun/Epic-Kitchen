import Link from "next/link"
import { CheckCircle, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SuccessPageProps {
  searchParams: {
    method?: string
    code?: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const paymentMethod = searchParams.method || "unknown"
  const transferCode = searchParams.code

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "transfer":
        return "Transfer Bank"
      case "ewallet":
        return "E-Wallet"
      case "cod":
        return "Bayar di Tempat (COD)"
      default:
        return "Pembayaran"
    }
  }

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              {paymentMethod === "cod" ? "Pesanan Berhasil!" : "Pembayaran Berhasil!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {paymentMethod === "cod"
                ? "Pesanan Anda telah diterima dan akan segera diproses. Pembayaran akan dilakukan saat barang tiba."
                : "Terima kasih atas pembayaran Anda. Pesanan Anda sedang diproses dan akan segera dikirim."}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nomor Pesanan:</span>
                <span className="text-lg font-bold">#PEK-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Metode Pembayaran:</span>
                <span className="font-semibold">{getPaymentMethodText(paymentMethod)}</span>
              </div>
              {transferCode && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Kode Transfer:</span>
                  <span className="font-bold text-blue-600">{transferCode}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {paymentMethod === "cod"
                  ? "Kami akan menghubungi Anda untuk konfirmasi pengiriman."
                  : "Kami akan mengirimkan konfirmasi dan detail pengiriman ke email Anda."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Link href="/">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full bg-transparent">
                  <Package className="mr-2 h-4 w-4" />
                  Lanjut Belanja
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
