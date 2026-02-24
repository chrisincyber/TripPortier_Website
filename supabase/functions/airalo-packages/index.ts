import { corsHeaders } from "../_shared/cors.ts";
import { getAiraloToken, getAiraloApiBase } from "../_shared/airalo.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, countryCode, country_code, region } = body;

    const code = countryCode || country_code;
    const token = await getAiraloToken();
    const apiBase = getAiraloApiBase();

    let url: string;
    if (type === "local" && code) {
      url = `${apiBase}/v2/packages?filter[country]=${code.toLowerCase()}&filter[type]=sim&limit=50`;
    } else if (type === "regional" && region) {
      url = `${apiBase}/v2/packages?filter[country]=${region.toLowerCase()}&filter[type]=sim&limit=50`;
    } else if (type === "global") {
      url = `${apiBase}/v2/packages?filter[type]=sim&filter[country]=world&limit=50`;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request: type and countryCode/region required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Airalo API error:", res.status, text);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch packages" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await res.json();
    const operators = data.data?.data || data.data || [];

    const packages: Array<Record<string, unknown>> = [];
    for (const op of Array.isArray(operators) ? operators : []) {
      const opTitle = op.title || op.operator?.title || "";
      const opCountries = op.countries || [];
      for (const pkg of op.packages || []) {
        packages.push({
          id: pkg.id,
          data: pkg.data || pkg.title || "",
          days: pkg.day ?? pkg.validity ?? 0,
          price: pkg.price ?? 0,
          netPrice: pkg.net_price ?? pkg.price ?? 0,
          operatorTitle: opTitle,
          hasVoice: pkg.voice !== null && pkg.voice !== undefined && pkg.voice !== "0",
          hasText: pkg.text !== null && pkg.text !== undefined && pkg.text !== "0",
          countries: opCountries,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, packages }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("airalo-packages error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
