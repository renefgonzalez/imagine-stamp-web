// ============================================================
//  Edge Function: create-preference
//  Crea una preferencia de pago en Mercado Pago (Checkout Pro)
//  y devuelve el enlace al que se redirige al cliente.
//
//  El ACCESS TOKEN secreto NUNCA va en el frontend: se lee aquí
//  desde la variable de entorno MP_ACCESS_TOKEN.
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!ACCESS_TOKEN) {
      throw new Error("Falta configurar el secret MP_ACCESS_TOKEN.");
    }

    const { items, orderId, siteUrl } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No se recibieron productos.");
    }

    const base = (siteUrl || "https://imagineandstamp.site").replace(/\/$/, "");
    const isLocal = base.includes("localhost") || base.includes("127.0.0.1");

    const preference: Record<string, unknown> = {
      items: items.map((it: any) => ({
        title: String(it.name || "Producto").slice(0, 250),
        quantity: Math.max(1, Number(it.quantity) || 1),
        unit_price: Number(it.price) || 0,
        currency_id: "MXN",
      })),
      external_reference: String(orderId || ""),
      back_urls: {
        success: `${base}/?pago=exito`,
        failure: `${base}/?pago=error`,
        pending: `${base}/?pago=pendiente`,
      },
      statement_descriptor: "IMAGINE&STAMP",
    };

    // Mercado Pago rechaza auto_return con URLs locales; solo en producción
    if (!isLocal) {
      preference.auto_return = "approved";
    }

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
