"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  CheckCircle,
  ArrowRight,
  Store,
  Globe,
  Shield,
} from "lucide-react"
import { useSearch } from "@/contexts/search-context"
import { SearchResults } from "@/components/search-results"
import { CartDrawer } from "@/components/cart-drawer"
import { useState } from "react"

export default function SellersPage() {
  const { searchQuery, setSearchQuery } = useSearch()
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    category: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Seller application:", formData)
  }

  const benefits = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Global Reach",
      description: "Access millions of customers worldwide with our international marketplace platform.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
      title: "Low Fees",
      description: "Competitive commission rates starting at just 3% with no hidden charges.",
    },
    {
      icon: <Package className="h-8 w-8 text-orange-600" />,
      title: "Easy Management",
      description: "Powerful seller dashboard to manage inventory, orders, and analytics in one place.",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Secure Payments",
      description: "Fast, secure payment processing with multiple payment options for customers.",
    },
  ]

  const stats = [
    { label: "Active Sellers", value: "2.5M+", icon: <Store className="h-6 w-6" /> },
    { label: "Monthly Buyers", value: "150M+", icon: <Users className="h-6 w-6" /> },
    { label: "Average Revenue", value: "$12K", icon: <TrendingUp className="h-6 w-6" /> },
    { label: "Success Rate", value: "94%", icon: <CheckCircle className="h-6 w-6" /> },
  ]

  const steps = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up and verify your business information",
    },
    {
      step: "2",
      title: "List Products",
      description: "Add your products with photos and descriptions",
    },
    {
      step: "3",
      title: "Start Selling",
      description: "Receive orders and start earning money",
    },
  ]

  const successStories = [
    {
      name: "Sarah's Boutique",
      category: "Fashion",
      revenue: "$50K/month",
      growth: "+300%",
      image: "/woman-business-owner.jpg",
      quote: "ShopHub helped me grow from a local store to an international business.",
    },
    {
      name: "Tech Gadgets Pro",
      category: "Electronics",
      revenue: "$120K/month",
      growth: "+250%",
      image: "/man-tech-entrepreneur.jpg",
      quote: "The platform's tools made scaling my electronics business incredibly easy.",
    },
    {
      name: "Home Decor Plus",
      category: "Home & Garden",
      revenue: "$35K/month",
      growth: "+180%",
      image: "/woman-home-decor-seller.jpg",
      quote: "I love how ShopHub connects me with customers who appreciate quality home goods.",
    },
  ]

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
                <Link href="/sellers" className="text-orange-400">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">Start Selling on ShopHub Today</h1>
          <p className="text-xl mb-8 text-slate-200 text-pretty max-w-3xl mx-auto">
            Join millions of successful sellers and turn your products into profit. Our platform provides everything you
            need to build and grow your online business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8">
              Start Selling Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-orange-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose ShopHub?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We provide the tools, support, and platform you need to succeed in e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get started in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-6 -right-4 h-6 w-6 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">See how other sellers are thriving on ShopHub</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{story.name}</h3>
                      <p className="text-sm text-slate-600">{story.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{story.revenue}</div>
                      <div className="text-xs text-slate-600">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{story.growth}</div>
                      <div className="text-xs text-slate-600">Growth</div>
                    </div>
                  </div>
                  <p className="text-slate-700 italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Selling?</h2>
            <p className="text-xl text-slate-600">Fill out the form below and we'll get you started</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name *</label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home-garden">Home & Garden</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="books">Books & Media</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="automotive">Automotive</option>
                    <option value="toys">Toys & Games</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your business and products..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
