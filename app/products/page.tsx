"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Filter, Grid, List, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { SearchResults } from "@/components/search-results"
import { CartDrawer } from "@/components/cart-drawer"
import { useState, useEffect } from "react"
import { DatabaseService, Product, Category } from "@/lib/supabase/database"

export default function ProductsPage() {
  const { dispatch } = useCart()
  const { searchQuery, setSearchQuery } = useSearch()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  const db = new DatabaseService()

  useEffect(() => {
    loadData()
  }, [selectedCategory, sortBy])

  const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesData, productsData] = await Promise.all([
        db.getCategories(),
        db.getProducts({ categoryId: selectedCategory || undefined }),
      ])
      
      setCategories(categoriesData)
      let sortedProducts = [...productsData.products]
      
      // Apply sorting
      if (sortBy === "price-low") {
        sortedProducts.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-high") {
        sortedProducts.sort((a, b) => b.price - a.price)
      } else if (sortBy === "name") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      setProducts(sortedProducts)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: Number(product.id),
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
      },
    })
  }

  const filteredProducts = products.filter((product) => {
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity
    return product.price >= minPrice && product.price <= maxPrice
  })

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
                <Link href="/categories" className="hover:text-orange-400 transition-colors">
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
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Category</h4>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-600">
                  {loading ? "Loading..." : `${filteredProducts.length} products found`}
                </p>
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
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="bg-slate-200 h-48 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="bg-slate-200 h-4 rounded mb-2"></div>
                      <div className="bg-slate-200 h-4 rounded mb-2 w-3/4"></div>
                      <div className="bg-slate-200 h-6 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
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
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className={`object-cover ${
                            viewMode === "list" ? "w-full h-32 rounded-l-lg" : "w-full h-48 rounded-t-lg"
                          }`}
                        />
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                          </Badge>
                        )}
                        {product.is_featured && (
                          <Badge className="absolute top-2 right-2 bg-orange-500">Featured</Badge>
                        )}
                      </div>
                      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className={`${viewMode === "list" ? "flex justify-between items-start" : ""}`}>
                          <div className={`${viewMode === "list" ? "flex-1 pr-4" : ""}`}>
                            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl font-bold text-slate-900">${product.price}</span>
                              {product.compare_at_price && (
                                <span className="text-sm text-slate-500 line-through">
                                  ${product.compare_at_price}
                                </span>
                              )}
                            </div>
                            {product.category && (
                              <Badge variant="secondary" className="mb-2">
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                          <div className={`${viewMode === "list" ? "flex flex-col gap-2" : ""}`}>
                            <Button
                              className={`bg-orange-500 hover:bg-orange-600 ${
                                viewMode === "list" ? "w-32" : "w-full"
                              }`}
                              onClick={() => addToCart(product)}
                              disabled={product.stock_quantity === 0}
                            >
                              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
                <Button
                  onClick={() => {
                    setSelectedCategory("")
                    setPriceRange({ min: "", max: "" })
                    setSearchQuery("")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}