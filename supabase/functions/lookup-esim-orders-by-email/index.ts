import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderCode } = await req.json();

    if (!orderCode) {
      return new Response(
        JSON.stringify({ success: false, error: "Order code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: orders, error } = await supabase
      .from("esim_orders")
      .select("*")
      .or(`order_code.eq.${orderCode},airalo_order_id.eq.${orderCode}`)
      .in("status", ["completed", "processing"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lookup error:", error);
      throw error;
    }

    const formattedOrders = (orders || []).map((o) => ({
      id: o.id,
      email: o.email,
      packageName: o.package_name,
      countryTitle: o.country_title,
      countryCode: o.country_code,
      data: o.data_amount,
      days: o.days,
      price: o.price,
      iccid: o.iccid || "",
      orderCode: o.order_code || o.airalo_order_id || "",
      qrCodeUrl: o.qr_code_url || "",
      directApple: o.direct_apple_url || "",
      status: o.status,
      esimStatus: o.esim_status || o.status,
      createdAt: o.created_at,
      orderedAt: o.paid_at || o.created_at,
    }));

    return new Response(
      JSON.stringify({ success: true, orders: formattedOrders }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("lookup-esim-orders-by-email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
