import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const FLW_WEBHOOK_HASH = Deno.env.get("FLW_WEBHOOK_HASH");
    if (!FLW_WEBHOOK_HASH) throw new Error("FLW_WEBHOOK_HASH is not configured");

    // Verify webhook signature
    const signature = req.headers.get("verif-hash");
    if (signature !== FLW_WEBHOOK_HASH) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const { event, data } = payload;

    if (event !== "charge.completed" || data.status !== "successful") {
      return new Response(JSON.stringify({ status: "ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const txRef = data.tx_ref;
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Update payment status
    const { data: payment } = await adminClient
      .from("payments")
      .update({ status: "completed", provider_ref: String(data.id) })
      .eq("provider_ref", txRef)
      .select("user_id")
      .single();

    if (payment?.user_id) {
      // Upgrade user to premium
      await adminClient
        .from("profiles")
        .update({ plan: "premium" })
        .eq("user_id", payment.user_id);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
