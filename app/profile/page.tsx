"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Package, Settings, CreditCard, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DatabaseService, Profile, Order } from "@/lib/supabase/database"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading: authLoading, signOut, updateProfile } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    user_type: "buyer" as "buyer" | "seller" | "admin",
  })
  
  const router = useRouter()
  const db = new DatabaseService()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, authLoading])

  const loadUserData = async () => {
    if (!user) return

    try {
      const [profileData, ordersData] = await Promise.all([
        db.getProfile(user.id),
        db.getUserOrders(user.id),
      ])

      if (profileData) {
        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
          user_type: profileData.user_type,
        })
      }
      setOrders(ordersData)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdating(true)
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        alert("Error updating profile: " + error)
      } else {
        alert("Profile updated successfully!")
        await loadUserData()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating your profile")
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="font-semibold text-lg text-slate-900 mb-1">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-slate-600 mb-2">{user.email}</p>
                <Badge className={profile?.user_type === "seller" ? "bg-orange-500" : "bg-blue-500"}>
                  {profile?.user_type?.charAt(0).toUpperCase() + profile?.user_type?.slice(1)}
                </Badge>
                <div className="mt-4 pt-4 border-t text-sm text-slate-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Orders ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" value={user.email || ""} disabled />
                          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange("full_name", e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user_type">Account Type</Label>
                          <Select
                            value={formData.user_type}
                            onValueChange={(value) => handleInputChange("user_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buyer">Buyer</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" disabled={updating} className="bg-orange-500 hover:bg-orange-600">
                          {updating ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-600 mb-4">You haven't placed any orders yet</p>
                        <Link href="/products">
                          <Button className="bg-orange-500 hover:bg-orange-600">Start Shopping</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id} className="border border-slate-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-slate-900">Order #{order.order_number}</h4>
                                  <p className="text-sm text-slate-600">
                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                  <p className="text-lg font-bold text-slate-900 mt-1">
                                    ${order.total_amount.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              
                              <Separator className="my-3" />
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                  {order.payment_status === "paid" && (
                                    <span className="text-green-600 font-medium">✓ Paid</span>
                                  )}
                                  {order.tracking_number && (
                                    <span className="ml-4">Tracking: {order.tracking_number}</span>
                                  )}
                                </div>
                                <Link href={`/orders/${order.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No saved addresses</h3>
                      <p className="text-slate-600 mb-4">Add your addresses for faster checkout</p>
                      <Button className="bg-orange-500 hover:bg-orange-600">Add Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}