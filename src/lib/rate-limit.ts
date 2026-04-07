/**
 * Simple in-memory rate limiter for Next.js middleware.
 * Tracks requests by IP + path prefix. Entries auto-expire.
 *
 * Note: This works per-instance. For multi-instance deployments,
 * use a Redis-backed rate limiter or Vercel's built-in WAF.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 60 seconds
let lastCleanup = Date.now()
function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

/** Default rate limit configs by route category */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  auth: { limit: 10, windowSeconds: 60 },       // 10 auth attempts per minute
  checkout: { limit: 5, windowSeconds: 60 },     // 5 checkout attempts per minute
  api: { limit: 30, windowSeconds: 60 },         // 30 API calls per minute
  default: { limit: 60, windowSeconds: 60 },     // 60 requests per minute
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(
  ip: string,
  category: string,
  config?: RateLimitConfig
): RateLimitResult {
  cleanup()

  const cfg = config || RATE_LIMITS[category] || RATE_LIMITS.default
  const key = `${ip}:${category}`
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + cfg.windowSeconds * 1000
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: cfg.limit - 1, resetAt }
  }

  entry.count++
  store.set(key, entry)

  if (entry.count > cfg.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: cfg.limit - entry.count, resetAt: entry.resetAt }
}
