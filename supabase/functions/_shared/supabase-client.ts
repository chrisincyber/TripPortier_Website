import { createClient } from "npm:@supabase/supabase-js@2";

export function createSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

export function createSupabaseFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : undefined,
  );

  return { client, token };
}
