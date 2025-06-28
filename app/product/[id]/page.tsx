"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductById } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // You could add a toast notification here
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {product.originalPrice && (
              <Badge variant="destructive">
                Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Deskripsi Produk</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jumlah</label>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={!product.inStock}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Tambah ke Keranjang" : "Stok Habis"}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Informasi Produk</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inStock ? "Tersedia" : "Stok Habis"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori:</span>
                  <span className="capitalize">{product.category.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span>{product.rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
