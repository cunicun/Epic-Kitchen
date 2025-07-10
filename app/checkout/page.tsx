"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { useOrders } from "@/lib/orders-context"
import { formatCurrency, generateOrderId, validateEmail, validatePhone, calculateShippingCost } from "@/lib/utils"
import { PaymentSuccessModal } from "@/components/payment-success-modal"
import { CreditCard, Smartphone, Truck, ArrowLeft, ShoppingCart, MapPin, User } from "lucide-react"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useUser()
  const { addOrder } = useOrders()

  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    paymentMethod: "Transfer Bank",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const shippingCost = calculateShippingCost(items)
  const finalTotal = total + shippingCost

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Nama lengkap wajib diisi"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat lengkap wajib diisi"
    }

    if (!formData.city.trim()) {
      newErrors.city = "Kota wajib diisi"
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Kode pos wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderId = generateOrderId()
      const orderNumber = `PEK-${Date.now().toString().slice(-6)}`

      const newOrder = {
        id: orderId,
        orderNumber,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          id: item.id,
          productName: item.name,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: total,
        shippingCost,
        total: finalTotal,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addOrder(newOrder)
      setOrderData(newOrder)
      setShowSuccessModal(true)
      clearCart()
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses pesanan")
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push(`/payment/${orderData.id}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-4">Silakan tambahkan produk ke keranjang terlebih dahulu</p>
            <Button onClick={() => router.push("/products")}>Belanja Sekarang</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Keranjang
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Lengkapi informasi untuk menyelesaikan pesanan</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Pelanggan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Nama Lengkap *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className={errors.customerName ? "border-red-500" : ""}
                      />
                      {errors.customerName && <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="nama@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Alamat Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                      rows={3}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Kota *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Nama kota"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Kode Pos *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        placeholder="12345"
                        className={errors.postalCode ? "border-red-500" : ""}
                      />
                      {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan Pengiriman (Opsional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Instruksi khusus untuk kurir (warna rumah, patokan, dll)"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="Transfer Bank" id="transfer" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <Label htmlFor="transfer" className="font-medium cursor-pointer">
                              Transfer Bank BCA
                            </Label>
                            <p className="text-sm text-gray-500">Virtual Account 4 Digit - Otomatis terkonfirmasi</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="E-Wallet" id="ewallet" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <Label htmlFor="ewallet" className="font-medium cursor-pointer">
                              E-Wallet
                            </Label>
                            <p className="text-sm text-gray-500">GoPay, OVO, DANA, ShopeePay - Scan QR Code</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="Bayar di Tempat" id="cod" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Truck className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <Label htmlFor="cod" className="font-medium cursor-pointer">
                              Bayar di Tempat (COD)
                            </Label>
                            <p className="text-sm text-gray-500">Bayar saat barang diterima - Cash on Delivery</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg?height=48&width=48"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity}x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} item)</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses Pesanan...
                      </div>
                    ) : (
                      `Bayar ${formatCurrency(finalTotal)}`
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Payment Success Modal */}
        {showSuccessModal && orderData && (
          <PaymentSuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} orderData={orderData} />
        )}
      </div>
    </div>
  )
}
