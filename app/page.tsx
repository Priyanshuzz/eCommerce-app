"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Truck, Shield, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { useAuth } from "@/contexts/auth-context"
import { SearchResults } from "@/components/search-results"
import { CartDrawer } from "@/components/cart-drawer"
import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/supabase/database"

export default function HomePage() {
  const { dispatch } = useCart()
  const { searchQuery, setSearchQuery, loadProducts } = useSearch()
  const { user, signOut } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const db = new DatabaseService()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        db.getProducts({ featured: true, limit: 4 }),
        db.getCategories()
      ])
      setFeaturedProducts(productsData.products)
      
      // Map categories with icons and counts
      const categoriesWithMeta = categoriesData.map(cat => ({
        name: cat.name,
        icon: getCategoryIcon(cat.name),
        count: "2.5k+", // In real app, you'd get actual counts
        id: cat.id
      }))
      setCategories(categoriesWithMeta)
      
      await loadProducts()
    } catch (error) {
      console.error('Failed to load data:', error)
      // Fallback to sample data
      setFeaturedProducts(sampleProducts)
      setCategories(sampleCategories)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (name: string) => {
    const iconMap: { [key: string]: string } = {
      'Electronics': '📱',
      'Fashion': '👕', 
      'Home & Garden': '🏠',
      'Sports & Outdoors': '⚽',
      'Books & Media': '📚',
      'Beauty & Health': '💄',
      'Automotive': '🚗',
      'Toys & Games': '🎮'
    }
    return iconMap[name] || '🛍️'
  }

  // Sample/fallback data
  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.5,
      reviews: 1234,
      image: "/wireless-bluetooth-headphones.jpg",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.8,
      reviews: 856,
      image: "/smart-fitness-watch.png",
      badge: "New",
    },
    {
      id: 3,
      name: "Portable Phone Charger",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.3,
      reviews: 2341,
      image: "/portable-phone-charger.jpg",
      badge: "Sale",
    },
    {
      id: 4,
      name: "Wireless Gaming Mouse",
      price: 59.99,
      rating: 4.6,
      reviews: 678,
      image: "/wireless-gaming-mouse.png",
    },
  ]

  const sampleCategories = [
    { name: "Electronics", icon: "📱", count: "2.5k+" },
    { name: "Fashion", icon: "👕", count: "1.8k+" },
    { name: "Home & Garden", icon: "🏠", count: "3.2k+" },
    { name: "Sports", icon: "⚽", count: "1.1k+" },
    { name: "Books", icon: "📚", count: "5.7k+" },
    { name: "Beauty", icon: "💄", count: "890+" },
  ]
  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: typeof product.id === 'string' ? parseInt(product.id.slice(-8), 16) : product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || "/placeholder.svg",
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
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile">
                    <Button variant="ghost" className="text-white hover:text-orange-400">
                      {user.email}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-orange-400"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-white hover:text-orange-400">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
                  </Link>
                </>
              )}
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance text-white">
            Discover Amazing Products at Unbeatable Prices
          </h1>
          <p className="text-xl mb-8 text-slate-200 text-pretty">
            Shop millions of products from trusted sellers worldwide with fast, secure delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 text-white">
              Start Shopping
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-600">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(loading ? sampleProducts.slice(0, 4) : featuredProducts).map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative">
                  <img
                    src={product.images?.[0] || product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.badge && (
                    <Badge
                      className={`absolute top-2 left-2 ${
                        product.badge === "Sale"
                          ? "bg-red-500"
                          : product.badge === "New"
                            ? "bg-emerald-500"
                            : "bg-orange-500"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      Featured
                    </Badge>
                  )}
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 4.5) ? "text-yellow-400 fill-current" : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">({product.reviews || 100})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-slate-900">${product.price}</span>
                    {(product.originalPrice || product.compare_at_price) && (
                      <span className="text-sm text-slate-500 line-through">${product.originalPrice || product.compare_at_price}</span>
                    )}
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-slate-600">Free shipping on orders over $50. Express delivery available.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-slate-600">Your data is protected with industry-standard encryption.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-slate-600">30-day return policy. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-4">ShopHub</h3>
              <p className="text-slate-300 mb-4">
                Your trusted marketplace for quality products from verified sellers worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/help" className="hover:text-orange-400">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-orange-400">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-orange-400">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-orange-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/sell" className="hover:text-orange-400">
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link href="/seller-center" className="hover:text-orange-400">
                    Seller Center
                  </Link>
                </li>
                <li>
                  <Link href="/seller-support" className="hover:text-orange-400">
                    Seller Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/about" className="hover:text-orange-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-orange-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-orange-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-orange-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
