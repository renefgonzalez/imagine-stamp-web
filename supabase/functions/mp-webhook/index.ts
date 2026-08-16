// ============================================================
//  Edge Function: mp-webhook
//  Recibe notificaciones de Mercado Pago (webhooks de pago),
//  consulta el estado del pago en la API de MP y actualiza el
//  pedido en Supabase usando la service_role key (bypassa RLS).
//
//  IMPORTANTE:
//  - Se despliega con verify_jwt = false (Mercado Pago no manda
//    un JWT de Supabase).
//  - Requiere los secrets: MP_ACCESS_TOKEN, SUPABASE_URL y
//    SUPABASE_SERVICE_ROLE_KEY.
//  - Registra notification_url en la preference de create-preference
//    (o en el panel de Mercado Pago) para que MP llame aquí.
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ACCESS_TOKEN || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error("Faltan secrets: MP_ACCESS_TOKEN, SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
    }

    const body = await req.json();

    // Mercado Pago envía notificaciones con dos formatos:
    //  - Webhooks v2: { action, type: "payment", data: { id: "..." } }
    //  - Notificaciones v1 (IPN): { topic: "payment", id: "..." }
    const isPayment = body.type === "payment" || body.topic === "payment";
    if (!isPayment) {
      // No es una notificación de pago (p.ej. merchant_order) - la ignoramos.
      return new Response(JSON.stringify({ ignored: true, reason: "not-a-payment" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentId = body.data?.id ?? body.id;
    if (!paymentId) {
      throw new Error("Notificación sin id de pago.");
    }

    // 1) Consultar el pago en Mercado Pago para obtener el estado real
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) {
      const err = await mpRes.text();
      throw new Error(`Error consultando el pago (${mpRes.status}): ${err}`);
    }

    const payment = await mpRes.json();
    const orderId = payment.external_reference;
    const paymentStatus = payment.status; // approved | pending | rejected | ...

    if (!orderId) {
      // El pago no tiene external_reference: no podemos ligarlo a un pedido.
      return new Response(JSON.stringify({ ignored: true, reason: "no-external-reference", paymentId }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Actualizar el pedido usando la service_role key (bypassa RLS).
    //    Mantenemos el mismo contrato que App.tsx al volver del checkout:
    //    payment_reference = "MP-<paymentId>" cuando el pago es aprobado.
    let updateBody: Record<string, unknown> = {};

    if (paymentStatus === "approved") {
      updateBody = {
        payment_reference: `MP-${paymentId}`,
      };
    } else if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
      updateBody = {
        payment_reference: `MP-${paymentId}-${paymentStatus}`,
      };
    }

    if (Object.keys(updateBody).length > 0) {
      const supabaseRes = await fetch(
        `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(updateBody),
        },
      );

      if (!supabaseRes.ok) {
        const err = await supabaseRes.text();
        throw new Error(`Error actualizando el pedido (${supabaseRes.status}): ${err}`);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orderId,
        paymentId,
        paymentStatus,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    // Respondemos 500 para que Mercado Pago reintente la notificación.
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
