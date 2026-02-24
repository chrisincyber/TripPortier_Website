let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAiraloToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = Deno.env.get("AIRALO_CLIENT_ID")!;
  const clientSecret = Deno.env.get("AIRALO_CLIENT_SECRET")!;
  const apiBase = Deno.env.get("AIRALO_API_BASE") || "https://partners-api.airalo.com";

  const res = await fetch(`${apiBase}/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airalo auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.data.access_token,
    expiresAt: Date.now() + (data.data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export function getAiraloApiBase(): string {
  return Deno.env.get("AIRALO_API_BASE") || "https://partners-api.airalo.com";
}
