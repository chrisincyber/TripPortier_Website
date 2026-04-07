/**
 * Sanitize error messages before showing to users.
 * Strips Supabase/Postgres internals, table names, policy names, etc.
 */

const INTERNAL_PATTERNS = [
  /relation ".*?" does not exist/i,
  /column ".*?" of relation/i,
  /violates row-level security/i,
  /new row violates check constraint/i,
  /permission denied for table/i,
  /PGRST\d+/,
  /JWT expired/i,
  /role ".*?" does not exist/i,
  /function .*?\(.*?\) does not exist/i,
  /duplicate key value violates unique constraint/i,
  /null value in column/i,
  /invalid input syntax/i,
]

const FRIENDLY_MESSAGES: Record<string, string> = {
  '23505': 'This record already exists.',
  '42501': 'You do not have permission to perform this action.',
  '42P01': 'Something went wrong. Please try again.',
  'PGRST116': 'Record not found.',
  'PGRST301': 'Something went wrong. Please try again.',
  '23502': 'Required information is missing.',
  '22P02': 'Invalid data format.',
}

export function sanitizeError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback

  const message = error instanceof Error ? error.message : String(error)
  const code = (error as { code?: string })?.code

  // Check for known Postgres/Supabase error codes
  if (code && FRIENDLY_MESSAGES[code]) {
    return FRIENDLY_MESSAGES[code]
  }

  // Check for internal patterns that should not be exposed
  for (const pattern of INTERNAL_PATTERNS) {
    if (pattern.test(message)) {
      return fallback
    }
  }

  // Safe Supabase auth messages can pass through
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password.'
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email address first.'
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 8 characters.'
  }

  // If the message looks like it contains SQL or internal details, suppress it
  if (/\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|TABLE|SCHEMA)\b/.test(message)) {
    return fallback
  }

  // For short, simple messages that don't look internal, pass through
  if (message.length < 200 && !/[{}[\]]/.test(message)) {
    return message
  }

  return fallback
}
