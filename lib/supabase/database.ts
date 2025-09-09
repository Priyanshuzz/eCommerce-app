import { createClient } from "./client"

export interface Product {
  id: string
  seller_id: string
  category_id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  sku: string
  stock_quantity: number
  images: string[]
  tags: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  user_type: "buyer" | "seller" | "admin"
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  shipping_address: any
  billing_address: any
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method?: string
  shipping_method?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  product_snapshot: any
  created_at: string
}

export class DatabaseService {
  private supabase = createClient()

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .order("name")

    if (error) throw error
    return data || []
  }

  // Products
  async getProducts(options: {
    categoryId?: string
    featured?: boolean
    limit?: number
    offset?: number
    search?: string
  } = {}): Promise<{ products: Product[]; count: number }> {
    let query = this.supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `, { count: "exact" })
      .eq("is_active", true)

    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId)
    }

    if (options.featured) {
      query = query.eq("is_featured", true)
    }

    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) throw error
    return { products: data || [], count: count || 0 }
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) return null
    return data
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .eq("is_active", true)
      .limit(10)

    if (error) throw error
    return data || []
  }

  // User Profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) return null
    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Orders
  async createOrder(orderData: {
    user_id: string
    items: Array<{
      product_id: string
      quantity: number
      unit_price: number
    }>
    subtotal: number
    tax_amount: number
    shipping_amount: number
    discount_amount: number
    total_amount: number
    shipping_address: any
    billing_address: any
    payment_method?: string
    shipping_method?: string
  }): Promise<Order> {
    // Create order
    const { data: order, error: orderError } = await this.supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax_amount,
        shipping_amount: orderData.shipping_amount,
        discount_amount: orderData.discount_amount,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        payment_method: orderData.payment_method,
        shipping_method: orderData.shipping_method,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await this.supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) throw itemsError

    return order
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getOrder(orderId: string, userId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", orderId)
      .eq("user_id", userId)
      .single()

    if (error) return null
    return data
  }

  // Cart items (for persistent cart)
  async getCartItems(userId: string) {
    const { data, error } = await this.supabase
      .from("cart_items")
      .select(`
        *,
        product:products(*)
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data || []
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const { data, error } = await this.supabase
      .from("cart_items")
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error
    return data
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId)
    }

    const { data, error } = await this.supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("product_id", productId)
      .select()

    if (error) throw error
    return data
  }

  async removeFromCart(userId: string, productId: string) {
    const { error } = await this.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId)

    if (error) throw error
  }

  async clearCart(userId: string) {
    const { error } = await this.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)

    if (error) throw error
  }
}