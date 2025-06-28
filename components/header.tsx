"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { categories } from "@/lib/products"

export function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">Prada Epic Kitchen</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-foreground/80">
              Semua Produk
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Kategori
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="grid gap-4 py-4">
                  <h3 className="font-semibold">Kategori Produk</h3>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products/${category.id}`}
                      className="flex items-center gap-2 text-sm hover:text-foreground/80"
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold">Prada Epic Kitchen</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/products">Semua Produk</Link>
                <div className="flex flex-col space-y-2">
                  <h4 className="font-medium">Kategori</h4>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products/${category.id}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari produk..." className="pl-8 md:w-[300px] lg:w-[400px]" />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{totalItems}</Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
