import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { service, targetClient, platform, tone } = await req.json();

    if (!service || !targetClient || !platform || !tone) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const toneGuide: Record<string, string> = {
      professional: "Professional and polished tone",
      casual: "Casual and friendly tone",
      persuasive: "Persuasive and compelling tone",
      kenyan: "Casual Kenyan vibe — warm, relatable, with local slang where natural",
    };

    const systemPrompt = `You are an expert client outreach copywriter. Generate messages for freelancers and small business owners. Always return valid JSON.`;

    const userPrompt = `Generate 4 client outreach messages for a ${service} professional targeting ${targetClient} on ${platform}.

Tone: ${toneGuide[tone] || tone}

Return JSON with these exact keys:
{
  "coldOutreach": "A compelling cold outreach message",
  "followUp": "A follow-up message if they don't respond",
  "safeVariation": "A safe, non-pushy variation",
  "boldVariation": "A bold, direct, sales-focused variation"
}

Keep messages concise and platform-appropriate. Each message should be 2-4 sentences max.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_messages",
              description: "Return the generated outreach messages",
              parameters: {
                type: "object",
                properties: {
                  coldOutreach: { type: "string" },
                  followUp: { type: "string" },
                  safeVariation: { type: "string" },
                  boldVariation: { type: "string" },
                },
                required: ["coldOutreach", "followUp", "safeVariation", "boldVariation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_messages" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { coldOutreach: "Failed to generate", followUp: "", safeVariation: "", boldVariation: "" };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
