import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Semua Produk</h1>
        <p className="text-muted-foreground">Temukan berbagai peralatan dapur berkualitas tinggi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
