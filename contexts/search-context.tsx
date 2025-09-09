"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { DatabaseService, Product } from "@/lib/supabase/database"

interface Product {
  id: string
  name: string
  price: number
  compare_at_price?: number
  rating?: number
  reviews?: number
  images: string[]
  badge?: string
  category?: {
    id: string
    name: string
  }
  description?: string
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]
  isSearching: boolean
  allProducts: Product[]
  loadProducts: () => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  
  const db = new DatabaseService()

  // Load products from database
  const loadProducts = async () => {
    try {
      const { products } = await db.getProducts({ limit: 100 })
      const formattedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        compare_at_price: p.compare_at_price,
        rating: 4.5, // Default rating since we don't have reviews yet
        reviews: 100, // Default review count
        images: p.images,
        badge: p.is_featured ? "Featured" : undefined,
        category: p.category,
        description: p.description,
      }))
      setAllProducts(formattedProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      // Fallback to sample data if database fails
      setAllProducts([])
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Search functionality with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const results = await db.searchProducts(searchQuery)
        const formattedResults = results.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          compare_at_price: p.compare_at_price,
          rating: 4.5,
          reviews: 100,
          images: p.images,
          badge: p.is_featured ? "Featured" : undefined,
          category: p.category,
          description: p.description,
        }))
        setSearchResults(formattedResults)
      } catch (error) {
        console.error('Search failed:', error)
        // Fallback to local search
        const filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(filtered)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, allProducts])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        allProducts,
        loadProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
