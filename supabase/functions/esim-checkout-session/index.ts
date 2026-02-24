import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdmin } from "../_shared/supabase-client.ts";
import Stripe from "npm:stripe@17";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    const {
      email,
      packageId,
      packageName,
      countryCode,
      countryTitle,
      data,
      days,
      price,
      netPrice,
      operatorTitle,
      hasVoice,
      hasText,
      tripcoinsUsed,
      userId,
    } = await req.json();

    if (!email || !packageId || !price) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const amountInCents = Math.round(price * 100);
    const discountCents = tripcoinsUsed ? Math.round(tripcoinsUsed * 100) : 0;
    const finalAmount = Math.max(amountInCents - discountCents, 50);

    const siteUrl = Deno.env.get("SITE_URL") || "https://www.tripportier.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `eSIM: ${packageName}`,
              description: `${data} data, ${days} days${countryTitle ? ` - ${countryTitle}` : ""}`,
              metadata: {
                type: "esim",
                packageId,
                countryCode: countryCode || "",
              },
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "esim",
        packageId,
        packageName: packageName || "",
        countryCode: countryCode || "",
        countryTitle: countryTitle || "",
        data: data || "",
        days: String(days || ""),
        netPrice: String(netPrice || price),
        operatorTitle: operatorTitle || "",
        hasVoice: String(hasVoice || false),
        hasText: String(hasText || false),
        tripcoinsUsed: String(tripcoinsUsed || 0),
        userId: userId || "",
        email,
      },
      success_url: `${siteUrl}/esim-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/esim.html?checkout=cancelled`,
    });

    // Store preliminary order in database
    const supabase = createSupabaseAdmin();
    await supabase.from("esim_orders").insert({
      stripe_session_id: session.id,
      email,
      package_id: packageId,
      package_name: packageName,
      country_code: countryCode,
      country_title: countryTitle,
      data_amount: data,
      days,
      price,
      net_price: netPrice || price,
      operator_title: operatorTitle,
      tripcoins_used: tripcoinsUsed || 0,
      user_id: userId || null,
      status: "pending_payment",
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("esim-checkout-session error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
