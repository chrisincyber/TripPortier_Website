import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, error: "session_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: order, error } = await supabase
      .from("esim_orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error || !order) {
      return new Response(
        JSON.stringify({ success: false, error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // If order is still pending payment or processing, tell the frontend to poll
    if (order.status === "pending_payment" || order.status === "processing") {
      return new Response(
        JSON.stringify({ status: "processing" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // If there was an error provisioning the eSIM
    if (order.status === "failed") {
      return new Response(
        JSON.stringify({
          success: false,
          error: order.error_message || "eSIM provisioning failed. Please contact support.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Order is complete — return details
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          email: order.email,
          packageName: order.package_name,
          countryTitle: order.country_title,
          data: order.data_amount,
          days: order.days,
          iccid: order.iccid || "",
          orderCode: order.order_code || order.airalo_order_id || "",
          qrCodeUrl: order.qr_code_url || "",
          directApple: order.direct_apple_url || "",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("esim-order-by-session error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
