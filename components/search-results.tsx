"use client"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import { useSearch } from "@/contexts/search-context"
import { useCart } from "@/contexts/cart-context"

export function SearchResults() {
  const { searchQuery, searchResults, isSearching } = useSearch()
  const { dispatch } = useCart()

  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: typeof product.id === 'string' ? parseInt(product.id) : product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || "/placeholder.svg",
      },
    })
  }

  if (!searchQuery.trim()) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-slate-600">Searching...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="p-2">
          <div className="text-sm text-slate-600 px-2 py-1 border-b">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
          </div>
          {searchResults.slice(0, 6).map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
              <img
                src={product.images?.[0] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-600">${product.price}</span>
                  {product.compare_at_price && (
                    <span className="text-xs text-slate-500 line-through">${product.compare_at_price}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-slate-600">{product.rating || 4.5}</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product)
                }}
              >
                Add to Cart
              </Button>
            </div>
          ))}
          {searchResults.length > 6 && (
            <div className="p-2 text-center border-t">
              <Button variant="ghost" size="sm" className="text-orange-600">
                View all {searchResults.length} results
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-slate-600">No products found for "{searchQuery}"</p>
          <p className="text-sm text-slate-500 mt-1">Try different keywords or browse categories</p>
        </div>
      )}
    </div>
  )
}
