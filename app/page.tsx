import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { categories, getPopularProducts } from "@/lib/products"

export default function HomePage() {
  const popularProducts = getPopularProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Prada Epic Kitchen</h1>
          <p className="text-xl md:text-2xl mb-8">Peralatan Dapur Berkualitas untuk Keluarga Indonesia</p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            <Link href="/products">Belanja Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Kategori Produk</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Produk Populer</h2>
            <Link href="/products">
              <Button variant="outline">Lihat Semua</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih Prada Epic Kitchen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-muted-foreground">Semua produk telah melalui quality control ketat</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-muted-foreground">Gratis ongkir untuk pembelian di atas Rp 100.000</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">Garansi Resmi</h3>
              <p className="text-muted-foreground">Garansi resmi untuk semua produk yang dijual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Prada Epic Kitchen</h3>
              <p className="text-gray-400">Toko peralatan dapur terpercaya dengan kualitas terbaik</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kategori</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products/mangkok">Mangkok</Link>
                </li>
                <li>
                  <Link href="/products/panci">Panci</Link>
                </li>
                <li>
                  <Link href="/products/cangkir">Cangkir</Link>
                </li>
                <li>
                  <Link href="/products/telenan">Telenan</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#">Bantuan</Link>
                </li>
                <li>
                  <Link href="#">Cara Pemesanan</Link>
                </li>
                <li>
                  <Link href="#">Kebijakan Return</Link>
                </li>
                <li>
                  <Link href="#">Garansi</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@pradaepickitchen.com</li>
                <li>Phone: +62 21 1234 5678</li>
                <li>WhatsApp: +62 812 3456 7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Prada Epic Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
