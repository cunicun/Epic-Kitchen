"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"
import {
  Copy,
  Clock,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  Mail,
  Shield,
  QrCode,
} from "lucide-react"
import { toast } from "sonner"

interface PaymentInstructionsProps {
  orderData: {
    id: string
    total: number
    paymentMethod: string
    customerName: string
  }
}

export function PaymentInstructions({ orderData }: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Generate Virtual Account (4 digits based on order ID)
  const virtualAccount = `8808${orderData.id.slice(-4).padStart(4, "0")}`

  // Payment expiry (24 hours from now)
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const expiryString = expiryTime.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} berhasil disalin!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error(`Gagal menyalin ${field}`)
    }
  }

  const renderBankTransferInstructions = () => (
    <div className="space-y-6">
      {/* BCA Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Transfer Bank BCA</h3>
            <p className="text-blue-100 mt-1">Virtual Account - Otomatis Terkonfirmasi</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              Berlaku sampai {expiryString}
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Account Details */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Detail Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Virtual Account Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nomor Virtual Account</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <code className="flex-1 text-lg font-mono font-bold text-gray-900">{virtualAccount}</code>
              <Button
                size="sm"
                variant={copiedField === "Virtual Account" ? "default" : "outline"}
                onClick={() => handleCopy(virtualAccount, "Virtual Account")}
                className="shrink-0"
              >
                {copiedField === "Virtual Account" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Jumlah Transfer</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <span className="text-2xl font-bold text-green-600">{formatCurrency(orderData.total)}</span>
              <Button
                size="sm"
                variant={copiedField === "Jumlah" ? "default" : "outline"}
                onClick={() => handleCopy(orderData.total.toString(), "Jumlah")}
                className="ml-auto"
              >
                {copiedField === "Jumlah" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Important Warning */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>PENTING:</strong> Transfer harus sesuai dengan jumlah yang tertera. Jika berbeda, pembayaran tidak
              akan terdeteksi otomatis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Transfer Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BCA Mobile */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              BCA Mobile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Langkah-langkah:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Buka aplikasi BCA Mobile</li>
                <li>Pilih "m-Transfer"</li>
                <li>Pilih "BCA Virtual Account"</li>
                <li>
                  Masukkan nomor VA: <code className="bg-gray-100 px-1 rounded">{virtualAccount}</code>
                </li>
                <li>
                  Masukkan nominal: <code className="bg-gray-100 px-1 rounded">{formatCurrency(orderData.total)}</code>
                </li>
                <li>Konfirmasi pembayaran</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Internet Banking */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              KlikBCA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Langkah-langkah:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Login ke KlikBCA</li>
                <li>Pilih "Transfer Dana"</li>
                <li>Pilih "Transfer ke BCA Virtual Account"</li>
                <li>
                  Masukkan nomor VA: <code className="bg-gray-100 px-1 rounded">{virtualAccount}</code>
                </li>
                <li>
                  Masukkan nominal: <code className="bg-gray-100 px-1 rounded">{formatCurrency(orderData.total)}</code>
                </li>
                <li>Konfirmasi dengan KeyBCA</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* ATM */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              ATM BCA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Langkah-langkah:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Masukkan kartu ATM & PIN</li>
                <li>Pilih "Transaksi Lainnya"</li>
                <li>Pilih "Transfer"</li>
                <li>Pilih "ke Rek BCA Virtual Account"</li>
                <li>
                  Masukkan nomor VA: <code className="bg-gray-100 px-1 rounded">{virtualAccount}</code>
                </li>
                <li>Masukkan nominal & konfirmasi</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Pembayaran Aman & Terenkripsi</p>
              <p className="text-sm text-green-700">
                Transaksi Anda dilindungi dengan enkripsi SSL 256-bit dan sistem keamanan bank.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEWalletInstructions = () => (
    <div className="space-y-6">
      {/* E-Wallet Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Pembayaran E-Wallet</h3>
            <p className="text-green-100 mt-1">Scan QR Code untuk membayar</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              Berlaku sampai {expiryString}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-900">Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* QR Code Placeholder */}
            <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">QR Code akan muncul di sini</p>
                <p className="text-xs text-gray-400 mt-1">Untuk demo, gunakan aplikasi e-wallet Anda</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-lg">Total Pembayaran</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(orderData.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported E-Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>E-Wallet yang Didukung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "GoPay", color: "bg-green-500", icon: "🏍️" },
              { name: "OVO", color: "bg-purple-500", icon: "💜" },
              { name: "DANA", color: "bg-blue-500", icon: "💙" },
              { name: "ShopeePay", color: "bg-orange-500", icon: "🛒" },
            ].map((wallet) => (
              <div key={wallet.name} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${wallet.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-xl">{wallet.icon}</span>
                </div>
                <p className="font-medium">{wallet.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Buka aplikasi e-wallet pilihan Anda (GoPay, OVO, DANA, atau ShopeePay)</li>
            <li>Pilih fitur "Scan QR" atau "Bayar"</li>
            <li>Arahkan kamera ke QR Code di atas</li>
            <li>
              Pastikan nominal pembayaran sesuai: <strong>{formatCurrency(orderData.total)}</strong>
            </li>
            <li>Konfirmasi pembayaran dengan PIN/biometrik</li>
            <li>Simpan bukti pembayaran yang muncul</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )

  const renderCODInstructions = () => (
    <div className="space-y-6">
      {/* COD Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Bayar di Tempat (COD)</h3>
            <p className="text-orange-100 mt-1">Cash on Delivery - Bayar saat barang diterima</p>
          </div>
          <Truck className="w-12 h-12 text-orange-200" />
        </div>
      </div>

      {/* Amount to Prepare */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-900">Siapkan Uang Tunai</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-lg text-gray-700">Total yang harus dibayar:</p>
              <p className="text-4xl font-bold text-orange-600">{formatCurrency(orderData.total)}</p>
            </div>
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Siapkan uang pas atau lebih untuk memudahkan transaksi dengan kurir.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* COD Process */}
      <Card>
        <CardHeader>
          <CardTitle>Proses Bayar di Tempat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Pesanan Diproses",
                description: "Tim kami akan memproses pesanan Anda dalam 1-2 hari kerja",
                icon: "📦",
              },
              {
                step: 2,
                title: "Barang Dikirim",
                description: "Kurir akan menghubungi Anda sebelum pengiriman",
                icon: "🚚",
              },
              {
                step: 3,
                title: "Kurir Tiba",
                description: "Periksa barang sebelum melakukan pembayaran",
                icon: "🏠",
              },
              {
                step: 4,
                title: "Pembayaran",
                description: `Bayar ${formatCurrency(orderData.total)} kepada kurir`,
                icon: "💰",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      Step {item.step}
                    </Badge>
                    <h4 className="font-medium">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Catatan Penting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
            <li>Periksa kondisi barang sebelum melakukan pembayaran</li>
            <li>Pastikan barang sesuai dengan pesanan Anda</li>
            <li>Jika ada kerusakan, Anda berhak menolak pesanan</li>
            <li>Simpan struk pembayaran sebagai bukti transaksi</li>
            <li>Layanan COD tersedia untuk area Jabodetabek</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {orderData.paymentMethod === "Transfer Bank" && <CreditCard className="w-5 h-5 text-blue-600" />}
          {orderData.paymentMethod === "E-Wallet" && <Smartphone className="w-5 h-5 text-green-600" />}
          {orderData.paymentMethod === "Bayar di Tempat" && <Truck className="w-5 h-5 text-orange-600" />}
          Instruksi Pembayaran - {orderData.paymentMethod}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderData.paymentMethod === "Transfer Bank" && renderBankTransferInstructions()}
        {orderData.paymentMethod === "E-Wallet" && renderEWalletInstructions()}
        {orderData.paymentMethod === "Bayar di Tempat" && renderCODInstructions()}
      </CardContent>
    </Card>
  )
}

export function CustomerSupport() {
  const supportMethods = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "WhatsApp",
      description: "Chat langsung dengan customer service",
      contact: "+62 812-3456-7890",
      action: "Chat Sekarang",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Telepon",
      description: "Hubungi hotline 24/7",
      contact: "(021) 1234-5678",
      action: "Telepon",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      description: "Kirim pertanyaan via email",
      contact: "support@pradaepickitchen.com",
      action: "Kirim Email",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  const handleContact = (method: string, contact: string) => {
    switch (method) {
      case "WhatsApp":
        window.open(`https://wa.me/6281234567890?text=Halo, saya butuh bantuan dengan pembayaran pesanan`, "_blank")
        break
      case "Telepon":
        window.open(`tel:${contact}`, "_blank")
        break
      case "Email":
        window.open(`mailto:${contact}?subject=Bantuan Pembayaran Pesanan`, "_blank")
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Butuh Bantuan?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportMethods.map((method) => (
            <div key={method.title} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div
                className={`w-12 h-12 ${method.color} text-white rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                {method.icon}
              </div>
              <h4 className="font-medium mb-1">{method.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{method.description}</p>
              <p className="text-sm font-mono text-gray-800 mb-3">{method.contact}</p>
              <Button size="sm" className={method.color} onClick={() => handleContact(method.title, method.contact)}>
                {method.action}
              </Button>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="text-center">
          <h4 className="font-medium mb-2">Jam Operasional Customer Service</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Senin - Jumat:</strong> 08:00 - 20:00 WIB
            </p>
            <p>
              <strong>Sabtu - Minggu:</strong> 09:00 - 17:00 WIB
            </p>
            <p className="text-xs text-gray-500 mt-2">*WhatsApp tersedia 24/7 dengan respon otomatis</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
