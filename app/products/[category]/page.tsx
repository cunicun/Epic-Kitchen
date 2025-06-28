import { ProductCard } from "@/components/product-card"
import { categories, getProductsByCategory } from "@/lib/products"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((cat) => cat.id === params.category)
  const products = getProductsByCategory(params.category)

  if (!category) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span>{category.icon}</span>
          {category.name}
        </h1>
        <p className="text-muted-foreground">Koleksi {category.name.toLowerCase()} berkualitas tinggi</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada produk dalam kategori ini.</p>
        </div>
      )}
    </div>
  )
}
