import type { Product } from "./types"

export const categories = [
  { id: "wadah-tisu", name: "Wadah Tisu", icon: "🧻" },
  { id: "mangkok", name: "Mangkok", icon: "🥣" },
  { id: "panci", name: "Panci", icon: "🍲" },
  { id: "tutup-makanan", name: "Tutup Makanan", icon: "🍽️" },
  { id: "cangkir", name: "Cangkir", icon: "☕" },
  { id: "sendok-garpu", name: "Sendok & Garpu", icon: "🍴" },
  { id: "ring-adonan", name: "Ring Adonan", icon: "⭕" },
  { id: "telenan", name: "Telenan", icon: "🔪" },
  { id: "toples", name: "Toples", icon: "🫙" },
  { id: "rolling-pin", name: "Rolling Pin", icon: "🥖" },
]

export const products: Product[] = [
  // Category Products with real images
  {
    id: "6",
    name: "Wadah Tisu Kayu Premium",
    price: 35000,
    image: "/images/wadah-tisu.jpg",
    category: "wadah-tisu",
    description: "Wadah tisu dari kayu berkualitas dengan desain minimalis",
    inStock: true,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: "7",
    name: "Mangkok Keramik Set 6pcs",
    price: 120000,
    originalPrice: 140000,
    image: "/images/mangkok.jpg",
    category: "mangkok",
    description: "Set 6 mangkok keramik dengan berbagai ukuran",
    inStock: true,
    rating: 4.7,
    reviews: 78,
  },
  {
    id: "8",
    name: "Panci Anti Lengket 24cm",
    price: 185000,
    image: "/images/panci.jpg",
    category: "panci",
    description: "Panci anti lengket dengan lapisan ceramic coating",
    inStock: true,
    rating: 4.8,
    reviews: 92,
  },
  {
    id: "9",
    name: "Tutup Makanan Silikon Fleksibel",
    price: 25000,
    image: "/images/tutup-makanan.jpg",
    category: "tutup-makanan",
    description: "Set tutup makanan silikon yang dapat meregang",
    inStock: true,
    rating: 4.4,
    reviews: 134,
  },
  {
    id: "10",
    name: "Cangkir Kopi Keramik Premium",
    price: 55000,
    image: "/images/cangkir.jpg",
    category: "cangkir",
    description: "Cangkir kopi keramik dengan desain elegan",
    inStock: true,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: "11",
    name: "Set Sendok Garpu Stainless Steel",
    price: 65000,
    image: "/images/sendok-garpu.jpg",
    category: "sendok-garpu",
    description: "Set lengkap sendok garpu dari stainless steel food grade",
    inStock: true,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "12",
    name: "Ring Adonan Adjustable",
    price: 40000,
    image: "/images/ring-adonan.jpg",
    category: "ring-adonan",
    description: "Ring adonan yang dapat disesuaikan ukurannya",
    inStock: true,
    rating: 4.5,
    reviews: 34,
  },
  {
    id: "13",
    name: "Telenan Bambu Antibakteri",
    price: 45000,
    image: "/images/telenan.jpg",
    category: "telenan",
    description: "Telenan bambu dengan sifat antibakteri alami",
    inStock: true,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "14",
    name: "Toples Kaca Hermetis 1L",
    price: 35000,
    image: "/images/toples.jpg",
    category: "toples",
    description: "Toples kaca dengan penutup hermetis, kapasitas 1 liter",
    inStock: true,
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "15",
    name: "Rolling Pin Kayu Solid",
    price: 30000,
    image: "/images/rol-adonan.jpg",
    category: "rolling-pin",
    description: "Rolling pin dari kayu solid untuk menggulung adonan",
    inStock: true,
    rating: 4.7,
    reviews: 45,
  },
]

// Remove getFeaturedProducts function and update getProductsByCategory
export const getProductsByCategory = (category: string) => {
  return products.filter((product) => product.category === category)
}

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id)
}

// Get some popular products instead of featured
export const getPopularProducts = () => {
  return products.slice(0, 6) // Return first 6 products as popular
}
