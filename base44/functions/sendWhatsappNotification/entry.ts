import { secrets } from "base44:runtime";

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const apiKey = secrets.get("CALLMEBOT_APIKEY");
    if (!apiKey) {
      return Response.json({ ok: false, error: "CALLMEBOT_APIKEY غير مضبوط بعد — أضفه من إعدادات التطبيق" });
    }

    // رقم واتساب صاحب الموقع (مستلم الإشعار) بصيغة دولية
    const phone = body.recipient_phone || "213655033965";

    const lines = [
      "🔔 طلب حجز جديد عبر موقع المسار",
      body.reference_number ? `المرجع: ${body.reference_number}` : null,
      `الوكالة: ${body.agency_name || "—"}`,
      `جهة الاتصال: ${body.contact_name || "—"}`,
      `الهاتف: ${body.phone || "—"}`,
      body.email ? `البريد: ${body.email}` : null,
      body.service ? `الخدمة: ${body.service}` : null,
      body.offer ? `العرض: ${body.offer}` : null,
      body.destination ? `الوجهة: ${body.destination}` : null,
      body.travelers ? `عدد المسافرين: ${body.travelers}` : null,
      body.travel_date ? `تاريخ السفر: ${body.travel_date}` : null,
      body.notes ? `ملاحظات: ${body.notes}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return Response.json({ ok: res.ok, status: res.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}