import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Routes that require authentication - redirect to /account if not logged in
const PROTECTED_ROUTES = ['/trips', '/myesims', '/profile', '/settings']

// Rate limit categories by path prefix
function getRateLimitCategory(pathname: string): string | null {
  if (pathname === '/auth/callback') return 'auth'
  if (pathname.startsWith('/api/checkout') || pathname.includes('checkout')) return 'checkout'
  if (pathname.startsWith('/api/')) return 'api'
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1'

  // Rate limiting for sensitive endpoints
  const category = getRateLimitCategory(pathname)
  if (category) {
    const result = checkRateLimit(ip, category)
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMITS[category]?.limit || 60),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
          },
        }
      )
    }
  }

  // Update Supabase session (refreshes cookies)
  const response = await updateSession(request)

  // Server-side auth guard for protected routes
  const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))
  if (isProtected) {
    // Check for Supabase auth cookie presence
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))
    if (!hasAuthCookie) {
      const loginUrl = new URL('/account', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
}
