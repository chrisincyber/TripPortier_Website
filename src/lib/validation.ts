import { z } from 'zod'

// Profile update
export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(100, 'Display name is too long')
    .regex(/^[a-zA-Z0-9\s\-'.]+$/, 'Display name contains invalid characters'),
})

// Email/password auth
export const emailAuthSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
})

// eSIM checkout
export const checkoutEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
})

// Country code param
export const countryCodeSchema = z
  .string()
  .length(2, 'Invalid country code')
  .regex(/^[A-Z]{2}$/, 'Invalid country code')

// Generic validation helper - returns { success, data, error }
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.issues[0]?.message || 'Validation failed' }
}
