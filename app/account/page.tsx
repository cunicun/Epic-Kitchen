"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Package, ShoppingBag, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"
import { useOrders } from "@/lib/orders-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { user, isAuthenticated, updateProfile } = useUser()
  const { orders } = useOrders()
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Initialize edit data when user data is available
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
      })
    }
  }, [user])

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <p>Memuat...</p>
        </div>
      </div>
    )
  }

  // Get user orders
  const userOrders = orders.filter((order) => order.customerEmail === user.email)
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset data
      setEditData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
    toast({
      title: "Profil berhasil diperbarui",
      description: "Informasi akun Anda telah disimpan.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Menunggu", variant: "secondary" as const },
      processing: { label: "Diproses", variant: "default" as const },
      shipped: { label: "Dikirim", variant: "outline" as const },
      delivered: { label: "Selesai", variant: "default" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Akun Saya</h1>
            <p className="text-muted-foreground">Kelola informasi akun dan pesanan Anda</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="orders">Pesanan</TabsTrigger>
            <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>Kelola informasi pribadi Anda</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleEditToggle}>
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={handleEditToggle}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{user.name || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        placeholder="+62 812 3456 7890"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{user.phone || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        name="city"
                        value={editData.city}
                        onChange={handleInputChange}
                        placeholder="Jakarta"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{user.city || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{user.address || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Kode Pos</Label>
                    {isEditing ? (
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={editData.postalCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{user.postalCode || "Belum diisi"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pesanan</CardTitle>
                <CardDescription>Lihat semua pesanan yang pernah Anda buat</CardDescription>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Belum ada pesanan</h3>
                    <p className="text-muted-foreground mb-4">Anda belum melakukan pemesanan apapun</p>
                    <Button onClick={() => router.push("/products")}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Mulai Belanja
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Pesanan #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Sejak</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDate(user.createdAt)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userOrders.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Belanja</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>Informasi kontak yang tersimpan di akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Email utama</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.phone}</p>
                      <p className="text-sm text-muted-foreground">Nomor telepon</p>
                    </div>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {user.address}
                        {user.city && `, ${user.city}`}
                        {user.postalCode && ` ${user.postalCode}`}
                      </p>
                      <p className="text-sm text-muted-foreground">Alamat pengiriman</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
