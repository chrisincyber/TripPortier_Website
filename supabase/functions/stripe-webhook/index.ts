import { createSupabaseAdmin } from "../_shared/supabase-client.ts";
import { getAiraloToken, getAiraloApiBase } from "../_shared/airalo.ts";
import Stripe from "npm:stripe@17";

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret,
      undefined,
      cryptoProvider,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      // Only handle eSIM purchases
      if (metadata.type !== "esim") {
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const supabase = createSupabaseAdmin();

      // Update order status to processing
      await supabase
        .from("esim_orders")
        .update({ status: "processing", paid_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id);

      // Create Airalo eSIM order
      try {
        const token = await getAiraloToken();
        const apiBase = getAiraloApiBase();

        const airaloRes = await fetch(`${apiBase}/v2/orders`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            package_id: metadata.packageId,
            quantity: 1,
            type: "sim",
            description: `TripPortier order for ${metadata.email}`,
          }),
        });

        if (!airaloRes.ok) {
          const errorText = await airaloRes.text();
          console.error("Airalo order creation failed:", airaloRes.status, errorText);
          await supabase
            .from("esim_orders")
            .update({
              status: "failed",
              error_message: `Airalo API error: ${airaloRes.status}`,
            })
            .eq("stripe_session_id", session.id);
          return new Response(JSON.stringify({ received: true }), { status: 200 });
        }

        const airaloData = await airaloRes.json();
        const orderData = airaloData.data;
        const sim = orderData?.sims?.[0] || {};

        // Update order with eSIM details
        await supabase
          .from("esim_orders")
          .update({
            status: "completed",
            airalo_order_id: String(orderData.id || ""),
            order_code: orderData.code || "",
            iccid: sim.iccid || "",
            qr_code_url: sim.qrcode_url || sim.qrcode || "",
            direct_apple_url: sim.direct_apple_url || sim.esim_url || "",
            airalo_response: JSON.stringify(airaloData),
            completed_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id);

        console.log("eSIM order completed:", orderData.code, "ICCID:", sim.iccid);
      } catch (airaloError) {
        console.error("Airalo eSIM provisioning error:", airaloError);
        await supabase
          .from("esim_orders")
          .update({
            status: "failed",
            error_message: airaloError.message,
          })
          .eq("stripe_session_id", session.id);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 },
    );
  }
});
