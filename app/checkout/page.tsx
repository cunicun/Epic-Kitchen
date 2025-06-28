"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart-context"
import { QrCode, Copy, CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("transfer")
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [transferCode, setTransferCode] = useState("")
  const [copied, setCopied] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const shippingCost = getTotalPrice() >= 100000 ? 0 : 15000
  const totalAmount = getTotalPrice() + shippingCost

  // Generate random transfer code
  const generateTransferCode = () => {
    const code = Math.floor(Math.random() * 900000) + 100000 // 6 digit random number
    return code.toString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Generate transfer code for bank transfer
    if (paymentMethod === "transfer") {
      const code = generateTransferCode()
      setTransferCode(code)
      setShowPaymentDetails(true)
      setIsProcessing(false)
      return
    }

    // For e-wallet, show QR code
    if (paymentMethod === "ewallet") {
      setShowPaymentDetails(true)
      setIsProcessing(false)
      return
    }

    // For COD, show receipt details
    if (paymentMethod === "cod") {
      setShowPaymentDetails(true)
      setIsProcessing(false)
      return
    }
  }

  const handlePaymentConfirmation = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart()
    router.push(`/success?method=${paymentMethod}&code=${transferCode}`)
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  if (showPaymentDetails) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {paymentMethod === "transfer" && "Transfer Bank"}
                {paymentMethod === "ewallet" && "Pembayaran E-Wallet"}
                {paymentMethod === "cod" && "Nota Pembayaran - Bayar di Tempat"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentMethod === "cod" && (
                <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg">
                  {/* Receipt Header */}
                  <div className="text-center border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-bold">PRADA EPIC KITCHEN</h2>
                    <p className="text-sm text-gray-600">Peralatan Dapur Berkualitas</p>
                    <p className="text-xs text-gray-500">📍 Jakarta, Indonesia | 📞 +62 21 1234 5678</p>
                  </div>

                  {/* Order Details */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>No. Pesanan:</span>
                      <span className="font-bold">#PEK-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tanggal:</span>
                      <span>{new Date().toLocaleDateString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Metode Pembayaran:</span>
                      <span className="font-semibold">Cash on Delivery (COD)</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="border-t border-b border-gray-300 py-4 mb-4">
                    <h4 className="font-semibold mb-3">DETAIL PESANAN:</h4>
                    {items.map((item, index) => (
                      <div key={item.product.id} className="flex justify-between text-sm mb-2">
                        <div className="flex-1">
                          <span className="block">
                            {index + 1}. {item.product.name}
                          </span>
                          <span className="text-gray-600 text-xs">
                            {formatPrice(item.product.price)} x {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} item):</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ongkos Kirim:</span>
                      <span>{shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>TOTAL BAYAR:</span>
                        <span className="text-red-600">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">📋 INSTRUKSI PEMBAYARAN:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>
                        • Siapkan uang pas sejumlah <strong>{formatPrice(totalAmount)}</strong>
                      </li>
                      <li>• Pembayaran dilakukan saat barang tiba</li>
                      <li>• Periksa kondisi barang sebelum pembayaran</li>
                      <li>• Simpan nota ini sebagai bukti pesanan</li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📞 INFORMASI PENGIRIMAN:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Kurir akan menghubungi Anda sebelum pengiriman</p>
                      <p>• Estimasi pengiriman: 1-3 hari kerja</p>
                      <p>• Hubungi CS: +62 812 3456 7890 (WhatsApp)</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
                    <p>Terima kasih telah berbelanja di Prada Epic Kitchen!</p>
                    <p>Barang yang sudah dibeli tidak dapat dikembalikan kecuali ada kerusakan.</p>
                  </div>
                </div>
              )}

              {/* Existing transfer and ewallet sections remain the same */}
              {paymentMethod === "transfer" && (
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Detail Transfer Bank</h3>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between">
                        <span>Bank:</span>
                        <span className="font-semibold">BCA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No. Rekening:</span>
                        <span className="font-semibold">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atas Nama:</span>
                        <span className="font-semibold">Prada Epic Kitchen</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah Transfer:</span>
                        <span className="font-semibold text-lg text-blue-600">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Kode Transfer Unik</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-yellow-600">{transferCode}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(transferCode)}
                        className="ml-2"
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Tambahkan kode ini di akhir nominal transfer untuk verifikasi otomatis
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>• Transfer sesuai nominal yang tertera</p>
                    <p>• Sertakan kode unik di akhir nominal</p>
                    <p>• Pembayaran akan diverifikasi otomatis</p>
                  </div>
                </div>
              )}

              {paymentMethod === "ewallet" && (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Scan QR Code</h3>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <QrCode className="h-48 w-48 text-gray-800" />
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-600">{formatPrice(totalAmount)}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Cara Pembayaran:</h4>
                    <div className="text-sm text-left space-y-1">
                      <p>1. Buka aplikasi GoPay/OVO/DANA</p>
                      <p>2. Pilih "Scan QR" atau "Bayar"</p>
                      <p>3. Scan QR code di atas</p>
                      <p>4. Konfirmasi pembayaran</p>
                      <p>5. Klik "Saya Sudah Bayar" di bawah</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setShowPaymentDetails(false)} className="flex-1">
                  Kembali
                </Button>
                <Button onClick={handlePaymentConfirmation} disabled={isProcessing} className="flex-1">
                  {isProcessing ? "Memproses..." : paymentMethod === "cod" ? "Konfirmasi Pesanan" : "Saya Sudah Bayar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" type="tel" required />
                </div>
                <div>
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea id="address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Kode Pos</Label>
                    <Input id="postalCode" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">Transfer Bank (BCA)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ewallet" id="ewallet" />
                    <Label htmlFor="ewallet">E-Wallet (GoPay, OVO, DANA)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Bayar di Tempat (COD)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} item)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Memproses..." : "Lanjut ke Pembayaran"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
