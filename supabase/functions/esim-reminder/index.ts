import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, email, orderCode, arrivalDate, packageName, countryTitle } =
      await req.json();

    if (action !== "create") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!email || !orderCode || !arrivalDate) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createSupabaseAdmin();

    // Upsert reminder (one per order)
    const { error } = await supabase.from("esim_reminders").upsert(
      {
        email,
        order_code: orderCode,
        arrival_date: arrivalDate,
        package_name: packageName || "eSIM",
        country_title: countryTitle || "",
        status: "scheduled",
        created_at: new Date().toISOString(),
      },
      { onConflict: "order_code" },
    );

    if (error) {
      console.error("Reminder insert error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("esim-reminder error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
