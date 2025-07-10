"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, generateVirtualAccount } from "@/lib/utils"
import { Copy, Check, CreditCard, Phone, Mail, AlertCircle } from "lucide-react"
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
  const [copiedVA, setCopiedVA] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)

  const virtualAccount = generateVirtualAccount(orderData.id)

  const copyToClipboard = async (text: string, type: "va" | "amount") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "va") {
        setCopiedVA(true)
        setTimeout(() => setCopiedVA(false), 2000)
        toast.success("Virtual Account berhasil disalin!")
      } else {
        setCopiedAmount(true)
        setTimeout(() => setCopiedAmount(false), 2000)
        toast.success("Nominal pembayaran berhasil disalin!")
      }
    } catch (err) {
      toast.error("Gagal menyalin ke clipboard")
    }
  }

  // Test the copy functionality immediately
  const testCopyPaste = () => {
    console.log("🧪 Testing Copy-Paste Functionality:")
    console.log("Virtual Account:", virtualAccount)
    console.log("Amount:", orderData.total)
    console.log("Formatted Amount:", formatCurrency(orderData.total))

    // Test VA copy
    copyToClipboard(virtualAccount, "va")

    // Test amount copy after 1 second
    setTimeout(() => {
      copyToClipboard(orderData.total.toString(), "amount")
    }, 1000)
  }

  if (orderData.paymentMethod === "Transfer Bank") {
    return (
      <div className="space-y-6">
        {/* Test Button - Remove in production */}
        <Card className="border-dashed border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">🧪 Test Copy-Paste Functionality</h4>
                <p className="text-sm text-blue-700">Klik tombol untuk test copy VA dan nominal</p>
              </div>
              <Button onClick={testCopyPaste} variant="outline" size="sm">
                Test Copy-Paste
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Transfer Bank BCA</CardTitle>
                <p className="text-sm text-muted-foreground">Virtual Account 4 Digit</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Virtual Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Informasi Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Virtual Account BCA</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  4 Digit
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-2xl font-bold text-blue-900 font-mono select-all">{virtualAccount}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(virtualAccount, "va")}
                  className="bg-white hover:bg-blue-50"
                >
                  {copiedVA ? (
                    <>
                      <Check className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Salin VA
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Nominal Transfer</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Exact Amount
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-900 select-all">{formatCurrency(orderData.total)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(orderData.total.toString(), "amount")}
                  className="bg-white hover:bg-green-50"
                >
                  {copiedAmount ? (
                    <>
                      <Check className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Salin Nominal
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-green-700 mt-2">💡 Tip: Salin nominal ini untuk paste di aplikasi BCA</p>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Cara Transfer BCA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Buka Aplikasi BCA Mobile atau Internet Banking</h4>
                  <p className="text-sm text-muted-foreground">Login ke akun BCA Anda</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Pilih Menu Transfer</h4>
                  <p className="text-sm text-muted-foreground">Pilih "Transfer ke Virtual Account"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Masukkan Virtual Account</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono select-all">{virtualAccount}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(virtualAccount, "va")}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Masukkan Nominal</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-muted px-2 py-1 rounded text-sm font-mono select-all">
                      {formatCurrency(orderData.total)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(orderData.total.toString(), "amount")}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Konfirmasi dan Transfer</h4>
                  <p className="text-sm text-muted-foreground">Pembayaran akan otomatis terkonfirmasi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-amber-900">Penting untuk Diperhatikan:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Transfer harus menggunakan nominal exact: {formatCurrency(orderData.total)}</li>
                  <li>• Virtual Account hanya berlaku untuk pesanan ini</li>
                  <li>• Pembayaran akan otomatis terkonfirmasi dalam 1-5 menit</li>
                  <li>• Jika ada kendala, hubungi customer service kami</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Other payment methods remain the same...
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground">Metode pembayaran: {orderData.paymentMethod}</p>
      </CardContent>
    </Card>
  )
}

// Customer Support Section
export function CustomerSupport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Butuh Bantuan?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium">WhatsApp Customer Service</p>
            <p className="text-sm text-muted-foreground">+62 812-3456-7890 (24/7)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Email Support</p>
            <p className="text-sm text-muted-foreground">support@pradaepickitchen.com</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Jam Operasional:</strong> Senin - Jumat (09:00 - 18:00 WIB)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
