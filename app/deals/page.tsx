"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Clock, Flame, Zap } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { SearchResults } from "@/components/search-results"
import { CartDrawer } from "@/components/cart-drawer"
import { useState, useEffect } from "react"

export default function DealsPage() {
  const { dispatch } = useCart()
  const { searchQuery, setSearchQuery } = useSearch()
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const flashDeals = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 49.99,
      originalPrice: 99.99,
      discount: 50,
      rating: 4.5,
      reviews: 1234,
      image: "/wireless-bluetooth-headphones.jpg",
      sold: 156,
      total: 200,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 129.99,
      originalPrice: 199.99,
      discount: 35,
      rating: 4.8,
      reviews: 856,
      image: "/smart-fitness-watch.png",
      sold: 89,
      total: 150,
    },
    {
      id: 3,
      name: "Portable Phone Charger",
      price: 19.99,
      originalPrice: 39.99,
      discount: 50,
      rating: 4.3,
      reviews: 2341,
      image: "/portable-phone-charger.jpg",
      sold: 234,
      total: 300,
    },
  ]

  const dailyDeals = [
    {
      id: 4,
      name: "Cotton T-Shirt",
      price: 14.99,
      originalPrice: 24.99,
      discount: 40,
      rating: 4.3,
      reviews: 567,
      image: "/cotton-t-shirt.jpg",
      badge: "Limited Time",
    },
    {
      id: 5,
      name: "Running Shoes",
      price: 59.99,
      originalPrice: 89.99,
      discount: 33,
      rating: 4.6,
      reviews: 432,
      image: "/running-shoes-on-track.png",
      badge: "Hot Deal",
    },
    {
      id: 6,
      name: "Coffee Maker",
      price: 89.99,
      originalPrice: 129.99,
      discount: 31,
      rating: 4.4,
      reviews: 298,
      image: "/modern-coffee-maker.png",
      badge: "Best Value",
    },
    {
      id: 7,
      name: "Yoga Mat",
      price: 24.99,
      originalPrice: 39.99,
      discount: 38,
      rating: 4.7,
      reviews: 654,
      image: "/rolled-yoga-mat.png",
      badge: "Popular",
    },
  ]

  const addToCart = (product: any) => {
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
                <Link href="/categories" className="hover:text-orange-400 transition-colors">
                  Categories
                </Link>
                <Link href="/deals" className="text-orange-400">
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
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Flame className="h-8 w-8" />
                Flash Deals
              </h1>
              <p className="text-xl opacity-90">Limited time offers - Don't miss out!</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Ends in:</p>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <div className="bg-white/20 rounded-lg px-3 py-2">{String(timeLeft.hours).padStart(2, "0")}</div>
                <span>:</span>
                <div className="bg-white/20 rounded-lg px-3 py-2">{String(timeLeft.minutes).padStart(2, "0")}</div>
                <span>:</span>
                <div className="bg-white/20 rounded-lg px-3 py-2">{String(timeLeft.seconds).padStart(2, "0")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Flash Deals</h2>
            <Badge className="bg-red-500">Limited Stock</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashDeals.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow group cursor-pointer border-2 border-red-200"
              >
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {product.sold}/{product.total} sold
                  </div>
                </div>
                <CardContent className="p-4">
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
                    <span className="text-xl font-bold text-red-600">${product.price}</span>
                    <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Sold: {product.sold}</span>
                      <span>Available: {product.total - product.sold}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(product.sold / product.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Deals */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Daily Deals</h2>
            <Badge className="bg-orange-500">Today Only</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyDeals.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-orange-500">-{product.discount}%</Badge>
                  {product.badge && <Badge className="absolute top-2 right-2 bg-emerald-500">{product.badge}</Badge>}
                </div>
                <CardContent className="p-4">
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
                    <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
