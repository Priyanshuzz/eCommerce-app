import { NextResponse, type NextRequest } from "next/server"
import { createServerSupabaseClient } from "./lib/supabase/server"

export async function middleware(request: NextRequest) {
  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('your_supabase_url_here') || 
      supabaseAnonKey.includes('your_supabase_anon_key_here')) {
    console.log("[middleware] Supabase not configured, allowing all requests")
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerSupabaseClient(request, supabaseResponse)
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect checkout and admin routes
    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/checkout") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/orders") ||
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/seller"))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && request.nextUrl.pathname.startsWith('/auth/')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("[v0] Auth check failed:", error)
    // Continue without auth check if there's an error
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
