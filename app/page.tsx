import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { getPopularProducts } from "@/lib/products"
import { Star, Quote, ShoppingCart, Truck, Shield } from "lucide-react"

export default function HomePage() {
  const popularProducts = getPopularProducts()

  const customerTestimonials = [
    {
      id: 1,
      name: "Sari Dewi",
      location: "Jakarta",
      rating: 5,
      comment:
        "Kualitas produknya luar biasa! Panci anti lengketnya benar-benar awet dan mudah dibersihkan. Sudah 6 bulan pakai masih seperti baru.",
      product: "Panci Anti Lengket 24cm",
      avatar: "SD",
    },
    {
      id: 2,
      name: "Budi Santoso",
      location: "Surabaya",
      rating: 5,
      comment:
        "Pelayanan sangat memuaskan, pengiriman cepat dan packaging rapi. Telenan bambunya berkualitas premium, recommended banget!",
      product: "Telenan Bambu Antibakteri",
      avatar: "BS",
    },
    {
      id: 3,
      name: "Maya Putri",
      location: "Bandung",
      rating: 5,
      comment:
        "Harga terjangkau tapi kualitas premium. Set mangkok keramiknya cantik dan tahan lama. Puas banget belanja di sini!",
      product: "Mangkok Keramik Set 6pcs",
      avatar: "MP",
    },
    {
      id: 4,
      name: "Ahmad Rizki",
      location: "Medan",
      rating: 5,
      comment:
        "Customer service responsif, produk sesuai deskripsi. Rolling pin kayunya solid dan nyaman digunakan untuk bikin roti.",
      product: "Rolling Pin Kayu Solid",
      avatar: "AR",
    },
    {
      id: 5,
      name: "Rina Sari",
      location: "Yogyakarta",
      rating: 5,
      comment:
        "Gratis ongkir benar-benar membantu! Toples kacanya berkualitas tinggi, penutupnya rapat dan kedap udara. Terima kasih!",
      product: "Toples Kaca Hermetis 1L",
      avatar: "RS",
    },
    {
      id: 6,
      name: "Doni Pratama",
      location: "Makassar",
      rating: 5,
      comment:
        "Sudah langganan di sini, semua produk berkualitas. Cangkir kopinya elegan dan nyaman digenggam. Highly recommended!",
      product: "Cangkir Kopi Keramik Premium",
      avatar: "DP",
    },
  ]

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

      {/* Customer Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apa Kata Pelanggan Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ribuan pelanggan telah merasakan kualitas produk kami. Berikut testimoni mereka yang membuat kami semakin
              termotivasi memberikan yang terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-orange-200" />
                    <p className="text-gray-700 italic pl-6 mb-3">"{testimonial.comment}"</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Produk: {testimonial.product}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">4.9</div>
                <div className="flex justify-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Rating Rata-rata</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">10K+</div>
                <div className="text-sm text-muted-foreground">Ulasan Positif</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">98%</div>
                <div className="text-sm text-muted-foreground">Kepuasan Pelanggan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Produk Populer</h2>
              <p className="text-muted-foreground mt-2">Pilihan terbaik dari customer kami</p>
            </div>
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
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-muted-foreground">
                Semua produk telah melalui quality control ketat dan berstandar internasional
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-muted-foreground">
                Gratis ongkir untuk pembelian di atas Rp 100.000 ke seluruh Indonesia
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kepuasan Pelanggan</h3>
              <p className="text-muted-foreground">
                98% tingkat kepuasan pelanggan dengan rating 4.9/5 dari ribuan ulasan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Merasakan Kualitas Terbaik?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan pelanggan yang telah merasakan kepuasan berbelanja di Prada Epic Kitchen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Mulai Belanja
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
            >
              Lihat Testimoni Lainnya
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Prada Epic Kitchen</h3>
              <p className="text-gray-400 mb-4">
                Toko peralatan dapur terpercaya dengan kualitas terbaik untuk keluarga Indonesia
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">ig</span>
                </div>
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">wa</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Semua Produk
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Best Seller
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Promo Spesial
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Produk Terbaru
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cara Pemesanan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Kebijakan Return
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Garansi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@pradaepickitchen.com</li>
                <li>📞 +62 21 1234 5678</li>
                <li>💬 +62 812 3456 7890</li>
                <li>📍 Jakarta, Indonesia</li>
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
