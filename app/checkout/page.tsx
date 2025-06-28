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

    // For COD, proceed directly
    if (paymentMethod === "cod") {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      clearCart()
      router.push("/success?method=cod")
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
                {paymentMethod === "transfer" ? "Transfer Bank" : "Pembayaran E-Wallet"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  {isProcessing ? "Memproses..." : "Saya Sudah Bayar"}
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
