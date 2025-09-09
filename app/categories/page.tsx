"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Filter, Grid, List } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { SearchResults } from "@/components/search-results"
import { CartDrawer } from "@/components/cart-drawer"
import { useState } from "react"

export default function CategoriesPage() {
  const { dispatch } = useCart()
  const { searchQuery, setSearchQuery } = useSearch()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = [
    { name: "All", count: 15420, icon: "🛍️" },
    { name: "Electronics", count: 2543, icon: "📱" },
    { name: "Fashion", count: 1876, icon: "👕" },
    { name: "Home & Garden", count: 3201, icon: "🏠" },
    { name: "Sports & Outdoors", count: 1134, icon: "⚽" },
    { name: "Books & Media", count: 5678, icon: "📚" },
    { name: "Beauty & Health", count: 892, icon: "💄" },
    { name: "Automotive", count: 456, icon: "🚗" },
    { name: "Toys & Games", count: 789, icon: "🎮" },
  ]

  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.5,
      reviews: 1234,
      image: "/wireless-bluetooth-headphones.jpg",
      category: "Electronics",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.8,
      reviews: 856,
      image: "/smart-fitness-watch.png",
      category: "Electronics",
      badge: "New",
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.3,
      reviews: 567,
      image: "/cotton-t-shirt.jpg",
      category: "Fashion",
      badge: "Sale",
    },
    {
      id: 4,
      name: "Running Shoes",
      price: 89.99,
      rating: 4.6,
      reviews: 432,
      image: "/running-shoes-on-track.png",
      category: "Sports & Outdoors",
    },
    {
      id: 5,
      name: "Coffee Maker",
      price: 129.99,
      rating: 4.4,
      reviews: 298,
      image: "/modern-coffee-maker.png",
      category: "Home & Garden",
    },
    {
      id: 6,
      name: "Yoga Mat",
      price: 39.99,
      rating: 4.7,
      reviews: 654,
      image: "/rolled-yoga-mat.png",
      category: "Sports & Outdoors",
      badge: "Popular",
    },
  ]

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory)

  const addToCart = (product: (typeof products)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder.svg",
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-orange-400">
                ShopHub
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/categories" className="text-orange-400">
                  Categories
                </Link>
                <Link href="/deals" className="hover:text-orange-400 transition-colors">
                  Deals
                </Link>
                <Link href="/sellers" className="hover:text-orange-400 transition-colors">
                  Sell on ShopHub
                </Link>
              </nav>
            </div>

            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <SearchResults />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:text-orange-400">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
              </Link>
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.name
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">({category.count})</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h1>
                <p className="text-slate-600">{filteredProducts.length} products found</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className={`${viewMode === "list" ? "flex" : ""}`}>
                    <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className={`object-cover ${
                          viewMode === "list" ? "w-full h-32 rounded-l-lg" : "w-full h-48 rounded-t-lg"
                        }`}
                      />
                      {product.badge && (
                        <Badge
                          className={`absolute top-2 left-2 ${
                            product.badge === "Sale"
                              ? "bg-red-500"
                              : product.badge === "New"
                                ? "bg-emerald-500"
                                : product.badge === "Popular"
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className={`${viewMode === "list" ? "flex justify-between items-start" : ""}`}>
                        <div className={`${viewMode === "list" ? "flex-1 pr-4" : ""}`}>
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-600">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-slate-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        <div className={`${viewMode === "list" ? "flex flex-col gap-2" : ""}`}>
                          <Button
                            className={`bg-orange-500 hover:bg-orange-600 ${viewMode === "list" ? "w-32" : "w-full"}`}
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
