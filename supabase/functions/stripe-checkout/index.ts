import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseFromRequest } from "../_shared/supabase-client.ts";
import Stripe from "npm:stripe@17";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    // Get authenticated user
    const { client, token } = createSupabaseFromRequest(req);

    if (!token) {
      return new Response(
        JSON.stringify({ error: { message: "Authentication required" } }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: { message: "Invalid session" } }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { planId, successUrl, cancelUrl } = await req.json();

    if (!planId) {
      return new Response(
        JSON.stringify({ error: { message: "planId is required" } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Map plan IDs to Stripe price IDs
    const priceMap: Record<string, string> = JSON.parse(
      Deno.env.get("STRIPE_PRICE_MAP") || "{}",
    );

    const priceId = priceMap[planId];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: { message: `Unknown plan: ${planId}` } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || "https://www.tripportier.com/premium-success.html",
      cancel_url: cancelUrl || "https://www.tripportier.com/premium.html",
      metadata: { supabase_uid: user.id, planId },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("stripe-checkout error:", error);
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
