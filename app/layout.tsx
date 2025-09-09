import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { SearchProvider } from "@/contexts/search-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ShopHub - Your Trusted Marketplace",
  description: "Discover amazing products at unbeatable prices from trusted sellers worldwide",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <SearchProvider>
              <CartProvider>{children}</CartProvider>
            </SearchProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
