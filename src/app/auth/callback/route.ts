import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Allowed redirect paths after auth (prevent open redirect)
const ALLOWED_PATHS = ['/account', '/trips', '/myesims', '/premium', '/settings', '/profile', '/esim']

function getSafeRedirectPath(next: string | null): string {
  if (!next) return '/account'
  // Must be a relative path starting with /
  if (!next.startsWith('/')) return '/account'
  // Must not contain protocol or double slashes (prevent //evil.com)
  if (next.includes('//') || next.includes(':\\')) return '/account'
  // Check against allowlist prefix
  const isAllowed = ALLOWED_PATHS.some(
    (allowed) => next === allowed || next.startsWith(allowed + '/')
  )
  return isAllowed ? next : '/account'
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const safePath = getSafeRedirectPath(next)

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${safePath}`)
    }
  }

  return NextResponse.redirect(`${origin}/account?error=auth_failed`)
}
