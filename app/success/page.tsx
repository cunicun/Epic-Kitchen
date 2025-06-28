import Link from "next/link"
import { CheckCircle, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Pembayaran Berhasil!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Terima kasih atas pembelian Anda. Pesanan Anda sedang diproses dan akan segera dikirim.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium">Nomor Pesanan</p>
              <p className="text-lg font-bold">#PEK-{Date.now().toString().slice(-6)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Kami akan mengirimkan konfirmasi dan detail pengiriman ke email Anda.
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
