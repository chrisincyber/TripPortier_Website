import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { passportCountry, destination, transitCountries } = await req.json();

    if (!passportCountry || !destination) {
      return new Response(
        JSON.stringify({ success: false, error: "passportCountry and destination are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createSupabaseAdmin();

    // Look up visa requirement from database
    const { data: visaData, error } = await supabase
      .from("visa_requirements")
      .select("*")
      .eq("passport_country", passportCountry.toUpperCase())
      .eq("destination", destination.toUpperCase())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Visa lookup error:", error);
      throw error;
    }

    // Also check transit countries if provided
    const transitResults = [];
    if (transitCountries && Array.isArray(transitCountries)) {
      for (const transit of transitCountries) {
        const { data: transitData } = await supabase
          .from("visa_requirements")
          .select("*")
          .eq("passport_country", passportCountry.toUpperCase())
          .eq("destination", transit.toUpperCase())
          .single();

        if (transitData) {
          transitResults.push({
            country: transit,
            visaRequired: transitData.visa_required,
            stayDuration: transitData.stay_duration || null,
          });
        }
      }
    }

    if (!visaData) {
      return new Response(
        JSON.stringify({
          success: true,
          visaRequired: null,
          message: "Visa information not available for this combination. Please check with the embassy.",
          transitCountries: transitResults,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        visaRequired: visaData.visa_required,
        stayDuration: visaData.stay_duration || null,
        programs: visaData.programs || [],
        notes: visaData.notes || "",
        transitCountries: transitResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("visa-check error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
